const jwt = require('jsonwebtoken')
const authenticateUser = (req, res, next) => {
    const token = req.headers['authorization']
    if(!token) {
        return res.status(400).json({ error: 'token is required'})
    }
    try {
        const tokenData = jwt.verify(token, "monika") 
        //{id:65214123456789,role:candidate,issuedat:time,expiresat:time}
        //we are extracting id and role and attaching it to req.user because it is the only in backend to use info across all the project
        req.user = {
            id: tokenData.id,
            role: tokenData.role 
        }
        next()
    } catch(err) {
        return res.status(400).json({ error: err })
    }
}

module.exports = authenticateUser 