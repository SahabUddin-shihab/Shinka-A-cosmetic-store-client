import bcrypt from "bcrypt";
import prisma from "../../config/db.config.js";
import Validator from '../../validator/Validator.js'
import generateToken from "../../utils/GenerateToken.js";
import send_mail from "../../config/Mail.js";
import RandomNumber from "../../utils/RandomNumber.js";

class LoginController {

  static async login(req, res) { 

      try {
        const { email, password } = req.body;
        const isValidate = await Validator.loginValidation(req.body);
        if (isValidate.success != true) {
            return res.status(400).json({ errors: isValidate });
        }
        const user = await prisma.user.findFirst({
            where: {
            email: email,
            },
        });
        if (user) {
            if(user.is_approved == 1) {
                const token = generateToken(user);
                if (bcrypt.compareSync(password, user.password)) {
                  if(user.is_organizer == 1){
                    let payment_credential = await prisma.stripe.count({
                      where : {
                        user_id : user.id
                      }
                    });
                    if(payment_credential > 0){
                      return res.json({
                        user : {
                            id : user.id,
                            name : user.name,
                            email : user.email,
                            image : user.image
                        },
                        token,
                        message: "Logged in successfully!",
                        user_type : 'organizer',
                        payment_setup : true
                      });
                    }else {
                      return res.json({
                        user : {
                            id : user.id,
                            name : user.name,
                            email : user.email,
                            image : user.image
                        },
                        token,
                        message: "Logged in successfully!",
                        user_type : 'organizer',
                        payment_setup : false
                      });
                    }
                }else{

                return res.json({
                  user : {
                      id : user.id,
                      name : user.name,
                      email : user.email,
                      image : user.image
                  },
                  token,
                  user_type : 'user',
                  message: "Logged in successfully!",
                });
                
              }
            }     
            return res.status(401).json({ message: "Password does not match!!" });
            }
            return res.status(401).json({ message: "Your account is not active yet!" });
        }else{
            return res.status(401).json({ message: "Invalid credentials" });
        }
        } catch (error) {
            return res.status(401).json({ message: "Something wents to wrong!!" });
        }
  }

  static async forgot_password_email(req, res) { 

    try {
      const { email } = req.body;
      var success = true;
      const isValidate = await Validator.resetemailValidation(req.body);
      if (isValidate.success != true) {
          return res.status(400).json({ errors: isValidate });
      }
      const user = await prisma.user.findFirst({
          where: {
            email: email,
          },
      });
      if (user) {
        var verified_token = RandomNumber(100000,999999);
        const mail_credentials = await prisma.email.findFirst({});
        var transporter = send_mail();
        var mailOptions = {
          from: mail_credentials.email_from,
          to: email,
          subject: 'Forgot password otp',
          text: 'Your reset password otp is : '+ verified_token
        };
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            success = false;
          } else {
            success = true
          }
        });
        
        if(success == false) {
          return res.status(500).json({ message: "Something went wrong." });
        }
        await prisma.user.update({
            where : { 
                id: user.id 
            },
            data : {
            verified_token : verified_token
            }
        });

        return res.status(200).json({ message: "Send otp in your email!" });
      }else{
          return res.status(400).json({ message: "Email not found!" });
      }
      } catch (error) {
          return res.status(401).json({ message: "Something wents to wrong!!" });
      }
  }
  static async check_otp(req, res) { 

    try {
        const otp = parseInt(req.params.otp);
        var success = false;
        const user = await prisma.user.findFirst({
            where: {
                verified_token : otp,
            },
        });
        if (!user) {
          return res.status(500).json({ 
            success : false,
            message: "Invalid token!" 
        });
        }
        return res.status(200).json({ 
            success: true,
            message : "found!"
         });
     
      } catch (error) {
          return res.status(401).json({ message: "Something wents to wrong!!" });
      }
  }
  static async reset_password(req, res) { 

    try {
        const otp = parseInt(req.params.otp);
        const { password,confirm_password } =req.body;
       
        const isValidate = await Validator.resetpasswordValidation(req.body);
        if (isValidate.success != true) {
            return res.status(400).json({ errors: isValidate });
        }
        if(!(password === confirm_password)) {
            return res.status(200).json({ message : "password does not match!" });
        }
        const hashPassword = bcrypt.hashSync(password, 15);
        const user = await prisma.user.findFirst({
            where: {
                verified_token : otp,
            },
        });
        if(!user){
            return res.status(400).json({ message : "Otp not found"});
        }
        await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              password: hashPassword,
              verified_token: null
            },
          });
        return res.status(200).json({ message : "Reset your password.Login now!"});
     
      } catch (error) {
          return res.status(401).json({ message: "Something wents to wrong!!" });
      }
  }
}

export default LoginController;
