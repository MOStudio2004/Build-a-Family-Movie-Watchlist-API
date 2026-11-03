export function authorizeModification(req, res, next) {
  const isParent = req.user?.role === "parent";
  const isOwnWatchlist =
    req.user?.role === "child" &&
    Number(req.params.userId) === Number(req.user.id);

  if (!isParent && !isOwnWatchlist) {
    return res.status(403).json({ error: "Access denied" });
  }

  next();
}
