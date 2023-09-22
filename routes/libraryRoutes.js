/**
 * @swagger
 * components:
 *  schemas:
 *      Member:
 *          type: object
 *          required:
 *              - _id
 *              - code
 *              - name
 *          properties:
 *              _id:
 *                  type: String
 *                  description: Auto-generated _id from MongoDB
 *                  example: 1
 *              code:
 *                  type: String
 *                  description: Id of the member
 *                  example: M001
 *              name:
 *                  type: String
 *                  description: Name of the member who register
 *                  example: Rafi Reyhan
 *              status:
 *                  type: String
 *                  description: Member current status if the member get penalized
 *                  example: Penalized
 *              penalty_date:
 *                  type: Date
 *                  description: The penalty date if the member get penalized
 *                  example: 2023-09-22T02:39:19.261+00:00
 *      Book:
 *          type: object
 *          required:
 *              - _id
 *              - code
 *              - title
 *              - author
 *              - stock
 *          properties:
 *              _id:
 *                  type: String
 *                  description: Auto-generated _id from MongoDB
 *                  example: 1
 *              code:
 *                  type: String
 *                  description: Code of the book
 *                  example: JK-45
 *              title:
 *                  type: String
 *                  description: Title of the book
 *                  example: Harry Potter
 *              author:
 *                  type: String
 *                  description: Author of the book
 *                  example: J.K Rowling
 *              stock:
 *                  type: Number
 *                  description: Stock of the book
 *                  example: 1
 *              loans_id_member:
 *                  type: String
 *                  description: the Member Code if the book loaned
 *                  example: M001
 *              loans_date:
 *                  type: Date
 *                  description: Date when the book loaned
 *                  example: 2023-09-22T02:41:25.472+00:00
 *
 */

/**
 * @swagger
 * tags:
 *  name: Library
 *  description: Libary managing API
 * /library/create-member:
 *  post:
 *      summary: Add new member
 *      tags: [Member]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: Rafi Reyhan
 *      responses:
 *          201:
 *              description: Created Member
 *              content:
 *                  application/json:
 *                      schema:
 *                          items:
 *                              $ref: '#/components/schemas/Member'
 *          500:
 *              description: Internal Server Error
 * /library/check-member:
 *  get:
 *      summary: Show all existing member and books being borrowed by each member
 *      tags: [Member]
 *      responses:
 *          200:
 *              description: Member list
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Member'
 *          500:
 *              description: Internal Server Error
 * /library/create-book:
 *  post:
 *      summary: Add new book
 *      tags: [Book]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          code:
 *                              type: string
 *                              example: JK-45
 *                          title:
 *                              type: string
 *                              example: Harry Potter
 *                          author:
 *                              type: string
 *                              example: J.K Rowling
 *                          stock:
 *                              type: number
 *                              example: 1
 *      responses:
 *          201:
 *              description: Created Book
 *              content:
 *                  application/json:
 *                      schema:
 *                          items:
 *                              $ref: '#/components/schemas/Book'
 *          500:
 *              description: Internal Server Error
 * /library/check-book:
 *  get:
 *      summary: Show all existing book and quantities, borrowed books not counted
 *      tags: [Book]
 *      responses:
 *          200:
 *              description: Book list
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Book'
 *          500:
 *              description: Internal Server Error
 * /library/borrow-book/{code}:
 *  put:
 *      summary: Members can borrow books with condition
 *      tags: [Book]
 *      parameters:
 *          - in: path
 *            name: code
 *            required: true
 *            description: Member Code
 *            schema:
 *              type: string
 *              example: M001
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          book_code:
 *                              type: string
 *                              example: JK-45
 *      responses:
 *          200:
 *              description: Book successfully loaned
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Berhasil meminjam buku!
 *          404:
 *              description: Books not found or not available!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Buku tidak tersedia!
 *          400:
 *              description: Member may not borrow more than 2 books, or currently not being penalized
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Member tidak boleh meminjam lebih dari 2 buku!!
 *          500:
 *              description: Internal Server Error
 * /library/return-book/{code}:
 *  put:
 *      summary: Members return the book with conditions
 *      tags: [Book]
 *      parameters:
 *          - in: path
 *            name: code
 *            required: true
 *            description: Member Code
 *            schema:
 *              type: string
 *              example: M001
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          book_code:
 *                              type: string
 *                              example: JK-45
 *      responses:
 *          200:
 *              description: Book successfully returned
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Buku berhasil dikembalikan!
 *          404:
 *              description: Books Data not found or the member is not the one who borrowed the book
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Data buku tidak ditemukan!
 *          500:
 *              description: Internal Server Error
 */

const express = require("express");
const router = express.Router();

//Import Services or Controller
const memberController = require("../controllers/memberController");
const bookController = require("../controllers/booksController");
const memberVerify = require("../validations/memberVerification");

//Member Endpoint
router.post("/create-member", memberController.create_member);
router.get("/check-member", memberController.check_member);

//Book Endpoint
router.post("/create-book", bookController.create_book);
router.get("/check-book", bookController.check_book);
router.put("/borrow-book/:code", memberVerify.member_loan_verif, memberVerify.member_status_verif, bookController.borrow_book);
router.put("/return-book/:code", bookController.return_book);

//Export
module.exports = router;
