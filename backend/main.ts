import {} from "https://deno.land/x/oak/mod.ts"
Deno.serve((_request: Request) => {
  return new Response("Hello, world!");
})
