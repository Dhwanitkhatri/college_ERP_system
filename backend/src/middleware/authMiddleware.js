import jwt  from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;  

  if (!token) {
    return res.status(401).json({
      message: "Access denied. No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
};

export const adminMiddleware = (req,res,next)=>{
    if(req.user.role !== "Admin"){
        return res.status(403).json({Message :"Access denied. Admins only"});
    }
    next();
}