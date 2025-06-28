import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is missing"
            });
        }
        const decoded = await jwt.verify(token,process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token"
            });
        }
        req.id = decoded.userId;
        next(); 
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Authentication failed",
            error: error.message
        });
    }
}

export default isAuthenticated;