import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js';

const posts: Record<string, Array<Record<string, any>>> = {
  default: [{ id: 0, title: 'post', body: 'a post', created_at: new Date() }],
  snoopy: [],
};

function ensureUserPosts(user: string) {
  if (!posts[user]) {
    posts[user] = [];
  }
}

const router = new Router();

router
  .get('/post/new', add) 
  .get('/post/:id', show) 
  .post('/post', create); 

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());


async function add(ctx) {
  ctx.response.body = await render.newPost(); 
}

async function show(ctx) {
  const id = parseInt(ctx.params.id, 10);
  const userPosts = posts.default; 
  const post = userPosts?.[id];

  if (!post) {
    ctx.throw(404, 'Invalid post ID');
  }

  ctx.response.body = await render.show('default', post); 
}


async function create(ctx) {
  const user = "default"; 
  ensureUserPosts(user); 

  const body = ctx.request.body();
  if (body.type === 'form') {
    const pairs = await body.value; 
    const post: Record<string, any> = {};

    for (const [key, value] of pairs) {
      post[key] = value; 
    }

    post.created_at = new Date();
    post.id = posts[user].length;

    posts[user].push(post); 
    ctx.response.redirect(`/post/${post.id}`); 
  } else {
    ctx.throw(400, 'Invalid form submission');
  }
}

console.log('Server running at http://127.0.0.1:8000');
await app.listen({ port: 8000 });
