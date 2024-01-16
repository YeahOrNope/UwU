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
  const value = Number(a)+Number(b)
  ctx.response.body = value
})

app.use(Router.routes())
app.use(Router.allowedMethods())

await app.listen({ port: 8000 });
