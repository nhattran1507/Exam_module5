import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import ProductList from "./components/ProductList";
import EditProduct from "./components/EditProduct";
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
    return (
        <Router>
            <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
                <Navbar bg="dark" variant="dark" expand="lg">
                    <Container>
                        <Navbar.Brand href="/">Quản lý sản phẩm</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ms-auto">
                                <Nav.Link href="/">Trang chủ</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                <Container className="mt-5">
                    <Routes>
                        <Route path="/" element={<ProductList />} />
                        <Route path="/edit/:id" element={<EditProduct />} />
                    </Routes>
                </Container>
            </div>
        </Router>
    );
}

export default App;
