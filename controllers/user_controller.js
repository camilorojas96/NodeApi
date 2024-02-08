
const asyncHandler = require('express-async-handler')
const User = require('../models/user_model')


const  get_users =  asyncHandler(async(req,res)=>{
    try {
        const users = await User.find({})
        res.status(200).json(users)

    } catch (error) {
        res.status(500);
        throw new Error(error.message)
        
    }
})

const get_user_by_id = asyncHandler(async(req,res)=>{
    try {
        const {id} = req.params
        const user = await User.findById(id)
        res.status(200).json(user)
    } catch (error) {
        res.status(500)
        throw new Error(error.message)
    }

})

const add_user = asyncHandler(async(req,res)=>{

    try{
        const user = await User.create(req.body)
        res.status(200).json(user)

    } catch (error){
        console.log(error.message)
        res.status(500)
        throw new Error(error.message)
    }

})

const update_user = asyncHandler(async(req, res)=>{
    try {
        const {id} = req.params
        const user = await User.findByIdAndUpdate(id, req.body)
        if(!user){
            return res.status(404).json({message: `Cannot find the user with id: ${id}`})
        }
        const updated_user = await User.findById(id)
        res.status(200).json(updated_user) 
    } catch (error) {
        res.status(500)
        throw new Error(error.message)
    }
})

const delete_user = asyncHandler(async(req,res)=>{
    try {
        const {id} = req.params
        const user = await User.findByIdAndDelete(id)
        if(!user){
            res.status(404)
            throw new Error(`Cannot find the user with id: ${id}`)
        }
        res.status(200).json(user)

    } catch (error) {
        res.status(500)
        throw new Error(error.message)
        
    }
})

module.exports ={
    get_users,
    get_user_by_id,
    add_user,
    update_user,
    delete_user
}   