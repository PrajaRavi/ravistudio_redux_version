// const Model=require('../Models/UserRegisterModel')
const Model = require("../ModelForSign");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie_parser = require("cookie-parser");

// const secure_store=require('expo-secure-store')
require("dotenv").config();
// import { transporter } from "../nodemailer.js";
const transporter = require("../nodemailer");
const ModelForSign = require("../ModelForSign");

async function SignUp(req, resp, next) {
  const { FirstName, LastName, DOB, email, password, contact } = req.body;

  try {
    // here when we are doing email unique in Model it means on enter same email it will throw an error but again it will send an insert request in database so to stop this send request  Hum pahle hi check kar lenge ki user ka email hamare database me exist karta hai ya nahi
    let UserExist = await Model.findOne({ email });
    if (!UserExist) {
      let HashPass = bcrypt.hashSync(password, 10);
      let d = new Date();
      let BearthYear = DOB.split("-")[0];
      let curryer = d.getFullYear();
      let Age = curryer - Number(BearthYear);
      let Data = await Model.insertOne({
        FirstName,
        LastName,
        DOB,
        Age,
        email,
        password: HashPass,
        contact,
      });
      if (!Data) {
        return resp.send({ success: false, msg: "Data Not found" });
      } else {
        // next();
        // console.log(Data)

        let user = await ModelForSign.findOne({ email });
        let otp = String(Math.floor(100000 + Math.random() * 900000));
        const mailoptions = {
          from: process.env.SENDER_EMAIL,
          to: user.email,
          subject: "OTP for Email verificaion!!!!!",
          text: `Hello welcome to our website RaviStudio.com and OTP for your email verification is : ${otp} [This OTP will be active only for 10 minutes]`,
        };
        await transporter.sendMail(mailoptions);
        let Data = await Model.updateOne(
          { email: email },
          {
            $set: {
              verifyotp: otp,
              verifyotpExpiresAt: Date.now() + 10 * 60 * 1000,
            },
          }
        );

        console.log(Data);

        return resp.send({ success: true, msg: "Sign Up Successfully" });
      }
    } else {
      return resp.send({
        success: false,
        msg: "User already exist in database",
      });
    }
  } catch (error) {
    // return resp.send({success:false,message:error.message})
    if (error.message == "contact must be unique") {
      return resp.send({ success: false, msg: error.message });
    } else if (error.message == "Email must be unique") {
      return resp.send({ success: false, msg: error.message });
    } else {
      return resp.send({ success: false, msg: error.message });
    }
  }
}
// async function LogIn(req, resp, next) {
//   let { email, password } = req.body;

//   try {
//     let User = await Model.findOne({ email });
//     if (!User) {
//       return resp.send({ success: false, msg: "You didn't Sign Up" });
//     } else {
//       let IsPassMatch = bcrypt.compareSync(password, User.password);
//       if (IsPassMatch) {
//         // when the password matches with the password provided by the user then now the user is Authenticated and now we have to Authorised ther user for this now we will provide a jwt Token to user
//         if (req.cookies[`${User._id}`]) {
//           req.cookies[`${User._id}`] = "";
//         }
//         const Token = jwt.sign({ id: User._id }, process.env.MY_SECRET_KEY, {
//           algorithm: "HS256",
//           expiresIn: "40s",
//         }); //HERE first parameter is a paload which can be a string object etc basically init we have to fill detail of the user that we want to share with this token
//         // Now since we provided a token to the respective user now storing this token inside httpOnly cokkie
//         resp.cookie(String(User._id), Token, {
//           path: "/",
//           expires: new Date(Date.now() + 40 * 1000),
//           httpOnly: true,
//           samesite: "lax",
//         }); //first parameter is name of the cookie and second is the value of cookie and third parameter is some options for ex maxAge etc

