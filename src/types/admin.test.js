import {fireEvent, render, screen} from "@testing-library/react";
import {Provider} from "react-redux";
import {store} from "../store";
import {HashRouter} from "react-router-dom";
import React from "react";
import AdminPage from "../components/adminPage/AdminPage";

// fifth test
test('renders elements from store', async () => {
    render(
        <Provider store={store}>
            <HashRouter>
                <AdminPage/>
            </HashRouter>
        </Provider>
    );
    const input = await screen.findByTestId("title");
    fireEvent.input(input, {
        target: {value: "Мыло"}
    })
    expect(input.value).toContain("Мыло");
});

// sixth test

test('if required input is empty', async () => {
    const onSubmit = jest.fn();
    render(
        <Provider store={store}>
            <HashRouter>
                <AdminPage/>
            </HashRouter>
        </Provider>
    );
    const input = await screen.findByTestId("title");
    const btn = await screen.findByText("Submit");
    fireEvent.click(btn)
    expect(onSubmit).not.toHaveBeenCalled();
});