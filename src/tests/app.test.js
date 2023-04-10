import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {store} from "../store";
import {Provider} from 'react-redux';
import Products from "../components/products/Products";
import {HashRouter} from 'react-router-dom'
import ProductsList from "../components/products/ProductsList";


jest.mock('usehooks-ts', () => ({
    useMediaQuery: jest.fn(),
}));
// third test
test('renders learn react link', async () => {
    render(
        <Provider store={store}>
            <HashRouter>
                <Products/>
            </HashRouter>
        </Provider>
    );
    const linkElement = screen.getByText(/Цена/i);
    const input = screen.getByPlaceholderText(/Поиск.../i);
    expect(linkElement).toBeInTheDocument();
    expect(input).toBeInTheDocument();

});
// four test
test('renders elements from store', async () => {
    render(
        <Provider store={store}>
            <HashRouter>
                <Products/>
            </HashRouter>
        </Provider>
    );
    const productElement = await screen.findAllByText(/туалетное мыло/i);
    expect(productElement[0]).toBeInTheDocument();
});

// seventh test
test('products from store should render', async () => {
    render(
        <Provider store={store}>
            <HashRouter>
                <ProductsList minPrice="0" maxPrice="10000" sortField={"name"} sortOrder={"desc"}/>
            </HashRouter>
        </Provider>
    );
    const products = await screen.findAllByTestId("products")
    expect(products.length).toBe(15);
});

// eighth test
test('products should be filtered by price', async () => {
    render(
        <Provider store={store}>
            <HashRouter>
                <ProductsList minPrice="50" maxPrice="150" sortField={"name"} sortOrder={"desc"}/>
            </HashRouter>
        </Provider>
    );
    const products = await screen.findAllByTestId("products")
    expect(products.length).toBe(7);
});




