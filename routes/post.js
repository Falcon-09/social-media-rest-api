const express = require('express')
const { createPost, getPost, updatePost, deletePost, likePost, getTimelinePosts} = require('../controllers/post')
const router = express.Router()

router.get('/:id',getPost)
router.put('/:id',updatePost)
router.delete('/:id',deletePost)
router.put('/:id/like',likePost)
router.get('/:id/timeline',getTimelinePosts)
router.post('/',createPost)



module.exports = router