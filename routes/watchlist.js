import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";
import {
  getWatchlist,
  addMovie,
  updateMovie,
  deleteMovie,
} from "../utils/db.js";

const router = Router();

router.use(authenticate);

router.get("/:userId", (req, res) => {
  const watchlist = getWatchlist(Number(req.params.userId));

  if (watchlist === null) {
    return res.status(404).json({ error: "User not found." });
  }

  return res.status(200).json(watchlist);
});

router.post("/:userId/movies", authorizeModification, (req, res) => {
  const { title, genre } = req.body ?? {};

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof genre !== "string" ||
    !genre.trim()
  ) {
    return res.status(400).json({ error: "Title and genre are required." });
  }

  const movie = addMovie(Number(req.params.userId), { title, genre });

  if (movie === null) {
    return res.status(404).json({ error: "User not found." });
  }

  return res.status(201).json(movie);
});

router.put("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const { title, genre, watched } = req.body ?? {};
  const updates = {};

  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "Title must be a non-empty string." });
    }
    updates.title = title;
  }

  if (genre !== undefined) {
    if (typeof genre !== "string" || !genre.trim()) {
      return res.status(400).json({ error: "Genre must be a non-empty string." });
    }
    updates.genre = genre;
  }

  if (watched !== undefined) {
    if (typeof watched !== "boolean") {
      return res.status(400).json({ error: "Watched must be a boolean." });
    }
    updates.watched = watched;
  }

  const movie = updateMovie(
    Number(req.params.userId),
    Number(req.params.movieId),
    updates,
  );

  if (movie === null) {
    return res.status(404).json({ error: "User or movie not found." });
  }

  return res.status(200).json(movie);
});

router.delete("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const deleted = deleteMovie(
    Number(req.params.userId),
    Number(req.params.movieId),
  );

  if (!deleted) {
    return res.status(404).json({ error: "User or movie not found." });
  }

  return res.status(200).json({ message: "Movie deleted successfully." });
});

export default router;
