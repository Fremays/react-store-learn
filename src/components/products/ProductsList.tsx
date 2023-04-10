import React, {useEffect, useState} from 'react';
import {useTypedSelector} from "../hooks/useTypedSelector";
import {fetchProducts} from "../../store/action-creators/product";
import {useActions} from "../hooks/useActions";
import css from "./ProductsList.module.css"
import mass from "../../assets/images/mass.svg"
import volume from "../../assets/images/volume.svg"
import {NavLink} from "react-router-dom";
import Pagination from "../pagination/Pagination";
import {useMediaQuery} from "usehooks-ts";

interface ProductsListProps {
    sortField: string;
    sortOrder: 'asc' | 'desc';
    minPrice: number;
    maxPrice: number;
    selectedFilter?: string | null;
    selectedManufacturers?: string[];
}

const ProductsList: React.FC<ProductsListProps> = ({
                                                       sortField,
                                                       sortOrder,
                                                       minPrice,
                                                       maxPrice,
                                                       selectedFilter,
                                                       selectedManufacturers
                                                   }) => {
    const {products, error, loading} = useTypedSelector(state => state.product)
    const {fetchProducts} = useActions()
    const {fetchLocal} = useActions()
    useEffect(() => {
        fetchProducts(sortField, sortOrder)
    }, [sortField, sortOrder])

    // Получение продуктов после фильтров по типу и производителю
    const filteredProducts = products.filter((product) => {
        const isMatchingManufacturer = !selectedManufacturers || selectedManufacturers.includes(product.manufacturer);
        const isMatchingType = !selectedFilter || product.type_for.includes(selectedFilter);
        return isMatchingManufacturer && isMatchingType;
    });
    // Получение продуктов после фильтра по цене
    let productFiltered = filteredProducts.filter(
        (product) => parseFloat(product.price) >= minPrice && parseFloat(product.price) <= maxPrice);

    const initialState = () => {
        const localData = localStorage.getItem("products");
        return localData !== null ? JSON.parse(localData) : [];
    }

    const [productToBuy, setCount] = React.useState<string[]>(initialState())
    useEffect(() => {
        localStorage.setItem('products', JSON.stringify(productToBuy));
    }, [productToBuy]);

    let pagesCount = Math.ceil(productFiltered.length / 15);
    let pages = [];
    for (let i = 1; i <= pagesCount; i++) {
        pages.push(i);
    }

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 15;
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = productFiltered.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const phone = useMediaQuery('(max-width:959px)');

    if (loading) {
        return <h1>Идет загрузка...</h1>
    }
    if (error) {
        return <h1>{error}</h1>
    }
    return (
        <div>
            {phone ?
                (
                    <div>
                        <div className={css.products_list}>
                            {currentProducts.map(product =>
                                <div className={css.products_list__product} key={product.id}>
                                    <img className={css.products_list__image} src={product.images}/>
                                    <div className={css.products_list__descr}>
                                        <img className={css.products_list__type}
                                             src={product.size_type == "mass" ? mass : volume}/>
                                        <span className={css.products_list__size}>{product.size}</span>
                                        <NavLink to={'/products/' + product.barcode}>
                                            <p className={css.products_list__title}>
                                                <b>{product.brand}</b> {product.title}</p>
                                        </NavLink>
                                        <p className={css.products_list__barcode}>Штрихкод: <b>{product.barcode}</b><br/>
                                            Производитель: <b>{product.manufacturer}</b><br/>
                                            Бренд: <b>{product.brand}</b></p>
                                    </div>
                                    <div className={css.products_list__buy}>
                                        <span className={css.products_list__price}>{product.price}</span>
                                        <a onClick={(event) => {
                                            fetchLocal()
                                            setCount(prevArray => [...prevArray, product.barcode])
                                            event.preventDefault();
                                        }} className={css.products_list__button} href="#">В корзину
                                            <svg width="27" height="27" viewBox="0 0 27 27" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M24.448 8.09234C24.2955 7.87933 24.0909 7.77282 23.8341 7.77282H7.48756L7.0439 6.61782C6.93156 6.23913 6.77908 5.91568 6.58649 5.64744C6.39389 5.37921 6.18926 5.18987 5.97259 5.07942C5.75592 4.96897 5.56734 4.89403 5.40684 4.85458C5.24635 4.81513 5.08585 4.79541 4.92536 4.79541H1.62717C1.41852 4.79541 1.24198 4.86641 1.09753 5.00842C0.953083 5.15042 0.880859 5.33188 0.880859 5.55277C0.880859 5.679 0.912959 5.80128 0.977157 5.91962C1.04136 6.03796 1.13364 6.12869 1.25401 6.1918C1.37438 6.25491 1.49877 6.28647 1.62717 6.28647H4.92536C4.98955 6.28647 5.04974 6.29436 5.10591 6.31014C5.16209 6.32592 5.23832 6.39297 5.33462 6.51131C5.43092 6.62965 5.51117 6.80716 5.57537 7.04383L9.02832 16.5251C9.06042 16.6197 9.11258 16.7105 9.1848 16.7973C9.25703 16.884 9.34129 16.9511 9.43758 16.9984C9.53388 17.0458 9.6382 17.0694 9.75055 17.0694H20.1507C20.3112 17.0694 20.4596 17.0221 20.5961 16.9274C20.7325 16.8328 20.8248 16.7144 20.8729 16.5724L24.5563 8.79053C24.6365 8.53808 24.6004 8.30534 24.448 8.09234ZM19.621 15.5547H10.3524L7.89682 9.28755H22.7266L19.621 15.5547ZM18.2328 17.8908C17.7031 17.8908 17.2497 18.0762 16.8726 18.447C16.4954 18.8178 16.3068 19.2635 16.3068 19.7842C16.3068 20.3049 16.4954 20.7506 16.8726 21.1214C17.2497 21.4922 17.7031 21.6776 18.2328 21.6776C18.7624 21.6776 19.2158 21.4922 19.593 21.1214C19.9701 20.7506 20.1587 20.3049 20.1587 19.7842C20.1587 19.2635 19.9701 18.8178 19.593 18.447C19.2158 18.0762 18.7624 17.8908 18.2328 17.8908ZM11.2993 17.8908C10.9462 17.8908 10.6212 17.9776 10.3243 18.1511C10.0274 18.3247 9.79469 18.5535 9.62617 18.8375C9.45765 19.1215 9.37339 19.4371 9.37339 19.7842C9.37339 20.3049 9.56197 20.7506 9.93913 21.1214C10.3163 21.4922 10.7697 21.6776 11.2993 21.6776C11.829 21.6776 12.2824 21.4922 12.6595 21.1214C13.0367 20.7506 13.2253 20.3049 13.2253 19.7842C13.2253 19.658 13.2133 19.5318 13.1892 19.4055C13.1651 19.2793 13.129 19.161 13.0808 19.0505C13.0327 18.9401 12.9725 18.8336 12.9003 18.731C12.8281 18.6284 12.7478 18.5338 12.6595 18.447C12.5713 18.3602 12.475 18.2813 12.3706 18.2103C12.2663 18.1393 12.158 18.0801 12.0456 18.0328C11.9333 17.9855 11.8129 17.95 11.6845 17.9263C11.5561 17.9026 11.4277 17.8908 11.2993 17.8908Z"
                                                    fill="white"/>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            <Pagination pagesCount={pagesCount} currentPage={currentPage} paginate={paginate}
                                        minPrice={minPrice} maxPrice={maxPrice}
                                        selectedFilter={selectedFilter}
                                        onChange={(pageNumber: React.SetStateAction<number>) => setCurrentPage(pageNumber)}
                            />
                        </div>
                    </div>
                )
                : (
                    <div>
                        <div className={css.products_list}>
                            {currentProducts.map(product =>
                                <div className={css.products_list__product} key={product.id} data-testid="products">
                                    <img className={css.products_list__image} src={product.images}/><br/>
                                    <div className={css.products_list__descr}>
                                        <img className={css.products_list__type}
                                             src={product.size_type == "mass" ? mass : volume}/>
                                        <span className={css.products_list__size}>{product.size}</span><br/>
                                        <NavLink to={'/products/' + product.barcode}>
                                            <p className={css.products_list__title}>
                                                <b>{product.brand}</b> {product.title}</p>
                                        </NavLink>
                                        <p className={css.products_list__barcode}>Штрихкод: <b>{product.barcode}</b><br/>
                                            Производитель: <b>{product.manufacturer}</b><br/>
                                            Бренд: <b>{product.brand}</b></p>
                                    </div>
                                    <div className={css.products_list__buy}>
                                        <span className={css.products_list__price}>{product.price}</span>
                                        <a onClick={(event) => {
                                            fetchLocal()
                                            setCount(prevArray => [...prevArray, product.barcode])
                                            event.preventDefault();
                                        }} className={css.products_list__button} href="#">В корзину
                                            <svg width="27" height="27" viewBox="0 0 27 27" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M24.448 8.09234C24.2955 7.87933 24.0909 7.77282 23.8341 7.77282H7.48756L7.0439 6.61782C6.93156 6.23913 6.77908 5.91568 6.58649 5.64744C6.39389 5.37921 6.18926 5.18987 5.97259 5.07942C5.75592 4.96897 5.56734 4.89403 5.40684 4.85458C5.24635 4.81513 5.08585 4.79541 4.92536 4.79541H1.62717C1.41852 4.79541 1.24198 4.86641 1.09753 5.00842C0.953083 5.15042 0.880859 5.33188 0.880859 5.55277C0.880859 5.679 0.912959 5.80128 0.977157 5.91962C1.04136 6.03796 1.13364 6.12869 1.25401 6.1918C1.37438 6.25491 1.49877 6.28647 1.62717 6.28647H4.92536C4.98955 6.28647 5.04974 6.29436 5.10591 6.31014C5.16209 6.32592 5.23832 6.39297 5.33462 6.51131C5.43092 6.62965 5.51117 6.80716 5.57537 7.04383L9.02832 16.5251C9.06042 16.6197 9.11258 16.7105 9.1848 16.7973C9.25703 16.884 9.34129 16.9511 9.43758 16.9984C9.53388 17.0458 9.6382 17.0694 9.75055 17.0694H20.1507C20.3112 17.0694 20.4596 17.0221 20.5961 16.9274C20.7325 16.8328 20.8248 16.7144 20.8729 16.5724L24.5563 8.79053C24.6365 8.53808 24.6004 8.30534 24.448 8.09234ZM19.621 15.5547H10.3524L7.89682 9.28755H22.7266L19.621 15.5547ZM18.2328 17.8908C17.7031 17.8908 17.2497 18.0762 16.8726 18.447C16.4954 18.8178 16.3068 19.2635 16.3068 19.7842C16.3068 20.3049 16.4954 20.7506 16.8726 21.1214C17.2497 21.4922 17.7031 21.6776 18.2328 21.6776C18.7624 21.6776 19.2158 21.4922 19.593 21.1214C19.9701 20.7506 20.1587 20.3049 20.1587 19.7842C20.1587 19.2635 19.9701 18.8178 19.593 18.447C19.2158 18.0762 18.7624 17.8908 18.2328 17.8908ZM11.2993 17.8908C10.9462 17.8908 10.6212 17.9776 10.3243 18.1511C10.0274 18.3247 9.79469 18.5535 9.62617 18.8375C9.45765 19.1215 9.37339 19.4371 9.37339 19.7842C9.37339 20.3049 9.56197 20.7506 9.93913 21.1214C10.3163 21.4922 10.7697 21.6776 11.2993 21.6776C11.829 21.6776 12.2824 21.4922 12.6595 21.1214C13.0367 20.7506 13.2253 20.3049 13.2253 19.7842C13.2253 19.658 13.2133 19.5318 13.1892 19.4055C13.1651 19.2793 13.129 19.161 13.0808 19.0505C13.0327 18.9401 12.9725 18.8336 12.9003 18.731C12.8281 18.6284 12.7478 18.5338 12.6595 18.447C12.5713 18.3602 12.475 18.2813 12.3706 18.2103C12.2663 18.1393 12.158 18.0801 12.0456 18.0328C11.9333 17.9855 11.8129 17.95 11.6845 17.9263C11.5561 17.9026 11.4277 17.8908 11.2993 17.8908Z"
                                                    fill="white"/>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            <Pagination pagesCount={pagesCount} currentPage={currentPage} paginate={paginate}
                                        minPrice={minPrice} maxPrice={maxPrice}
                                        selectedFilter={selectedFilter}
                                        onChange={(pageNumber: React.SetStateAction<number>) => setCurrentPage(pageNumber)}
                            />
                        </div>
                        <div className={css.etc}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam interdum ut justo,
                            vestibulum sagittis iaculis iaculis. Quis mattis vulputate feugiat massa vestibulum duis.
                            Faucibus consectetur aliquet sed pellentesque consequat consectetur congue mauris venenatis.
                            Nunc elit, dignissim sed nulla ullamcorper enim, malesuada.
                        </div>
                    </div>
                )}

        </div>
    );
};

export default ProductsList;