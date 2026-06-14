const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models/db");

const createError = (statusCode, message) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

exports.register = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      username,
      password,
      confirmPassword,
    } = req.body;

    if (
      !(firstName && lastName && email && phone && username && password && confirmPassword)
    ) {
      throw createError(400, "Fulfill all inputs");
    }
    if (confirmPassword !== password) {
      throw createError(400, "confirm password not match");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.user.create({
      data: { firstName, lastName, email, phone, username, password: hashedPassword },
    });

    res.json({ msg: "Register successful" });
  } catch (err) {
    // Prisma unique-constraint violation (duplicate username/email)
    if (err.code === "P2002") {
      return next(createError(409, "username or email already exists"));
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password || !username.trim() || !password.trim()) {
      throw createError(400, "username or password must not blank");
    }

    const user = await db.user.findFirst({ where: { username } });
    // Same message whether the user is missing or the password is wrong
    // (avoids user enumeration).
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw createError(400, "invalid login");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

exports.getme = (req, res, next) => {
  res.json(req.user);
};
