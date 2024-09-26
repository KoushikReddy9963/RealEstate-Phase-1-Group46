import jwt from 'jsonwebtoken';

export const verifyJWT = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: "Access Denied" });
    jwt.verify(token.split(' ')[1], "mySuperSecretKey12345", (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid Token" });
        req.user = decoded;
        next();
    });
};

export const roleCheck = (roles) => {
    return (req, res, next) => {
        if (roles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({ message: "Access Denied: Insufficient Privileges" });
        }
    }
}
