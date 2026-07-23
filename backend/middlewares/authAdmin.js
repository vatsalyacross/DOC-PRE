import e from "express"
import jwt from "jsonwebtoken"

const authAdmin = (req, res, next) => {
  try {
    const { atoken } = req.headers

    if (!atoken) {
      return res.json({ success: false, message: "Unauthorized Access" })
    }

    const decoded = jwt.verify(atoken, process.env.JWT_SECRET)

    const adminKey = process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD

    if (decoded !== adminKey) {
      return res.json({ success: false, message: "Unauthorized Access" })
    }

    next()
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Unauthorized Access" })
  }
}

export default authAdmin