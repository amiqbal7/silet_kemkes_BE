const express = require('express')
const router = express.Router()
const {
  verifyToken,
  verifyUser,
} = require('../middleware/auth')

const users = require('../controller/users')
const controller = require('../controller/auth')


/** Authenticate */
router.post('/auth', verifyUser, (req, res) => res.end())
router.post('/login', controller.login)

router.get('/token', controller.refreshToken)

/** Users */
router.get('/silet-kemkes', verifyToken, users.getData)
router.put('/update/:id', verifyUser, users.updateData)


module.exports = router