//         return resp.send({
//           success: true,
//           msg: "Loged In Successfully",
//           useremail: User.email,
//         });
//       } else {
//         return resp.send({ success: false, msg: "Invalid Credentials" });
//       }
//     }
//   } catch (error) {
//     return resp.send({ success: false, message: error.message });
//   }
// }
async function LogIn(req, resp, next) {
  let { email, password } = req.body;

  try {
    let User = await Model.findOne({ email });
    if (!User) {
      return resp.send({ success: false, msg: "You didn't Sign Up" });
    } else {
      let IsPassMatch = bcrypt.compareSync(password, User.password);
      if (IsPassMatch) {
        // when the password matches with the password provided by the user then now the user is Authenticated and now we have to Authorised ther user for this now we will provide a jwt Token to user
       
        const Token = jwt.sign({ id: User._id }, process.env.MY_SECRET_KEY, {
          algorithm: "HS256",
          expiresIn: "40s",
        }); //HERE first parameter is a paload which can be a string object etc basically init we have to fill detail of the user that we want to share with this token
        let data=await ModelForSign.updateOne({
          _id:User._id

        },{
          $set:{
            accesstoken:Token,
            accesstokenExpiry:Date.now()+40*1000,
          }
        })
        // Now since we provided a token to the respective user now storing this token inside httpOnly cokkie
        // resp.cookie(String(User._id), Token, {
        //   path: "/",
        //   expires: new Date(Date.now() + 40 * 1000),
        //   httpOnly: true,
        //   samesite: "lax",
        // }); //first parameter is name of the cookie and second is the value of cookie and third parameter is some options for ex maxAge etc

        return resp.send({
          success: true,
          msg: "Loged In Successfully",
          user:User,
        });
      } else {
        return resp.send({ success: false, msg: "Invalid Credentials" });
      }
    }
  } catch (error) {
    return resp.send({ success: false, message: error.message });
  }
}
// async function GenrateTokenOnComingOnHomePage(req, resp, next) {
//   try {
//     let { email } = req.body;
//     let User = await ModelForSign.findOne({ email });
//     if (req.cookies[`${User._id}`]) {
//       req.cookies[`${User._id}`] = "";
//     }
//     const Token = jwt.sign({ id: User._id }, process.env.MY_SECRET_KEY, {
//       algorithm: "HS256",
//       expiresIn: "40s",
//     }); //HERE first parameter is a paload which can be a string object etc basically init we have to fill detail of the user that we want to share with this token
//     // Now since we provided a token to the respective user now storing this token inside httpOnly cokkie
//     resp.cookie(String(User._id), Token, {
//       path: "/",
//       expires: new Date(Date.now() + 40 * 1000),
//       httpOnly: true,
//       secure:true,
//       samesite: "lax",
//     }); //first parameter is name of the cookie and second is the value of cookie and third parameter is some options for ex maxAge etc
//     return resp.send("Genrated successfully");
//   } catch (error) {
//     // console.log(error)
//     return resp.send(error);
//   }
// }
async function GenrateTokenOnComingOnHomePage(req, resp, next) {
  try {
    let { email } = req.body;
    let User = await ModelForSign.findOne({ email });
    if(User.accesstoken!=''){
      let data =await ModelForSign.updateOne({email},
        {$set:{accesstoken:''}}
      )
      const Token = jwt.sign({ id: User._id }, process.env.MY_SECRET_KEY, {
        algorithm: "HS256",
        expiresIn: "40s",
      }); //HERE first parameter is a paload which can be a string object etc basically init we have to fill detail of the user that we want to share with this token
      // Now since we provided a token to the respective user now storing this token inside httpOnly cokkie
    //   resp.cookie(String(User._id), Token, {
    //   path: "/",
    //   expires: new Date(Date.now() + 40 * 1000),
    //   httpOnly: true,
    //   secure:true,
    //   samesite: "lax",
    // }); //first parameter is name of the cookie and second is the value of cookie and third parameter is some options for ex maxAge etc
    let data1=await ModelForSign.updateOne({email},{
      $set:{accesstoken:Token,
        accesstokenExpiry:Date.now()+40*1000,
      }
    })
    return resp.send("Genrated successfully");
  }
  else{
    const Token = jwt.sign({ id: User._id }, process.env.MY_SECRET_KEY, {
        algorithm: "HS256",
        expiresIn: "40s",
      }); //HERE first parameter is a paload which can be a string object etc basically init we have to fill detail of the user that we want to share with this token
      // Now since we provided a token to the respective user now storing this token inside httpOnly cokkie
    //   resp.cookie(String(User._id), Token, {
    //   path: "/",
    //   expires: new Date(Date.now() + 40 * 1000),
    //   httpOnly: true,
    //   secure:true,
    //   samesite: "lax",
    // }); //first parameter is name of the cookie and second is the value of cookie and third parameter is some options for ex maxAge etc
    let data1=await ModelForSign.updateOne({email},{
      $set:{accesstoken:Token,
        accesstokenExpiry:Date.now()+40*1000,
      }
    })
    return resp.send("Genrated successfully");
    
  }
  } catch (error) {
    // console.log(error)
    return resp.send(error);
  }
}

