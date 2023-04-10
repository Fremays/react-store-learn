import React, {useEffect, useState} from 'react';

interface Product {
    id: number | null;
    title: string;
    size_type: string;
    size: string;
    barcode: string;
    manufacturer: string;
    brand: string;
    description: string;
    price: string;
    images: string;
    type_for: string[];
}

interface ProductFormState {
    id: number | null;
    title: string;
    size_type: string;
    size: string;
    barcode: string;
    manufacturer: string;
    brand: string;
    description: string;
    price: string;
    images: string;
    type_for: string[];
    isEditing: boolean;
    editingId: number | null;
    isDeleting: boolean;
    deletingId: number | null;
}

const initialFormState: ProductFormState = {
    id: 0,
    isEditing: false,
    isDeleting: false,
    editingId: 0,
    deletingId: 0,
    title: "",
    size_type: "",
    size: "",
    barcode: "",
    manufacturer: "",
    brand: "",
    description: "",
    price: "",
    images: "",
    type_for: [],
};
interface EditProductFormState extends Product, ProductFormState {}

const AdminPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [formState, setFormState] = useState<ProductFormState>(
        initialFormState
    );
    //  Загрузка продуктов
    useEffect(() => {
        const products = JSON.parse(localStorage.getItem("products_list") || "[]");
        setProducts(products);
    }, []);

    // Функция при изменение текстового или номерного инпута
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement  | HTMLInputElement & {
            type: 'text' | 'number';
            checked?: never;
        } | HTMLSelectElement | HTMLTextAreaElement;

        const value =  target.value;
        const name = target.name;

        setFormState(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Функция при изменение чекбокса
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (formState.type_for.includes(value)) {
            setFormState({
                ...formState,
                type_for: formState.type_for.filter((type) => type !== value),
            });
        } else {
            setFormState({
                ...formState,
                type_for: [...formState.type_for, value],
            });
        }
    };

    // Функция отправки
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const product: Product = {
            id: formState.isEditing ? formState.editingId : (formState.id || 0),
            title: formState.title,
            size_type: formState.size_type,
            size: formState.size,
            barcode: formState.barcode,
            manufacturer: formState.manufacturer,
            brand: formState.brand,
            description: formState.description,
            price: formState.price,
            images: formState.images,
            type_for: formState.type_for,
        };
        let updatedProducts = [];
        if (formState.isEditing) {
            updatedProducts = products.map((p) => (p.id === product.id ? product : p));
        } else {
            updatedProducts = [...products, product];
        }
        localStorage.setItem("products_list", JSON.stringify(updatedProducts));
        alert(formState.isEditing ? "Продукт был изменен!" : "Продукт был добавлен!");
        setFormState(initialFormState);
        setProducts(updatedProducts);
    };

    // Функция по изменению продукта
    const handleEdit = (id: number | null) => {
        if (id !== null) {
            const product = products.find((p) => p.id === id) as EditProductFormState;
            setFormState({
                ...product,
                isEditing: true,
                editingId: id,
            });
        }
    };

// Функция для удаления продукта
    const handleDelete = (id: number | null) => {
        if (id !== null) {
            const confirmed = window.confirm("Вы уверены что хотите удалить этот товар?");
            if (confirmed) {
                const updatedProducts = products.filter((product) => product.id !== id);
                localStorage.setItem("products_list", JSON.stringify(updatedProducts));
                setProducts(updatedProducts);
            }
        }
    };
    // Функция по завершению изменения продукта
    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const product: Product = {
            ...formState,
        };
        setProducts((prevProducts) =>
            prevProducts.map((p) => (p.id === formState.id ? product : p))
        );
        alert("Продукт был изменен");
        setFormState(initialFormState);
    };

    return (
        <div>
            <h1>Продукты</h1>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        {product.title} ({product.price})
                        <button onClick={() => handleEdit(product.id)}>Изменить</button>
                        <button onClick={() => handleDelete(product.id)}>Удалить</button>
                    </li>
                ))}
            </ul>
            <h2>{formState.isEditing ? "Edit" : "Add"} Продукт</h2>
            <form onSubmit={formState.isEditing ? handleUpdate : handleSubmit}>
                <div>
                    <label htmlFor="id">ID:</label>
                    <input
                        type="number"
                        name="id"
                        value={formState.id === null ? '' : formState.id}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="title">Название:</label>
                    <input
                        data-testid="title"
                        type="text"
                        name="title"
                        value={formState.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="size_type">Тип размера (вес/объем):</label>
                    <select name="size_type" required onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange(e)}>
                        <option value="">--Please choose an option--</option>
                        <option value="volume">Volume</option>
                        <option value="weight">Weight</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="size">Размер:</label>
                    <input
                        type="text"
                        name="size"
                        value={formState.size}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="barcode">Штрихкод:</label>
                    <input
                        type="number"
                        name="barcode"
                        value={formState.barcode}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="manufacturer">Производитель:</label>
                    <input
                        type="text"
                        name="manufacturer"
                        value={formState.manufacturer}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="brand">Бренд:</label>
                    <input
                        type="text"
                        name="brand"
                        value={formState.brand}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Описание:</label>
                    <textarea
                        name="description"
                        value={formState.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="price">Цена:</label>
                    <input
                        type="text"
                        name="price"
                        value={formState.price}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="images">Изображение:</label>
                    <input
                        type="text"
                        name="images"
                        value={formState.images}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="type_for">Тип ухода:</label>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                name="type_for"
                                value="body"
                                checked={formState.type_for.includes("body")}
                                onChange={handleCheckboxChange}
                            />
                            За телом
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="type_for"
                                value="hands"
                                checked={formState.type_for.includes("hands")}
                                onChange={handleCheckboxChange}
                            />
                            За руками
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="type_for"
                                value="legs"
                                checked={formState.type_for.includes("legs")}
                                onChange={handleCheckboxChange}
                            />
                            За ногами
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="type_for"
                                value="face"
                                checked={formState.type_for.includes("face")}
                                onChange={handleCheckboxChange}
                            />
                            За лицом
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="type_for"
                                value="hair"
                                checked={formState.type_for.includes("hair")}
                                onChange={handleCheckboxChange}
                            />
                            За волосами
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="type_for"
                                value="tan"
                                checked={formState.type_for.includes("tan")}
                                onChange={handleCheckboxChange}
                            />
                            Для загара
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="type_for"
                                value="shave"
                                checked={formState.type_for.includes("shave")}
                                onChange={handleCheckboxChange}
                            />
                            Для бритья
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="type_for"
                                value="present"
                                checked={formState.type_for.includes("present")}
                                onChange={handleCheckboxChange}
                            />
                            Подарочные
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="type_for"
                                value="hygiene"
                                checked={formState.type_for.includes("hygiene")}
                                onChange={handleCheckboxChange}
                            />
                            Гигиеническая продукция
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="type_for"
                                value="hygiene_oral"
                                checked={formState.type_for.includes("hygiene_oral")}
                                onChange={handleCheckboxChange}
                            />
                            Гигиена полости рта
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="type_for"
                                value="paper"
                                checked={formState.type_for.includes("paper")}
                                onChange={handleCheckboxChange}
                            />
                            Бумажная продукция
                        </label>
                    </div>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default AdminPage;