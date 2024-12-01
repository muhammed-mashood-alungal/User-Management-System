const express = require('express')
const { getAllUsers, deleteUser } = require('../Controller/adminController')
const { doLogin } = require('../Controller/userController')
const router = express.Router()

///API FOR GET ALL USERS
router.get('/all-users', (req, res) => {
    getAllUsers().then((users) => {
        res.status(200).json({ users: users })
    }).catch((err) => {
        res.status(400).json({ msg: err })
    })
})

// API FOR DELETE AN USER 
router.delete('/delete-user/:id', (req, res) => {
    deleteUser(req.params.id).then(() => {
        res.status(200).json({ status: true })
    }).catch(() => {
        res.status(400).json({ status: false })
    })
})

//API FOR USER LOGIN
router.post('/login', (req, res) => {
    doLogin(req.body).then((response) => {
        res.cookie('token', response.token, {
            httpOnly: true,
            secure: true
        })
        res.json({ user: response.user }).status(200)
    }).catch((err) => {
        res.status(400).json({ msg: err })
    })
})
module.exports = router