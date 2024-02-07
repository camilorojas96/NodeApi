
const error_middleware = (err , req, res, next) =>{
    console.log('Error middleware')
    const status_code =res.status_code ? res.status_code : 500
    res.status(status_code)
    res.json({message: err.message, stack: process.env.NODE_ENV === "development" ? err.stack: null})

}

const validate_entries = (err ,req, res , next) =>{
    const {data} = req.body

    if(!data){
        console.log("Data error")
        return res.status(400).json({error: "Missing data entries"})
    }

    next()
}

module.exports = error_middleware, validate_entries

