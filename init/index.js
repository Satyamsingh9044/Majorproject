const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

main()
.then(()=>{
    console.log("Database Connected")
})
.catch(err => console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust");
}


const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:'6a05379147e21c182248a361'}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}
initDB();