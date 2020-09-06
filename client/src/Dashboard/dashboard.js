import React, { useEffect, useState } from 'react';
import style from './dashboard.module.css';
import $ from 'jquery';
import axios from 'axios';

function Dashboard() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [renderView, setRenderView] = useState(true);
    const [updateData, setUpdateData] = useState(false);
    const [item, setItem] = useState(null);

    useEffect(() => {
        $('.view').click(function () {
            setRenderView(true);
        })

        $('.close').click(function () {
            $('#dashboard').hide(function () {
                $(this).off('click');
            });

            $('body').css('overflow', 'auto');
        })

        $('.btn_controlItemImg').click(function () {
            $('.btn_controlItemImg').removeAttr('style');
            $(this).css('background', '#ea1d63');
            setRenderView(false);
        })
    }, [])

    useEffect(() => {
        axios.get('/api/getData')
        .then( function (data) {
            localStorage.setItem('images', JSON.stringify(data));
            setImages(JSON.parse(localStorage.getItem('images')));
            setLoading(false)
        })
        .catch(function(){
            alert('loading data to dashboard fail');
        })

    }, [updateData])

    useEffect(() => {
        $(`.${style.itemImage}`).off('click').on('click', function () {
            let id = $(this).data('id');
            $(`.${style.activeItemImage}`).removeClass(`${style.activeItemImage}`);
            $(this).addClass(`${style.activeItemImage}`);
            setItem(searchSpecific(id));
            console.log(id);
        })

        $(`.${style.itemImage}:first-child`).click();
    }, [loading])

    useEffect(() => {
        if (item !== null) {
            $(`.${style.formInforImg} .${style.nameImg} input`).val(item.name);
            $(`.${style.formInforImg} .${style.introImg} textarea`).val(item.review);
        }
    }, [item])

    useEffect(() => {
        $('.new').click(function () {
            resetForm();
            $(`.${style.complete}`).off('click').on('click', function (evt) {
                evt.preventDefault();
                console.log('create click');
                let form = $(`.${style.formInforImg}`)[0];
                let formData = new FormData(form);

                $.ajax({
                    type: 'post',
                    encType: 'multipart/form-data',
                    url: `/api/createNew`,
                    data: formData,
                    processData: false,
                    contentType: false,
                    cache: false,
                    success: async function (data) {
                        if (data) {
                            setUpdateData(!updateData);
                            window.location.reload();
                        } else {
                            alert('Tao moi that bai!Vui long thu lai!');
                        }
                    }
                })
            })
        })

        $('.update').click(function () {
            $(`.${style.complete}`).off('click').on('click', function (evt) {
                evt.preventDefault();
                let form = $(`.${style.formInforImg}`)[0];
                let formData = new FormData(form);

                $.ajax({
                    type: "POST",
                    enctype: 'multipart/form-data',
                    url: `/api/updateSpecifix/${item._id}`,
                    data: formData,
                    processData: false,
                    contentType: false,
                    cache: false,
                    success: async function (data) {
                        if (data) {
                            setUpdateData(!updateData);
                            window.location.reload();
                        } else {
                            alert('Cap nhap that bai!Vui long thu lai!');
                        }
                    }
                })
            })
        })

        $('.delete').click(async function () {
            $(`.${style.complete}`).html('Delete');
            $(`.${style.complete}`).off('click').on('click', async function (evt) {
                evt.preventDefault();
                let removed = await $.ajax({
                    url: `/api/removeSpecifix/${item._id}`,
                    type: 'DELETE',
                })

                if (removed) {
                    setUpdateData(!updateData);
                    window.location.reload();
                } else {
                    alert('Xoa khong thanh cong!');
                }
            })
        })

    }, [renderView, item, updateData])

    function addEventForExpand() {
        $(`.${style.listItemImage}`).toggleClass(`${style.activeListImg}`);
        $('.expand').toggleClass(`${style.active}`);
    }

    function searchSpecific(id) {
        return JSON.parse(localStorage.getItem('images')).find(item => item._id === id);
    }

    function resetForm() {
        $(`.${style.formInforImg} .${style.nameImg} input`).val('');
        $(`.${style.formInforImg} .${style.introImg} textarea`).val('');
        $(`.${style.formInforImg} .${style.img}`).attr('src', require('../images/no-photo.svg'));
    }

    if (images === null) { return <h1>co loi</h1> }

    return (
        <section id="dashboard">
            <ul className={style.listItemImage}>
                {images.map((item, index) => {
                    return (<li key={index + 1} className={style.itemImage} data-id={item._id}>
                        <img src={require(`../images/${item.fileImage}`)} alt="beach"></img>
                        <span className={style.imgName}>{item.name}</span>
                    </li>
                    )
                })}
            </ul>
            <div className={style.contentDashboard}>
                {(renderView === true) ? <View item={item} /> : ''}
                {(renderView === false) ? <Form item={item} /> : ''}
            </div>
            <ul className={style.listBtns_control}>
                <li className={`${style.itemBnt_control} close`}>
                    <i className="fas fa-times"></i>
                    <span>close</span>
                </li>
                <li className={`${style.itemBnt_control} view`}>
                    <i className="fas fa-eye"></i>
                    <span>view</span>
                </li>
                <li className={`${style.itemBnt_control} btn_controlItemImg new`}>
                    <i className="fas fa-plus"></i>
                    <span>new</span>
                </li>
                <li className={`${style.itemBnt_control} btn_controlItemImg update`}>
                    <i className="fas fa-tools"></i>
                    <span>update</span>
                </li>
                <li className={`${style.itemBnt_control} btn_controlItemImg delete`}>
                    <i className="fas fa-trash-alt"></i>
                    <span>delete</span>
                </li>
                <li className={`${style.itemBnt_control} expand`} onClick={() => addEventForExpand()}>
                    <i className="fas fa-expand"></i>
                    <span>expand</span>
                </li>
            </ul>
        </section>
    )
}

