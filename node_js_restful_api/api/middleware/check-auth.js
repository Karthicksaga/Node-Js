const jwt = require('jsonwebtoken')
const auth = (req,res,next) => {

    //decode the token not encryted
    try{

        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(req.body.token, process.env.JWT_KEY, null, process.env.JWT_KEY);
        req.userData = decoded
        //call the next functions
        next()
    }catch(err){
        return res.status(401).json({

            message : "Auth failed"
        })
    }
    //next() is successfully executed
}

module.exports = auth;