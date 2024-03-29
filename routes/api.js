const express = require('express');
const router = express.Router();
const Image = require('../model/Images_model');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const uuid=require('uuid');

const storage = multer.diskStorage({
    destination: './client/src/images',
    filename: function (req, file, cb) {
        cb(null, 'beach-' + req.body.nameImg + uuid.v4() + path.extname(file.originalname));
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    }
})

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true)
    } else {
        return cb(null, false);
    }
}

const ImageData = JSON.parse(fs.readFileSync('./images.json', 'utf-8'));

router.post('/insertData',(req,res)=>{
    let listImage=[];
    ImageData.forEach(function(item){
        let itemToAddDB={
            name: item.name,
            fileImage: {
                data: fs.readFileSync('./client/src/images/'+item.fileImage),
                contentType: 'image/jpeg'
            },
            review: item.review
        }
        listImage.push(itemToAddDB);
    })

    Image.insertMany(listImage);
    
    res.send('insert data success');
})

router.get('/getData', async (req, res) => {
    let listImgData = await Image.find({});
    let listItemToShow=[];
    listImgData.forEach(function(item){
        let itemToShow={
            _id: item._id,
            name: item.name,
            fileImage:{
                imgData: Buffer.from(item.fileImage.data).toString('base64'),
                imgContentType: item.fileImage.contentType
            },
            review: item.review
        }
        listItemToShow.push(itemToShow);
    })
    res.json(listItemToShow);
})

router.delete('/removeAll', async (req, res) => {
    await Image.deleteMany({});
    res.send('removed');
})

router.post('/updateSpecifix/:id', upload.single('myImage'), async (req, res) => {
    let name = req.body.nameImg;
    let intro = req.body.introview;
    let id = req.params.id;
    let itemImage = {};
    if (req.file) {
        itemImage = {
            name: name,
            fileImage: {
                data: fs.readFileSync('./client/src/images/'+req.file.filename),
                contentType: 'images/jpeg'
            },
            review: intro
        }
    } else {
        itemImage = {
            name: name,
            review: intro
        }
    }

    if (itemImage.name != '' && itemImage.review != '' && id != undefined) {
        await Image.updateOne({ _id: id }, {
            $set: itemImage
        })
        return res.send(true)
    }else {
        return res.send(false);
    }
})

router.delete('/removeSpecifix/:id', async (req, res) => {
    await Image.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) })
    res.send(true);
})

router.post('/createNew',upload.single('myImage'),async (req,res)=>{
    let name = req.body.nameImg;
    let intro = req.body.introview;
    if (req.file && name != '' && intro != '') {
        let itemImage = {
            name: name,
            fileImage: {
                data:fs.readFileSync('./client/src/images/'+req.file.filename),
                contentType: 'images/jpeg'
            },
            review: intro
        }
        await Image.create(itemImage);
        return res.send(true)
    } else {
        return res.send(false);
    }
})

module.exports = router;