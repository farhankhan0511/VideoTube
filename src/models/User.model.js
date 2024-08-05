import mongoose,{Schema} from "mongoose";

import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"






const UserSchema=new Schema({
    username:{
        type:String,
        unique:true,
        lowercase:true,
        required:true,
        index:true,
        trim:true
    }
    ,email:{
        type:String,
        unique:true,
        lowercase:true,
        required:true,
        
        trim:true
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,
        required:true
    },
    coverimage:{
        type:String,

    },
    watchHistory:[
        {type:Schema.Types.ObjectId,
            ref:"Video"
        }
        
    ],
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    refreshToken:{
        type:String
    }
},{
    timestamps:true
})

UserSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next()
    this.password=bcrypt.hash(this.password,10);
    next()
})

UserSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}

UserSchema.methods.generateAccessToken()=function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,

    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

UserSchema.methods.generateRefershToken()=function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}

export const User=mongoose.model("User",UserSchema)