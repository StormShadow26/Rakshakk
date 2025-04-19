const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const token = req.cookies?.token; // assuming cookie is named "token"
  console.log("Token is:"+token);
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded; // Save decoded user info
    next();
  });
};

module.exports = verifyJWT;