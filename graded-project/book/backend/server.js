/* ==========================================================================
 * BookNest API
 *
 *   Students: you don't need to read or edit this file. Just run it.
 *
 *   1. npm install
 *   2. npm start        (or npm run dev for auto-restart)
 *   3. Leave it running, then open the frontend with Live Server.
 *
 * Sanity check in your browser: http://localhost:4001
 * ========================================================================== */

require("dotenv").config(); //[cite: 1]

const express = require("express"); //[cite: 1]
const cors = require("cors"); //[cite: 1]

const connectDB = require("./utils/db"); //[cite: 1]
const { seed } = require("./seed"); //[cite: 1]
const books = require("./routes/books.routes"); //[cite: 1]

const app = express(); //[cite: 1]

const PORT = process.env.PORT || 4001; //[cite: 1]

// CORS is wide open on purpose. This one backend is shared by an entire
// class — every student deploys their OWN frontend at their own
// unpredictable URL (a personal GitHub Pages site, their own Vercel
// project, Netlify, whatever they pick), so a hardcoded origin allow-list
// doesn't scale to "however many students are in the course". It's also not
// hiding anything real: this app has no authentication, so anyone can already
// POST/PUT/DELETE data directly (curl, Postman) regardless of what CORS
// allows — CORS only gates browser JS, not other clients. Restricting origins
// here would add inconvenience without adding real protection.
app.use(cors()); //[cite: 1]

// Parse incoming JSON bodies (needed for POST/PUT /api/books).
app.use(express.json()); //[cite: 1]

let seedPromise = null; //[cite: 1]
app.use((req, res, next) => {
  connectDB()
    .then(() => {
      if (!seedPromise) seedPromise = seed();
      return seedPromise;
    })
    .then(() => next())
    .catch((err) => {
      seedPromise = null; // let the next request try again
      next(err);
    });
}); //[cite: 1]

// Landing page
app.get("/", (req, res) => {
  res.status(200).type("html").send(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>BookNest API</title>
<style>
  :root { color-scheme: light dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: linear-gradient(160deg, #fdf6ec, #f1e4cf);
    color: #2c2417;
  }
  main {
    width: 100%;
    max-width: 30rem;
    padding: 2.5rem;
    border-radius: 1rem;
    background: #fffaf2;
    box-shadow: 0 1rem 3rem rgba(60, 40, 10, 0.15);
    text-align: center;
  }
  h1 { margin: 0 0 0.25rem; font-size: 1.75rem; }
  p.tagline { margin: 0 0 1.5rem; color: #7a6a4f; }
  .status {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.8rem;
    border-radius: 999px;
    background: #e4f2e1;
    color: #2f6d33;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }
  .status::before { content: "●"; color: #43a047; }
  ul { list-style: none; padding: 0; margin: 0; text-align: left; }
  li {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.6rem 0;
    border-top: 1px solid #eee0c8;
    font-size: 0.9rem;
  }
  li:first-child { border-top: none; }
  code {
    background: #f1e4cf;
    padding: 0.15rem 0.4rem;
    border-radius: 0.3rem;
    font-size: 0.85rem;
    white-space: nowrap;
  }
</style>
</head>
<body>
  <main>
    <h1>📚 BookNest API</h1>
    <p class="tagline">A tiny REST API for the BookNest teaching project.</p>
    <div class="status">Running</div>
    <ul>
      <li><span>All books</span><code>GET /api/books</code></li>
      <li><span>One book</span><code>GET /api/books/:id</code></li>
      <li><span>Genres</span><code>GET /api/genres</code></li>
      <li><span>Add a book</span><code>POST /api/books</code></li>
      <li><span>Update a book</span><code>PUT /api/books/:id</code></li>
      <li><span>Remove a book</span><code>DELETE /api/books/:id</code></li>
    </ul>
  </main>
</body>
</html>`);
}); //[cite: 1]

app.use("/api/books", books.router); //[cite: 1]
app.use("/api/genres", books.genresRouter); //[cite: 1]

// Anything else under /api is a genuine 404.
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not found" });
}); //[cite: 1]

// Centralized error handler.
app.use((err, req, res, next) => {
  console.error("[error]", err); //[cite: 1]
  res.status(500).json({
    error: err.message || "Something went wrong",
  });
});

module.exports = app; //[cite: 1]

if (require.main === module) {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log("");
        console.log("  📚 BookNest API is running");
        console.log("     http://localhost:" + PORT);
        console.log("     http://localhost:" + PORT + "/api/books");
        console.log("");
        console.log(
          "  Keep this terminal open, then start Live Server for the frontend.",
        );
        console.log("");
      });
    })
    .catch((err) => {
      console.error("[server] Failed to start:", err);
      process.exit(1);
    });
} //[cite: 1]
