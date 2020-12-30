// Import model User
const Joi = require('joi')
const { Post, User, Image, Art } = require('../../models')

// GET SINGLE PROFILE
exports.getSingleProfile = async (req, res) => {
  try {
    const { id } = req.userId

    const user = await User.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'password'],
      },
      include: [
        {
          model: Post,
          as: 'posts',
          attributes: {
            exclude: ['channelId', 'updatedAt', 'UserId', 'userId'],
          },
          include: [
            {
              model: Image,
              as: 'photos',
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'postId', 'PostId'],
              },
            },
          ],
        },
        {
          model: Art,
          as: 'arts',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'userId', 'UserId'],
          },
        },
      ],
    })

    if (!user) {
      return res.status(404).send({
        status: 'Resource not found',
        message: `User with id ${id} not found`,
        data: [],
      })
    }

    res.send({
      status: 'Success',
      message: 'Successfully get Profile',
      data: user,
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

// GET USER DETAIL
exports.getSingleUser = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'password'],
      },
      include: [
        {
          model: Post,
          as: 'posts',
          attributes: {
            exclude: ['channelId', 'updatedAt', 'UserId', 'userId'],
          },
          include: [
            {
              model: Image,
              as: 'photos',
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'postId', 'PostId'],
              },
            },
          ],
        },
        {
          model: Art,
          as: 'arts',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'userId', 'UserId'],
          },
        },
      ],
    })

    if (!user) {
      return res.status(404).send({
        status: 'Resource not found',
        message: `User with id ${id} not found`,
        data: [],
      })
    }

    res.send({
      status: 'Success',
      message: 'Successfully get Profile',
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

// UPDATE PROFILES
exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.userId
    const { fullName, greeting } = req.body
    const { avatar } = req.files

    const avatarName = avatar[0].filename

    const schema = Joi.object({
      fullName: Joi.string().min(5),
      greeting: Joi.string().min(20),
    })

    const { error } = schema.validate(
      {
        fullName,
        greeting,
      },
      { abortEarly: false },
    )

    if (error) {
      return res.status(400).send({
        status: 'Validation Error',
        error: {
          message: error.details.map((error) => error.message),
        },
      })
    }

    const userId = await User.findOne({
      where: {
        id,
      },
    })

    if (!userId) {
      return res.status(404).send({
        status: 'Resource not found',
        message: `User with id ${id} not found`,
        data: [],
      })
    }

    const userAfterUpdate = await User.update(
      {
        fullName,
        greeting,
        avatar: avatarName,
      },
      {
        where: {
          id,
        },
      },
    )

    const user = await User.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    })

    res.send({
      status: 'Success',
      message: 'Channel successfully updated',
      data: {
        user: {
          id: user.id,
          fullName: user.fullName,
          greeting: user.greeting,
          avatar: user.avatar,
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
