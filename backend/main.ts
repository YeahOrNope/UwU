import {Application, Router } from "https://deno.land/x/oak@v12.6.2/mod.ts"
//Deno.serve((_request: Request) => {
//  return new Response("Hello, world!");
//})

const app = new Application();

app.use((ctx) => {
  ctx.response.body = "Hello World!";
});

app.use(Router.routes())
app.use(Router.allowedMethods())

await app.listen({ port: 8000 });
