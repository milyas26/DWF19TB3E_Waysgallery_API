const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

// UPLOAD PROFILE
exports.uploadAvatar = (avatar) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/images')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    },
  })

  const fileFilter = function (req, file, cb) {
    if (file.fieldname === avatar) {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = {
          message: 'Only image files are allowed!',
        }
        return cb(new Error('Only image files are allowed!'), false)
      }
    }
    cb(null, true)
  }

  const maxSize = 5 * 1000 * 1000

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  }).fields([
    {
      name: avatar,
      maxCount: 1,
    },
  ])

  return (req, res, next) => {
    upload(req, res, function (err) {
      if (req.fileValidationError)
        return res.status(400).send(req.fileValidationError)

      if (!req.files && !err)
        return res.status(400).send({
          message: 'Please select files to upload',
        })

      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).send({
            message: 'Max file sized 10MB',
          })
        }
        return res.status(400).send(err)
      }

      return next()
    })
  }
}

// UPLOAD MULTIPLE
exports.uploadMultiple = (image) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/images')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    },
  })

  const fileFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      req.fileValidationError = {
        message: 'Only image files are allowed!',
      }
      return cb(new Error('Only image files are allowed!'), false)
    }

    cb(null, true)
  }

  const maxSize = 5 * 1000 * 1000

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  }).array('image', 5)

  return (req, res, next) => {
    upload(req, res, function (err) {
      if (req.fileValidationError)
        return res.status(400).send(req.fileValidationError)

      if (!req.files && !err)
        return res.status(400).send({
          message: 'Please select files to upload',
        })

      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).send({
            message: 'Max file sized 10MB',
          })
        }
        return res.status(400).send(err)
      }

      return next()
    })
  }
}
