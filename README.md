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
To store the profile picture and memes i written AWS S3 service. you can see in `service` folder

## Configuring the environments variables
-  There are three parameters in this project
- `mongoURI` - mongodb database url
- `secretOrKey`- secret key to making encryption stronger (salting)
- `imageAPI` - URL of memestar image api (read the above section to more)
- `AWS_S3_ACCESS_KEY_ID` - AWS ACCESS KEY ID
- `AWS_S3_SECRET_ACCESS_KEY` - AWS S3 SECRET ACCESS KEY
- `AWS_S3_REGION` - AWS S3 Region

 
 - for producton
    - in root create new `.env.production` and put above variables
    - for client side you have to do same thing that you done in local but create file .env.production instead .env.development

## How to install and run this web app
- clone this repository `git clone https://github.com/yashrajb/memestar.git`
- go to directory and run `npm install` then go to `./client/` and run npm install
- after that you can run this web app concurrently using `npm run dev`. you can also run servers separately
- don't forget to run image api

