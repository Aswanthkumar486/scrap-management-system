const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7);
  }

  try {
    const decoded = jwt.verify(token, "secret123");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};