export function View({ item }) {

    if (item !== null) {
        return (
            <div className={style.view}>
                <div>
                    <span>Name:</span>
                    <span>{item.name}</span>
                </div>
                <div>
                    <span>Image:</span>
                    <img src={require(`../images/${item.fileImage}`)} alt="img"></img>
                </div>
                <div>
                    <span>Intro:</span>
                    <p>{item.review}</p>
                </div>
            </div>
        )
    } else {
        return (<h1>co loi</h1>)
    }
}

export function Err({ msg }) {
    return (
        <h1 className={style.err}>{msg}</h1>
    )
}

export function Form({ item }) {
    useEffect(() => {
        return () => {
            $('#dashboard').off('click');
        }
    }, [])

    function renderImageFile(event) {
        let selectedFile = event.target.files[0];
        let reader = new FileReader();

        let imgtag = $(`.${style.img}`);
        reader.onload = function (event) {
            imgtag.attr('src', `${event.target.result}`)
        }

        reader.readAsDataURL(selectedFile);
    }

    if (item !== undefined) {
        return (
            <form className={style.formInforImg} encType="multipart/form-data">
                <div className={style.nameImg}>
                    <label>Name: </label>
                    <input type="text" name="nameImg" placeholder="Name image" autoComplete="off" defaultValue={item.name}></input>
                </div>
                <div className={style.choseFileImg}>
                    <label>Chose file image: </label>
                    <input type="file" name="myImage" onChange={(evt => renderImageFile(evt))}></input>
                </div>
                <div>
                    <label></label>
                    <img src={require(`../images/${item.fileImage}`)} className={style.img} alt="img"></img>
                </div>
                <div className={style.introImg}>
                    <label>Intro image: </label>
                    <textarea name="introview" defaultValue={item.review}></textarea>
                </div>
                <button type="button" className={style.complete}>Complete</button>
            </form>
        )
    } else {
        return (<h1>undefined</h1>)
    }

}

export default React.memo(Dashboard);