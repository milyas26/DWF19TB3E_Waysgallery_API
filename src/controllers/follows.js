const { User, Follow, Post, Image } = require('../../models')

// ADD FOLLOWING
exports.addFollowing = async (req, res) => {
  try {
    const { id: creator } = req.params
    const { id: userId } = req.userId

    if (userId === creator) {
      return res.status(400).send({
        status: 'error',
        error: {
          message: 'Cannot subscribe yourself',
        },
      })
    }

    const checkUser = await User.findOne({
      where: {
        id: creator,
      },
    })

    if (!checkUser) {
      return res.status(400).send({
        status: 'Error',
        error: {
          message: 'User not found!',
        },
      })
    }

    const isFollowed = await Follow.findOne({
      where: {
        followingId: creator,
        followerId: userId,
      },
    })

    if (isFollowed) {
      return res.status(400).send({
        status: 'error',
        error: {
          message: 'Already follow to this chanel',
        },
      })
    }

    await Follow.create({
      followingId: creator,
      followerId: userId,
    })

    const follows = await User.findOne({
      where: {
        id: creator,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'password'],
      },
    })

    res.send({
      status: 'Success',
      data: {
        follows: {
          follows,
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

// DELETE FOLLOWING / UNFOLLOW
exports.unFollow = async (req, res) => {
  try {
    const { id: creator } = req.params
    const { id: userId } = req.userId

    const follow = await Follow.destroy({
      where: {
        followingId: creator,
        followerId: userId,
      },
    })

    if (!follow) {
      return res.status(404).send({
        status: 'Following not found',
      })
    }

    res.send({
      status: 'Success',
      data: {
        id: creator,
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

// GET FOLLOWINGS
exports.getFollowings = async (req, res) => {
  try {
    const { id } = req.userId

    const followings = await User.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'password'],
      },
      include: {
        model: User,
        as: 'following',
        through: {
          attributes: [],
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'password'],
        },
        include: {
          model: Post,
          as: 'posts',
          attributes: {
            exclude: ['updatedAt', 'userId', 'UserId'],
          },
          include: {
            model: Image,
            as: 'photos',
            attributes: {
              exclude: ['postId', 'PostId', 'ProjectId', 'updatedAt'],
            },
          },
        },
      },
    })

    if (followings.following.length == 0) {
      return res.status(400).send({
        status: 'error',
        error: {
          message: "You didn't follows anyone",
        },
      })
    }

    const folowingPosts = followings.following.map((post) => post.posts)

    let posts = []
    for (let i = 0; i < folowingPosts.length; i++) {
      for (let k = 0; k < folowingPosts[i].length; k++) {
        posts.push(folowingPosts[i][k])
      }
    }

    res.send({
      status: 'Success',
      data: {
        followings: posts,
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

// GET ID FOLLOWING
exports.getIdFollowing = async (req, res) => {
  try {
    const { id: userId } = req.userId
    const { id: creator } = req.params

    const follower = await Follow.findOne({
      where: {
        followerId: userId,
        followingId: creator,
      },
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
          'password',
          'chanelName',
          'id',
          'email',
        ],
      },
    })

    res.send({
      status: 'Success',
      data: {
        follower,
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
