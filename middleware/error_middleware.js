
const error_middleware = (err , req, res, next) =>{
    console.log('Error middleware')
    const status_code =res.status_code ? res.status_code : 500
    res.status(status_code)
    res.json({message: err.message, stack: process.env.NODE_ENV === "development" ? err.stack: null})

}

module.exports = error_middleware

