const mongoose=require('mongoose');

const ImageSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    fileImage:{
        type: String,
        required: true
    },
    review:{
        type: String,
        required: true
    }
})

const Image=mongoose.model('Images',ImageSchema);

module.exports=Image;