async function LoginForApp(req, resp, next) {
  let { email, password } = req.body;

  try {
    let User = await Model.findOne({ email });
    if (!User) {
      return resp.send({ success: false, msg: "You didn't Sign Up" });
    } else {
      let IsPassMatch = bcrypt.compareSync(password, User.password);
      if (IsPassMatch) {
        // when the password matches with the password provided by the user then now the user is Authenticated and now we have to Authorised ther user for this now we will provide a jwt Token to user
        const Token = jwt.sign({ id: User._id }, process.env.MY_SECRET_KEY, {
          algorithm: "HS256",
          expiresIn: "1d",
        }); //HERE first parameter is a paload which can be a string object etc basically init we have to fill detail of the user that we want to share with this token
        // Now since we provided a token to the respective user now storing this token inside httpOnly cokkie

        return resp.send({
          success: true,
          msg: "Loged In Successfully",
          Token,
        });
      } else {
        return resp.send({ success: false, msg: "Invalid Credentials" });
      }
    }
  } catch (error) {
    return resp.send({ success: false, message: error.message });
  }
}
async function VerifyToken(req, resp, next) {
  // abhi tak ham khud token ko jo ki user ko mila use Authorization wale section me as Bearer token bhej rahe the kyoki ham token ko kahi per store nahi  kar rahe the but ab kyoki ham user ke token ki cookie me store kar rahe hai to ham use vahi se get karenge
  // <----------------------METHOD 1----------------------------------->
  // const headers=req.headers['authorization']
  //   let Token=String(headers).replace('Bearer ','')
  // if(!Token){
  //   return resp.send("Token Not found")

  // }
  // else{
  // // Now we will verify the token
  //   // console.log(Token)
  //   jwt.verify(String(Token),process.env.MY_SECRET_KEY,(err,user)=>{//here in this user object we have decoded information about the user
  //     if(err){
  //   return console.log(err)

  //     }else{
  //       // resp.setHeader('Content-Type','application/json')
  //       console.log({userid:user.id})
  //       req.id=user.id;

  //     }

  //   })

  // }
  // // console.log(headers)
  // next();
  // <-------------------------------METHOD 2------------------------------------>
  // let email=localStorage.getItem('UserEmail'); 
    try {
    
    let token=await ModelForSign.findOne({email:req.params.email})
    const Token = token.accesstoken;
    // console.log(req.headers);
    // let Token = String(cookies).split("=")[1];
    // console.log(Token)
    if (!Token) {
      return resp.send("Token Not found" + "verify");
    } else {
      // Now we will verify the token
      // console.log(Token)
      jwt.verify(String(Token), process.env.MY_SECRET_KEY, (err, user) => {
      //here in this user object we have decoded information about the user
      if (err) {
        return console.log(err);
      } else {
        // resp.setHeader('Content-Type','application/json')

        req.id = user.id;
        
        next();
      }
    });
  } 
}
catch(error){
  console.log(error)
  return resp.send({msg:error.message})
}
  // console.log(headers)
}

