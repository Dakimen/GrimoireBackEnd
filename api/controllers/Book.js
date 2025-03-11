const Book = require("../models/Book");
const jwt = require("jsonwebtoken");
const fs = require("fs");

exports.postBook = (req, res, next) => {
  console.log(req.body.book);
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  const book = new Book({
    ...bookObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Livre enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getBooks = async (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneBook = async (req, res, next) => {
  /*Book.findById(req.params.id)
    .then((book) => res.status(200).json(book))
    .catch((error) => {
      console.log(error.message);
      res.status(400).json({ error });
    }); */
};

exports.bestRatingBooks = async (req, res, next) => {
  console.log("Texte");
  Book.find({})
    .sort({ averageRating: 1 })
    .limit(3)
    .then((books) => {
      return res.status(200).json(books);
    })
    .catch((error) => {
      console.log(error.message);
      res.status(400).json({ error });
    });
  /*Book.find()
    .then((books) => {
      const booksArray = [books];
      console.log(booksArray);
      booksArray.sort((a, b) => a.averageRating - b.averageRating);
      var bestBooks = booksArray.slice(0, 2);
      return res.status(200).json(bestBooks);
    })
    .catch((error) => res.status(404).json({ error })); */
};

exports.updateBook = async (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  Book.findOne({ _id: req.params.id }).then((book) => {
    Book.updateOne(
      { _id: req.params.id },
      { ...bookObject, _id: req.params.id }
    )
      .then(() => res.status(200).json({ message: "Livre modifié !" }))
      .catch((error) => res.status(401).json({ error }));
  });
};

exports.deleteBook = async (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      const filename = book.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Book.deleteOne({ _id: req.params.id })
          .then(() => {
            res.status(200).json({ message: "Livre supprimé !" });
          })
          .catch((error) => res.status(401).json({ error }));
      });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.postRating = async (req, res, next) => {
  Book.findById(req.params.id)
    .then((book) => {
      const ratingNew = {
        userId: req.body.userId,
        grade: req.body.rating,
        id: req.params.id,
      };
      book.ratings.push(ratingNew);
      var sum = 0;
      for (i = 0; i < book.ratings.length; i++) {
        sum += book.ratings[i].grade;
      }
      book.averageRating = sum / book.ratings.length;
      Book.findByIdAndUpdate(book._id, { $set: book })
        .then(() => {
          res.status(200).json(book);
        })
        .catch((error) => {
          res.status(400).json(error);
        });
    })
    .catch((error) => {
      console.log(error.message);
      res.status(400).json({ error });
    });
};
