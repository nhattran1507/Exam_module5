import axios from "axios";

const API_URL = "http://localhost:3001";

const productService = {
    async getProducts() {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    },
    async getCategories() {
        const response = await axios.get(`${API_URL}/categories`);
        return response.data;
    },
    async getProductById(id) {
        const response = await axios.get(`${API_URL}/products/${id}`);
        return response.data;
    },
    async updateProduct(id, updatedProduct) {
        await axios.put(`${API_URL}/products/${id}`, updatedProduct);
    },
};

export default productService;
