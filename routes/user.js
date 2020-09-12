const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const passport = require("passport");
const validateRegisterInput = require("../validations/register");
const validateLoginInput = require("../validations/login");
const user = require("../models/user");

router.post("/register", (req, res) => {
  console.log(req.body);
  const { errors, anyErrors } = validateRegisterInput(req.body);
  console.log(anyErrors);
  if (anyErrors) {
    return res.status(400).json({error:errors});
  }
  console.log("after valid");
  user
    .findOne({ username: req.body.username })
    .then(result => {
      if (result) {
        //errors.user = "username already exists";
        return res.status(400).json({error:"username already exists"});
      } else {
        let newUser = new user({
          username: req.body.username,
          password: req.body.password
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(saved => res.status(200).json(saved))
              .catch(err => Promise.reject(err));
          });
        });
      }
    })
    .catch(err => res.status(400).json(err));
});

router.post("/login", (req, res) => {
  let { errors, anyErrors } = validateLoginInput(req.body);
  if (anyErrors) {
    return res.status(400).json({error:errors});
  }
  user
    .findOne({ username: req.body.username })
    .then(result => {
      if (!result) {
        return res.status(400).json({ error: "user is not found" });
      }
      bcrypt
        .compare(req.body.password, result.password)
        .then(isMatch => {
          if (isMatch) {
            var payload = {
              id: result.id
            };
            jwt.sign(payload, keys.secretOrKey, { expiresIn: "1 days" }, function(
              err,
              token
            ) {
              if (err) {
                return res
                  .status(400)
                  .json({ error: "something happened wrong" });
              }
              return res
                .status(200)
                .json({ success: true, token: "Bearer " + token });
            });
          } else {
            errors.push("Password incorrect");
            return res.status(400).json({error:errors});
          }
        })
        .catch(err => Promise.reject(err));
    })
    .catch(err => res.status(400).json(err));
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    user
      .findById(req.user.id)
      .then(result => {
        if (result) {
          var payload = {
            id: result.id,
            username: result.username,
            image: result.image,
            bio: result.bio
          };
          return res.status(200).json(payload);
        } else {
          return Promise.reject();
        }
      })
      .catch(err => res.status(400).json(err));
  }
);

router.post(
  "/changepassword",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    user
      .findById(req.user.id)
      .then(result => {
        bcrypt.compare(req.body.newPassword,result.password).then((isSame) => {
          if(isSame){
           return res.status(400).send({error:"new password is same"}); 
          }
        })
        bcrypt
          .compare(req.body.currentPassword, result.password)
          .then(isTrue => {
            if (isTrue) {
              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.newPassword, salt, (err, hash) => {
                  if (err) throw err;
                  result.password = hash;
                  result
                    .save()
                    .then(saved => {
                      return res.status(200).json(saved)
                    })
                    .catch(err => Promise.reject(err));
                });
              });
            } else {
              return Promise.reject({error:"Current Password is wrong"});
            }
          })
          .catch(err =>{
            console.log(err);
            return res.status(400).send({error:"something went wrong"})
          }
            
          );
      })
      .catch(err =>
        res.status(400).send({ error: "something happened wrong.please try again" })
      );
  }
);



module.exports = router;
