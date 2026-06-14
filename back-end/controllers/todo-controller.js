const db = require("../models/db");
const { Status } = require("@prisma/client");

const createError = (statusCode, message) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

exports.getByUser = async (req, res, next) => {
  try {
    const Reservation = await db.reservation.findMany({
      where: { userId: req.user.id },
      orderBy: { id: "desc" },
    });
    res.json({ Reservation });
  } catch (err) {
    next(err);
  }
};

exports.createTodo = async (req, res, next) => {
  try {
    const { title, status, dueDate } = req.body;
    if (!title || !dueDate) {
      throw createError(400, "title and dueDate are required");
    }

    const data = {
      title,
      dueDate: new Date(dueDate),
      userId: req.user.id,
    };
    if (status) data.status = status;

    const result = await db.reservation.create({ data });
    res.json({ msg: "Create OK", result });
  } catch (err) {
    next(err);
  }
};

exports.updateTodo = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!id) throw createError(400, "invalid id");

    const { title, status, dueDate } = req.body;
    const data = {};
    if (title !== undefined) data.title = title;
    if (status !== undefined) data.status = status;
    if (dueDate !== undefined) data.dueDate = new Date(dueDate);

    // updateMany lets us scope by ownership (id + userId) and get a count back,
    // so another user can't edit a row that isn't theirs (no IDOR).
    const result = await db.reservation.updateMany({
      data,
      where: { id, userId: req.user.id },
    });
    if (result.count === 0) throw createError(404, "reservation not found");

    res.json({ msg: "Update ok", result });
  } catch (err) {
    next(err);
  }
};

exports.deleteTodo = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!id) throw createError(400, "invalid id");

    const result = await db.reservation.deleteMany({
      where: { id, userId: req.user.id },
    });
    if (result.count === 0) throw createError(404, "reservation not found");

    res.json({ msg: "Delete ok", result });
  } catch (err) {
    next(err);
  }
};

exports.getAllStatus = (req, res, next) => {
  res.json({ status: Object.values(Status) });
};
