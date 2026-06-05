const express=require("express");
const router=express.Router();
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {listingSchema}=require("../schema.js");
const {isLoggedIn,isOwner}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const{storage}=require("../cloudConfig.js");
const multer  = require('multer')
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },

//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

const upload = multer({ storage });


const validateListing=(req,res,next)=>{
let {error}= listingSchema.validate(req.body);
  if(error){
    throw new ExpressError(400,error);
  }else{
    next();
  }
}

router.route("/")
.get(listingController.index)
.post(isLoggedIn,validateListing,upload.single('listing[image][url]'),wrapAsync(listingController.createListing));
// .post(upload.single('listing[image][url]'),(req,res)=>{
//   res.send(req.file);   
// })


//New route
router.get("/new",isLoggedIn,listingController.renderNewform)

router.route("/:id")
.get(listingController.showListing)
.put(isLoggedIn,isOwner,upload.single('listing[image][url]'),validateListing,listingController.updateListing)
.delete(isLoggedIn,isOwner,listingController.destroyListing)

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,listingController.renderEditform)

module.exports=router;