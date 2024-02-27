import { Application, Router } from "https://deno.land/x/oak@v12.6.2/mod.ts";
import { Status } from "https://deno.land/x/oak_commons@0.4.0/status.ts";

const app = new Application();
const router = new Router();

const SESSION_DURATION = 1000 * 60 * 10;

router.get("/", (ctx) => {
  ctx.response.body = "Hi mom!"
})

router.get("/add/:a/:b", (ctx) => {
  const { a, b } = ctx.params
  const value = Number(a) + Number(b)
  ctx.response.body = value
})

const dict: Record<string, string> = {}

router.post("/dict/set/:key/:value", (ctx) => {
  const { key, value } = ctx.params
  dict[key] = value
  ctx.response.status = Status.NoContent
})

router.get("/dict/get/:key", (ctx) => {
  const { key } = ctx.params
  ctx.response.body = dict[key]
})

const kv = await Deno.openKv()
router.post("/register", async (ctx) => {
  try {
    const body = ctx.request.body({ type: "json" })
    const credentials = await body.value
      
    // null/undefined -> false, "" -> false
    // sprawdzamy, czy istnieją odpowiednie dane w JSONie
    if (!credentials.login || !credentials.password) {
      ctx.response.status = Status.BadRequest
      return;
    }

    const key = ["users", credentials.login]
    const entry = await kv.get(key);
    // czy użytkownik z tym loginem istnieje
    if (entry.versionstamp) {
      ctx.response.status = Status.Unauthorized
      return;
    }

    const value = { password: credentials.password }
    await kv.set(key, value)
    ctx.response.status = Status.NoContent
  } catch {
    ctx.response.status = Status.Unauthorized
  }
}).post("/login", async (ctx) => {
  try {
    const body = ctx.request.body({ type: "json" })
    const credentials = await body.value

    // czy login i hasło istnieją w żądaniu
    if (!credentials.login || !credentials.password) {
      ctx.response.status = Status.BadRequest
      return;
    }

    const key = ["users", credentials.login]
    const entry = await kv.get<{ password: string }>(key);

    // później przejdziemy do haszowania haseł, omówienia mechanizmu korzystania
    // z funkcji udostępnionych przez Deno w tym celu
    if (entry.value?.password === credentials.password) {
      // tymczasowo
      const sessionId = crypto.randomUUID();
      const key = ["sessions", sessionId];
      const value = credentials.login;
      await kv.set(key, value, { expireIn: SESSION_DURATION });
      ctx.cookies.set("session", sessionId, {maxAge: SESSION_DURATION });
      ctx.response.status = Status.NoContent
    } else {
      ctx.response.status = Status.Unauthorized
    }
  } catch {
    ctx.response.status = Status.Unauthorized
  }
})

app.use(router.routes())
app.use(router.allowedMethods())

await app.listen({ port: 8000 })