const { Hire, Project, Image } = require('../../models')
const Joi = require('joi')

// SEND PROJECT
exports.sendProject = async (req, res) => {
  try {
    const { description } = req.body
    const { files } = req
    const { id } = req.params

    const schema = Joi.object({
      description: Joi.string().min(20),
    })

    const { error } = schema.validate({
      description,
    })

    if (error) {
      return res.status(400).send({
        status: 'Validation Error',
        error: {
          message: error.details.message,
        },
      })
    }

    const newProject = await Project.create({
      description,
      hireId: id,
    })

    console.log(newProject.id)

    for (let i = 0; i < files.length; i++) {
      await Image.create({
        image: files[i].filename,
        ProjectId: newProject.id,
      })
    }

    await Hire.update(
      {
        status: 'Done',
      },
      {
        where: {
          id,
        },
      },
    )

    const project = await Project.findOne({
      where: {
        id: newProject.id,
      },
      attributes: {
        exclude: ['updatedAt', 'hireId', 'HireId'],
      },
      include: [
        {
          model: Image,
          as: 'photos',
          attributes: {
            exclude: [
              'createdAt',
              'updatedAt',
              'projectId',
              'ProjectId',
              'postId',
              'PostId',
            ],
          },
        },
        {
          model: Hire,
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'projectId', 'ProjectId'],
          },
        },
      ],
    })

    res.send({
      status: 'Success',
      message: 'Successfully add Project',
      data: {
        project,
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

// GET PROJECTS
exports.getProjects = async (req, res) => {
  try {
    const project = await Project.findAll({
      attributes: {
        exclude: ['updatedAt', 'hireId', 'HireId'],
      },
      include: {
        model: Image,
        as: 'photos',
        attributes: {
          exclude: [
            'postId',
            'PostId',
            'updatedAt',
            'createdAt',
            'projectId',
            'ProjectId',
          ],
        },
      },
    })

    if (project.length === 0) {
      return res.status(400).send({
        status: 'Resource not found',
        message: "Project doesn't exist",
        data: [],
      })
    }

    res.send({
      status: 'Success',
      data: {
        project,
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

// GET DETAILS PROJECT
exports.getDetailProject = async (req, res) => {
  try {
    const { id } = req.params

    const project = await Project.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ['updatedAt', 'hireId', 'HireId'],
      },
      include: [
        {
          model: Image,
          as: 'photos',
          attributes: {
            exclude: [
              'createdAt',
              'updatedAt',
              'postId',
              'PostId',
              'projectId',
              'ProjectId',
            ],
          },
        },
      ],
    })

    if (!project) {
      return res.status(404).send({
        status: 'Resource not found',
        message: `Project with id ${id} not found`,
        data: [],
      })
    }

    res.send({
      status: 'Success',
      message: 'Successfully get Poject',
      data: {
        project,
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
