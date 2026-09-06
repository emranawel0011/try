/*
 * seed.js — fills the `pets` collection with starter data the first time the
 * server boots against an empty database. Never runs again once there is at
 * least one pet, so an instructor's edits (or a student's test pets) survive
 * restarts.
 *
 * Images come from picsum.photos with a fixed `seed` per pet, so the same
 * URL always returns the same photo (not a real photo of that species/breed
 * — just a stable placeholder to build the UI against).
 */

const Pet = require('./models/Pet');

const STARTER_PETS = [
  {
    name: 'Biscuit',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: 2,
    gender: 'Male',
    size: 'Large',
    description: 'Biscuit is a goofy, tail-wagging bundle of energy who loves fetch, long walks, and greeting every single person he meets like a long-lost friend.',
    imageUrl: 'https://picsum.photos/seed/biscuit-pawhaven/640/480',
    status: 'Available',
  },
  {
    name: 'Luna',
    species: 'Cat',
    breed: 'Domestic Shorthair',
    age: 1,
    gender: 'Female',
    size: 'Small',
    description: 'Luna is a curious, quiet little shadow who will follow you from room to room and curl up on whatever you were just about to sit on.',
    imageUrl: 'https://picsum.photos/seed/luna-pawhaven/640/480',
    status: 'Available',
  },
  {
    name: 'Pretzel',
    species: 'Rabbit',
    breed: 'Holland Lop',
    age: 1,
    gender: 'Male',
    size: 'Small',
    description: 'Pretzel has floppy ears and an unstoppable love of fresh herbs. He is litter-trained and gets along well with calm dogs and cats.',
    imageUrl: 'https://picsum.photos/seed/pretzel-pawhaven/640/480',
    status: 'Pending',
  },
  {
    name: 'Captain',
    species: 'Bird',
    breed: 'Cockatiel',
    age: 3,
    gender: 'Male',
    size: 'Small',
    description: 'Captain whistles the first few notes of the theme from a movie nobody can identify, and will happily perform it for anyone with sunflower seeds.',
    imageUrl: 'https://picsum.photos/seed/captain-pawhaven/640/480',
    status: 'Available',
  },
  {
    name: 'Nugget',
    species: 'Dog',
    breed: 'Corgi Mix',
    age: 4,
    gender: 'Female',
    size: 'Medium',
    description: 'Nugget has short legs and a big personality. She is fully house-trained, knows five tricks, and negotiates for treats using only eye contact.',
    imageUrl: 'https://picsum.photos/seed/nugget-pawhaven/640/480',
    status: 'Available',
  },
  {
    name: 'Mochi',
    species: 'Cat',
    breed: 'Ragdoll',
    age: 5,
    gender: 'Female',
    size: 'Medium',
    description: 'Mochi is a gentle, laid-back lap cat who goes limp with happiness when she is picked up. She would love a quiet home with a sunny windowsill.',
    imageUrl: 'https://picsum.photos/seed/mochi-pawhaven/640/480',
    status: 'Adopted',
  },
  {
    name: 'Waffles',
    species: 'Small Animal',
    breed: 'Guinea Pig',
    age: 1,
    gender: 'Male',
    size: 'Small',
    description: 'Waffles "wheeks" loudly the moment he hears the fridge open, hoping it means bell peppers. He is friendly and does best with a cage-mate.',
    imageUrl: 'https://picsum.photos/seed/waffles-pawhaven/640/480',
    status: 'Available',
  },
  {
    name: 'Zeus',
    species: 'Dog',
    breed: 'German Shepherd',
    age: 3,
    gender: 'Male',
    size: 'Large',
    description: 'Zeus is smart, loyal, and food-motivated in the best way — he picked up "sit," "stay," and "down" in a single weekend. Needs an active family.',
    imageUrl: 'https://picsum.photos/seed/zeus-pawhaven/640/480',
    status: 'Available',
  },
  {
    name: 'Clementine',
    species: 'Cat',
    breed: 'Orange Tabby',
    age: 2,
    gender: 'Female',
    size: 'Medium',
    description: 'Clementine is a chatty, food-obsessed troublemaker who will supervise every task you attempt in the kitchen from the counter\'s edge.',
    imageUrl: 'https://picsum.photos/seed/clementine-pawhaven/640/480',
    status: 'Pending',
  },
  {
    name: 'Ziggy',
    species: 'Other',
    breed: 'Bearded Dragon',
    age: 2,
    gender: 'Unknown',
    size: 'Small',
    description: 'Ziggy is a calm, easygoing reptile who enjoys basking under his lamp and staring judgmentally at whoever walks by his terrarium.',
    imageUrl: 'https://picsum.photos/seed/ziggy-pawhaven/640/480',
    status: 'Available',
  },
];

async function seed() {
  const count = await Pet.countDocuments();
  if (count > 0) return;

  await Pet.insertMany(STARTER_PETS);
  console.log(`[seed] Inserted ${STARTER_PETS.length} starter pets.`);
}

module.exports = { seed, STARTER_PETS };

// Allow `npm run seed` to force-run this file directly against whatever
// MONGODB_URI is in .env, useful if the collection was cleared out.
if (require.main === module) {
  require('dotenv').config();
  const connectDB = require('./utils/db');

  connectDB()
    .then(() => seed())
    .then(() => {
      console.log('[seed] Done.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[seed] Failed:', err);
      process.exit(1);
    });
}
