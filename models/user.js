const mongoose =require("mongoose");
const userSchema = new mongoose.Schema({
      
      id: { type:String.INTEGER,autoIncrement: true,primaryKey: true },
      email : {type:String, required:true, trim:true },
      password : {type:String, required:true, trim:true },
      address : {type:String, required:true, trim:true },
      ville :{type:String, required:true, trim:true  },
      point : {type:String, required:true, trim:true  },
      telephone : {type:String, required:true, trim:true },
      name_prenom : {type:String, required:true, trim:true},
      email_verifie : {type:String, required:true, trim:true},
      role : {type:String, required:true, trim:true},
    });
    const userModel = mongoose.model("user", userSchema)
  
  export default userModel