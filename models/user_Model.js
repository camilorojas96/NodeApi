const { Binary } = require("mongodb")
const mongoose = require("mongoose")

const userSchema = mongoose.Schema(
    {
        user_name: {
            type: String,
            required : true
            
        },

        administrator: {
            type: Binary,
            required : true
        },
        password:{
            type: String,
            required: true
        
        }
    }
)

const Patient = mongoose.model("User", userSchema)

module.exports = User