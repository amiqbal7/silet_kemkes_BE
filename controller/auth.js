const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Users } = require('../model/schemas')

/** Login */
const login = async (req, res, next) => {
  try {
    const user = await Users.findOne({
      where: {
        username: req.body.username,
      }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User Not Found!',
      })
    }
    const id = user.id
    const name = user.name
    const email = req.body.email
    const match = await bcrypt.compare(req.body.password, user.password)
    if (!match) {
      return res.status(401).json({
        success: false,
        message: 'Wrong Password!'
      })
    }

    const accessToken = jwt.sign({
        id,
        name,
        email,
      },
      process.env.ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: '24h'
      })
    const refreshToken = jwt.sign({
        id,
        name,
        email,
      },
      process.env.REFRESH_TOKEN_SECRET_KEY, {
        expiresIn: '7d'
      })
    await Users.update({
      refresh_token: refreshToken
    }, {
      where: {
        id: id
      }
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      samSite: 'none',
      secure: false,
    })
    res.status(200).json({
      success: true,
      message: 'Login Successfully!',
      payload: {
        id,
        name,
        token: accessToken,
      }
    })
  } catch (err) {
    console.log(err)
    res.status(401).json({
      success: false,
      message: err.message,
    })
  }
}

const refreshToken = async (req, res) => {
  try {
    console.log('cookie => ', req.cookies)
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      })
    }
    console.log('user => ', Users)
    const user = await Users.findOne({
      where: {
        refresh_token: refreshToken
      },
    })
    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden'
      })
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden'
        })
      }
      const id = user.id
      const name = user.name
      const email = user.email
      const accessToken = jwt.sign({
          id,
          name,
          email
        },
        process.env.ACCESS_TOKEN_SECRET_KEY, {
          expiresIn: '24h'
        })
      res.status(200).json({
        success: true,
        payload: {
          token: accessToken
        }
      })
    })
  } catch (err) {
    console.log(err)
    res.status(404).json({
      success: false,
      message: err.message
    })
  }
}

module.exports = {
  login,
  refreshToken
}