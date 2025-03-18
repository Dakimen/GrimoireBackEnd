const express = require("express");
const router = express.Router();

const bookController = require("../controllers/Book");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.post("/books", auth, multer, bookController.postBook);
router.get("/books", bookController.getBooks);
router.get("/books/bestrating", bookController.bestRatingBooks);
router.get("/books/:id", bookController.getOneBook);
router.put("/books/:id", auth, multer, bookController.updateBook);
router.delete("/books/:id", auth, bookController.deleteBook);
router.post("/books/:id/rating", auth, bookController.postRating);

module.exports = router;
