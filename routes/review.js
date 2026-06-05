const express=require("express");
const router=express.Router({mergeParams:true});
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");


const validateReview=(req,res,next)=>{
let {error}= reviewSchema.validate(req.body);
  if(error){
    throw new ExpressError(400,error);
  }else{
    next();
  }
}

//post route
router.post("/",validateReview,isLoggedIn,wrapAsync( async(req,res)=>{
let listing=await Listing.findById(req.params.id);
let newReview=new Review(req.body.review);
newReview.author=req.user ._id;
console.log(newReview);
listing.reviews.push(newReview);
await newReview.save();
await listing.save();
res.redirect(`/listings/${listing._id}`);
}))


// delete route
router.delete("/:reviewId",wrapAsync(async(req,res)=> {
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))

module.exports=router;