import React, { useEffect, useState } from "react";
import { Table, Card, Button, Alert, Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { PencilSquare } from "react-bootstrap-icons";
import productService from "../services/productService";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    const [alertMessage, setAlertMessage] = useState(null);

    useEffect(() => {
        if (location.state && location.state.success) {
            setAlertMessage(location.state.message);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productData = await productService.getProducts();
                const categoryData = await productService.getCategories();

                const sortedProducts = productData.sort((a, b) => a.quantity - b.quantity);
                setProducts(sortedProducts);
                setCategories(categoryData);
                setFilteredProducts(sortedProducts);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN");
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.name : "Không xác định";
    };

    const handleSearch = () => {
        const filtered = products.filter((product) => {
            return (
                (searchTerm === "" || product.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (selectedCategory === "" || product.categoryId === selectedCategory)
            );
        });
        setFilteredProducts(filtered);
    };

    return (
        <Card className="shadow-lg p-4 mb-5">
            <Card.Body>
                {alertMessage && <Alert variant="success">{alertMessage}</Alert>}

                <div className="d-flex gap-3 mb-4">
                    <Form.Control
                        type="text"
                        placeholder="Tìm theo tên sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Form.Select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">Tất cả loại sản phẩm</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </Form.Select>
                    <Button variant="primary" onClick={handleSearch}>Tìm kiếm</Button>
                </div>

                {filteredProducts.length === 0 ? (
                    <Alert variant="danger" className="text-center">
                        Không tìm thấy sản phẩm
                    </Alert>
                ) : (
                    <Table striped bordered hover responsive className="text-center">
                        <thead className="table-dark">
                        <tr>
                            <th>Mã sản phẩm</th>
                            <th>Tên sản phẩm</th>
                            <th>Ngày nhập</th>
                            <th>Số lượng</th>
                            <th>Loại sản phẩm</th>
                            <th>Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredProducts.map((product) => (
                            <tr key={product.id}>
                                <td className="fw-bold">{product.id}</td>
                                <td>{product.name}</td>
                                <td>{formatDate(product.date)}</td>
                                <td>{product.quantity}</td>
                                <td className="text-capitalize">{getCategoryName(product.categoryId)}</td>
                                <td>
                                    <Button
                                        variant="warning"
                                        className="d-flex align-items-center gap-2 mx-auto"
                                        onClick={() => navigate(`/edit/${product.id}`)}
                                    >
                                        <PencilSquare /> Cập nhật
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                )}
            </Card.Body>
        </Card>
    );
};

export default ProductList;