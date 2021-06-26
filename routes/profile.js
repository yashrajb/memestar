const router = require("express").Router();
const passport = require("passport");
const user = require("../models/user");
const path = require("path");
const {deleteImage,getSignedURL,deleteDirectory} = require("../services/awsService");
const meme = require("../models/meme");
const { v4: uuid } = require('uuid');
router.get("/:username",async (req, res) => {
  try {
    let { image, _id, username, bio } = await user.findOne({ username: req.params.username });
    
    if(!_id || !image || !username){
      return res.send({error:"user not found"}).status(400);
    }
      
    return res.send({ profile: {image,_id,username,bio}}).status(200);
     
  } catch (e) {
    console.log("error inside GET profile/:username",err);
    return res.send({error:"something went wrong"}).status(500)
  }
});

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
    let updated  = await user.findById(req.user.id)
      
        let values = {};
        values.id = updated._id;
        values.username = updated.username;
        values.image = updated.image;
        if (updated.bio) {
          values.bio = updated.bio;
        }
        return res.send(values).status(200);
      }catch (e) {
        console.log("error inside GET profile/",err);
        return res.send({error:"something went wrong"}).status(500)
      }
  }
);

router.post(
  "/edit",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {

          let valuesChanged = {};
          if (req.body.username) {
            valuesChanged.username = req.body.username;
          }
          valuesChanged.bio = req.body.bio;
          let updated = await user.findByIdAndUpdate(req.user.id, { $set: valuesChanged }, { new: true })
      
        
          let {_id,username,image,bio} = updated;
      return res.send({_id,username,image,bio}).status(200);
        
        } catch (e) {
          console.log("error inside POST profile/edit",err);
          return res.send({error:"something went wrong"}).status(500)
        }
      
  }
);

router.post(
  "/edit/profilepic",
  passport.authenticate("jwt", { session: false }),
  async function(req, res) {
    try {
      let valuesChanged = {
        image:req.body.image
      }
      
      req.user.image!=="default-profile.jpg" && (await deleteImage(req.user.image))
      let updatedUser = await user.findByIdAndUpdate(
        req.user._id,
        { $set: valuesChanged },
        { new: true }
      );
      let {_id,username,image,bio} = updatedUser
      return res.send({_id,username,image,bio}).status(200);
    } catch (e) {
      console.log("error inside POST profile/edit/profilepic",err);
      return res.send({error:"something went wrong"}).status(500)
    }
  }
);

router.post(
  "/deleteaccount",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let memes = await meme.getAllMemesOfUser(req.user._id);
      memes.length && (await deleteDirectory(`${req.user._id}`)); 
      await meme.deleteMany({ user_id: req.user._id });
      await user.findByIdAndDelete(req.user._id);
      req.logout();
      res.status(200).send();
  
    } catch (err) {
      console.log("error inside POST profile/deletaccount",err);
      return res.send({error:"something went wrong"}).status(500)
    }
  }
);

router.post('/upload', passport.authenticate("jwt", { session: false }), async (req, res) => {

  try {


    if(!req.body.name || !req.body.type){
      return res.json({
        success:false,
        error:"required params are not present"
      })
    }
  
  
    var key = `${req.user._id}/${uuid()}-profile-pic${path.extname(req.body.name)}`;

  
    var signedURL = await getSignedURL(req.body.type,key);

    return res.json({url:signedURL.url,key}).status(200);

  }catch(err){
      console.log("error inside GET profile/upload",err);
      return res.send({error:"something went wrong"}).status(500)
  }

  



});

module.exports = router;
