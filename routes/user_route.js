const express = require('express')
const User = require('../models/user_model')
const router = express.Router()
const {get_users, get_user_by_id, add_user, update_user, delete_user} = require('../controllers/user_controller')


router.get('/',get_users) 
router.get('/:id',get_user_by_id )
router.post('/', add_user)
router.put('/:id',update_user)
router.delete('/:id',delete_user)

module.exports = router