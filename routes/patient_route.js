const express = require('express')
const Patient = require('../models/patients_model')
const router = express.Router()
const {get_patients, get_patient_by_id, add_patient, update_patient, delete_patient} = require('../controllers/patient_controller')


router.get('/',get_patients) 
router.get('/:id',get_patient_by_id )
router.post('/', add_patient)
router.put('/:id',update_patient )
router.delete('/:id',delete_patient )


module.exports = router