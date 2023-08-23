const jwt = require('jsonwebtoken')
const {Users} = require('../model/schemas')


/** Verify Token */
const verifyToken = async (req, res, next) => {
  const header = req.headers['authorization']
  const token = header && header.split(' ')[1]
  console.log(header, ' || ', token)

  if (!token) return res.status(401).json({
    success: false,
    message: 'Missing Token!'
  })

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid Token!'
      })
    }
    req.id = decoded.id
    req.username = decoded.username
    console.log(decoded)
    next()
  })
}

/** Verify User */
const verifyUser = async (req, res, next) => {
  try {
    const {
      username
    } = req.method === "GET" ? req.query : req.body
    const user = await Users.findOne({
      where: {
        username
      }
    })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Can\'t find Username!'
      })
    }
    next()
  } catch (err) {
    console.log(err)
    res.status(404).json({
      success: false,
      message: err.message
    })
  }
}


module.exports = {
  verifyToken,
  verifyUser
}