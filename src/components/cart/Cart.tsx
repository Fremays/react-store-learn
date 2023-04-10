import React, {useEffect, useState} from 'react';
import {useTypedSelector} from "../hooks/useTypedSelector";
import {useActions} from "../hooks/useActions";
import css from "./Cart.module.css";
import mass from "../../assets/images/mass.svg";
import volume from "../../assets/images/volume.svg";
import {useMediaQuery} from "usehooks-ts";
import {NavLink} from "react-router-dom";


const Cart = () => {
        const {products, error, loading} = useTypedSelector(state => state.product)
        const {local} = useTypedSelector(state => state.local)
        const {fetchProducts, fetchLocal} = useActions()

        let localCart: any = []
        let uniqueProducts: any = {}
        let productsInCart: any[]
        let repeatProd: any
        let result = [];
        if (typeof local === "string") {
            localCart = JSON.parse(local)
        }
        // Уникальные штрихкоды продуктов в корзине
        uniqueProducts = Object.values(localCart).filter((elem: any, index: any) => {
            return localCart.indexOf(elem) === index;
        });
        //Продукты в корзине
        productsInCart = products.filter((item) => uniqueProducts.includes(item.barcode));

        // Количество каждого товара в корзине
        const [quantity, setQuantity] = useState([])

        useEffect(() => {
            fetchProducts("name", "asc")
        }, [])

    //Количество товаров в корзине для useEffect'a

        function addItem(barcode: string) {
            result = [...localCart, barcode];
            repeatProd = localCart.reduce((acc: { [x: string]: any; }, val: string | number) => {
                acc[val] = (acc[val] || 0) + 1;
                return acc;
            }, {})
            setQuantity(repeatProd)
            localStorage.setItem('products', JSON.stringify(result))
        }

        function removeItem(barcode: string) {
            let index = localCart.indexOf(barcode);
            if (index > -1) {
                localCart.splice(index, 1);
            }
            result = [...localCart]
            repeatProd = localCart.reduce((acc: { [x: string]: any; }, val: string | number) => {
                acc[val] = (acc[val] || 0) + 1;
                return acc;
            }, {})
            setQuantity(repeatProd)
            localStorage.setItem('products', JSON.stringify(result))
        }

        function deleteItem(barcode: string) {
            let i = 0
            while (i < localCart.length) {
                if (localCart[i] === barcode) {
                    localCart.splice(i, 1);
                } else {
                    ++i;
                }
            }
            result = [...localCart]
            repeatProd = localCart.reduce((acc: { [x: string]: any; }, val: string | number) => {
                acc[val] = (acc[val] || 0) + 1;
                return acc;
            }, {})
            setQuantity(repeatProd)
            localStorage.setItem('products', JSON.stringify(result))
        }

        function makeOrder(evt: { preventDefault: () => void; }) {
            localStorage.removeItem('products')
            alert("Спасибо за заказ!")
            fetchLocal()
            evt.preventDefault()
        }

        // Получение общей стоимости товаров
        let totalPrice = 0;
        for (const barcode in quantity) {
            const quantities = quantity[barcode];
            const product = products.find(p => p.barcode === barcode);
            if (product) {
                totalPrice += parseFloat(product.price.replace(",", ".")) * quantities;
            }
        }

        useEffect(() => {
            let timeoutId: ReturnType<typeof setTimeout> | null = null;
            if (localCart) {
                const repeatProd = localCart.reduce((acc: { [x: string]: any; }, val: string | number) => {
                    acc[val] = (acc[val] || 0) + 1;
                    return acc;
                }, {});

                if (timeoutId) {
                    clearTimeout(timeoutId);
                }

                timeoutId = setTimeout(() => {
                    setQuantity(repeatProd);
                }, 200);
            }

            return () => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
            };
        }, [local]);
        const phone = useMediaQuery('(max-width:959px)');

        if (loading) {
            return (<h1>Идет загрузка...</h1>)
        }
        if (error) {
            return (<h1>{error}</h1>)
        }
        return (
            <div data-testid="cart">
                {phone ?
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
                                <h1>Корзина</h1>
                            </div>
                            {productsInCart.map(product =>
                                <div key={product.id} className={css.item}>
                                    <div className={css.item__image}>
                                        <img src={product.images}/>
                                    </div>
                                    <div className={css.item__product}>
                                        <img src={product.size_type == "mass" ? mass : volume}/>
                                        <span>{product.size}</span>
                                        <p className={css.item__product_title}><b>{product.brand} {product.title}</b></p>
                                        <p className={css.item__product_description}>{product.description}</p>
                                    </div>
                                    <div className={css.item__buying}>
                                        <div className={css.item__counts}>
                                            <button onClick={() => removeItem(product.barcode)}>-</button>
                                            <span>{quantity[product.barcode]}</span>
                                            <button onClick={() => addItem(product.barcode)}>+</button>
                                        </div>
                                        <div className={css.item__price}>
                                            <p>{(parseFloat(product.price.replace(/[^0-9.,]+/g, "").replace(",", ".")) * quantity[product.barcode]).toFixed(2)
                                                + product.price.substr(-1)}</p>
                                        </div>
                                        <div className={css.item__delete}>
                                            <a onClick={() => deleteItem(product.barcode)}>
                                                <svg width="25" height="25" viewBox="0 0 25 25" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M15.625 6.25H20.3125C20.5197 6.25 20.7184 6.33231 20.8649 6.47882C21.0114 6.62534 21.0938 6.82405 21.0938 7.03125C21.0938 7.23845 21.0114 7.43716 20.8649 7.58368C20.7184 7.73019 20.5197 7.8125 20.3125 7.8125H19.4484L18.2734 18.4C18.1673 19.3555 17.7125 20.2384 16.9961 20.8795C16.2797 21.5207 15.352 21.8751 14.3906 21.875H10.6094C9.64797 21.8751 8.72029 21.5207 8.00389 20.8795C7.28749 20.2384 6.8327 19.3555 6.72656 18.4L5.55 7.8125H4.6875C4.4803 7.8125 4.28159 7.73019 4.13507 7.58368C3.98856 7.43716 3.90625 7.23845 3.90625 7.03125C3.90625 6.82405 3.98856 6.62534 4.13507 6.47882C4.28159 6.33231 4.4803 6.25 4.6875 6.25H9.375C9.375 5.4212 9.70424 4.62634 10.2903 4.04029C10.8763 3.45424 11.6712 3.125 12.5 3.125C13.3288 3.125 14.1237 3.45424 14.7097 4.04029C15.2958 4.62634 15.625 5.4212 15.625 6.25ZM12.5 4.6875C12.0856 4.6875 11.6882 4.85212 11.3951 5.14515C11.1021 5.43817 10.9375 5.8356 10.9375 6.25H14.0625C14.0625 5.8356 13.8979 5.43817 13.6049 5.14515C13.3118 4.85212 12.9144 4.6875 12.5 4.6875ZM10.1562 10.9375V17.1875C10.1562 17.3947 10.2386 17.5934 10.3851 17.7399C10.5316 17.8864 10.7303 17.9688 10.9375 17.9688C11.1447 17.9688 11.3434 17.8864 11.4899 17.7399C11.6364 17.5934 11.7188 17.3947 11.7188 17.1875V10.9375C11.7188 10.7303 11.6364 10.5316 11.4899 10.3851C11.3434 10.2386 11.1447 10.1562 10.9375 10.1562C10.7303 10.1562 10.5316 10.2386 10.3851 10.3851C10.2386 10.5316 10.1562 10.7303 10.1562 10.9375ZM14.0625 10.1562C13.8553 10.1562 13.6566 10.2386 13.5101 10.3851C13.3636 10.5316 13.2812 10.7303 13.2812 10.9375V17.1875C13.2812 17.3947 13.3636 17.5934 13.5101 17.7399C13.6566 17.8864 13.8553 17.9688 14.0625 17.9688C14.2697 17.9688 14.4684 17.8864 14.6149 17.7399C14.7614 17.5934 14.8438 17.3947 14.8438 17.1875V10.9375C14.8438 10.7303 14.7614 10.5316 14.6149 10.3851C14.4684 10.2386 14.2697 10.1562 14.0625 10.1562Z"
                                                        fill="white"/>
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className={css.order}>

                                <div className={css.order__price}><span>1 348,76 ₸</span></div>
                                <div>
                                    <a onClick={makeOrder} className={css.order__done} href="#">
                                        Оформить заказ
                                    </a>
                                </div>
                            </div>
                        </div>) :
                    (
                        <div className={css.container}>
                            <div className={css.top}>
                                <p>Главная <span>Корзина</span></p>
                                <h1>Корзина</h1>
                            </div>
                            {productsInCart.map(product =>
                                <div key={product.id} className={css.item}>
                                    <div className={css.item__image}>
                                        <img src={product.images}/>
                                    </div>
                                    <div className={css.item__product}>
                                        <img src={product.size_type == "mass" ? mass : volume}/>
                                        <span>{product.size}</span>
                                        <p className={css.item__product_title}><b>{product.brand} {product.title}</b></p>
                                        <p className={css.item__product_description}>{product.description}</p>
                                    </div>
                                    <div className={css.item__counts}>
                                        <button onClick={() => removeItem(product.barcode)}>-</button>
                                        <span>{quantity[product.barcode]}</span>
                                        <button onClick={() => addItem(product.barcode)}>+</button>
                                    </div>
                                    <div className={css.item__price}>
                                        <p>{(parseFloat(product.price.replace(/[^0-9.,]+/g, "").replace(",", ".")) * quantity[product.barcode]).toFixed(2)
                                            + product.price.substr(-1)}</p>

                                    </div>
                                    <div className={css.item__delete}>
                                        <a onClick={() => deleteItem(product.barcode)}>
                                            <svg width="25" height="25" viewBox="0 0 25 25" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M15.625 6.25H20.3125C20.5197 6.25 20.7184 6.33231 20.8649 6.47882C21.0114 6.62534 21.0938 6.82405 21.0938 7.03125C21.0938 7.23845 21.0114 7.43716 20.8649 7.58368C20.7184 7.73019 20.5197 7.8125 20.3125 7.8125H19.4484L18.2734 18.4C18.1673 19.3555 17.7125 20.2384 16.9961 20.8795C16.2797 21.5207 15.352 21.8751 14.3906 21.875H10.6094C9.64797 21.8751 8.72029 21.5207 8.00389 20.8795C7.28749 20.2384 6.8327 19.3555 6.72656 18.4L5.55 7.8125H4.6875C4.4803 7.8125 4.28159 7.73019 4.13507 7.58368C3.98856 7.43716 3.90625 7.23845 3.90625 7.03125C3.90625 6.82405 3.98856 6.62534 4.13507 6.47882C4.28159 6.33231 4.4803 6.25 4.6875 6.25H9.375C9.375 5.4212 9.70424 4.62634 10.2903 4.04029C10.8763 3.45424 11.6712 3.125 12.5 3.125C13.3288 3.125 14.1237 3.45424 14.7097 4.04029C15.2958 4.62634 15.625 5.4212 15.625 6.25ZM12.5 4.6875C12.0856 4.6875 11.6882 4.85212 11.3951 5.14515C11.1021 5.43817 10.9375 5.8356 10.9375 6.25H14.0625C14.0625 5.8356 13.8979 5.43817 13.6049 5.14515C13.3118 4.85212 12.9144 4.6875 12.5 4.6875ZM10.1562 10.9375V17.1875C10.1562 17.3947 10.2386 17.5934 10.3851 17.7399C10.5316 17.8864 10.7303 17.9688 10.9375 17.9688C11.1447 17.9688 11.3434 17.8864 11.4899 17.7399C11.6364 17.5934 11.7188 17.3947 11.7188 17.1875V10.9375C11.7188 10.7303 11.6364 10.5316 11.4899 10.3851C11.3434 10.2386 11.1447 10.1562 10.9375 10.1562C10.7303 10.1562 10.5316 10.2386 10.3851 10.3851C10.2386 10.5316 10.1562 10.7303 10.1562 10.9375ZM14.0625 10.1562C13.8553 10.1562 13.6566 10.2386 13.5101 10.3851C13.3636 10.5316 13.2812 10.7303 13.2812 10.9375V17.1875C13.2812 17.3947 13.3636 17.5934 13.5101 17.7399C13.6566 17.8864 13.8553 17.9688 14.0625 17.9688C14.2697 17.9688 14.4684 17.8864 14.6149 17.7399C14.7614 17.5934 14.8438 17.3947 14.8438 17.1875V10.9375C14.8438 10.7303 14.7614 10.5316 14.6149 10.3851C14.4684 10.2386 14.2697 10.1562 14.0625 10.1562Z"
                                                    fill="white"/>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            )}
                            <div className={css.order}>
                                <div>
                                    <a data-testid="order" onClick={makeOrder} className={css.order__done} href="#">
                                        Оформить заказ
                                    </a>
                                </div>
                                <div className={css.order__price}><span>{totalPrice}</span></div>
                            </div>
                        </div>
                    )
                }

            </div>
        );
    }
;
export default Cart;
