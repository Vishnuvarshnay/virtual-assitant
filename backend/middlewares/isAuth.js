import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try {
        // 1. Cookie se token nikalna
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: Token not found" });
        }

        // 2. Token ko verify karna
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // 3. Request object mein userId attach karna taaki controllers ise use kar sakein
        req.userId = decoded.userId;

        // 4. Agle function (controller) par bhejna
        next();

    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        return res.status(500).json({ message: "Internal server error in authentication" });
    }
};

export default isAuth;