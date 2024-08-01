import bcrypt from "bcrypt";
import prisma from "../../config/db.config.js";
import Validator from '../../validator/Validator.js';
import send_mail from "../../config/Mail.js";
import RandomNumber from "../../utils/RandomNumber.js";
import nodemailer from "nodemailer";
import generateToken from "../../utils/GenerateToken.js";

class RegisterController {

static async store(req, res) {
    try {
      const { name, email, password } = req.body;

      // Validate the user input
      const isValidate = await Validator.registerValidation(req.body);
      if (!isValidate.success) {
        return res.status(400).json({ errors: isValidate.errors });
      }

      // Check if the user already exists
      const existingUser = await prisma.user.findFirst({ where: { email } });
      if (existingUser) {
        return res.status(401).json({ message: "An account already exists under this email!" });
      }

      // Hash the password
      const hashPassword = bcrypt.hashSync(password, 15);

      // Generate verification token and link
      const verified_token = RandomNumber(10000000, 99999999);
      const verified_link = `${req.protocol}://${req.headers.host}/auth/account/verified/${verified_token}`;

      // Create the new user in the database
      const newUser = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: hashPassword,
          email_verified: null,
          is_organizer: 0,
          is_approved: 0,
          verified_token: verified_token
        }
      });

      // Retrieve email credentials from your database
      const mail_credentials = await prisma.email.findFirst({});
      const transporter = nodemailer.createTransport({
        host: mail_credentials.mail_host,
        port: mail_credentials.mail_port,
        secure: false, // true for 465, false for other ports
        auth: {
          user: mail_credentials.smtp_username,
          pass: mail_credentials.smtp_password
        }
      });

      // Set up email options
      const mailOptions = {
        from: mail_credentials.email_from,
        to: email,
        subject: 'User Registration - Verify Your Email',
        html: `Please verify your email by clicking this link: <a href="${verified_link}">Verify Email</a>`
      };

      // Send the email asynchronously
      let success = true;
      try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully');
      } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        success = false;
      }

      // Respond to the client
      return res.status(200).json({
        message: success
          ? "Please check your email and verify your account!"
          : "Registration successful, but failed to send verification email.",
        success
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({
        message: "Something went wrong!",
        error: error.message
      });
    }
  }

  static async resendEmail(req, res) { 
    try {
    
      const { email } = req.body;

      const isValidate = await Validator.resendemailValidation(req.body);
      if (isValidate.success != true) {
          return res.status(400).json({ errors: isValidate });
      }
      const user = await prisma.user.findFirst({
          where: {
          email: email,
          },
      });
      if (!user) {
          return res.status(401).json({ message: "You are not resister yet!" });
      }
      const verified_token = RandomNumber(100000,999999);
      const verified_link = req.protocol+"://"+req.headers.host+"/auth/account/verified/"+verified_token;
     
  
        await prisma.user.update({
          where : {
            id : user.id
          },
          data: {  
            verified_token : verified_token
          },
        });

        const mail_credentials = await prisma.email.findFirst({});
        var transporter = send_mail();
        var mailOptions = {
          from: mail_credentials.email_from,
          to: email,
          subject: 'User resend email',
          text: `Please verify your email by clicking this link : <a href="${verified_link}">Verify Email</a>`,
        };
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            success = false;
          } else {
            success = true
          }
        });
        return res.status(200).json({ message: "Please check your email and verified your account!" });
      } catch (error) {
          return res.status(401).json({ message: "Something wents to wrong!!" });
      }
}

  static async account_verify(req,res)
  {
    const verify_token = parseInt(req.params.token);
    const find_user = await prisma.user.findFirst({
      where: { 
        verified_token: verify_token,
      },
    });
    if(!find_user){
      return res.status(401).json({ message: "Please provide a valide token!" });
    }
    await prisma.user.update({
      where : {
        id : find_user.id,
      },
      data : {
        email_verified : 'verified',
        is_approved : 1
      }
    });
    const token = generateToken(find_user);
    return res.json({
        user : {
            id : find_user.id,
            name : find_user.name,
            email : find_user.email,
            image : find_user.image
        },
        token,
        message: "Thank you. Your account is active now!!",
        user_type : 'user'
    });
    
  }
}

export default RegisterController;
