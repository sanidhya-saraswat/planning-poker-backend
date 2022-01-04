const express = require('express')
const router = express.Router()
const gameController = require('./controllers/games')

// game routes
router.post('/games', gameController.create)
router.get('/games/:link', gameController.getByLink)
router.patch('/games/:link', gameController.update)
router.patch('/games/:link/reset', gameController.reset)
router.post('/games/:link/users', gameController.createUser)
router.patch('/games/:link/users/logged-in', gameController.updateLoggedInUser)
router.patch('/games/:link/users', gameController.bulkUpdateUsers)

router.get('/games/users/logged-in', gameController.getLoggedInUser)

module.exports = router
