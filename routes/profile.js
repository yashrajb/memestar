const router = require("express").Router();
const passport = require("passport");
const user = require("../models/user");
const path = require("path");
const {uploadProfilePicture,deleteAllMeme,deleteProfile} = require("../utils/image-api");
const meme = require("../models/meme");
router.get("/:username",async (req, res) => {
  try {
    let userResult = await user.findOne({ username: req.params.username },{_id:1,image:1,username:1,bio:1});
    if (userResult) {
      const { image, _id, username, bio } = userResult;
      return res.send({ profile: { image, _id, username, bio }}).status(200);
    } else {
      throw new Error();
    }
  } catch (e) {
    console.log(e)
    return res.send({ error: "something happened wrong" }).status(400);
  }
});

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    user
      .findById(req.user.id)
      .then(updated => {
        let values = {};
        values.username = updated.username;
        values.image = updated.image;
        if (updated.bio) {
          values.bio = updated.bio;
        }
        return res.send(values).status(200);
      })
      .catch(err => res.send(err).status(400));
  }
);

router.post(
  "/edit",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let valuesChanged = {};
    if (req.body.username) {
      valuesChanged.username = req.body.username;
    }
    valuesChanged.bio = req.body.bio;
    user
      .findByIdAndUpdate(req.user.id, { $set: valuesChanged }, { new: true })
      .then(updated => {
        if (updated) {
          let val = {
            username: updated.username,
            image: updated.image
          };
          val.bio = updated.bio;
          return res.send(val).status(200);
        } else {
          return Promise.reject();
        }
      })
      .catch(err => res.send(err).status(400));
  }
);

router.post(
  "/edit/profilepic",
  passport.authenticate("jwt", { session: false }),
  async function(req, res) {
    try {
      let newProfile = await uploadProfilePicture(req.files.profilePic);
      if(newProfile.status!==200){
        return res.send({error:newProfile.error}).status(400);
      }
      if(req.user.image!=="default.jpg"){
        let isDeleted = await deleteProfile(req.user.image);
        if(isDeleted.status!==200){
          throw new Error();
        }
    }
      let valuesChanged = {
        image:newProfile.image_new_name
      }
      let updatedUser = await user.findByIdAndUpdate(
        req.user.id,
        { $set: valuesChanged },
        { new: true }
      );
      return res.send(updatedUser).status(200);
    } catch (e) {
      return res.send({ error: "Server Error" }).status(400);
    }
  }
);

router.post(
  "/deleteaccount",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
     let memes = await meme.getAllMemesOfUser(req.user._id);
     if(memes.length){
      memes = JSON.stringify(memes);
      await deleteAllMeme(memes); 
     }
      await meme.deleteMany({ user_id: req.user._id });
      await user.findByIdAndDelete(req.user._id);
      res.status(200).send();
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "Server Error" });
    }
  }
);

module.exports = router;
