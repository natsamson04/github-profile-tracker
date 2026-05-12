const express = require('express');
const router = express.Router();
const Search = require('../models/Search');

// --- GitHub API helper -------------------------------------------------------
// Uses the public REST API: https://api.github.com
// Node 18+ provides fetch globally, so no extra dependency is needed.
async function fetchGithubUser(username) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'github-profile-tracker',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const safe = encodeURIComponent(username);

  const userRes = await fetch(`https://api.github.com/users/${safe}`, { headers });
  if (userRes.status === 404) {
    throw new Error(`GitHub user "${username}" was not found.`);
  }
  if (userRes.status === 403) {
    throw new Error('GitHub API rate limit reached. Add a GITHUB_TOKEN to .env and try again.');
  }
  if (!userRes.ok) {
    throw new Error(`GitHub API error: ${userRes.status} ${userRes.statusText}`);
  }
  const user = await userRes.json();

  const reposRes = await fetch(
    `https://api.github.com/users/${safe}/repos?sort=updated&per_page=6`,
    { headers }
  );
  const repos = reposRes.ok ? await reposRes.json() : [];

  return { user, repos };
}

// --- Routes ------------------------------------------------------------------

// GET / — show the search form
router.get('/', (req, res) => {
  res.render('index', { title: 'GitHub Profile Tracker', error: null });
});

// POST /search — process the form, call GitHub, save to MongoDB
router.post('/search', async (req, res) => {
  const username = (req.body.username || '').trim();
  const note = (req.body.note || '').trim();

  if (!username) {
    return res.status(400).render('index', {
      title: 'GitHub Profile Tracker',
      error: 'Please enter a GitHub username.',
    });
  }

  try {
    const { user, repos } = await fetchGithubUser(username);

    const search = await Search.create({
      username: user.login,
      displayName: user.name || '',
      avatarUrl: user.avatar_url || '',
      bio: user.bio || '',
      location: user.location || '',
      publicRepos: user.public_repos || 0,
      followers: user.followers || 0,
      following: user.following || 0,
      profileUrl: user.html_url || '',
      note,
    });

    res.render('profile', {
      title: `@${user.login}`,
      user,
      repos,
      search,
    });
  } catch (err) {
    res.status(400).render('index', {
      title: 'GitHub Profile Tracker',
      error: err.message,
    });
  }
});

module.exports = router;
