const express = require('express')
const { getUser, updateUser, deleteUser, followUser, unFollowUser } = require('../controllers/user')
const router = express.Router()

router.get('/:id',getUser)
router.put('/:id',updateUser)
router.delete('/:id',deleteUser)
router.put('/:id/unfollow',unFollowUser)
router.put('/:id/follow',followUser)

module.exports = router