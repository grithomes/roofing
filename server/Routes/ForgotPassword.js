const express = require('express');
const router = express.Router()
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const jwrsecret = "MYNameisJashandeepSInghjoharmukts"
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jdwebservices1@gmail.com',
    pass: 'mqvuugdphmzmoclh',
  },
});

// Generate a random temporary password
function generateTempPassword(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}


router.post("/resetpassword",[
    body('email').isEmail()
],async (req,res) =>{
  const { email } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err) {
      console.log('Error finding user:', err);
      return res.status(500).send('An error occurred');
    }

    if (!user) {
      // Email not found
      return res.status(404).send('User not found');
    }

    // Generate a temporary password
    const tempPassword = generateTempPassword();

    // Hash the temporary password
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        console.log('Error generating salt:', err);
        return res.status(500).send('An error occurred');
      }

      bcrypt.hash(tempPassword, salt, (err, hash) => {
        if (err) {
          console.log('Error hashing password:', err);
          return res.status(500).send('An error occurred');
        }

        // Save the hashed temporary password in the database
        user.password = hash;
        user.save((err) => {
          if (err) {
            console.log('Error updating password:', err);
            return res.status(500).send('An error occurred');
          }

          // Send the temporary password to the user's email
          const mailOptions = {
            from: 'your_email_address',
            to: email,
            subject: 'Password Reset',
            text: `Your temporary password is: ${tempPassword}`,
          };

          transporter.sendMail(mailOptions, (err) => {
            if (err) {
              console.log('Error sending email:', err);
              return res.status(500).send('An error occurred from email');
            }

            return res.status(200).send('Temporary password sent');
          });
        });
      });
    });
  });


});
module.exports = router;