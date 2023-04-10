import {ProductAction, ProductActionTypes} from "../../types/product";
import {Dispatch} from "redux";
import data from "../data.json"

export const fetchProducts = (sortField: string, sortOrder: string) => {
    return async (dispatch: Dispatch<ProductAction>) => {
        try {
            dispatch({type: ProductActionTypes.FETCH_PRODUCTS})
            let response = data.products
            const localProduct = localStorage.getItem("products_list")
            if (localProduct && JSON.parse(localProduct).length > 0){
                response = JSON.parse(localProduct)
            }
            const sortedProducts = response.sort((a, b) => {
                if (sortField === 'name') {
                    const nameA = a.title.toLowerCase();
                    const nameB = b.title.toLowerCase();
                    if (nameA < nameB) return sortOrder === 'asc' ? -1 : 1;
                    if (nameA > nameB) return sortOrder === 'asc' ? 1 : -1;
                    return 0;
                } else if (sortField === 'price') {
                    const priceA = parseFloat(a.price);
                    const priceB = parseFloat(b.price);
                    return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
                }
                return 0;
            });
            setTimeout(() => {
                dispatch({type: ProductActionTypes.FETCH_PRODUCTS_SUCCESS, payload: response})
            }, 500)
        } catch (e) {
            dispatch({
                type: ProductActionTypes.FETCH_PRODUCTS_ERROR,
                payload: 'Произошла ошибка при загрузке товаров'
            })
        }
    }
}