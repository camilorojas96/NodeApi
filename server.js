const express = require("express")
const app = express()

app.get('/', (req,res) => {
    res.send("Node Api")
})

app.listen(3000, ()=>{
    console.log("Node Api running on port 3000")
})