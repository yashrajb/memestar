require('dotenv').config()
const AWS = require("aws-sdk");

var S3 = new AWS.S3({
               accessKeyId:process.env.AWS_S3_ACCESS_KEY_ID,
                secretAccessKey:process.env.AWS_S3_SECRET_ACCESS_KEY, 
                signatureVersion: 'v4',
                region:process.env.AWS_S3_REGION 
})


async function deleteImage(Key) {
  return new Promise((resolve, reject) => {
    console.log(Key);
    S3.deleteObject(
      {
        Bucket: process.env.AWS_S3_BUCKET,
        Key,
      },
      function (err, result) {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      }
    );
  }).catch((err) => {
    console.log("Error inside deleteMeme of awsService", err);
    return err
  });
}

async function getSignedURL(type, Key) {
  return new Promise((resolve, reject) => {
    S3.getSignedUrl(
      "putObject",
      {
        Bucket: process.env.AWS_S3_BUCKET,
        ContentType: type,
        Key,
      },
      (err, url) => {
        if (err) {
          return reject(err);
        }

        return resolve({ url: url });
      }
    );
  }).catch((err) => {
    console.log("Error inside getSignedURL of awsService", err);
    return err
  });
}

async function deleteDirectory(prefix) {
  return new Promise(async (resolve, reject) => {

    let allObjects = await getObjects(prefix);
    allObjects.Contents.forEach(async ({Key}) => { 
      
      let a = await deleteImage(Key) 
      console.log(a);
    
    });

   return resolve(true);

  }).catch((err) => {
    console.log("Error inside deleteMeme of awsService", err);
    return err
  });
}


function getObjects(Prefix){

return new Promise((resolve, reject) => {
  S3.listObjectsV2(
    {
      Bucket: process.env.AWS_S3_BUCKET,
      Prefix,
    },
    function (err, result) {
        if(err){
          return reject(err);
        }else{
          return resolve(result);
        }
    }
  );
}).catch((err) => {
  console.log("Error inside deleteMeme of awsService", err);
  return err;
});

}

module.exports = {
  deleteImage,
  getSignedURL,
  deleteDirectory
};
