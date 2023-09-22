const bookModel = require("../models/booksModel");
const e = require("express");
const memberModel = require("../models/memberModel");

//Create New Book Function
const create_book = async (req, res) => {
  try {
    //Create new BookModel based on Body Request
    const book_db = new bookModel({
      code: req.body.code,
      title: req.body.title,
      author: req.body.author,
      stock: req.body.stock,
      loans_id_member: null,
      loans_date: null,
    });

    //Save to DB
    const save_db = await book_db.save();

    //Response
    res.status(201).json({
      message: "Book berhasil dibuat!",
      result: [book_db],
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

//Get Book List Function
const check_book = async (req, res) => {
  try {
    //Find Book based on stock
    const get_db = await bookModel.find({ stock: 1 });

    //Count Total Books
    const total_db = await bookModel.count({});

    //Count Total Books that loaned
    const loaned_db = await bookModel.count({ stock: 0 });

    //Response
    res.status(200).json({
      results: [get_db],
      total_books: total_db,
      loaned_books: loaned_db,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

//Borrow Book Function
const borrow_book = async (req, res) => {
  try {
    //Request Member Code by Parameter
    id_member = req.params.code;

    //Check the member code
    const get_member = await memberModel.findOne({ code: id_member });
    if (get_member == null) {
      res.status(404).json({ message: "Member tidak ditemukan!" });
    }

    //Find Book that want to loan base on stock or availbility
    const get_db = await bookModel.findOne({
      code: req.body.book_code,
      stock: 0,
    });

    //If the stock is 0
    if (get_db) {
      //Response, book not found
      res.status(404).json({ message: "Buku tidak tersedia!" });
    } else {
      //if there is stock in the book, loan the book to the member
      const borrow_db = await bookModel.updateOne(
        { code: req.body.book_code },
        {
          stock: 0,
          loans_id_member: id_member,
          loans_date: new Date(),
        }
      );

      //Response
      res.status(200).json({
        message: "Berhasil meminjam buku!",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

//Return Book Function
const return_book = async (req, res) => {
  try {
    //Find Book by Parameter Request of Member Code and Book Code
    const loan_db = await bookModel.findOne({
      code: req.body.book_code,
      loans_id_member: req.params.code,
    });

    //If the data is found
    if (loan_db) {
      //Update the book data
      const book_db = await bookModel.updateOne(
        {
          code: req.body.book_code,
        },
        {
          stock: 1,
          loans_id_member: null,
          loans_date: null,
        }
      );

      //Check the book loaned date
      const return_date = new Date();
      const loan_diff = Math.floor((return_date - loan_db.loans_date) / (1000 * 60 * 60 * 24));

      //If the book is returned after more than 7 days
      if (loan_diff > 7) {
        //Member get penalty
        const member_db = await memberModel.updateOne(
          {
            code: req.params.code,
          },
          {
            status: "Penalized",
            penalty_date: new Date(),
          }
        );

        //Response if get penalty
        res.status(200).json({
          message: "Buku berhasil dikembalikan!",
          warning: "Member terkena Penalty, dikarenakan peminjaman melebihi 7 hari!!!",
        });
      } else {
        //Success Response
        res.status(200).json({
          message: "Buku berhasil dikembalikan!",
        });
      }
    } else {
      //Response if the data not found
      res.status(404).json({
        message: "Data buku tidak ditemukan!",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = {
  create_book,
  check_book,
  borrow_book,
  return_book,
};
