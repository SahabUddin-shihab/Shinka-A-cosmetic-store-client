import jwt from 'jsonwebtoken';
import generateToken from "../../utils/GenerateToken.js";
import prisma from "../../config/db.config.js";

class LoginController {
  static async googleAuth(req, res) {
  
    const user = req.user;
    const token = generateToken(user); 
    res.redirect(`http://localhost:3000/login-success?token=${token}`);

  }

}
export default LoginController;
