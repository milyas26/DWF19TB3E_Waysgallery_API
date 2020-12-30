const express = require('express')
const router = express.Router()

const { auth: authentication } = require('../middleware/auth')
const { uploadAvatar, uploadMultiple } = require('../middleware/upload')

const { addUser, loginUser, checkAuth } = require('../controllers/auth')
const { getPosts, getDetailPost, addPost } = require('../controllers/posts')
const {
  getSingleProfile,
  getSingleUser,
  updateProfile,
} = require('../controllers/profiles')

const { addArt, updateArt, getArt } = require('../controllers/arts')

const {
  getHires,
  addHire,
  getOffers,
  getOrders,
} = require('../controllers/hires')

const {
  sendProject,
  getProjects,
  getDetailProject,
  cancelProject,
  approveProject,
  completeProject,
  successProject,
} = require('../controllers/projects')

const {
  addFollowing,
  unFollow,
  getFollowings,
  getIdFollowing,
} = require('../controllers/follows')

// AUTH
router.post('/register', addUser)
router.post('/login', loginUser)
router.get('/check-auth', authentication, checkAuth)

// POSTS
router.get('/posts', getPosts)
router.get('/post/:id', authentication, getDetailPost)
router.post('/post', authentication, uploadMultiple('image'), addPost)

// PROFILE
router.get('/user', authentication, getSingleProfile)
router.get('/user/:id', authentication, getSingleUser)
router.patch('/user', authentication, uploadAvatar('avatar'), updateProfile)

// ARTS
router.post('/art', authentication, uploadAvatar('image'), addArt)
router.patch('/art', authentication, uploadAvatar('image'), updateArt)
router.get('/art/:id', getArt)

// HIRES
router.get('/hires', getHires)
router.post('/hire/:id', authentication, addHire)
router.get('/my-offers', authentication, getOffers)
router.get('/my-orders', authentication, getOrders)

// PROJECT
router.post(
  '/project/:id',
  authentication,
  uploadMultiple('image'),
  sendProject,
)
router.get('/projects', getProjects)
router.get('/project/:id', authentication, getDetailProject)
router.patch('/cancel-project/:id', authentication, cancelProject)
router.patch('/approve-project/:id', authentication, approveProject)
router.patch('/complete-project/:id', authentication, completeProject)
router.patch('/success-project/:id', authentication, successProject)

// FOLLOW
router.post('/follow/:id', authentication, addFollowing)
router.delete('/follow/:id', authentication, unFollow)
router.get('/following', authentication, getFollowings)
router.get('/following/:id', authentication, getIdFollowing)

module.exports = router
