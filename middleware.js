const Listing=require("./models/listing.js")
module.exports.isLoggedIn=(req,res,next)=>{
    // console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","u must be logged in");
       return  res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner= async(req,res,next)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","u are not the owner of the listing")
        return res.redirect(`/listings/${id}`)
    }
    next();
}