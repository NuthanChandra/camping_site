var express= require("express"),
    app= express(),
    bodyParser= require("body-parser"),
    mongoose= require("mongoose"),
    passport= require("passport"),
    LocalStrategy= require("passport-local"),
    methodOverride= require("method-override"),
    flash= require("connect-flash"),
    User= require("./models/user")
    seedDb = require("./seeds"),
    Campground= require("./models/campground"),
    Comment= require("./models/comment");
    
var commentRoutes= require("./routes/comments"),
    campgroundRoutes= require("./routes/campgrounds"),
    indexRoutes= require("./routes/index");
    

      mongoose.connect("mongodb://localhost/camping_site");
      app.use(bodyParser.urlencoded({extended:true}));
      app.use(flash());
      app.set("view engine","ejs");
      app.use(express.static(__dirname+"/public"));
      
    //   seedDb(); 
   
   //PASSPORT CONFIG
   app.use(require("express-session")({
      secret: "I love my India chek de budget de hindustan",
      resave: false,
      saveUninitialized: false
   }));
  
   app.use(methodOverride("_method"));
   app.use(passport.initialize());
   app.use(passport.session());
   passport.use(new LocalStrategy(User.authenticate()));
   passport.serializeUser(User.serializeUser());
   passport.deserializeUser(User.deserializeUser());
   
   app.use(function(req,res,next){
      res.locals.currentUser = req.user;
      res.locals.error = req.flash("error");
      res.locals.success = req.flash("success");
      next(); 
   });

   app.use("/",indexRoutes);
   app.use("/campgrounds",campgroundRoutes);
   app.use("/campgrounds/:id/comments",commentRoutes);
   
   
app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Camping site server started!!!"); 
}); 