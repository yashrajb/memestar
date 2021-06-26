const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const {validateRegisterInput,validateLoginInput} = require("../utils/validations");
const user = require("../models/user");

router.post("/register", async (req, res) => {
  try{
    
      const { errors, anyErrors } = validateRegisterInput(req.body);
 
      if (anyErrors) {
          return res.status(400).json({error:errors});
      }
 
      let result = await user.findOne({ username: req.body.username })
    
      if (result) {
        return res.status(400).json({error:"username already exists"});
      } 

        let hashedPassword = await genSalt(req.body.password)

        let newUser = new user({
          username: req.body.username,
          password: hashedPassword.hash
        });

        let savedUser = await newUser.save();

        return res.json({success:true}).status(200);

      
  }catch(err){

      console.log("Error in POST /user/register",err);
      return res.status(500).json({error:"something happend wrong. please try again"})

  }
  
    
    
});

router.post("/login", async (req, res) => {
try {
  let { errors, anyErrors } = validateLoginInput(req.body);
  if (anyErrors) {
    return res.status(400).json({error:errors});
  }
  let result = await user.findOne({ username: req.body.username });

      if (!result) {
        return res.status(400).json({ error: "user is not found" });
      }
      let isPasswordMatch = await bcrypt.compare(req.body.password, result.password)
        
          if (!isPasswordMatch) {
            errors.push("Password incorrect");
            return res.status(400).json({error:errors});
          }
            var payload = {id: result.id};
            jwt.sign(payload, process.env.SECRET_OR_KEY, { expiresIn: "1 days" }, function(err,token) {

              if (err) {
                return res
                  .status(500)
                  .json({ error: "something happened wrong" });
              }

              return res
                .status(200)
                .json({ success: true, token: token, profile:{
                  _id:result._id,
                  username:result.username,
                  image:result.image,
                  bio:result.bio
                } });
            });

  }catch(err){

  console.log("Error in POST /user/login",err);
  return res.status(500).json({error:"something happend wrong. please try again"})

}   
        
    
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {

    try {
    
    let result = await user.findById(req.user.id)

        if (result) {
          var payload = {
            id: result.id,
            username: result.username,
            image: result.image,
            bio: result.bio
          };
          return res.status(200).json(payload);
        } 
        
        return Promise.reject();
        

      }catch(err){

        console.log("Error in GET /user/current",err);
        return res.status(500).json({error:"something happend wrong. please try again"})
      
      }   
  });

router.post(
  "/changepassword",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {

    try {
     
      let result = await user.findById(req.user.id);

      if(!result){

        return Promise.reject();

      }
  
     let isOldPassword  = await bcrypt.compare(req.body.newPassword,result.password)
      
      if(isOldPassword){
          return res.status(400).send({error:"new password is same. please use new password"}); 
      }

     let isCurrentPasswordMatch =  await bcrypt.compare(req.body.currentPassword, result.password)
     
      if (!isCurrentPasswordMatch)  {
        return res.status(400).send({error:"current password is incorrect. please try again"});
      }
            


      let hashedNewPass = await genSalt(req.body.newPassword);
      
      result.password = hashedNewPass.hash;
      await result.save()
                        
      return res.status(200).json({ success:true })
                      
                        
            
    }catch(err){
  
        console.log("Error in POST /user/changepassword",err);
        return res.status(500).json({error:"something happend wrong. please try again"})

    }
}
);

async function genSalt(password){

  return new Promise((resolve,reject) => {



    bcrypt.genSalt(10, (err1, salt) => {

      if(err1){
        return reject(false)
      }

      bcrypt.hash(password, salt, async (err, hash) => {
        
        if (err){
          return reject(false)
        }else{
          return resolve({hash})
        }
        
      });
    });



  })


}


module.exports = router;
