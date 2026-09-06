/*
 * pets.routes.js — full CRUD for the `pets` collection.
 *
 * Mounted in server.js as:  app.use('/api/pets', petsRouter);
 * so every path below is relative to /api/pets.
 */

const express = require('express');
const Pet = require('../models/Pet');

const router = express.Router();

/*
 * GET /api/pets
 *   ?species=Dog     filter to one species (exact match, case-insensitive)
 *   ?status=Available filter to one status (exact match, case-insensitive)
 *   ?search=luna      match against name OR breed (partial, case-insensitive)
 *
 * Always returns an array (empty if nothing matches) — never a 404. Newest
 * pets first.
 */
router.get('/', async (req, res, next) => {
  try {
    const filter = {};

    const species = (req.query.species || '').toString().trim();
    if (species) filter.species = new RegExp(`^${escapeRegex(species)}$`, 'i');

    const status = (req.query.status || '').toString().trim();
    if (status) filter.status = new RegExp(`^${escapeRegex(status)}$`, 'i');

    const search = (req.query.search || '').toString().trim();
    if (search) {
      const pattern = new RegExp(escapeRegex(search), 'i');
      filter.$or = [{ name: pattern }, { breed: pattern }];
    }

    const pets = await Pet.find(filter).sort({ createdAt: -1 });
    res.status(200).json(pets);
  } catch (err) {
    next(err);
  }
});

/*
 * GET /api/pets/:id
 * -> the one pet, or 404 if the id doesn't exist / isn't a valid Mongo id.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ error: 'Pet not found' });
    res.status(200).json(pet);
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ error: 'Pet not found' });
    next(err);
  }
});

/*
 * POST /api/pets
 * body: { name, species, age, description, imageUrl, breed?, gender?, size?, status? }
 * -> 201 + the created pet, or 400 if required fields are missing/invalid.
 */
router.post('/', async (req, res, next) => {
  try {
    const pet = await Pet.create(req.body);
    res.status(201).json(pet);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
    next(err);
  }
});

/*
 * PUT /api/pets/:id
 * body: any subset of the Pet fields — used both for full edits and for
 * quick one-field updates like { status: "Adopted" }.
 * -> the updated pet, or 404 if it doesn't exist.
 */
router.put('/:id', async (req, res, next) => {
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!pet) return res.status(404).json({ error: 'Pet not found' });
    res.status(200).json(pet);
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ error: 'Pet not found' });
    if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
    next(err);
  }
});

/*
 * DELETE /api/pets/:id
 * -> 204 No Content on success, or 404 if it doesn't exist.
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ error: 'Pet not found' });
    res.status(204).send();
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ error: 'Pet not found' });
    next(err);
  }
});

/** Escape a string so it's safe to drop into a `new RegExp(...)`. */
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = router;
