import jwt from "jsonwebtoken";

const authDoctor = async (req, res, next) => {
  try {
    // console.log("headers received:", req.headers);

    // ✅ read token exactly as frontend sends
    const dtoken = req.headers.dtoken;

    if (!dtoken) {
      return res.json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    // ✅ verify token directly
    const decoded = jwt.verify(dtoken, process.env.JWT_SECRET);

    req.docId = decoded.id;

    next();

  } catch (error) {
    console.log("AUTH ERROR:", error.message);

    res.json({
      success: false,
      message: "Unauthorized Access",
    });
  }
};

export default authDoctor