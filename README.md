# MEMESTAR
memestar is the social media website where memers compete with other to become memestar on the basis of the likes. memestar accept all kind of memes and also memers can build their profile.
---
![memestar image](https://github.com/yashrajb/yashrajb.github.io/blob/master/images/memestar-app-repo.png)

## Technologies
---
- React.JS
- Redux
- Nodejs
- Mongodb
- AWS
- Passport
- Heroku
- Git

## Memestar image API
To store the profile picture and memes i written Rest API. this API is written in PHP. to run this webapp you need this API. take look [here](https://github.com/yashrajb/memestar-image-api) and understand how to run this API 

## Configuring the environments variables
-  There are three parameters in this project
- `mongoURI` - mongodb database url
-  `secretOrKey`- secret key to making encryption stronger (salting)
- `imageAPI` - URL of memestar image api (read the above section to more)

- for local
   - go to `/config` and create file `keys_dev.js`
   - export object with those three keys 
   - go to `/client`. you will find `.env.example` you can rename as .env.development whatever you like in that file you will find    `REACT_APP_IMAGE_API` where you have to put URL of image API
 
 - for producton
    - in root create new `.env.production` and write those three parameters whicg listed above
    - for client side you have to do same thing that you done in local but create file .env.production instead .env.development

## How to install and run this web app
- clone this repository `git clone https://github.com/yashrajb/memestar.git`
- go to directory and run `npm install` then go to `./client/` and run npm install
- after that you can run this web app concurrently using `npm run dev`. you can also run servers separately
- don't forget to run image api

