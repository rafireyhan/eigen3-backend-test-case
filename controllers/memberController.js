const memberModel = require("../models/memberModel");
const e = require("express");
const { count } = require("../models/memberModel");
const { get } = require("mongoose");
const booksModel = require("../models/booksModel");

//Create member function
const create_member = async (req, res) => {
  try {
    //Auto-Increment by Formatted ID
    let id_code;
    const count_db = await memberModel.count({});

    if (count_db > 0 && count_db < 10) {
      id_code = "M00" + (count_db + 1);
    } else if (count_db > 10 && count_db < 100) {
      id_code = "M0" + (count_db + 1);
    } else if (count_db > 100 && count_db < 1000) {
      id_code = "M" + (count_db + 1);
    } else {
      id_code = "M001";
    }
    //End of Auto-Increment by Formatted ID

    //Create new Member Model by Body Request
    const member_db = new memberModel({
      code: id_code,
      name: req.body.name,
      status: null,
      penalty_date: null,
    });

    //Save to DB
    const save_db = await member_db.save();

    //Response
    res.status(201).json({
      message: "Member berhasil dibuat!",
      result: [member_db],
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

//Member Check Function
const check_member = async (req, res) => {
  try {
    //Find all member in DB
    const get_length = await memberModel.find({});
    let results = [];

    //Looping based on length of data
    for (let i = 0; i < get_length.length; i++) {
      //Find member from _id based on MongoDB default key
      let get_member = await memberModel.findOne({ _id: i });

      //If the data is found
      if (get_member != null) {
        //Count the totals of books loaned by the member
        let get_book = await booksModel.count({ loans_id_member: get_member.code });
        member = get_member;
        book_loans = get_book;

        //Merge the array with Results
        let hasil = [{ member, book_loans }];
        results = results.concat(hasil);
      }
    }

    //Response
    res.status(200).json({ results });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = {
  create_member,
  check_member,
};
