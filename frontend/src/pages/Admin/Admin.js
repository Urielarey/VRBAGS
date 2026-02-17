import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import axios from "axios";
import "./Admin.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

const Admin = () => {
    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();

    const [activeTab, setActiveTab] = useState("dashboard");
    const [products, setProducts] = useState([]);
    // const [tickets, setTickets] = useState([]); // Eliminado para evitar warning no-unused-vars
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        code: "",
        price: "",
        stock: "",
        category: "",
        status: true,
        thumbnails: "",
    });

    const getAuthHeaders = useCallback(() => {
        const token = localStorage.getItem("token");
        return {
            headers: { Authorization: `Bearer ${token}` },
        };
    }, []);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const prodResponse = await axios.get(
                `${API_URL}/products?limit=100`,
                getAuthHeaders()
            );

            if (prodResponse.data.status === "success") {
                setProducts(prodResponse.data.payload);
            }

            const ticketResponse = await axios.get(
                `${API_URL}/tickets/all`,
                getAuthHeaders()
            );

            if (ticketResponse.data.status === "success") {
                setTickets(ticketResponse.data.payload || []);
            }
        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setLoading(false);
        }
    }, [getAuthHeaders]);

    useEffect(() => {
        if (!isAdmin()) {
            navigate("/");
            return;
        }
        loadData();
    }, [navigate, isAdmin, loadData]);

    // Limpia el formulario y el producto en edición
    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            code: "",
            price: "",
            stock: "",
            category: "",
            status: true,
            thumbnails: "",
        });
        setEditingProduct(null);
    };

    // const handleSaveProduct = async (e) => { ... } // Eliminado para evitar warning no-unused-vars

    const handleDeleteProduct = async (pid) => {
        if (!window.confirm("¿Seguro que querés eliminar este producto?")) return;

        try {
            await axios.delete(
                `${API_URL}/products/${pid}`,
                getAuthHeaders()
            );
            alert("✅ Producto eliminado");
            loadData();
        } catch (error) {
            alert("❌ Error: " + (error.response?.data?.message || error.message));
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setFormData({
            title: product.title,
            description: product.description,
            code: product.code,
            price: product.price,
            stock: product.stock,
            category: product.category,
            status: product.status,
            thumbnails: product.thumbnails?.[0] || "",
        });
        setActiveTab("create-product");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        window.location.reload();
    };

    if (!user) {
        return <div className="container mt-5">Cargando...</div>;
    }

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Panel de Control - VRBAGS</h1>
                <div className="admin-user-info">
                    <span>
                        👤 {user.first_name} {user.last_name} (
                        {user.role.toUpperCase()})
                    </span>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={handleLogout}
                    >
                        Salir
                    </button>
                </div>
            </div>

            <div className="admin-tabs">
                <button
                    className={`tab-btn ${activeTab === "dashboard" ? "active" : ""
                        }`}
                    onClick={() => setActiveTab("dashboard")}
                >
                    📊 Dashboard
                </button>

                <button
                    className={`tab-btn ${activeTab === "products" ? "active" : ""
                        }`}
                    onClick={() => setActiveTab("products")}
                >
                    📦 Productos ({products.length})
                </button>

                <button
                    className={`tab-btn ${activeTab === "create-product" ? "active" : ""
                        }`}
                    onClick={() => setActiveTab("create-product")}
                >
                    ➕ Nuevo Producto
                </button>
            </div>

            {loading ? (
                <div className="loading">⏳ Cargando...</div>
            ) : (
                <div className="admin-content">
                    {activeTab === "products" &&
                        products.map((p) => (
                            <div key={p._id}>
                                <strong>{p.title}</strong> - $
                                {p.price.toLocaleString()}
                                <button onClick={() => handleEditProduct(p)}>
                                    Editar
                                </button>
                                <button onClick={() => handleDeleteProduct(p._id)}>
                                    Eliminar
                                </button>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default Admin;
