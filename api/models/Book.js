const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
    },
    author: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    year: {
      type: Number,
    },
    genre: {
      type: String,
    },
    ratings: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        grade: {
          type: Number,
        },
      },
    ],
    averageRating: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