async function VerifyTokenForApp(req, resp, next) {
  // <-------------------------------METHOD 2------------------------------------>
  let { Token } = req.body;
  console.log(Token);

  console.log(Token);
  if (!Token) {
    return resp.send("Token Not found");
  } else {
    // Now we will verify the token
    // console.log(Token)
    jwt.verify(String(Token), process.env.MY_SECRET_KEY, (err, user) => {
      //here in this user object we have decoded information about the user
      if (err) {
        return console.log(err);
      } else {
        // resp.setHeader('Content-Type','application/json')
        console.log({ userid: user.id });
        req.id = user.id;
      }
    });
  }
  // console.log(Token)
  next();
}
async function GetUser(req, res) {
  let userid = req.id;
  // console.log(userid)

  try {
    let user = await Model.findById(userid).select(
      "-password -IsAdmin -isAccountVerified"
    );
    return res.send(user);
  } catch (error) {
    // console.log(error.message)
    return new Error(error);
  }
}
async function GetUserDringRefresh(req, res) {
  let userid = req.id;
  // console.log(userid)

  try {
    let user = await Model.findById(userid, "-password");
    res.json(user);
  } catch (error) {
    // console.log(error.message)
    return new Error(error);
  }
}
async function Logout(req, resp) {
  let userid = req.id;
  try {
    resp.clearCookie(userid, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expiresIn: 37 * 1000, // in millisecond it is 7days
    });
    resp.send("Logout successfully");
  } catch (error) {
    resp.send(error.message);
  }
}
// NOW ADDING LOGIC SUCH THAT WE CAN CREATE A REFRESH TOKEN FUNCNALITY
async function RefreshToken(req, resp, next) {
  try {
    // const cookies = req.headers.cookie;
    let user=await ModelForSign.findOne({email:req.params.email});

    // let PrevToken = String(cookies).split("=")[1];
    // console.log(PrevToken)
    let PrevToken=user.accesstoken;
    if (!PrevToken) {
      return resp.status.json({ msg: "Token Not found" });
    } else {
      jwt.verify(String(PrevToken), process.env.MY_SECRET_KEY, async(err, User) => {
        //here in this user object we have decoded information about the user
        if (err) {
          console.log(err);
        } else {
          // resp.setHeader('Content-Type','application/json')
          // console.log({userid:user.id})
          // req.id=user.id;
          //------------> now after the varification completed now clearing the cookie from resp
          // -------------->Now we will create a new Token
          const Token = jwt.sign({ id: User.id }, process.env.MY_SECRET_KEY, {
            algorithm: "HS256",
            expiresIn: "40s",
          }); //HERE first parameter is a paload which can be a string object etc basically init we have to fill detail of the user that we want to share with this token
          // Now since we provided a token to the respective user now storing this token inside httpOnly cokkie
          // resp.cookie(String(User.id), Token, {
          //   path: "/",
          //   expires: new Date(Date.now() + 40 * 1000),
          //   httpOnly: true,
          //   samesite: "lax",
          // }); //first parameter is name of the cookie and second is the value of cookie and third parameter is some options for ex maxAge etc
          let data1=await ModelForSign.updateOne({email:req.params.email},
            {$set:{accesstoken:Token}}

          )
          

          req.id = User.id;

          next();
        }
      });
    }
  } catch (error) {
    return resp.send(error);
  }
}
async function RefreshTokenFroApp(req, resp, next) {
  try {
    let { Token } = req.body;

    let PrevToken = String(Token).split("=")[1];
    // console.log(PrevToken)
    if (!PrevToken) {
      return resp.status.json({ msg: "Token Not found" });
    } else {
      jwt.verify(String(PrevToken), process.env.MY_SECRET_KEY, (err, User) => {
        //here in this user object we have decoded information about the user
        if (err) {
          console.log(err);
        } else {
          // resp.setHeader('Content-Type','application/json')
          // console.log({userid:user.id})
          // req.id=user.id;
          //------------> now after the varification completed now clearing the cookie from resp

          // -------------->Now we will create a new Token
          const Token = jwt.sign({ id: User.id }, process.env.MY_SECRET_KEY, {
            algorithm: "HS256",
            expiresIn: "40s",
          }); //HERE first parameter is a paload which can be a string object etc basically init we have to fill detail of the user that we want to share with this token
          // Now since we provided a token to the respective user now storing this token inside httpOnly cokkie
          req.id = User.id;

          next();
          return resp.send({ success: true, msg: Token });
        }
      });
    }
  } catch (error) {
    return resp.send(error);
  }
}
async function SendResetPasswordOTP(req, resp) {
  let { email } = req.body;
  if (!email) {
    return resp.send({ success: false, message: "Please Provide email" });
  } else {
    try {
      const user = await Model.findOne({ email });
      if (!user) {
        return resp.send({ success: false, message: "User Not Exist" });
      } else {
        let otp = String(Math.floor(100000 + Math.random() * 900000));
        const mailoptions = {
          from: process.env.SENDER_EMAIL,
          to: user.email,
          subject: " Reset Password OTP",
          text: `OTP for Reset your Password  is ${otp} [This OTP will be active only for 5 minutes]`,
        };
        await transporter.sendMail(mailoptions);
        let Data = await Model.updateOne(
          { email: email },
          {
            $set: {
              resetOtp: otp,
              resetOtpExpiresAt: Date.now() + 5 * 60 * 1000,
            },
          }
        );

        console.log(Data);
        resp.send(Data);
      }
    } catch (error) {
      return resp.send({ success: false, message: error.message });
    }
  }
}
// NOW MAKING A CONTROLLER FUNCTION THAT WILL RESET THE USER PASSWORD HERE WE NEED EMAIL RESETPASSOTP AND NEW PASSWORD
async function ResetUserPassword(req, resp) {
  const { email, NewPassword, otp } = req.body;
  if (!email || !NewPassword || !otp) {
    resp.send({ success: false, message: "All field required" });
  } else {
    try {
      let user = await Model.findOne({ email });
      if (!user) {
        resp.send({ success: false, message: "User Not Found" });
      } else {
        if (user.resetOtp == "" || user.resetOtp !== otp) {
          return resp.send({ success: false, message: "Invalid otp" });
        }
        if (user.resetOtpExpiresAt < Date.now()) {
          return resp.send({ success: false, message: "OTP is expired" });
        }
        let NewHashPass = bcrypt.hashSync(NewPassword, 10);
        let Data = await Model.updateOne(
          { email },
          {
            $set: {
              password: NewHashPass,
              resetOtp: "",
              resetOtpExpiresAt: 0,
            },
          }
        );
        return resp.send({
          success: true,
          message: "Password reset Successfully",
        });
      }
    } catch (error) {
      resp.send({ success: false, message: error.message });
    }
  }
}
async function VerifyOTPafterSignUp(req, resp) {
  const { email, OTP } = req.body;
  try {
    let user = await ModelForSign.findOne({ email });
    if (!user) {
      return resp.send({ success: false, msg: "user not found" });
    } else {
      if (user.verifyotp == "" || user.verifyotp != OTP) {
        return resp.send({ success: false, msg: "Invalid OTP" });
      }
      if (user.resetOtpExpiresAt > Date.now()) {
        return resp.send({ success: false, msg: "OTP is expired" });
      }
      let Data = await ModelForSign.updateOne(
        { email },
        {
          $set: {
            verifyotp: "",
            verifyotpExpiresAt: 0,
            isAccountVerified: true,
          },
        }
      );
      return resp.send({
        success: true,
        msg: "Email verified successfully!!!",
      });
    }
  } catch (error) {}
}
async function UpdateUserProfile(req, resp) {
  let { email, FirstName, LastName, Age, DOB, contact } = req.body;
  try {
    let Data = await ModelForSign.findOneAndUpdate(
      { email: req.params.email },
      {
        $set: { FirstName, LastName, Age, contact, DOB, email },
      }
    );
    console.log(Data);
    return resp.send({ success: true, msg: "Profile updated successfully" });
  } catch (error) {
    return resp.send({ success: false, msg: error.message });

    // console.log(error)
  }
}
module.exports = {
  SignUp,
  LogIn,
  VerifyToken,
  GetUser,
  RefreshToken,
  Logout,
  SendResetPasswordOTP,
  ResetUserPassword,
  LoginForApp,
  VerifyTokenForApp,
  RefreshTokenFroApp,
  VerifyOTPafterSignUp,
  UpdateUserProfile,
  GetUserDringRefresh,
  GenrateTokenOnComingOnHomePage,
};