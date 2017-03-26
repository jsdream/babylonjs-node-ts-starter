import * as Koa from "koa";
import * as parser from "koa-bodyparser";
import * as serve from "koa-static";
import * as send from "koa-send";

const app: Koa = new Koa();

// parse body
app.use(parser());

// serve static content
app.use(serve(process.cwd() + "/compiled/client"));
app.use(serve(process.cwd() + "/assets"));

app.use(async (ctx) => {
    await send(ctx, "/compiled/client/index.html");
});

app.listen(3214);
