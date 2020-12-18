const Joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Art } = require('../../models')

// ADD NEW USER / REGISTER NEW USER
exports.addUser = async (req, res) => {
  try {
    const { email, password, fullName } = req.body

    const schema = Joi.object({
      email: Joi.string().email().min(8).required(),
      password: Joi.string().min(6).required(),
      fullName: Joi.string().min(5).required(),
    })

    const { error } = schema.validate({
      email,
      password,
      fullName,
    })

    if (error) {
      return res.status(400).send({
        status: 'Validation Error',
        error: {
          message: error.details.map((error) => error.message),
        },
      })
    }

    const passwordHashed = await bcrypt.hash(password, 10)

    const checkEmail = await User.findOne({
      where: {
        email,
      },
    })

    if (checkEmail) {
      return res.status(400).send({
        status: 'Failed',
        error: {
          message: `This email already exist!`,
        },
      })
    }

    const newUser = await User.create({
      email,
      password: passwordHashed,
      fullName,
      avatar: 'default-avatar.png',
      greeting: "Let's show the world all of your greatest works!",
    })

    const newArt = await Art.create({
      image: 'image5.jpg',
      userId: newUser.id,
    })

    const PrivateKey = process.env.JWT_PRIVATE_KEY
    const token = jwt.sign(
      {
        id: newUser.id,
      },
      PrivateKey,
    )

    const user = await User.findOne({
      where: {
        id: newUser.id,
      },
      include: {
        model: Art,
        as: 'arts',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
    })

    res.send({
      status: 'Success',
      message: 'Channel successfully created',
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          avatar: user.avatar,
          token,
        },
      },
    })
  } catch (err) {
    console.log(err)
    res.status(500).send({
      error: {
        message: 'Server error',
      },
    })
  }
}

// LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const schema = Joi.object({
      email: Joi.string().email().min(6).required(),
      password: Joi.string().min(6).required(),
    })

    const { error } = schema.validate({
      email,
      password,
    })

    if (error) {
      return res.status(400).send({
        status: 'Validation Error',
        error: {
          message: error.details.map((error) => error.message),
        },
      })
    }

    const user = await User.findOne({
      where: {
        email,
      },
    })

    if (!user) {
      return res.status(400).send({
        error: {
          message: `Invalid Login!`,
        },
      })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(400).send({
        error: {
          message: `Invalid Login!`,
        },
      })
    }

    const PrivateKey = process.env.JWT_PRIVATE_KEY
    const token = jwt.sign(
      {
        id: user.id,
      },
      PrivateKey,
    )

    res.send({
      status: 'Success',
      message: 'Login Successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          avatar: user.avatar,
          token,
        },
      },
    })
  } catch (err) {
    console.log(err)
    res.status(500).send({
      error: {
        message: 'Server error',
      },
    })
  }
}

// CHECK AUTH
exports.checkAuth = async (req, res) => {
  try {
    const userId = req.userId

    const user = await User.findOne({
      where: {
        id: userId.id,
      },
      attributes: {
        exclude: ['password'],
      },
    })

    res.send({
      status: 'Success',
      message: 'User Valid',
      data: { user },
    })
  } catch (err) {
    console.log(err)
    res.status(500).send({
      error: {
        message: 'Server error',
      },
    })
  }
}
