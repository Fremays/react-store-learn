import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {fetchProducts} from "../store/action-creators/product";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
// tenth text
describe('fetchProducts', () => {
    it('should dispatch FETCH_PRODUCTS action', async () => {
        const store = mockStore({});
        await store.dispatch(fetchProducts('name', 'asc'));
        const actions = store.getActions();
        expect(actions[0].type).toEqual('FETCH_PRODUCTS');
    });

});