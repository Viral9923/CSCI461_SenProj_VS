const express = require("express");
const {
  addTransaction,
  getAllTransaction,
  editTransaction,
  deleteTransacion,
} = require("../controllers/transactionController");

const router = express.Router();

router.post("/add-transaction", addTransaction);

router.post("/get-transaction", getAllTransaction);

router.post("/edit-transaction", editTransaction);

router.post("/delete-transaction", deleteTransacion);

module.exports = router;
