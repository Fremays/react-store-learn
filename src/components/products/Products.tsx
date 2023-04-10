import React, {TouchEventHandler, useEffect, useState} from 'react';
import css from "./Products.module.css"
import ProductsList from "./ProductsList";
import {useTypedSelector} from "../hooks/useTypedSelector";
import {useActions} from "../hooks/useActions";
import {useMediaQuery} from "usehooks-ts";
import {NavLink} from "react-router-dom";

const Products = () => {
    const {products, error, loading} = useTypedSelector(state => state.product)
    const {fetchProducts} = useActions()
    useEffect(() => {
        fetchProducts("name", "asc")
    }, [])
    // Сет уникальных производителей для филтра
    let manufacturers = Array.from(new Set(products.map((product) => product.manufacturer)));
    localStorage.setItem('manufacturers', JSON.stringify(manufacturers))
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [numVisibleManufacturers, setNumVisibleManufacturers] = useState<number>(4);
    const [sortField, setSortField] = useState("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const storedManufacturers = localStorage.getItem('manufacturers');

    // Проверка не производителей: из json или из localStorage
    const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>(
        storedManufacturers ? JSON.parse(storedManufacturers) : manufacturers
    );
    useEffect(() => {
        setTimeout(() => {
            const storedManufacturers = localStorage.getItem('manufacturers');
            const parsedStoredManufacturers = storedManufacturers ? JSON.parse(storedManufacturers) : manufacturers;
            if (selectedManufacturers.length === 0) {
                setSelectedManufacturers(parsedStoredManufacturers);
            }
        }, 200);
    }, [manufacturers]);

    // Сортировка по убиванию или возрастанию
    const handleSortClick = (field: string) => {
        if (field === sortField) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    // Показ вида сортировки
    const [showSortOptions, setShowSortOptions] = useState(false);
    const toggleSortOptions = () => {
        setShowSortOptions((prevShowSortOptions) => !prevShowSortOptions);
    };


    // Показ меню сортировки для мобильных устройств
    const [isMenuShown, setIsMenuShown] = useState(false);
    const [startX, setStartX] = useState(0);

    const handleTouchStart: TouchEventHandler<HTMLDivElement> = (e) => {
        setStartX(e.touches[0].clientX);
    };
    const handleTouchMove: TouchEventHandler<HTMLDivElement> = (e) => {
        const touchCurrent = e.touches[0].clientX;
        const touchDiff = startX - touchCurrent;
        if (touchDiff < 0) {
            setIsMenuShown(true);
        } else {
            setIsMenuShown(false);
        }
    };
    const handleTouchEnd: TouchEventHandler<HTMLDivElement> = (e) => {
        const touchCurrent = e.changedTouches[0].clientX;
        const touchDiff = startX - touchCurrent;
        if (touchDiff > 0 && isMenuShown) {
            setIsMenuShown(false);
        }
    };

    // Сортировка по цене
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(10000);

    // Сортировка по типу ухода
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

    const handleManufacturerFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
        const manufacturer = event.target.name;
        if (selectedManufacturers.includes(manufacturer)) {
            setSelectedManufacturers((prevSelected) =>
                prevSelected.filter((selected) => selected !== manufacturer)
            );
        } else {
            setSelectedManufacturers((prevSelected) => [...prevSelected, manufacturer]);
        }
    };

    const filteredManufacturers = manufacturers.filter((manufacturer) =>
        manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const middle = useMediaQuery('(max-width:1280px)');
    const phone = useMediaQuery('(max-width:959px)');

    return (
        <div className={css.container}
             onTouchStart={handleTouchStart}
             onTouchMove={handleTouchMove}
             onTouchEnd={handleTouchEnd}
                data-testid="toggle-div"
        >
            {phone ?
                (
                    <div className={css.products}>
                        <div className={css.head}>
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
                            <div className={css.head__title}>Косметика и гигиена</div>
                        </div>
                        <div className={css.product_area}>
                            <div className={css.product_area__filter}>
                                <div>
                                    <div className={css.product_area__filter_price}>
                                        <div className={css.product_area__filter_shown}>

                                            <h2>ПОДБОР ПО ПАРАМЕТРАМ</h2>
                                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <rect opacity="0.5" x="32" width="32" height="32" rx="16"
                                                      transform="rotate(90 32 0)" fill="#FFCA65"/>
                                                <path d="M20 18L16 14L12 18" stroke="#3F4E65"/>
                                            </svg>
                                        </div>
                                        <div data-testid="toggle-elem"
                                            className={`${css.filter_shown}  ${
                                                isMenuShown ? css.shown : css.filter_shown
                                            }`}
                                        >
                                            <div>
                                                <p className={css.product_area__filter_price_name}>Цена ₸</p>
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    value={minPrice}
                                                    onChange={(e) => setMinPrice(parseInt(e.target.value))}/>
                                                <span>-</span>
                                                <input
                                                    type="number"
                                                    placeholder="10000"
                                                    value={maxPrice}
                                                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                                                />
                                            </div>
                                            <div className={css.product_area__filter_manufacturer}>
                                                <p>Производитель</p>
                                                <input
                                                    className={css.product_area__filter_search}
                                                    placeholder="Поиск..."
                                                    onChange={(event) => setSearchQuery(event.target.value)}
                                                />
                                                <a className={css.product_area__filter_manufacturer_search} href="#">
                                                    <svg width="39" height="39" viewBox="0 0 39 39" fill="none"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <rect width="39" height="39" rx="19.5" fill="#FFC85E"/>
                                                        <path
                                                            d="M27.5294 27.5294L24.0989 24.0928L27.5294 27.5294ZM26 19.5C26 21.2239 25.3152 22.8772 24.0962 24.0962C22.8772 25.3152 21.2239 26 19.5 26C17.7761 26 16.1228 25.3152 14.9038 24.0962C13.6848 22.8772 13 21.2239 13 19.5C13 17.7761 13.6848 16.1228 14.9038 14.9038C16.1228 13.6848 17.7761 13 19.5 13C21.2239 13 22.8772 13.6848 24.0962 14.9038C25.3152 16.1228 26 17.7761 26 19.5V19.5Z"
                                                            stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
                                                    </svg>
                                                </a>
                                                <ul>
                                                    {filteredManufacturers.slice(0, numVisibleManufacturers).map((manufacturer) => (
                                                        <li key={manufacturer}>
                                                            <input
                                                                type="checkbox"
                                                                id={manufacturer}
                                                                name={manufacturer}
                                                                checked={selectedManufacturers.includes(manufacturer)}
                                                                onChange={handleManufacturerFilter}
                                                            />
                                                            <label htmlFor={manufacturer}>{manufacturer}</label>
                                                        </li>
                                                    ))}
                                                </ul>
                                                {numVisibleManufacturers <= filteredManufacturers.length && (
                                                    <div>
                                <span className={css.show_more_span} id="show_more" onClick={() =>
                                    setNumVisibleManufacturers((prevNumVisible) =>
                                        prevNumVisible === 4 ? filteredManufacturers.length : 4
                                    )
                                }>
                                {numVisibleManufacturers <= 4 ? "Показать все" : "Скрыть"}
                                </span>
                                                        <a>
                                                            <svg
                                                                className={numVisibleManufacturers !== 4 ? css.show_more : ''}
                                                                width="7"
                                                                height="6" viewBox="0 0 7 6" fill="none"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M3.5 6L0.468911 0.750001L6.53109 0.75L3.5 6Z"
                                                                      fill="#3F4E65"/>
                                                            </svg>
                                                        </a>
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className={css.product_area__filter_type}>
                                <ul>
                                    <li><a className={selectedFilter === 'body' ? css.selected : ''}
                                           onClick={() => setSelectedFilter(selectedFilter === 'body' ? null : 'body')}>Уход
                                        за телом</a></li>
                                    <li><a className={selectedFilter === 'hands' ? css.selected : ''}
                                           onClick={() => setSelectedFilter(selectedFilter === 'hands' ? null : 'hands')}>Уход
                                        за руками</a></li>
                                    <li><a className={selectedFilter === 'legs' ? css.selected : ''}
                                           onClick={() => setSelectedFilter(selectedFilter === 'legs' ? null : 'legs')}>Уход
                                        за ногами</a></li>
                                    <li><a className={selectedFilter === 'face' ? css.selected : ''}
                                           onClick={() => setSelectedFilter(selectedFilter === 'face' ? null : 'face')}>Уход
                                        за лицом</a></li>
                                    <li><a className={selectedFilter === 'hair' ? css.selected : ''}
                                           onClick={() => setSelectedFilter(selectedFilter === 'hair' ? null : 'hair')}>Уход
                                        за волосами</a></li>
                                    <li><a className={selectedFilter === 'tan' ? css.selected : ''}
                                           onClick={() => setSelectedFilter(selectedFilter === 'tan' ? null : 'tan')}>Средства
                                        для загара</a></li>
                                    <li><a className={selectedFilter === 'shave' ? css.selected : ''}
                                           onClick={() => setSelectedFilter(selectedFilter === 'shave' ? null : 'shave')}>Средства
                                        для бритья</a></li>
                                    <li><a className={selectedFilter === 'present' ? css.selected : ''}
                                           onClick={() => setSelectedFilter(selectedFilter === 'present' ? null : 'present')}>Подарочные
                                        наборы</a></li>
                                    <li><a className={selectedFilter === 'hygiene' ? css.selected : ''}
                                           onClick={() => setSelectedFilter(selectedFilter === 'hygiene' ? null : 'hygiene')}>Гигиеническая
                                        продукция</a></li>
                                    <li><a className={selectedFilter === 'hygiene_oral' ? css.selected : ''}
                                           onClick={() => setSelectedFilter(selectedFilter === 'hygiene_oral' ? null : 'hygiene_oral')}>Гигиена
                                        полости рта</a></li>
                                    <li><a className={selectedFilter === 'paper' ? css.selected : ''}
                                           onClick={() => setSelectedFilter(selectedFilter === 'paper' ? null : 'paper')}>Бумажная
                                        продукция</a></li>
                                </ul>
                            </div>

                            <div className={isMenuShown ? css.head__sort_fil : css.head__sort}>
                                <p>Сортировка: <span>{sortField === "name" && <>&uarr; Название</>}
                                    {sortField === "price" && <>&uarr; Цена</>}
                                </span>
                                    <a onClick={(evt) => {
                                        let item = document.querySelector("#sort") as HTMLElement
                                        item.classList.toggle(css.rotate)
                                        toggleSortOptions();
                                        evt.preventDefault()
                                    }} href="#">
                                        <svg id="sort" width="7" height="6" viewBox="0 0 7 6" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3.5 6L0.468911 0.750001L6.53109 0.75L3.5 6Z" fill="#3F4E65"/>
                                        </svg>
                                    </a></p>

                                <p className={showSortOptions ? css.show : css.hide}>
                                    <span onClick={() => handleSortClick("name")}>
                            По названию {sortField === "name" && sortOrder === "asc" && <>&uarr; По возрастанию</>}
                                        {sortField === "name" && sortOrder === "desc" && <>&darr; По убыванию</>}
                            </span>
                                    {" | "}
                                    <span onClick={() => handleSortClick("price")}>
                            По цене {sortField === "price" && sortOrder === "asc" && <>&uarr; По возрастанию</>}
                                        {sortField === "price" && sortOrder === "desc" && <>&darr; По убыванию</>}
                            </span>
                                </p>
                            </div>

                            <div className={css.products_list}>
                                <ProductsList sortField={sortField} sortOrder={sortOrder}
                                              minPrice={minPrice} maxPrice={maxPrice}
                                              selectedFilter={selectedFilter}
                                              selectedManufacturers={selectedManufacturers}/>
                            </div>
                        </div>
                    </div>

                )
                :
                (
                    <div>
                        <div className={css.breadcrumbs}>
                            <span>Главная</span> <span>Косметика и гигиена</span>
                        </div>
                        <div className={css.products}>
                            <div className={css.head}>
                                <div className={css.head__title}>Косметика и гигиена</div>
                                <div className={css.head__sort}>
                                    <p>Сортировка: <span>Название</span></p>
                                    <a onClick={(evt) => {
                                        let item = document.querySelector("#sort") as HTMLElement
                                        item.classList.toggle(css.rotate)
                                        toggleSortOptions();
                                        evt.preventDefault()
                                    }} href="#">
                                        <svg id="sort" width="7" height="6" viewBox="0 0 7 6" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3.5 6L0.468911 0.750001L6.53109 0.75L3.5 6Z" fill="#3F4E65"/>
                                        </svg>
                                    </a>
                                    <p className={showSortOptions ? css.show : css.hide}>
                                        Сортировать:{" "}
                                        <span onClick={() => handleSortClick("name")}>
                            По названию {sortField === "name" && sortOrder === "asc" && <>&uarr; По возрастанию</>}
                                            {sortField === "name" && sortOrder === "desc" && <>&darr; По убыванию</>}
                            </span>
                                        {" | "}
                                        <span onClick={() => handleSortClick("price")}>
                            По цене {sortField === "price" && sortOrder === "asc" && <>&uarr; По возрастанию</>}
                                            {sortField === "price" && sortOrder === "desc" && <>&darr; По убыванию</>}
                            </span>
                                    </p>
                                </div>
                            </div>
                            {middle ?
                                (middle) :
                                (
                                    <div className={css.filter_top}>
                                        <ul>
                                            <li><a className={selectedFilter === 'body' ? css.selected : ''}
                                                   onClick={() => setSelectedFilter(selectedFilter === 'body' ? null : 'body')}>Уход
                                                за
                                                телом</a></li>
                                            <li><a className={selectedFilter === 'hands' ? css.selected : ''}
                                                   onClick={() => setSelectedFilter(selectedFilter === 'hands' ? null : 'hands')}>Уход
                                                за
                                                руками</a></li>
                                            <li><a className={selectedFilter === 'legs' ? css.selected : ''}
                                                   onClick={() => setSelectedFilter(selectedFilter === 'legs' ? null : 'legs')}>Уход
                                                за
                                                ногами</a></li>
                                            <li><a className={selectedFilter === 'face' ? css.selected : ''}
                                                   onClick={() => setSelectedFilter(selectedFilter === 'face' ? null : 'face')}>Уход
                                                за
                                                лицом</a></li>
                                            <li><a className={selectedFilter === 'hair' ? css.selected : ''}
                                                   onClick={() => setSelectedFilter(selectedFilter === 'hair' ? null : 'hair')}>Уход
                                                за
                                                волосами</a></li>
                                            <li><a className={selectedFilter === 'tan' ? css.selected : ''}
                                                   onClick={() => setSelectedFilter(selectedFilter === 'tan' ? null : 'tan')}>Средства
                                                для
                                                загара</a></li>
                                            <li><a className={selectedFilter === 'shave' ? css.selected : ''}
                                                   onClick={() => setSelectedFilter(selectedFilter === 'shave' ? null : 'shave')}>Средства
                                                для бритья</a></li>
                                            <li><a className={selectedFilter === 'present' ? css.selected : ''}
                                                   onClick={() => setSelectedFilter(selectedFilter === 'present' ? null : 'present')}>Подарочные
                                                наборы</a></li>
                                            <li><a className={selectedFilter === 'hygiene' ? css.selected : ''}
                                                   onClick={() => setSelectedFilter(selectedFilter === 'hygiene' ? null : 'hygiene')}>Гигиеническая
                                                продукция</a></li>
                                            <li><a className={selectedFilter === 'hygiene_oral' ? css.selected : ''}
                                                   onClick={() => setSelectedFilter(selectedFilter === 'hygiene_oral' ? null : 'hygiene_oral')}>Гигиена
                                                полости рта</a></li>
                                            <li><a className={selectedFilter === 'paper' ? css.selected : ''}
                                                   onClick={() => setSelectedFilter(selectedFilter === 'paper' ? null : 'paper')}>Бумажная
                                                продукция</a></li>
                                        </ul>
                                    </div>
                                )}
                            <div className={css.product_area}>
                                <div className={css.product_area__filter}>
                                    <div className={css.product_area__filter_price}>
                                        <h2>ПОДБОР ПО ПАРАМЕТРАМ</h2>
                                        <p>Цена ₸</p>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(parseInt(e.target.value))}/>
                                        -
                                        <input
                                            type="number"
                                            placeholder="10000"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className={css.product_area__filter_manufacturer}>
                                        <p>Производитель</p>
                                        <input
                                            className={css.product_area__filter_search}
                                            placeholder="Поиск..."
                                            onChange={(event) => setSearchQuery(event.target.value)}
                                        />
                                        <a className={css.product_area__filter_manufacturer_search} href="#">
                                            <svg width="39" height="39" viewBox="0 0 39 39" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <rect width="39" height="39" rx="19.5" fill="#FFC85E"/>
                                                <path
                                                    d="M27.5294 27.5294L24.0989 24.0928L27.5294 27.5294ZM26 19.5C26 21.2239 25.3152 22.8772 24.0962 24.0962C22.8772 25.3152 21.2239 26 19.5 26C17.7761 26 16.1228 25.3152 14.9038 24.0962C13.6848 22.8772 13 21.2239 13 19.5C13 17.7761 13.6848 16.1228 14.9038 14.9038C16.1228 13.6848 17.7761 13 19.5 13C21.2239 13 22.8772 13.6848 24.0962 14.9038C25.3152 16.1228 26 17.7761 26 19.5V19.5Z"
                                                    stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
                                            </svg>
                                        </a>
                                        <ul>
                                            {filteredManufacturers.slice(0, numVisibleManufacturers).map((manufacturer) => (
                                                <li key={manufacturer}>
                                                    <input
                                                        type="checkbox"
                                                        id={manufacturer}
                                                        name={manufacturer}
                                                        checked={selectedManufacturers.includes(manufacturer)}
                                                        onChange={handleManufacturerFilter}
                                                    />
                                                    <label htmlFor={manufacturer}>{manufacturer}</label>
                                                </li>
                                            ))}
                                        </ul>
                                        {numVisibleManufacturers <= filteredManufacturers.length && (
                                            <div>
                                <span className={css.show_more_span} id="show_more" onClick={() =>
                                    setNumVisibleManufacturers((prevNumVisible) =>
                                        prevNumVisible === 4 ? filteredManufacturers.length : 4
                                    )
                                }>
                                {numVisibleManufacturers <= 4 ? "Показать все" : "Скрыть"}
                                </span>
                                                <a>
                                                    <svg className={numVisibleManufacturers !== 4 ? css.show_more : ''}
                                                         width="7"
                                                         height="6" viewBox="0 0 7 6" fill="none"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M3.5 6L0.468911 0.750001L6.53109 0.75L3.5 6Z"
                                                              fill="#3F4E65"/>
                                                    </svg>
                                                </a>
                                            </div>
                                        )}

                                    </div>
                                    <div className={css.product_area__filter_type}>
                                        <p>Уход за телом</p>
                                        <ul>
                                            <li><a className={selectedFilter === 'body' ? css.selected : ''}
                                                   onClick={() => setSelectedFilter(selectedFilter === 'body' ? null : 'body')}>Уход
                                                за телом</a></li>
                                            <li><a className={selectedFilter === 'hands' ? css.selected : ''}
                                                   onClick={() => setSelectedFilter(selectedFilter === 'hands' ? null : 'hands')}>Уход
                                                за руками</a></li>
                                            <li><a className={selectedFilter === 'legs' ? css.selected : ''}
                                                   onClick={() => setSelectedFilter(selectedFilter === 'legs' ? null : 'legs')}>Уход
                                                за ногами</a></li>
                                            <li><a className={selectedFilter === 'face' ? css.selected : ''}
                                                   onClick={() => setSelectedFilter(selectedFilter === 'face' ? null : 'face')}>Уход
                                                за лицом</a></li>
                                            <li><a className={selectedFilter === 'hair' ? css.selected : ''}
                                                   onClick={() => setSelectedFilter(selectedFilter === 'hair' ? null : 'hair')}>Уход
                                                за волосами</a></li>
                                            <li><a className={selectedFilter === 'tan' ? css.selected : ''}
                                                   onClick={() => setSelectedFilter(selectedFilter === 'tan' ? null : 'tan')}>Средства
                                                для загара</a></li>
                                            <li><a className={selectedFilter === 'shave' ? css.selected : ''}
                                                   onClick={() => setSelectedFilter(selectedFilter === 'shave' ? null : 'shave')}>Средства
                                                для бритья</a></li>
                                            <li><a className={selectedFilter === 'present' ? css.selected : ''}
                                                   onClick={() => setSelectedFilter(selectedFilter === 'present' ? null : 'present')}>Подарочные
                                                наборы</a></li>
                                            <li><a className={selectedFilter === 'hygiene' ? css.selected : ''}
                                                   onClick={() => setSelectedFilter(selectedFilter === 'hygiene' ? null : 'hygiene')}>Гигиеническая
                                                продукция</a></li>
                                            <li><a className={selectedFilter === 'hygiene_oral' ? css.selected : ''}
                                                   onClick={() => setSelectedFilter(selectedFilter === 'hygiene_oral' ? null : 'hygiene_oral')}>Гигиена
                                                полости рта</a></li>
                                            <li><a className={selectedFilter === 'paper' ? css.selected : ''}
                                                   onClick={() => setSelectedFilter(selectedFilter === 'paper' ? null : 'paper')}>Бумажная
                                                продукция</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className={css.products_list}>
                                    <ProductsList sortField={sortField} sortOrder={sortOrder}
                                                  minPrice={minPrice} maxPrice={maxPrice}
                                                  selectedFilter={selectedFilter}
                                                  selectedManufacturers={selectedManufacturers}/>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default Products;