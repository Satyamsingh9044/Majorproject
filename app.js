if(process.env.NODE_ENV!="production"){
    require('dotenv').config()
}


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const users=require("./routes/user.js");
const session=require("express-session");
const MongoStore = require("connect-mongo").default;
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
// console.log(MongoStore);
const dbUrl=process.env.ATLAS_URL;

main()
.then(()=>{
    console.log("Database Connected")
})
.catch(err => console.log(err));

async function main(){
    await mongoose.connect(dbUrl);
}


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);


const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRETE,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
})

const sessionOptions={
    store,
    secret:process.env.SECRETE,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    },
};



// app.get("/",(req,res)=>{
//     res.send("i am root");
// })

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
res.locals.success=req.flash("success");
res.locals.error = req.flash("error");
res.locals.currUser=req.user;
next(); 
});

// app.get("/demouser",async(req,res)=>{
//     let fakeuser=new User({
//         email:"student@gmail.com",
//         username:"delta-student",
//     });
//     let registerduser= await User.register(fakeuser,"helloworld");
//     res.send(registerduser);
// })


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews)
app.use("/",users)


app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err,req,res,next)=>{
    let{statusCode,message}=err;
    res.render("error.ejs",{err});
})

app.listen(3000,()=>{
    console.log("server is running at port 3000");
})