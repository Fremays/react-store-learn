import {render, screen} from "@testing-library/react";
import {Provider} from "react-redux";
import {store} from "../store";
import React from "react";
import App from "../App";
import userEvent from "@testing-library/user-event";

jest.mock('usehooks-ts', () => ({
    useMediaQuery: jest.fn(),
}));
// ninth test
describe("Router", () => {
    test("Router test", () => {
        render(
            <Provider store={store}>
                <App/>
            </Provider>
        );
        // const mainLink = screen.getByTestId("main-page")
        const cartLink = screen.getByTestId("cart-page")
        userEvent.click(cartLink)
        expect(screen.getByTestId("cart-page")).toBeInTheDocument();
    })
})