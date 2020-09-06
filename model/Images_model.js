const mongoose=require('mongoose');

const ImageSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    fileImage:{
        data: Buffer,
        contentType: String
    },
    review:{
        type: String,
        required: true
    }
})

const Image=mongoose.model('Images',ImageSchema);

module.exports=Image;