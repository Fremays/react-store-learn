import React from 'react';
import './App.css';
import Products from "./components/products/Products";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import {HashRouter, Route, Routes} from 'react-router-dom'
import ProductItem from "./components/products/productItem";
import Cart from "./components/cart/Cart";
import AdminPage from "./components/adminPage/AdminPage";


function App() {
    return (
        <div className="App">
            <HashRouter>
                <React.Suspense>
                    <Header/>
                    <Routes>
                        <Route path="/" element={<Products/>}/>
                        <Route path="/catalog/" element={<Products/>}/>
                        <Route path="/products/:id" element={<ProductItem/>}/>
                        <Route path="/cart/" element={<Cart/>}/>
                        <Route path="/admin/" element={<AdminPage/>}/>
                    </Routes>
                    <Footer/>
                </React.Suspense>
            </HashRouter>
        </div>
    );
}

export default App;
