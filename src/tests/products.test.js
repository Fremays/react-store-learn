import {fireEvent, render, screen} from '@testing-library/react';
import {Provider} from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Cart from '../components/cart/Cart';
import Products from "../components/products/Products";
import ProductsList from "../components/products/ProductsList";

const mockStore = configureMockStore([thunk]);

jest.mock('usehooks-ts', () => ({
    useMediaQuery: jest.fn(),
}));
// first test
describe('Cart should render', () => {
    let store;
    beforeEach(() => {
        store = mockStore({
            product: {
                products: [
                    {barcode: '123', name: 'Product 1', price: '1.00'},
                    {barcode: '456', name: 'Product 2', price: '2.00'},
                ],
                error: null,
                loading: false,
            },
            local: {
                local: JSON.stringify(['123', '456']),
                error: null,
                loading: false,
            },
        });
    });

    test('should render without crashing', () => {
        render(
            <Provider store={store}>
                <Cart/>
            </Provider>
        );
    });
});
// second test
describe('store should be empty after order', () => {
    let store;
    const localStorageSpy = jest.fn();
    const localStorageMock = {
        getItem: jest.fn(),
        removeItem: localStorageSpy,
    };
    beforeEach(() => {
        store = mockStore({
            product: {
                products: [
                    {barcode: '123', name: 'Product 1', price: '1.00'},
                    {barcode: '456', name: 'Product 2', price: '2.00'},
                ],
                error: null,
                loading: false,
            },
            local: {
                products: JSON.stringify(['123', '456']),
                error: null,
                loading: false,
            },
        });
        Object.defineProperty(window, 'localStorage', {
            value: localStorageMock,
            writable: true,
        });
    });

    test('should render without crashing', () => {
            render(
                <Provider store={store}>
                    <Cart/>
                </Provider>
            );
        const btn = screen.getByTestId("order");
        fireEvent.click(btn)
        expect(localStorageSpy).toHaveBeenCalledWith('products');
        }
    );
});


