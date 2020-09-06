const express=require('express');
const app=express();
const cors=require('cors');
const mongoose=require('mongoose');
const path=require('path');
const bodyParser=require('body-parser');

app.use(cors());
app.use(bodyParser.json());

const db=require('./config/connectDB').MongoURI;

mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log('connected'))
.catch(err=>console.log(err))

app.use('/api',require('./routes/api'));

if(process.env.NODE_ENV==='production'){
    app.use(express.static('client/build'));

    app.get('/',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`server started on ${PORT}`);
})
