import React, { useEffect } from 'react';
import style from './imageView.module.css';
import $ from 'jquery';

function ImageView({ setImage, image }) {

    useEffect(() => {
        $('#close').click(function () {
            setImage(undefined);
        })

        $('#imageView').click(function(evt){
            if($(evt.target).is($(this))){
                setImage(undefined);
            }
        })

        $('#back').click(function(){
            let index=findIndexOfImage(image);
            let img=findImage(index-1);
            setImage(img);
        })

        $('#next').click(function(){
            let index=findIndexOfImage(image);
            let img=findImage(index+1);
            setImage(img);
        })
    }, [image])

    function findIndexOfImage(image){
        return JSON.parse(localStorage.getItem('images')).findIndex((item)=>image._id===item._id);
    }

    function findImage(index){
        return JSON.parse(localStorage.getItem('images'))[index];
    }

    return (
        <main id="imageView">
            <section className={style.contentView}>
                <div className={style.imageShow}>
                    <img src={`data:${image.fileImage.imgContentType};base64,${image.fileImage.imgData}`} alt="img"></img>
                    <div className={style.btns_controlView}>
                        <button id="back"><img src={require('../images/back.svg')} alt="back"></img></button>
                        <button id="close"><img src={require('../images/close.svg')} alt="close"></img></button>
                        <button id="next"><img src={require('../images/next.svg')} alt="next"></img></button>
                    </div>
                </div>
                <div className={style.imageInfor}>
                    <h1>Name: <span className={style.nameImgView}>{image.name}</span></h1>
                    <p>{image.review}</p>
                </div>
            </section>
        </main>
    )
}

export default React.memo(ImageView);