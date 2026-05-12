# GitHub Profile Tracker

A small Node.js + Express + MongoDB web app that lets a user look up any GitHub username, view their profile and recent repositories, and save each search to a history page.

## How the requirements are met

1. **Node.js / Express / MongoDB** — `app.js` is the Express server, MongoDB is connected via Mongoose in the same file.
2. **No PHP** — pure JavaScript.
3. **`express.Router()`** — used in `routes/index.js` (home + `/search`) and `routes/history.js` (`/history` + delete). Both routers are mounted in `app.js`.
4. **Mongoose** — `models/Search.js` defines a Mongoose schema/model. All DB access (`.create`, `.find`, `.findByIdAndDelete`) goes through Mongoose.
5. **Stores & retrieves data** — every successful search is saved as a `Search` document and listed on `/history`.
6. **Form** — `views/index.ejs` has a form (`POST /search`) with a required username field and an optional note field.
7. **CSS file** — `public/css/styles.css` is served by Express static and is linked in every page. It uses `background-color`, `color`, and `font-size`, and loads the Google font **Inter** (`<link>` to `fonts.googleapis.com` in `views/partials/header.ejs`).
8. **External API** — calls the GitHub REST API (`https://api.github.com/users/:username` and `/users/:username/repos`) to populate the profile page. The token is optional but recommended (raises rate limit from 60/hr to 5,000/hr).

## Project structure

```
github-profile-tracker/
├── app.js
├── package.json
├── .env.example
├── .gitignore
├── README.md
├── models/
│   └── Search.js
├── routes/
│   ├── index.js          # GET / and POST /search
│   └── history.js        # GET /history and POST /history/:id/delete
├── views/
│   ├── index.ejs         # home page with the form
│   ├── profile.ejs       # search result page
│   ├── history.ejs       # saved search list
│   ├── error.ejs
│   └── partials/
│       ├── header.ejs
│       └── footer.ejs
└── public/
    └── css/
        └── styles.css
```

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# then edit .env and paste your MongoDB Atlas connection string into MONGODB_URI.
# (optional) paste a GitHub personal access token into GITHUB_TOKEN.

# 3. Run
npm start
# or, with auto-restart on save:
npm run dev
```

Open <http://localhost:3000>.

## Routes

| Method | Path                       | What it does                                            |
| ------ | -------------------------- | ------------------------------------------------------- |
| GET    | `/`                        | Renders the search form                                 |
| POST   | `/search`                  | Calls the GitHub API, saves a `Search` doc, renders the profile |
| GET    | `/history`                 | Lists the 50 most recent saved searches                 |
| POST   | `/history/:id/delete`      | Deletes a saved search                                  |

## Notes

- Requires Node.js 18+ because the code relies on the built-in `fetch`.
- If you see `403` errors from GitHub, you have hit the unauthenticated rate limit; add a `GITHUB_TOKEN` to `.env`.
- The Mongoose connection string is read from `MONGODB_URI`. If it is missing, the app falls back to `mongodb://localhost:27017/github_tracker` for local development.
