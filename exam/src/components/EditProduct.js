import React, {useEffect, useState} from "react";
import {Form, Button, Card, Alert} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import productService from "../services/productService";

const EditProduct = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const productData = await productService.getProductById(id);
            const categoryData = await productService.getCategories();
            if (productData.date) {
                const dateObj = new Date(productData.date);
                const day = String(dateObj.getDate()).padStart(2, "0");
                const month = String(dateObj.getMonth() + 1).padStart(2, "0");
                const year = dateObj.getFullYear();
                productData.dateString = `${day}/${month}/${year}`;
            }

            setProduct(productData);
            setCategories(categoryData);
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!product.name || product.name.length > 100) {
            setError("Tên sản phẩm không được quá 100 ký tự.");
            return;
        }
        const [day, month, year] = product.dateString.split("/");
        const checkDate = new Date(+year, +month - 1, +day);
        if (checkDate > new Date()) {
            setError("Ngày nhập không được lớn hơn ngày hiện tại.");
            return;
        }
        if (!Number.isInteger(Number(product.quantity)) || product.quantity <= 0) {
            setError("Số lượng phải là số nguyên lớn hơn 0.");
            return;
        }
        const isoYear = checkDate.getFullYear();
        const isoMonth = String(checkDate.getMonth() + 1).padStart(2, "0");
        const isoDay = String(checkDate.getDate()).padStart(2, "0");
        product.date = `${isoYear}-${isoMonth}-${isoDay}`;
        await productService.updateProduct(id, product);
        navigate("/", {state: {success: true, message: "Cập nhật thành công!"}});
    };

    if (!product) return <p>Loading...</p>;

    return (
        <Card className="shadow-sm p-4">
            <Card.Body>
                <Card.Title className="mb-4 text-primary">Cập nhật sản phẩm</Card.Title>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Tên sản phẩm</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Loại sản phẩm</Form.Label>
                        <Form.Select
                            name="categoryId"
                            value={product.categoryId}
                            onChange={handleChange}
                        >
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Ngày nhập (dd/MM/yyyy)</Form.Label>
                        <Form.Control
                            type="text"
                            name="dateString"
                            value={product.dateString}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Số lượng</Form.Label>
                        <Form.Control
                            type="number"
                            name="quantity"
                            value={product.quantity}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <div className="d-flex gap-2">
                        <Button variant="primary" type="submit">
                            Lưu thay đổi
                        </Button>
                        <Button variant="secondary" onClick={() => navigate("/")}>
                            Hủy thay đổi
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default EditProduct;
