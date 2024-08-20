import bcrypt from "bcrypt";
import prisma from "../../config/db.config.js";
import axios from "axios";
import generateToken from "../../utils/GenerateToken.js";
import send_mail from "../../config/Mail.js";
import RandomNumber from "../../utils/RandomNumber.js";
import session from "express-session";

class LoginController {
  static async googleAuth(req, res) {
  
    const user = req.user;
    const token = generateToken(user); 
    res.redirect(`http://localhost:3000/${token}`);

  }
}
export default LoginController;
