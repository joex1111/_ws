export function list(user, posts) {
    let list = [];
    for (let post of posts) {
      list.push(`
      <li>
        <h2>${post.title}</h2>
        <p><a href="/${user}/post/${post.id}">Read post</a></p>
      </li>
      `);
    }
    let content = `
    <h1>${user}'s Posts</h1>
    <p>You have <strong>${posts.length}</strong> posts!</p>
    <p><a href="/${user}/post/new">Create a Post</a></p>
    <ul id="posts">
      ${list.join('\n')}
    </ul>
    `;
    return layout(`${user}'s Posts`, content);
  }
  
  export function newPost(user) {
    return layout(`New Post for ${user}`, `
    <h1>Create a New Post</h1>
    <form action="/${user}/post" method="post">
      <p><input type="text" placeholder="Title" name="title"></p>
      <p><textarea placeholder="Contents" name="body"></textarea></p>
      <p><input type="submit" value="Create"></p>
    </form>
    `);
  }
  
  export function show(user, post) {
    return layout(post.title, `
    <h1>${post.title}</h1>
    <p>${post.body}</p>
    <p><a href="/${user}/">Back to Posts</a></p>
    `);
  }
  