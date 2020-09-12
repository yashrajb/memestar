const router = require("express").Router();
const passport = require("passport");
const { uploadMeme } = require("../utils/image-api");
const meme = require("../models/meme");
const users = require("../models/user");
const { deleteMeme } = require("../utils/image-api");
const ObjectId = require("mongoose").Types.ObjectId;
const middleware = function(req,res,next){
  passport.authenticate("jwt",{session:false},function(err,user,info){
    req.isAuthenticated = Boolean(user);
    req.user = user;
    next();
  })(req,res,next)
}
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      if (!req.files) {
        return res.status(400).json({ error: "file is required" });
      }
      if (!req.body.category) {
        return res.status(400).json({ error: "category is required" });
      }
      let uploadImage = await uploadMeme(req.files.meme);
      if (uploadImage.status !== 200) {
        return res.status(400).json({ error: "server error.please try again" });
      }
      let newMeme = new meme({
        user_id: req.user.id,
        createdAt: new Date(),
        image: uploadImage.image_new_name,
        category: req.body.category,
      });
      newMeme
        .save()
        .then((result) => res.send(result).status(200))
        .catch((err) => res.send(err).status(400));
    }catch(e){
      console.log("errr",e.response.data,e.response && e.response.data && e.response.data.error);
      return res.status(400).send({error:e.response && e.response.data?`${e.response.data.error}`:"something went wrong"})
  }
}
);

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let { _id, image } = req.body;
      let deletedMemes = await meme.findByIdAndDelete(_id);
      if (deletedMemes) {
        await deleteMeme(image);
      }

      return res.send({ success: true }).status(200);
    } catch (e) {
      console.log(e);
      res.status(400).send({ error:e.response && e.response.data?e.response.data.error:"something went wrong" });
    }
  }
);



router.get(
  "/all",
  //passport.authenticate("jwt", { session: false }),
  middleware,
  (req, res) => {
    let user = "";
    if(req.user){
      user = req.user._id
    }
    let {skip,user_id,category}  = req.query;
    let obj = {};
    skip = parseInt(skip);
    if(user_id){
      obj.user_id = ObjectId(user_id);
    }
    if(category){
      obj.category = category;
    }
    console.log(obj);
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
            userDetails: "$userDetails",
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
            userDetails: "$userDetails",
          },
        },
        {
          $skip:skip

        },
        {
          $limit:2
        }
      ])
      .exec()
      .then((result) => {
        return res.send(result).status(200);
      })
      .catch(err => {
        console.log(err);
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
  }catch(e){
      console.log(e);
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
      console.log(err);
      return res.send({error:"something went wrong"}).status(400)
    });
});

// router.get("/username/:user_id",async (req,res) => {
// try {
//   let {skip,limit,category} = req.query;
//   skip = parseInt(skip);
//   limit = parseInt(limit);
//   let {user_id} = req.params;
//   let obj = {
//     user_id
//   }
//   if(category){
//     obj.category = category;
//   }
//   let memes = await meme.find(obj).skip(skip).limit(limit);
//   return res.send(memes).status(200);
// }catch(e){
//   console.log(e);
//   return res.send({error:"something went wrong"}).status(400)
// }

// })
module.exports = router;
