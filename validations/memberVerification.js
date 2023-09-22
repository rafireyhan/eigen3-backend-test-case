const e = require("express");
const bookModel = require("../models/booksModel");
const memberModel = require("../models/memberModel");

//Member Borrow Condition
async function member_loan_verif(req, res, next) {
  try {
    //Count total of books borrowed by the member
    const member_id = req.params.code;
    const find_book_by_id = await bookModel.count({ loans_id_member: member_id });

    //if the total more then 2 books
    if (find_book_by_id > 1) {
      //Response Cant borrow
      res.status(400).json({ message: "Member tidak boleh meminjam lebih dari 2 buku!!" });
    } else {
      //Next Function
      next();
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

//Member not being penalized condition
async function member_status_verif(req, res, next) {
  try {
    //Find member status, check if the member has penalized status
    const member_id = req.params.code;
    const find_member_by_id = await memberModel.findOne({ code: member_id, status: "Penalized" });

    //If the member is penalized
    if (find_member_by_id != null) {
      //Check the date when they are get penalized
      const today_date = new Date();
      const penalized = Math.floor((today_date - find_member_by_id.penalty_date) / (1000 * 60 * 60 * 24));

      //If the penalty date more than 3 Days
      if (penalized > 3) {
        //Remove the penalty status
        const update_member = await memberModel.updateOne(
          {
            code: req.params.code,
          },
          {
            status: null,
            penalty_date: null,
          }
        );
        //Go to Next Function
        next();
      } else {
        //Error Response
        res.status(400).json({ message: "Member yang terkena penalty tidak boleh meminjam buku!!" });
      }
    } else {
      //Go to next Function
      next();
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

module.exports = {
  member_loan_verif,
  member_status_verif,
};
