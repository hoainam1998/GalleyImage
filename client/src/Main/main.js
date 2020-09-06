import React, { useEffect, useState } from 'react';
import style from './main.module.css';
import $ from 'jquery';
import View from '../ImageView/imageView';
import MobileView from '../MobileImageView/mobileImageView';

function Main() {

    const [listData, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState(undefined)

    useEffect(() => {
        $('#darkmode').change(function () {
            if (this.checked) {
                $('body').css('background', '#1e272e');
                $(`.${style.title}`).css('color', 'white');
                $(`.${style.btn_option}`).css('color', 'white');
            } else {
                $('body').css('background', '');
                $(`.${style.title}`).removeAttr('style');
                $(`.${style.btn_option}`).removeAttr('style');
            }
        })

        $(`.${style.btn_option}`).click(function () {
            $('#dashboard').show(function () {
                $('body').css('overflow', 'hidden');
            });
        })

        $.get('/api/getData', function (data) {
            localStorage.setItem('images', JSON.stringify(data));
            setData(JSON.parse(localStorage.getItem('images')));
            setLoading(false);
        });

        console.log('useEffect fetch data');

    }, [])

    useEffect(() => {
        console.log('call use Effect');
        $(`.click`).click(function () {
            let id = $(this).data('id');
            setImage(getSpecificImage(id));
        })
    }, [loading])

    function getSpecificImage(id) {
        return JSON.parse(localStorage.getItem('images')).find(item => item._id === id);
    }

    if(listData.length===0||listData===undefined){
        return (<h1>Loading...</h1>)
    }
    return (
        <main className={style.contentMain}>
            <h1 className={style.myCollection}>My Collection Images</h1>
            <p className={style.title}>Curabitur aliquet quam id dui posuere blandit.
            Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui.</p>
            <ul className={style.listImages}>
                {listData.map((item, index) => {
                    return <li key={index + 1} data-id={item._id} className={`${style.itemImage} click`}><img src={require(`../images/${item.fileImage}`)} alt="img"></img></li>
                })}
            </ul>
            <button className={style.btn_option}><i className="fas fa-ellipsis-v"></i></button>
            <label className={style.switch}>
                <input type="checkbox" id="darkmode"></input>
                <span className={style.slider}></span>
            </label>
            {image && <View setImage={setImage} image={image} />}
            {image && <MobileView setImage={setImage} image={image} />}
        </main>
    )
}

export default React.memo(Main);