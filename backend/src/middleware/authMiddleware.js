import jwt  from 'jsonwebtoken'

export const authMiddleware =   (req,res,next)=>{
     const token = req.headers["authorization"]?.split(" ")[1];

    if(!token){
        return res.status(401).json({Message :'Access denied. no token provid'});

    }
    try{
        const decode =  jwt.verify(token,process.env.JWT_SECRET);
        req.user = decode;
        console.log(decode)
        next();
    }
    catch(err){
        console.log(err);
        res.status(403).json({Message :"invalid or expired token"});
    }
}
export const adminMiddleware = (req,res,next)=>{
    if(req.user.role !== "Admin"){
        return res.status(403).json({Message :"Access denied. Admins only"});
    }
    next();
}