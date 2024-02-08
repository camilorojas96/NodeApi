const mongoose = require("mongoose")

const patientSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required : [true, "Please enter the patient name"]
            
        },

        last_name: {
            type: String,
            required : [true, "Please enter the patient  last name"]
        },
        id:{
            type: String,
            required: true
        },
        phone:{
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        administrator: {
            type: Boolean,
            required : true

        },
        password : {
            type: String,
            required: true
        }
    }
)

const Patient = mongoose.model("Patient", patientSchema)

module.exports = Patient