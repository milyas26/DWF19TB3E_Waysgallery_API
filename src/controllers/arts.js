const { User, Art } = require('../../models')

// CREATE / ADD ARTS
exports.addArt = async (req, res) => {
  try {
    const { id } = req.userId
    const { files } = req

    const imageName = files.image[0].filename

    const imageAfterCreate = await Art.update({
      image: imageName,
      userId: id,
    })

    const art = await Art.findOne({
      where: {
        id: imageAfterCreate.id,
      },
      attributes: {
        exclude: ['updatedAt', 'userId', 'UserId'],
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'password'],
          },
        },
      ],
    })

    res.send({
      status: 'Success',
      message: 'Successfully add Art',
      data: {
        art,
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

// UPDATE ART
exports.updateArt = async (req, res) => {
  try {
    const { id } = req.userId
    const { image } = req.files

    const artName = image[0].filename

    const oldArt = await Art.findOne({
      where: {
        userId: id,
      },
    })

    if (!oldArt) {
      return res.status(404).send({
        status: 'Resource not found',
        message: `Art with id ${id} not found`,
        data: [],
      })
    }

    const artAfterUpdate = await Art.update(
      {
        image: artName,
      },
      {
        where: {
          userId: id,
        },
      },
    )

    const art = await Art.findOne({
      where: {
        userId: id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'userId', 'UserId'],
      },
    })

    res.send({
      status: 'Success',
      message: 'Art successfully updated',
      data: {
        art,
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
