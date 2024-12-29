import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js';
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("blog.db");
db.query(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT,
    title TEXT,
    body TEXT
  )
`);

const router = new Router();

router
  .get('/:user/', list)        
  .get('/:user/post/new', add) 
  .get('/:user/post/:id', show) 
  .post('/:user/post', create);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

function query(sql, params = []) {
  return [...db.query(sql, params)].map(([id, user, title, body]) => ({ id, user, title, body }));
}

async function list(ctx) {
  const user = ctx.params.user;
  const posts = query("SELECT id, user, title, body FROM posts WHERE user = ?", [user]);
  ctx.response.body = render.list(user, posts);
}

async function add(ctx) {
  const user = ctx.params.user;
  ctx.response.body = render.newPost(user);
}

async function show(ctx) {
  const user = ctx.params.user;
  const pid = ctx.params.id;
  const posts = query("SELECT id, user, title, body FROM posts WHERE user = ? AND id = ?", [user, pid]);
  const post = posts[0];
  if (!post) ctx.throw(404, 'Invalid post ID');
  ctx.response.body = render.show(user, post);
}

async function create(ctx) {
  const user = ctx.params.user;
  const body = ctx.request.body();
  if (body.type === "form") {
    const form = await body.value;
    const post = Object.fromEntries(form); 
    db.query("INSERT INTO posts (user, title, body) VALUES (?, ?, ?)", [user, post.title, post.body]);
    ctx.response.redirect(`/${user}/`);
}

const port = parseInt(Deno.args[0]) || 8000; 
console.log(`Server running at http://127.0.0.1:${port}`);
await app.listen({ port });
