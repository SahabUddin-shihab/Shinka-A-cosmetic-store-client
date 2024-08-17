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
    const cookieData = {
      token: token,
      user: user,
    };
    
    const serializedCookieData = JSON.stringify(cookieData);
    res.clearCookie('cookie_data');
    res.cookie('cookie_data', serializedCookieData, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'Lax'
    });  
    setTimeout(() => {
      res.redirect("https://client-user-service.vercel.app");
    }, 8000);
  
    //res.redirect('https://event-ticketing-silk.vercel.app'); 
  }
}

export default LoginController;
