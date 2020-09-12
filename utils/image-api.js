const FormData = require("form-data");
const axios = require("axios");
const {imageAPI} = require("../config/keys");
async function uploadProfilePicture(file) {
  try {
    let imageData = new FormData();
    const formHeaders = imageData.getHeaders();
    imageData.append("profilePic", file.data, file.name);
    const uploadedImage = await axios.post(
      `${imageAPI}/index.php`,
      imageData,
      {
        headers: {
          "Content-Type": formHeaders["content-type"],
          ...formHeaders
        }
      }
    );
    return uploadedImage.data;
  } catch (e) {
    throw e;
  }
}

async function uploadMeme(file) {
  try {
    let imageData = new FormData();
    const formHeaders = imageData.getHeaders();
    imageData.append("meme", file.data, file.name);
    const uploadedImage = await axios.post(
      `${imageAPI}/index.php`,
      imageData,
      {
        headers: {
          "Content-Type": formHeaders["content-type"],
          ...formHeaders
        }
      }
    );
    return uploadedImage.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function deleteProfile(name) {
  try {
    let imageData = new FormData();
    const formHeaders = imageData.getHeaders();
    imageData.append("name", name);
    const deletedImage = await axios.post(
      `${imageAPI}/deleteprofile.php`,
      imageData,
      {
        headers: {
          "Content-Type": formHeaders["content-type"],
          ...formHeaders
        }
      }
    );
    
    return deletedImage.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function deleteMeme(name) {
  try {
    let imageData = new FormData();
    const formHeaders = imageData.getHeaders();
    imageData.append("singlememe", name);
    const deletedImage = await axios.post(
      `${imageAPI}/deletememe.php`,
      imageData,
      {
        headers: {
          "Content-Type": formHeaders["content-type"],
          ...formHeaders
        }
      }
    );
    
    return deletedImage.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function deleteAllMeme(name) {
  try {
    let imageData = new FormData();
    const formHeaders = imageData.getHeaders();
    imageData.append("memes", name);
    const uploadedImage = await axios.post(
      `${imageAPI}/deleteallmeme.php`,
      imageData,
      {
        headers: {
          "Content-Type": formHeaders["content-type"],
          ...formHeaders
        }
      }
    );
    return uploadedImage.data;
  } catch (e) {
    throw e;
  }
}
module.exports = {
  uploadProfilePicture,
  uploadMeme,
  deleteMeme,
  deleteProfile,
  deleteAllMeme
};
