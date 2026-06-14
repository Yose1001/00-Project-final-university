const jwt = require("jsonwebtoken");
const db = require("../models/db");

module.exports = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw Object.assign(new Error("Unauthorized"), { statusCode: 401 });
    }

    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await db.user.findFirst({ where: { id: payload.id } });
    if (!user) {
      throw Object.assign(new Error("Unauthorized"), { statusCode: 401 });
    }

    delete user.password;
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      err.statusCode = 401;
    }
    next(err);
  }
};
