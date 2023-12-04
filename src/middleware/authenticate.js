const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
exports.auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }
      req.user = user;
      return next();
    });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
