const User=require('../models/admin-model')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')
const adminCltr = {}
const {sendOTPEmail}=require('../../utils/sendRejectionMail')

adminCltr.register = async (req, res) => {
    const errors = validationResult(req) 
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()})
    }
    const body = req.body 
    try { 
        const salt = await bcryptjs.genSalt() 
        const hashPassword = await bcryptjs.hash(body.password, salt) 
        const user = new User(body) //body=user
        user.password = hashPassword
        await user.save() 
        res.status(201).json(user) 
    } catch(err) {
        res.status(500).json({ error: 'something went wrong'})
    }
}

adminCltr.login = async (req, res) => {
    const errors = validationResult(req) 
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()})
    }
    const body = req.body 
    try { 
        const user = await User.findOne({email: body.email }) 
        if(user) {
            const isAuth = await bcryptjs.compare(body.password, user.password)
            if(isAuth) {
                const tokenData = {
                    id: user._id,
                    role: user.role 
                }
                const token = jwt.sign(tokenData, "monika", { expiresIn: '7d'})
                return res.json({ token: token })
            }
            return res.status(404).json([{ error: 'invalid email / password '}])
        }
        return res.status(404).json([{ error: 'invalid email / password'}])
    } catch(err) {
        console.log(err)
        res.status(500).json({ error: 'something went wrong'})
    }
}

adminCltr.account=async(req,res)=>{
    try{
        const user=await User.findById(req.user.id)
        console.log(req.user.id)
        if(user){
            return res.json(user)
        }
        return res.status(404).json(user)
    }catch(err) {
        console.log(err)
        res.status(500).json({ error: 'something went wrong'})
    }
}

adminCltr.checkEmail = async (req, res) => {
    const { email } = req.query;
    //const email=req.query.email
    try{
        const user=await User.findOne({email})
        if(user){
            res.json({exists:true})
        }else{
            res.json({exists:false})
        }
    }catch(err){
        res.status(500).json('something went wrong')
    }
}

adminCltr.forgotPassword=async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body; // Only email is needed
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'No user found registered with this email' });
      }
      // Send OTP email and get the OTP
      const otp = await sendOTPEmail(email,user.username);
      // Store the OTP in the user's record with an expiration time (e.g., 10 minutes)
      user.resetPasswordToken = otp;
      user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  //reset password
adminCltr.resetPassword=async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, otp, newPassword } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Check if OTP is valid and not expired
      if (user.resetPasswordToken !== otp || user.resetPasswordExpires < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }
      // Hash the new password and save it
      const hashedPassword = await bcryptjs.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetOTP = undefined; // Clear the OTP fields
      user.otpExpires = undefined;
      await user.save();
      res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.log(error)
      res.status(500).json({ message: 'Server error' });
    }
  };

module.exports=adminCltr