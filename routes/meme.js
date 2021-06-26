const router = require("express").Router();
const passport = require("passport");
const meme = require("../models/meme");
const users = require("../models/user");
const { deleteImage,getSignedURL } = require("../services/awsService");
const ObjectId = require("mongoose").Types.ObjectId;
const {isAuthenticated} = require("../middlewares/isAuthenticated");
const { v4: uuid } = require('uuid');
const path = require("path");
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      
      if(!req.body.imageURL){
        return res.status(400).json({ error: "image url is required" });
      }
      if (!req.body.category) {
        return res.status(400).json({ error: "category is required" });
      }
      
      let newMeme = new meme({
        user_id: req.user.id,
        createdAt: new Date(),
        image: req.body.imageURL,
        category: req.body.category,
      });
      let result = await newMeme.save()
      return res.send(result).status(200);
       
    }catch(err){
      console.log("error inside POST /meme/",err);
      return res.status(400).send({error:"something went wrong"})
  }
}
);

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let { _id } = req.body;
      let userMeme = await meme.findByIdAndDelete(_id);
      await deleteImage(userMeme.image);
      await meme.findByIdAndDelete(_id);
      return res.send({ success: true }).status(200);
    } catch (err) {
      console.log("error inside DELETE /meme/",err);
      res.status(400).send({ error:"something went wrong" });
    }
  }
);



router.get(
  "/all",
  isAuthenticated,
  async (req, res) => {
    let user = "";
    if(req.user){
      user = req.user._id
    }
    let {skip=0,user_id,category}  = req.query;
    let obj = {};
    skip = parseInt(skip);
    user_id && (
      obj.user_id = ObjectId(user_id)
    )
    category && (
      obj.category = category
    )
    

    

    meme
      .aggregate([
        {
          $match:obj
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $project: {
            _id: "$_id",
            image: "$image",
            date: "$date",
            category: "$category",
            user_liked: {
              $filter: {
                input: "$likes",
                as: "likedUser",
                cond: { $eq: ["$$likedUser.user", user] },
              },
            },
            count: {
              $size: "$likes",
            },
            userDetails:{ $arrayElemAt: [ "$userDetails", 0 ] }
          },
        },
        {
          $project: {
            _id: "$_id",
            image: "$image",
            date: "$date",
            category: "$category",
            user_liked: {
              $size: "$user_liked",
            },
            count: "$count",
            userDetails:{
              "username":"$userDetails.username",
              "_id":"$userDetails._id",
              "image":"$userDetails.image"
            }
           
          },
        },
        {
          $skip:skip

        },
        {
          $limit:10
        }
      ])
      .exec()
      .then((result) => {
        
        return res.send(result).status(200);
      })
      .catch(err => {
        console.log("error inside GET /meme/all",err);
        return res.send({error:"something went wrong"}).status(400)
      });
  }
);

router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try{
    let result = await meme.findById(req.params.id);
    let isUserExist = result.likes.filter((element) => {
      return element.user.toString() === req.user._id.toString();
    });
    if (isUserExist.length) {
      result.likes = result.likes.filter((element) => {
        return element.user.toString() !== req.user._id.toString();
      });
    } else {
      result.likes.push({ user: req.user._id });
    }

    let updated = await result.save();
    return res.send(updated).status(200);
  }catch(err){
      console.log("error inside POST /like/:id",err);
      return res.send({error:"something went wrong"}).status(400)
  }
  }
);

router.get("/stars", (req, res) => {
  users
    .aggregate([
      {
        $lookup: {
          from: "memes",
          localField: "_id",
          foreignField: "user_id",
          as: "memes",
        },
      },
      {
        $addFields: {
          likes: {
            $sum: {
              $map: {
                input: "$memes",
                in: {
                  $size: "$$this.likes",
                },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          user_id: "$_id",
          image: "$image",
          username: 1,
          likes: 1,
        },
      },
      {
        $sort: { likes: -1 },
      },
      {
        $limit: 5,
      },
    ])
    .exec()
    .then((result) => {
        return res.send(result).status(200);
    })
    .catch(err => {
      console.log("error inside GET /stars",err);
      return res.send({error:"something went wrong"}).status(400)
    });
});






router.post('/upload', passport.authenticate("jwt", { session: false }), 
async (req, res) => {

  try {

    if(!req.body.name || !req.body.type){
      return res.json({
        success:false,
        error:"required params are not present"
      })
    }
  
  
    var key = `${req.user._id}/${uuid()}${path.extname(req.body.name)}`;
    
  
    var signedURL = await getSignedURL(req.body.type,key);

    return res.json({url:signedURL.url,key}).status(200);

  }catch(err){
      console.log("error inside GET meme/upload",err);
      return res.send({error:"something went wrong"}).status(500)
  }

  



});

module.exports = router;
