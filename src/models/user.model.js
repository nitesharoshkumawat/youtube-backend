import mongoose ,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    eamil:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true,

    },
    avatar:{
        type: String, // cloludinary url to use the saved in sepreate file
        required: true,

    },
    coverImage:{
        type: String,
        
    },
    watchHistory : [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password:{
        type : String,
        required: [true, "password is required"],
    },

    refreshToken:{
        type: String,

    }
},
{   
    timestamps: true
});

userSchema.pre("save", function(next){
     if(this.isModified("password")) return next();
     this.password = bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function(){
  return jwt.sign({
    _id: this._id,
    eamil: this.eamil,
    username: this.username,
    fullName: this.fullName
   },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
   )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id: this._id,

       },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRT
        }
       )
    };

export const User = mongoose.model("User", userSchema);