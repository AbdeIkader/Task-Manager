import mongoose, { model, Schema } from "mongoose";



const categorySchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    userId:{
        type:Schema.ObjectId,
        ref:'User'
    }
},{
    timestamps:true
})

export const categoryModel = new model('Category',categorySchema)