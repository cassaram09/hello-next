const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, dir: "./src" });

const handle = app.getRequestHandler();

const { Post, start } = require("./models/index");

app
  .prepare()
  .then(start)
  .then(() => {
    const server = express();

    server.get("/api/content", async (req, res) => {
      const posts = await Post.findAll();
      res.send(JSON.stringify(posts));
    });

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, err => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000");
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
