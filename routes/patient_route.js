const express = require('express')
const router = express.Router()
const {get_patients, get_patient_by_id, add_patient, update_patient, delete_patient, login, logout, change_password} = require('../controllers/patient_controller')
const authenticateToken = require('../middleware/authenticator')

router.post('/login', login)
router.post('/change_password/:id', change_password)

router.get('/',authenticateToken,get_patients) 
router.get('/:id',authenticateToken,get_patient_by_id )
router.post('/create', authenticateToken,add_patient)
router.put('/edit/:id',authenticateToken,update_patient )
router.delete('/delete/:id',authenticateToken,delete_patient )
router.post('/logout', authenticateToken,logout)




module.exports = router