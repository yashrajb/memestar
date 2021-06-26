
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");
const cors = require("cors");
const upload = require('express-fileupload');

const users = require("./routes/user");
const profile = require("./routes/profile");
const meme = require("./routes/meme");
const app = express();
app.use(upload());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
mongoose.set('useFindAndModify', false);
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true,useUnifiedTopology: true })
  .then((result) => {
      console.log("mongodb is connected");
  })
  .catch(err => console.log(err));

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/meme", meme);

if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port,() => console.log(`Server running on port ${port}`));
