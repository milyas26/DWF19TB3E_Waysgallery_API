const jwt = require('jsonwebtoken')

exports.auth = (req, res, next) => {
  let header, token

  if (
    !(header = req.header('Authorization')) ||
    !(token = header.replace('Bearer ', ''))
  ) {
    return res.status(401).send({
      status: 'Respond Fail',
      error: {
        message: `Access Denied!`,
      },
    })
  }

  try {
    const PrivateKey = process.env.JWT_PRIVATE_KEY
    const verified = jwt.verify(token, PrivateKey)

    req.userId = verified
    next()
  } catch (err) {
    return res.status(401).send({
      status: 'Respond Fail',
      error: {
        message: `Invalid Token!`,
      },
    })
  }
}
