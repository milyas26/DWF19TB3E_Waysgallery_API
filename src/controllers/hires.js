const {
  Hire,
  Project,
  Image,
  User,
  Transactions_Users,
} = require('../../models')
const Joi = require('joi')
const { Op } = require('sequelize')

// GET ALL HIRES
exports.getHires = async (req, res) => {
  try {
    const hires = await Hire.findAll({
      attributes: {
        exclude: ['updatedAt', 'userId', 'UserId'],
      },
      include: [
        {
          model: User,
          as: 'orderBy',
          attributes: {
            exclude: [
              'updatedAt',
              'password',
              'greeting',
              'avatar',
              'createdAt',
              'updatedAt',
            ],
          },
          through: {
            attributes: [],
          },
        },
        {
          model: User,
          as: 'orderTo',
          attributes: {
            exclude: [
              'updatedAt',
              'password',
              'greeting',
              'avatar',
              'createdAt',
              'updatedAt',
            ],
          },
          through: {
            attributes: [],
          },
        },
      ],
    })

    if (hires.length === 0) {
      return res.status(400).send({
        status: 'Resource not found',
        message: "Hires doesn't exist",
        data: [],
      })
    }

    res.send({
      status: 'Success',
      data: {
        hires,
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

// ADD HIRE
exports.addHire = async (req, res) => {
  try {
    const { title, description, startDate, endDate, price } = req.body
    const { id: orderBy } = req.userId
    const { id: orderTo } = req.params

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
      return res.status(400).send({
        status: 'Validation Error',
        error: {
          message: error.details.map((error) => error.message),
        },
      })
    }

    const newHire = await Hire.create({
      title,
      description,
      startDate,
      endDate,
      price,
      status: 'Waiting Accept',
    })

    const newTransactions = await Transactions_Users.create({
      hiredId: newHire.id,
      orderById: orderBy,
      orderToId: orderTo,
    })

    const hire = await Hire.findOne({
      where: {
        id: newHire.id,
      },
      attributes: {
        exclude: ['updatedAt'],
      },
      include: [
        {
          model: User,
          as: 'orderBy',
          attributes: {
            exclude: [
              'updatedAt',
              'password',
              'greeting',
              'avatar',
              'createdAt',
              'updatedAt',
            ],
          },
          through: {
            attributes: [],
          },
        },
        {
          model: User,
          as: 'orderTo',
          attributes: {
            exclude: [
              'updatedAt',
              'password',
              'greeting',
              'avatar',
              'createdAt',
              'updatedAt',
            ],
          },
          through: {
            attributes: [],
          },
        },
      ],
    })

    res.send({
      status: 'Success',
      message: 'We have sent your offer, please wait for the user to accept it',
      data: {
        transaction: hire,
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

// GET MY OFFERS
exports.getOffers = async (req, res) => {
  const { id } = req.userId
  try {
    const offers = await Hire.findAll({
      where: {
        '$orderTo.id$': { [Op.eq]: id },
      },
      include: [
        {
          model: User,
          as: 'orderBy',
          attributes: {
            exclude: [
              'updatedAt',
              'password',
              'greeting',
              'avatar',
              'createdAt',
              'updatedAt',
            ],
          },
          through: {
            attributes: [],
          },
        },
        {
          model: User,
          as: 'orderTo',
          attributes: {
            exclude: [
              'updatedAt',
              'password',
              'greeting',
              'avatar',
              'createdAt',
              'updatedAt',
            ],
          },
          through: {
            attributes: [],
          },
        },
      ],
    })

    if (offers.length === 0) {
      return res.status(400).send({
        status: 'Resource not found',
        message: "Offers doesn't exist",
        data: [],
      })
    }

    res.send({
      status: 'Success',
      data: {
        offers,
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

// GET MY ORDERS
exports.getOrders = async (req, res) => {
  const { id } = req.userId
  try {
    const orders = await Hire.findAll({
      where: {
        '$orderBy.id$': { [Op.eq]: id },
      },
      include: [
        {
          model: User,
          as: 'orderBy',
          attributes: {
            exclude: [
              'updatedAt',
              'password',
              'greeting',
              'avatar',
              'createdAt',
              'updatedAt',
            ],
          },
          through: {
            attributes: [],
          },
        },
        {
          model: User,
          as: 'orderTo',
          attributes: {
            exclude: [
              'updatedAt',
              'password',
              'greeting',
              'avatar',
              'createdAt',
              'updatedAt',
            ],
          },
          through: {
            attributes: [],
          },
        },
        {
          model: Project,
        },
      ],
    })

    if (orders.length === 0) {
      return res.status(400).send({
        status: 'Resource not found',
        message: "Order doesn't exist",
        data: [],
      })
    }

    res.send({
      status: 'Success',
      data: {
        orders,
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
