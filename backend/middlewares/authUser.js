// import jwt from "jsonwebtoken";

// const authUser = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization;

//     // ✅ correct check
//     if (!token) {
//       return res.json({
//         success: false,
//         message: "Unauthorized Access",
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // ✅ store userId
//     req.userId = decoded.id || decoded.userId

//     next();
//   } catch (error) {
//     console.log(error);
//     res.json({
//       success: false,
//       message: "Unauthorized Access",
//     });
//   }
// };

// export default authUser;

// import jwt from "jsonwebtoken";

// const authUser = async (req, res, next) => {
//   try {

//     let token = req.headers.authorization;

//     // ✅ check token exists
//     if (!token) {
//       return res.json({
//         success: false,
//         message: "Unauthorized Access",
//       });
//     }

//     // ✅ remove Bearer if present
//     if (token.startsWith("Bearer ")) {
//       token = token.split(" ")[1];
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     req.userId = decoded.id;

//     next();

//   } catch (error) {
//     console.log("AUTH ERROR:", error.message);
//     res.json({
//       success: false,
//       message: "Unauthorized Access",
//     });
//   }
// };

// export default authUser;
import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {

    // ✅ read token exactly as frontend sends
    const token = req.headers.authorization;

    if (!token) {
      return res.json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    // ✅ verify token directly
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;

    next();

  } catch (error) {
    console.log("AUTH ERROR:", error.message);

    res.json({
      success: false,
      message: "Unauthorized Access",
    });
  }
};

export default authUser;