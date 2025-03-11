const express = require("express");
const router = express.Router();

const bookController = require("../controllers/Book");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.post("/books", multer, bookController.postBook);
router.get("/books", bookController.getBooks);
router.get("/books/:id", bookController.getOneBook);
router.get("/books/bestrating", bookController.bestRatingBooks);
router.put("/books/:id", multer, bookController.updateBook);
router.delete("/books/:id", bookController.deleteBook);
router.post("/books/:id/rating", bookController.postRating);

module.exports = router;
