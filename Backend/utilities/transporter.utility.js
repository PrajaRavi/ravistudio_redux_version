import nodemailer from "nodemailer";
// const nodemailer=require('nodemailer')
// const nodemailer=require('nodemailer')
export const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "tonystark8976427743@gmail.com",
    pass: "obhj jdip jnza bhbh",
  },
});

// module.exports=transporter
