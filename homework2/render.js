export function layout(user, title, content) {
    return `
    <html>
    <head>
      <title>${user}:${title}</title>
      <style>
        body {
          padding: 80px;
          font: 16px Helvetica, Arial;
        }
        h1 { font-size: 2em; }
        h2 { font-size: 1.2em; }
        #posts { margin: 0; padding: 0; }
        #posts li {
          margin: 40px 0;
          padding: 0 0 20px 0;
          border-bottom: 1px solid #eee;
          list-style: none;
        }
        #posts li:last-child { border-bottom: none; }
        textarea { width: 500px; height: 300px; }
        input[type=text], textarea {
          border: 1px solid #eee;
          border-top-color: #ddd;
          border-left-color: #ddd;
          border-radius: 2px;
          padding: 15px;
          font-size: 0.8em;
        }
        input[type=text] { width: 500px; }
      </style>
    </head>
    <body>
      <section id="content">
        <h1>使用者：${user}</h1>
        ${content}
      </section>
    </body>
    </html>
    `;
}

export function userList(users) {
    let listHtml = users.map(user => `<li><a href="/${user}/">${user}</a></li>`).join('\n');
    return layout('', 'User List', `<ol>${listHtml}</ol>`);
}

export function list(user, posts) {
    let list = posts.map(post => `
      <li>
        <h2>${post.title}</h2>
        <p>Created at: ${new Date(post.created_at).toLocaleString()}</p>
        <p><a href="/${user}/post/${post.id}">Read post</a></p>
      </li>
    `).join('\n');
    return layout(user, 'Posts', `
      <h1>Posts</h1>
      <p>You have <strong>${posts.length}</strong> posts!</p>
      <p><a href="/${user}/post/new">Create a Post</a></p>
      <ul id="posts">${list}</ul>
    `);
}

export function newPost(user) {
    return layout(user, 'New Post', `
      <h1>New Post</h1>
      <p>Create a new post.</p>
      <form action="/${user}/post" method="post">
        <p><input type="text" placeholder="Title" name="title"></p>
        <p><textarea placeholder="Contents" name="body"></textarea></p>
        <p><input type="submit" value="Create"></p>
      </form>
    `);
}

export function show(user, post) {
    return layout(user, post.title, `
      <h1>${post.title}</h1>
      <pre>${post.body}</pre>
      <p>Created at: ${new Date(post.created_at).toLocaleString()}</p>
    `);
}
