/*
 * books.routes.js — full CRUD for the `books` collection (plus the
 * /api/books/genres and /api/genres alias for the genre dropdown).
 *
 * Mounted in server.js as:
 *   app.use('/api/books', booksRouter);
 *   app.use('/api/genres', genresRouter);   // the contract path the client uses
 */

const express = require('express');
const Book = require('../models/Book');

const router = express.Router();

// The fixed genre order we want the dropdown to show.
const GENRE_ORDER = [
  'Fiction',
  'Mystery',
  'Sci-Fi',
  'Fantasy',
  'Biography',
  'History',
  'Self-Help',
  'Romance'
];

/** Read the catalogue from MongoDB. Always an array. */
async function getBooks() {
  return Book.find({}, '-_id -__v').lean();
}

/** The distinct genres actually present in the catalogue, in our fixed order. */
async function getGenres() {
  const books = await getBooks();
  const present = [];

  for (const book of books) {
    if (book.genre && !present.includes(book.genre)) present.push(book.genre);
  }

  const known = GENRE_ORDER.filter((genre) => present.includes(genre));
  const extra = present.filter((genre) => !GENRE_ORDER.includes(genre));
  return known.concat(extra);
}

/** Book ids are plain incrementing numbers (not Mongo ObjectIds), so a new
 *  book just takes the next one after whatever the highest existing id is. */
async function nextId() {
  const last = await Book.findOne().sort({ id: -1 }).select('id').lean();
  return last ? last.id + 1 : 1;
}

/*
 * GET /api/books/genres
 *
 * IMPORTANT: this literal route is registered BEFORE '/:id'. Express matches
 * routes top to bottom, so if '/:id' came first it would happily treat the
 * word "genres" as an id and answer 404.
 */
router.get('/genres', async (req, res) => {
  res.status(200).json(await getGenres());
});

/*
 * GET /api/books
 * Optional query params, which combine when both are present:
 *   ?search=<text>  case-insensitive match on title OR author
 *   ?genre=<genre>  exact genre match
 */
router.get('/', async (req, res) => {
  let books = await getBooks();

  const search = (req.query.search || '').toString().trim().toLowerCase();
  const genre = (req.query.genre || '').toString().trim();

  if (search !== '') {
    books = books.filter((book) => {
      const title = (book.title || '').toLowerCase();
      const author = (book.author || '').toLowerCase();
      return title.includes(search) || author.includes(search);
    });
  }

  if (genre !== '') {
    books = books.filter((book) => book.genre === genre);
  }

  // No matches is still a successful request: 200 with an empty array, not 404.
  res.status(200).json(books);
});

/*
 * GET /api/books/:id
 * 200 with the book, or 404 { error: "Book not found" }.
 */
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const book = await Book.findOne({ id }, '-_id -__v').lean();

  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  res.status(200).json(book);
});

/*
 * POST /api/books
 * body: { title, author, genre, year?, rating?, price?, pages?, language?, cover?, description? }
 * -> 201 + the created book, or 400 if a required field is missing/invalid.
 */
router.post('/', async (req, res, next) => {
  try {
    const id = await nextId();
    const book = await Book.create({ ...req.body, id });
    res.status(201).json(book);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
    next(err);
  }
});

/*
 * PUT /api/books/:id
 * body: any subset of the Book fields.
 * -> the updated book, or 404 if it doesn't exist.
 */
router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    // `id` itself is never editable through the body — it's how the URL
    // found this book in the first place.
    const { id: _ignored, ...updates } = req.body;

    const book = await Book.findOneAndUpdate({ id }, updates, {
      new: true,
      runValidators: true,
      fields: '-_id -__v'
    });

    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.status(200).json(book);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
    next(err);
  }
});

/*
 * DELETE /api/books/:id
 * -> 204 No Content on success, or 404 if it doesn't exist.
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const book = await Book.findOneAndDelete({ id });

    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// A second tiny router so the contract path /api/genres works too.
const genresRouter = express.Router();
genresRouter.get('/', async (req, res) => {
  res.status(200).json(await getGenres());
});

module.exports = { router, genresRouter };
