var express= require("express");
var router= express.Router({mergeParams:true});
var Campground= require("../models/campground");
var middleware= require("../middleware");


//INDEX - show all campgrounds
router.get("/",function(req,res){
   // eval(require("locus"));
   Campground.find({},function(err,allCampgrounds){
      if(err){
          console.log(err);
      }
      else{
         res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user,page:'campgrounds'});
      }
   });
});

//CREATE - add new campground to DB
router.post("/",middleware.isLoggedIn,function(req,res){
   var name=req.body.name;
   var price=req.body.price;
   var image=req.body.image;
   var desc=req.body.description;
   var author= {
      id: req.user._id,
      username: req.user.username
   };
   var newCampground={name:name, price:price, image:image, description:desc, author: author};
   Campground.create(newCampground,function(err,newlyAdded){
      if(err || !newlyAdded){
         req.flash("error","Failed to create Campground");
         res.redirect("back");
      }
      else{
         console.log(newlyAdded);
         res.redirect("/campgrounds");
      }
   })
   
});

router.get("/new",middleware.isLoggedIn,function(req, res) {
   res.render("campgrounds/new"); 
});

router.get("/:id",function(req,res){
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
      if(err || !foundCampground){
         req.flash("error","Cannot find Campground");
         res.redirect("back");
      }
      else{
         console.log(foundCampground);
         res.render("campgrounds/show",{campground:foundCampground});
      }
   });
   
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req, res) {
   Campground.findById(req.params.id,function(err,campground){
      if(err || !campground){
         req.flash("error","Cannot find Campground");
         res.redirect("back");
      }else
         res.render("campgrounds/edit",{campground:campground});
   });
   
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
   Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
      if(err || !updatedCampground){
         res.redirect("/campgrounds");
      }
      else{
         console.log("Updated Campground:"+updatedCampground);
         res.redirect("/campgrounds/"+updatedCampground._id);
      }
   });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
   Campground.findByIdAndRemove(req.params.id,function(err){
      if(err){
         res.redirect("/campgrounds");
      }else{
         res.redirect("/campgrounds");
      }
   });
});



module.exports = router;