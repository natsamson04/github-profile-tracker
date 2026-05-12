const express = require('express');
const router = express.Router();
const Search = require('../models/Search');

// GET /history — list saved searches (newest first)
router.get('/', async (req, res, next) => {
  try {
    const searches = await Search.find().sort({ createdAt: -1 }).limit(50);
    res.render('history', { title: 'Search History', searches });
  } catch (err) {
    next(err);
  }
});

// POST /history/:id/delete — remove a single entry
router.post('/:id/delete', async (req, res, next) => {
  try {
    await Search.findByIdAndDelete(req.params.id);
    res.redirect('/history');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
