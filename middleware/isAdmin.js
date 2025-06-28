const isAdmin = async (req,res,next)=>{
const {role } = req.user
if(role==='admin') next()
}


module.exports = isAdmin