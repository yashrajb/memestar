const router = require("express").Router();
const passport = require("passport");
const { uploadMeme } = require("../utils/image-api");
const meme = require("../models/meme");
const users = require("../models/user");
const { deleteMeme } = require("../utils/image-api");
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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
      res.status(500).send({ error: "Something went wrong" });
    }
  }
);

router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    meme
      .aggregate([
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
                cond: { $eq: ["$$likedUser.user", req.user._id] },
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
      ])
      .exec()
      .then((result) => {
        return res.send(result).status(200);
      })
      .catch((err) => res.send(err).status(400));
  }
);

router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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
  }
);

router.get("/username/:username", async (req, res) => {
  let id = users.findOne({username:req.params.username},{_id:1});

});

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
      if (result.length) {
        return res.send(result).status(200);
      } else {
        return Promise.reject({ error: "there is no memestars" });
      }
    })
    .catch((err) => res.send(err).status(400));
});

module.exports = router;
