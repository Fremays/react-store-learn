import React, {useEffect, useState} from 'react';
import {useTypedSelector} from "../hooks/useTypedSelector";
import {useActions} from "../hooks/useActions";
import {NavLink, useParams} from "react-router-dom";
import css from "./ProductItem.module.css"
import mass from "../../assets/images/mass.svg";
import volume from "../../assets/images/volume.svg";
import {useMediaQuery} from "usehooks-ts";

const ProductItem = () => {
    const {products, error, loading} = useTypedSelector(state => state.product)
    const {local} = useTypedSelector(state => state.local)
    const {fetchProducts, fetchLocal} = useActions()
    const params = useParams()

    let product = products.filter(id => id.barcode == params.id)

    const [quantityToBuy, setQuantity] = useState(1)

    useEffect(() => {
        fetchProducts("name", "asc")
    }, [])

    function addItem() {
        setQuantity(quantityToBuy + 1)
    }

    //Показ и скрытие описания и характерстик на мобильной версии
    const [showDescription, setShowDescription] = useState(false);
    const toggleDescription = () => {
        setShowDescription(!showDescription);
    }
    const [showChara, setShowChara] = useState(false);
    const toggleChara = () => {
        setShowChara(!showChara);
    }

    function removeItem() {
        if (quantityToBuy <= 0) {
            return
        }
        setQuantity(quantityToBuy - 1)
    }

    // Функция добавления в корзину
    function addToCart(evt: { preventDefault: () => void; }) {
        let result: any = {}
        if (typeof local === "string") {
            result = JSON.parse(local)
        }
        for (let i = 0; i < quantityToBuy; i++) {
            if (!result) {
                result = [product[0].barcode]
            } else {
                result = [...result, product[0].barcode]
            }
        }
        localStorage.setItem('products', JSON.stringify(result))
        fetchLocal()

        setQuantity(1)
        evt.preventDefault()
    }

    const phone = useMediaQuery('(max-width:959px)');

    if (loading) {
        return <h1>Идет загрузка...</h1>
    }
    if (error) {
        return <h1>{error}</h1>
    }
    return (
        <div>
            {phone?
                (
                    <div className={css.container}>
                        <div className={css.top}>
                            <p>
                                <NavLink to={'/catalog/'}>
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <rect opacity="0.3" width="32" height="32" rx="16" fill="#FFCA65"/>
                                        <path d="M17 12L13 16L17 20" stroke="#3F4E65"/>
                                    </svg>

                                    <span>Назад</span>
                                </NavLink>
                            </p>
                        </div>
                        <div className={css.product}>
                            <div className={css.image}>
                                <img src={product[0]?.images}/>
                            </div>
                            <div className={css.description}>
                                <p className={css.description__stock}>В наличии</p>
                                <p className={css.description__title}><b>{product[0]?.brand}</b> {product[0]?.title}</p>

                                <div className={css.description__buying}>
                                    <p>{(parseFloat(product[0]?.price.replace(/[^0-9.,]+/g, "").replace(",", ".")) * quantityToBuy).toFixed(2)
                                        + product[0]?.price.substr(-1)}</p>
                                    <div>
                                        <button onClick={removeItem}>-</button>
                                        <span>{quantityToBuy}</span>
                                        <button onClick={addItem}>+</button>
                                    </div>

                                </div>
                                <div className={css.description__more}>
                                    <a href="#" onClick={addToCart}>В корзину
                                        <svg width="24" height="23" viewBox="0 0 24 23" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M21.3257 6.89296C21.1958 6.71151 21.0215 6.62079 20.8027 6.62079H6.87793L6.5 5.63689C6.4043 5.31431 6.27441 5.03877 6.11035 4.81028C5.94629 4.58178 5.77197 4.42049 5.5874 4.32641C5.40283 4.23232 5.24219 4.16848 5.10547 4.13488C4.96875 4.10127 4.83203 4.08447 4.69531 4.08447H1.88574C1.70801 4.08447 1.55762 4.14496 1.43457 4.26592C1.31152 4.38689 1.25 4.54146 1.25 4.72963C1.25 4.83716 1.27734 4.94133 1.33203 5.04213C1.38672 5.14294 1.46533 5.22023 1.56787 5.27399C1.67041 5.32775 1.77637 5.35463 1.88574 5.35463H4.69531C4.75 5.35463 4.80127 5.36135 4.84912 5.3748C4.89697 5.38824 4.96191 5.44536 5.04395 5.54617C5.12598 5.64697 5.19434 5.79818 5.24902 5.9998L8.19043 14.0764C8.21777 14.1571 8.26221 14.2343 8.32373 14.3083C8.38525 14.3822 8.45703 14.4393 8.53906 14.4796C8.62109 14.52 8.70996 14.5401 8.80566 14.5401H17.665C17.8018 14.5401 17.9282 14.4998 18.0444 14.4191C18.1606 14.3385 18.2393 14.2377 18.2803 14.1167L21.418 7.48772C21.4863 7.27267 21.4556 7.07442 21.3257 6.89296ZM17.2139 13.2498H9.31836L7.22656 7.91111H19.8594L17.2139 13.2498ZM16.0312 15.2398C15.5801 15.2398 15.1938 15.3977 14.8726 15.7136C14.5513 16.0294 14.3906 16.4092 14.3906 16.8527C14.3906 17.2963 14.5513 17.676 14.8726 17.9918C15.1938 18.3077 15.5801 18.4656 16.0312 18.4656C16.4824 18.4656 16.8687 18.3077 17.1899 17.9918C17.5112 17.676 17.6719 17.2963 17.6719 16.8527C17.6719 16.4092 17.5112 16.0294 17.1899 15.7136C16.8687 15.3977 16.4824 15.2398 16.0312 15.2398ZM10.125 15.2398C9.82422 15.2398 9.54736 15.3137 9.29443 15.4616C9.0415 15.6094 8.84326 15.8043 8.69971 16.0463C8.55615 16.2882 8.48438 16.557 8.48438 16.8527C8.48438 17.2963 8.64502 17.676 8.96631 17.9918C9.2876 18.3077 9.67383 18.4656 10.125 18.4656C10.5762 18.4656 10.9624 18.3077 11.2837 17.9918C11.605 17.676 11.7656 17.2963 11.7656 16.8527C11.7656 16.7452 11.7554 16.6377 11.7349 16.5301C11.7144 16.4226 11.6836 16.3218 11.6426 16.2277C11.6016 16.1336 11.5503 16.0429 11.4888 15.9555C11.4272 15.8682 11.3589 15.7875 11.2837 15.7136C11.2085 15.6397 11.1265 15.5725 11.0376 15.512C10.9487 15.4515 10.8564 15.4011 10.7607 15.3608C10.665 15.3204 10.5625 15.2902 10.4531 15.27C10.3438 15.2499 10.2344 15.2398 10.125 15.2398Z"
                                                fill="white"/>
                                        </svg>
                                    </a>
                                    <div className={css.more__share}>
                                        <svg width="20" height="21" viewBox="0 0 20 21" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M4.00004 13.5C4.87469 13.4974 5.71626 13.1653 6.35704 12.57L12.617 16.147C12.4073 16.9666 12.4998 17.8343 12.8775 18.5913C13.2552 19.3483 13.893 19.9439 14.674 20.2692C15.455 20.5944 16.327 20.6274 17.1304 20.3623C17.9338 20.0971 18.6148 19.5515 19.0488 18.8252C19.4827 18.099 19.6406 17.2408 19.4935 16.4076C19.3464 15.5745 18.9042 14.8222 18.2478 14.2885C17.5914 13.7548 16.7647 13.4753 15.919 13.5013C15.0734 13.5273 14.2655 13.857 13.643 14.43L7.38304 10.853C7.44904 10.603 7.48504 10.344 7.49104 10.085L13.641 6.56996C14.2332 7.10874 14.9927 7.42747 15.792 7.47268C16.5913 7.51789 17.3818 7.28684 18.031 6.81828C18.6802 6.34972 19.1484 5.67217 19.3572 4.89929C19.5661 4.1264 19.5027 3.30522 19.1779 2.5735C18.853 1.84178 18.2864 1.24404 17.5731 0.88056C16.8597 0.517083 16.0431 0.409982 15.2602 0.577226C14.4772 0.744469 13.7756 1.17588 13.2731 1.79909C12.7705 2.42229 12.4976 3.19937 12.5 3.99996C12.504 4.28796 12.543 4.57496 12.617 4.85296L6.93304 8.09997C6.60341 7.59003 6.1468 7.17461 5.60805 6.89454C5.06931 6.61446 4.46697 6.47937 3.86021 6.50251C3.25346 6.52566 2.66316 6.70627 2.14732 7.02658C1.63148 7.34689 1.20785 7.79589 0.918041 8.32946C0.628232 8.86303 0.48222 9.46282 0.494351 10.0699C0.506482 10.677 0.676338 11.2704 0.98723 11.792C1.29812 12.3136 1.73936 12.7453 2.26758 13.0447C2.7958 13.3442 3.39284 13.5011 4.00004 13.5V13.5Z"
                                                fill="#FFC85E"/>
                                        </svg>
                                    </div>

                                </div>
                                <div className={css.more__promo}>
                                    <span>При покупке от 10 000 ₸ бесплатная доставка по Кокчетаву и области</span>
                                </div>
                                <div className={css.more__list}>
                                    <a href="#">Прайс-лист
                                        <svg width="18" height="17" viewBox="0 0 18 17" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M13.958 6.375H11.1247V2.125H6.87467V6.375H4.04134L8.99967 12.0417L13.958 6.375ZM3.33301 13.4583H14.6663V14.875H3.33301V13.4583Z"
                                                fill="#3F4E65"/>
                                        </svg>
                                    </a>
                                </div>
                                <div className={css.description__barcode}>
                                    Производитель: <b>{product[0]?.manufacturer}</b> <br/>
                                    Бренд: <b>{product[0]?.brand}</b> <br/>
                                    Артикул: <b>4604049097548</b> <br/>
                                    Штрихкод: <b>{product[0]?.barcode}</b> <br/>
                                    Вес: <b>{product[0]?.size}</b> <br/>
                                    Объем: <b>{product[0]?.size}</b> <br/>
                                    Кол-во в коробке: <b>{product[0]?.size}</b>
                                </div>
                                <div onClick={toggleDescription} className={css.description__description}><span>Описание</span>
                                    <svg onClick={toggleDescription} width="7" height="6" viewBox="0 0 7 6" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.5 0L6.53109 5.25L0.468911 5.25L3.5 0Z" fill="#3F4E65"/>
                                    </svg>
                                    {showDescription && <p className={css.description__description_main}>{product[0]?.description}</p>}
                                </div>
                                <div className={css.description__feature}>
                                    <p onClick={toggleChara} className={css.description__feature_title}>Характеристики
                                        <svg onClick={toggleChara} width="7" height="6"
                                                                                                      viewBox="0 0 7 6"
                                                                                                      fill="none"
                                                                                                      xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.5 0L6.53109 5.25L0.468911 5.25L3.5 0Z" fill="#3F4E65"/>
                                    </svg>
                                    </p>
                                    {showChara &&<p className={css.description__feature_more}>
                                        Назначение: <b>{product[0]?.brand}</b> <br/>
                                        Тип: <b>{product[0]?.brand}</b> <br/>
                                        Производитель: <b>{product[0]?.manufacturer}</b> <br/>
                                        Бренд: <b>{product[0]?.brand}</b> <br/>
                                        Артикул: <b>4604049097548</b> <br/>
                                        Штрихкод: <b>{product[0]?.barcode}</b> <br/>
                                        Вес: <b>{product[0]?.size}</b> <br/>
                                        Объем: <b>{product[0]?.size}</b> <br/>
                                        Кол-во в коробке: <b>{product[0]?.size}</b> <br/>
                                    </p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            :
                    (
                <div className={css.container}>
                    <div className={css.breadcrumbs}>
                        <p>Главная
                            <NavLink to={'/products/'}>
                                Каталог
                            </NavLink>
                            <span>{product[0]?.title}</span></p>
                    </div>
                    <div className={css.product}>
                        <div className={css.image}>
                            <img src={product[0]?.images}/>
                        </div>
                        <div className={css.description}>
                            <p className={css.description__stock}>В наличии</p>
                            <p className={css.description__title}><b>{product[0]?.brand}</b> {product[0]?.title}</p>
                            <div>
                                <img src={product[0]?.size_type == "mass" ? mass : volume}/>
                                <p className={css.description__size}>{product[0]?.size}</p>
                            </div>
                            <div className={css.description__buying}>
                                <p>{(parseFloat(product[0]?.price.replace(/[^0-9.,]+/g, "").replace(",", ".")) * quantityToBuy).toFixed(2)
                                    + product[0]?.price.substr(-1)}</p>
                                <div>
                                    <button onClick={removeItem}>-</button>
                                    <span>{quantityToBuy}</span>
                                    <button onClick={addItem}>+</button>
                                </div>
                                <a href="#" onClick={addToCart}>В корзину
                                    <svg width="24" height="23" viewBox="0 0 24 23" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M21.3257 6.89296C21.1958 6.71151 21.0215 6.62079 20.8027 6.62079H6.87793L6.5 5.63689C6.4043 5.31431 6.27441 5.03877 6.11035 4.81028C5.94629 4.58178 5.77197 4.42049 5.5874 4.32641C5.40283 4.23232 5.24219 4.16848 5.10547 4.13488C4.96875 4.10127 4.83203 4.08447 4.69531 4.08447H1.88574C1.70801 4.08447 1.55762 4.14496 1.43457 4.26592C1.31152 4.38689 1.25 4.54146 1.25 4.72963C1.25 4.83716 1.27734 4.94133 1.33203 5.04213C1.38672 5.14294 1.46533 5.22023 1.56787 5.27399C1.67041 5.32775 1.77637 5.35463 1.88574 5.35463H4.69531C4.75 5.35463 4.80127 5.36135 4.84912 5.3748C4.89697 5.38824 4.96191 5.44536 5.04395 5.54617C5.12598 5.64697 5.19434 5.79818 5.24902 5.9998L8.19043 14.0764C8.21777 14.1571 8.26221 14.2343 8.32373 14.3083C8.38525 14.3822 8.45703 14.4393 8.53906 14.4796C8.62109 14.52 8.70996 14.5401 8.80566 14.5401H17.665C17.8018 14.5401 17.9282 14.4998 18.0444 14.4191C18.1606 14.3385 18.2393 14.2377 18.2803 14.1167L21.418 7.48772C21.4863 7.27267 21.4556 7.07442 21.3257 6.89296ZM17.2139 13.2498H9.31836L7.22656 7.91111H19.8594L17.2139 13.2498ZM16.0312 15.2398C15.5801 15.2398 15.1938 15.3977 14.8726 15.7136C14.5513 16.0294 14.3906 16.4092 14.3906 16.8527C14.3906 17.2963 14.5513 17.676 14.8726 17.9918C15.1938 18.3077 15.5801 18.4656 16.0312 18.4656C16.4824 18.4656 16.8687 18.3077 17.1899 17.9918C17.5112 17.676 17.6719 17.2963 17.6719 16.8527C17.6719 16.4092 17.5112 16.0294 17.1899 15.7136C16.8687 15.3977 16.4824 15.2398 16.0312 15.2398ZM10.125 15.2398C9.82422 15.2398 9.54736 15.3137 9.29443 15.4616C9.0415 15.6094 8.84326 15.8043 8.69971 16.0463C8.55615 16.2882 8.48438 16.557 8.48438 16.8527C8.48438 17.2963 8.64502 17.676 8.96631 17.9918C9.2876 18.3077 9.67383 18.4656 10.125 18.4656C10.5762 18.4656 10.9624 18.3077 11.2837 17.9918C11.605 17.676 11.7656 17.2963 11.7656 16.8527C11.7656 16.7452 11.7554 16.6377 11.7349 16.5301C11.7144 16.4226 11.6836 16.3218 11.6426 16.2277C11.6016 16.1336 11.5503 16.0429 11.4888 15.9555C11.4272 15.8682 11.3589 15.7875 11.2837 15.7136C11.2085 15.6397 11.1265 15.5725 11.0376 15.512C10.9487 15.4515 10.8564 15.4011 10.7607 15.3608C10.665 15.3204 10.5625 15.2902 10.4531 15.27C10.3438 15.2499 10.2344 15.2398 10.125 15.2398Z"
                                            fill="white"/>
                                    </svg>
                                </a>
                            </div>
                            <div className={css.description__more}>
                                <div className={css.more__share}>
                                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M4.00004 13.5C4.87469 13.4974 5.71626 13.1653 6.35704 12.57L12.617 16.147C12.4073 16.9666 12.4998 17.8343 12.8775 18.5913C13.2552 19.3483 13.893 19.9439 14.674 20.2692C15.455 20.5944 16.327 20.6274 17.1304 20.3623C17.9338 20.0971 18.6148 19.5515 19.0488 18.8252C19.4827 18.099 19.6406 17.2408 19.4935 16.4076C19.3464 15.5745 18.9042 14.8222 18.2478 14.2885C17.5914 13.7548 16.7647 13.4753 15.919 13.5013C15.0734 13.5273 14.2655 13.857 13.643 14.43L7.38304 10.853C7.44904 10.603 7.48504 10.344 7.49104 10.085L13.641 6.56996C14.2332 7.10874 14.9927 7.42747 15.792 7.47268C16.5913 7.51789 17.3818 7.28684 18.031 6.81828C18.6802 6.34972 19.1484 5.67217 19.3572 4.89929C19.5661 4.1264 19.5027 3.30522 19.1779 2.5735C18.853 1.84178 18.2864 1.24404 17.5731 0.88056C16.8597 0.517083 16.0431 0.409982 15.2602 0.577226C14.4772 0.744469 13.7756 1.17588 13.2731 1.79909C12.7705 2.42229 12.4976 3.19937 12.5 3.99996C12.504 4.28796 12.543 4.57496 12.617 4.85296L6.93304 8.09997C6.60341 7.59003 6.1468 7.17461 5.60805 6.89454C5.06931 6.61446 4.46697 6.47937 3.86021 6.50251C3.25346 6.52566 2.66316 6.70627 2.14732 7.02658C1.63148 7.34689 1.20785 7.79589 0.918041 8.32946C0.628232 8.86303 0.48222 9.46282 0.494351 10.0699C0.506482 10.677 0.676338 11.2704 0.98723 11.792C1.29812 12.3136 1.73936 12.7453 2.26758 13.0447C2.7958 13.3442 3.39284 13.5011 4.00004 13.5V13.5Z"
                                            fill="#FFC85E"/>
                                    </svg>
                                </div>
                                <div className={css.more__promo}>
                                    <span>При покупке от 10 000 ₸ бесплатная доставка по Кокчетаву и области</span>
                                </div>
                                <div className={css.more__list}>
                                    <a href="#">Прайс-лист
                                        <svg width="18" height="17" viewBox="0 0 18 17" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M13.958 6.375H11.1247V2.125H6.87467V6.375H4.04134L8.99967 12.0417L13.958 6.375ZM3.33301 13.4583H14.6663V14.875H3.33301V13.4583Z"
                                                fill="#3F4E65"/>
                                        </svg>
                                    </a></div>
                            </div>
                            <p className={css.description__barcode}>
                                Производитель: <b>{product[0]?.manufacturer}</b><br/>
                                Бренд: <b>{product[0]?.brand}</b><br/>
                                Артикул:: <b>460404</b><br/>
                                Штрихкод: <b>{product[0]?.barcode}</b>
                            </p>
                            <div className={css.description__description}><span>Описание</span>
                                <svg width="7" height="6" viewBox="0 0 7 6" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.5 0L6.53109 5.25L0.468911 5.25L3.5 0Z" fill="#3F4E65"/>
                                </svg>
                                <p className={css.description__description_main}>{product[0]?.description}</p>
                            </div>

                            <div className={css.description__feature}>
                                <p className={css.description__feature_title}>Характеристики <svg width="7" height="6"
                                                                                                  viewBox="0 0 7 6"
                                                                                                  fill="none"
                                                                                                  xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.5 0L6.53109 5.25L0.468911 5.25L3.5 0Z" fill="#3F4E65"/>
                                </svg>
                                </p>
                                <p className={css.description__feature_more}>
                                    Назначение: <b>{product[0]?.brand}</b> <br/>
                                    Тип: <b>{product[0]?.brand}</b> <br/>
                                    Производитель: <b>{product[0]?.manufacturer}</b> <br/>
                                    Бренд: <b>{product[0]?.brand}</b> <br/>
                                    Артикул: <b>4604049097548</b> <br/>
                                    Штрихкод: <b>{product[0]?.barcode}</b> <br/>
                                    Вес: <b>{product[0]?.size}</b> <br/>
                                    Объем: <b>{product[0]?.size}</b> <br/>
                                    Кол-во в коробке: <b>{product[0]?.size}</b> <br/>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                )}
        </div>
    );
};

export default ProductItem;

// const initialState = {
//     items: JSON.parse(window.localStorage.getItem('some-key') || '[]'),
//     // ...
// }
// // ...
//
// // в компоненте App, или где доступен redux store, самый верх..
// // каждый раз когда изменились state.cart.items - сохраняем их в localStorage...
// React.useEffect(() => {
//     window.localStorage.saveItem('some-key', JSON.stringify(state.cart.items));
// }, [state.cart.items]);