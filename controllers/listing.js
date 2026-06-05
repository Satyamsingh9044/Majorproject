const Listing=require("../models/listing");
module.exports.index=async(req,res)=>{
   const allListings= await Listing.find()
    res.render("listings/index.ejs",{allListings})
};

module.exports.renderNewform=(req,res)=>{
    res.render("listings/form.ejs");
};

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews").populate("owner");
    res.render("listings/show.ejs",{listing,lat: 17.3850,
        lng: 78.4867,
        mapToken: process.env.MAP_TOKENS});
};

module.exports.createListing=(async(req,res)=>{
const newlisting=new Listing(req.body.listing);
newlisting.owner=req.user._id;
newlisting.image = {
    url: req.file.path,
    filename: req.file.filename
};
await newlisting.save();
req.flash("success","New Listing Created");
res.redirect("/listings");
});

module.exports.renderEditform=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
};

module.exports.updateListing=async(req,res)=>{
    let{id}=req.params;
    // if(!req.body.listings){
    //     throw new ExpressError(404,"Send Valid Data");
    // }
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!=="undefined"){

        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
        await listing.save();
    }
        
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
};