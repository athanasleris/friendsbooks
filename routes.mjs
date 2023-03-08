import express from 'express'
// use different models to demonstrate connection to different databases
import * as Validator from './validator/validation.mjs'
import * as UserController from './controller/user_controller.mjs'
import * as BookController from './controller/book_controller.mjs'
import * as BookList from './model/booklist_model.mjs' // version 3 with ORM sequelize, postgress
import session from 'express-session'

const router = express.Router()

//αν υπάρχει ενεργή συνεδρία, ανακατεύθυνε στο /books
router.get("/", (req, res) => {
    if (req.session.username)
        res.redirect("/books")
    else
        res.render("home")
})
router.get("/addcomment/:title", UserController.checkIfAuthenticated, BookController.doaddcomment, BookController.showBookList)

//έλεγξε αν έχει συνδεθεί ο χρήστης, μετά δείξε τα βιβλία
router.get("/books", UserController.checkIfAuthenticated, BookController.showBookList)

//δείξε τη φόρμα εισαγωγής νέου βιβλίου
router.get("/addbookform", UserController.checkIfAuthenticated, (req, res) => {
    res.render("addbookform")
})

//αυτή η διαδρομή υποδέχεται τη φόρμα εισόδου
router.post("/books",
    
    Validator.validateLogin,
    UserController.doLogin,
    UserController.checkIfAuthenticated,
    BookController.showBookList)

//υποδέχεται την φόρμα υποβολής νέου βιβλίου
router.post("/doaddbook",
    UserController.checkIfAuthenticated, //έλεγξε αν έχει συνδεθεί ο χρήστης,
    Validator.validateNewBook,
    BookController.addBook,
    BookController.showBookList)

// διαγραφή ενός βιβλίου με τίτλο title από τη λίστα του χρήστη
router.get("/delete/:title",
    UserController.checkIfAuthenticated, //έλεγξε αν έχει συνδεθεί ο χρήστης,
    BookController.deleteBook,
    BookController.showBookList)

router.post("/addcomment/:title",
    UserController.checkIfAuthenticated, //έλεγξε αν έχει συνδεθεί ο χρήστης,
    BookController.doaddcomment,
    BookController.showBookList
    )

router.post("/updatecomment",
    UserController.checkIfAuthenticated, //έλεγξε αν έχει συνδεθεί ο χρήστης,
    //BookController.updatecomment,
    BookList.updatecomment,
    BookController.showBookList
    )

router.get("/logout", UserController.doLogout, (req, res) => {
    //req.session.destroy() //καταστρέφουμε τη συνεδρία στο session store
    res.redirect("/")
})

router.get("/register", (req, res) => {
    res.render("registrationform")
})

router.post("/doregister",
    Validator.validateNewUser,
    UserController.doRegister)

export { router }