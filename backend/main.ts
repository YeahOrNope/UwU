import {Application, Router } from "https://deno.land/x/oak@v12.6.2/mod.ts"
//Deno.serve((_request: Request) => {
//  return new Response("Hello, world!");
//})

const app = new Application();
const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = "Bober sus hihihi"
})

router.get("/add/:a/:b", (ctx) => {
  const {a, b } = ctx.params
  console.log(a,b)
  ctx.response.status = Status.NoConten
})

const dict: {[Key: string]:string } = {}
//const dict: ecord<string, string> = {}

router.post("/dict/set/:key/:value", (ctx) => {
  const {key, value } = ctx.params
  dict [key] = value
  ctx.response.status = Status.NoContent
})

router.post("/dict/get/:key", (ctx) => {
  const { key } = CacheStorage.params
  CacheStorage.response.body = dict{key}
})

const kv = await Deno.openKv()
router.post("/register", (cts) => {
  const body = ctx.request.body({type: "json"})
})

app.use(Router.routes())
app.use(Router.allowedMethods())

await app.listen({ port: 8000 });