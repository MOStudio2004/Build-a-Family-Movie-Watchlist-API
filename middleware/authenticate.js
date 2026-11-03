import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
  const authorization = req.headers.authorization;
  const match = authorization?.match(/^Bearer\s+(\S+)\s*$/i);

  if (!match) {
    return res.status(401).json({ error: "No token provided." });
  }

  try {
    req.user = jwt.verify(match[1], process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }

  next();
}