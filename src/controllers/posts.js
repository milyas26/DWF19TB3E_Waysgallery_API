const Joi = require('joi')
const { User, Post, Image } = require('../../models')
let fs = require('fs')

// GET ALL POSTS
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: {
        exclude: ['updatedAt', 'userId', 'UserId'],
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: {
            exclude: [
              'createdAt',
              'updatedAt',
              'password',
              'email',
              'description',
            ],
          },
        },
        {
          model: Image,
          as: 'photos',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'postId', 'PostId'],
          },
        },
      ],
    })

    if (posts.length === 0) {
      return res.status(400).send({
        status: 'Resource not found',
        message: "Video doesn't exist",
        data: [],
      })
    }

    res.send({
      status: 'Success',
      data: {
        posts,
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

// GET SINGLE Post
exports.getDetailPost = async (req, res) => {
  try {
    const { id } = req.params

    const post = await Post.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ['updatedAt', 'userId', 'UserId'],
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'password'],
          },
        },
        {
          model: Image,
          as: 'photos',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'postId', 'PostId'],
          },
        },
      ],
    })

    if (!post) {
      return res.status(404).send({
        status: 'Resource not found',
        message: `Post with id ${id} not found`,
        data: [],
      })
    }

    res.send({
      status: 'Success',
      message: 'Successfully get Post',
      data: {
        post,
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

// ADD POST
exports.addPost = async (req, res) => {
  try {
    const { title, description } = req.body
    const { id: userId } = req.userId
    const { files } = req

    const schema = Joi.object({
      title: Joi.string().min(8),
      description: Joi.string().min(20),
    })

    const { error } = schema.validate(
      {
        title,
        description,
      },
      { abortEarly: false },
    )

    if (error) {
      for (let i = 0; i < req.files.length; i++) {
        fs.unlink(`./uploads/images/${files[i].filename}`)
      }
      return res.status(400).send({
        status: 'Validation Error',
        error: {
          message: error.details.map((error) => error.message),
        },
      })
    }

    const postAfterCreate = await Post.create({
      userId: userId,
      title: title,
      description: description,
      viewcount: 0,
    })

    for (let i = 0; i < req.files.length; i++) {
      const imageSave = await Image.create({
        image: files[i].filename,
        postId: postAfterCreate.id,
      })
    }

    const post = await Post.findOne({
      where: {
        id: postAfterCreate.id,
      },
      attributes: {
        exclude: ['updatedAt', 'channelId', 'ChannelId'],
      },
      include: {
        model: Image,
        as: 'photos',
        attributes: {
          exclude: [
            'createdAt',
            'updatedAt',
            'postId',
            'PostId',
            'ProjectId',
            'projectId',
          ],
        },
      },
    })

    res.send({
      status: 'Success',
      message: 'Successfully add Post',
      data: {
        post,
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
