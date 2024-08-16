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
    const cookieData  = {
      token: token,
      user: user,
    };
    res.cookie('cookie_data', cookieData, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 24 * 60 * 60 * 1000,
      domain: 'http://localhost:3000',
      // sameSite: 'None',
      });

      setTimeout(() => {
        res.redirect("http://localhost:3000/");
      }, 5000);
  
    //res.redirect('https://event-ticketing-silk.vercel.app'); 
    // res.redirect('http://localhost:3000');
  }
}

export default LoginController;
