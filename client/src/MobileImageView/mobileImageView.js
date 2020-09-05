import React, { useEffect } from 'react';
import style from './mobileImageView.module.css';
import $ from 'jquery';

function MobileView({ setImage, image }) {

    useEffect(() => {
        $(`.${style.close}`).click(function (evt) {
            setImage(undefined);
        })

        $(`.${style.back}`).click(function(){
            let index=findIndexOfImage(image);
            let img=findImage(index-1);
            setImage(img);
        })

        $(`.${style.next}`).click(function(){
            let index=findIndexOfImage(image);
            let img=findImage(index+1);
            setImage(img);
        })

    }, [image])

    function findIndexOfImage(image) {
        return JSON.parse(localStorage.getItem('images')).findIndex((item) => image._id === item._id);
    }

    function findImage(index) {
        return JSON.parse(localStorage.getItem('images'))[index];
    }

    return (
        <section className={style.container}>
            <div className={style.view} >
                <img src={require(`../images/${image.fileImage}`)} alt="img"></img>
                <div className={style.contentImage}>
                    <h1>Name: {image.name}</h1>
                    <p>{image.review}</p>
                </div>
                <div className={style.btns_control}>
                    <button className={style.back}><img src={require('../images/back.svg')} alt="back"></img></button>
                    <button className={style.close}><img src={require('../images/close.svg')} alt="close"></img></button>
                    <button className={style.next}><img src={require('../images/next.svg')} alt="close"></img></button>
                </div>
                <button className={style.down}><img src={require('../images/down-arrow.svg')} alt="drop"></img></button>
            </div>
        </section>
    )
}

export default React.memo(MobileView);