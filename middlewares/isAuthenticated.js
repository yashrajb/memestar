const passport = require("passport");

module.exports = {
               isAuthenticated:function(req,res,next){
                              passport.authenticate("jwt",{session:false},function(err,user,info){
                                req.isAuthenticated = Boolean(user);
                                req.user = user;
                                next();
                              })(req,res,next)
                            }
}