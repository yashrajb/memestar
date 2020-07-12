const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const objectId = mongoose.Schema.Types.ObjectId;
const {deleteMeme} = require("../utils/image-api");
const memeSchema = new Schema({
  user_id: {
    type: objectId,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  date: {
    type: String,
    default: Date.now
  },
  category:{
    type:String,
    enum:["dank","offensive","programming","religious","uncategorized"],
    required:true,
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ],
});

memeSchema.statics.getAllMemesOfUser = async function(user_id){
  try {
  var meme = this;
  let memesofUser = await meme.find({user_id});
  let allMemes = []
  memesofUser.forEach(element => {
    allMemes.push(element.image);
  });
  return allMemes;
  }catch(e){
    throw e;
  }
  
}

module.exports = User = mongoose.model('meme', memeSchema);