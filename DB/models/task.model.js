import mongoose, { model, Schema } from "mongoose";

const taskSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:['Text','List'],
        required:true
    },
    text:{
        type:String,
        required: function() { return this.type === 'Text'; }
    },
    items:{
        type:[String],
        required:function(){return this.type === 'List'}
    },
    isShared:{
        type:Boolean,
        default:false
    },
    categoryId:{
        type:Schema.ObjectId(),
        ref:'Category',
        required:true
    },
    userId:{
        type:Schema.ObjectId(),
        ref:'User',
        required:true
    }
},{
    timestamps:true
})

export const taskModel = new model('Task',taskSchema)