import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    category: "Vegetables",
    price: "",
    stock: "",
    unit: "kg",
    image: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const token = localStorage.getItem("token");
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    if (!token) {
      setError("Please login first.");
      return;
    }

    if (user.role !== "farmer") {
      setError("Only farmers can add products.");
      return;
    }

    if (
      !product.name ||
      product.price === "" ||
      product.stock === ""
    ) {
      setError(
        "Please fill Product Name, Price and Stock."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/products",
        {
          name: product.name,
          category: product.category,
          price: Number(product.price),
          stock: Number(product.stock),
          unit: product.unit,
          image: product.image,
          description: product.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(
        response.data.message ||
          "Product added successfully!"
      );

      setProduct({
        name: "",
        category: "Vegetables",
        price: "",
        stock: "",
        unit: "kg",
        image: "",
        description: "",
      });

      setTimeout(() => {
        navigate("/products");
      }, 1000);

    } catch (err) {
      console.error("Add Product Error:", err);

      if (err.response?.status === 401) {
        setError(
          "Your login session expired. Please login again."
        );
      } else if (err.response?.status === 403) {
        setError(
          "Only a farmer account can add products."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to add product."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">

      <div className="add-product-card">

        <div className="add-product-header">

          <div>
            <h1>Add New Product</h1>

            <p>
              Add your fresh farm product
              to FarmFresh.
            </p>
          </div>

          <button
            type="button"
            className="back-btn"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ← Back
          </button>

        </div>

        {message && (
          <div className="success-message">
            ✓ {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form
          className="product-form"
          onSubmit={handleSubmit}
        >

          {/* PRODUCT NAME */}

          <div className="form-group">

            <label>
              Product Name *
            </label>

            <input
              type="text"
              name="name"
              placeholder="Example: Fresh Tomato"
              value={product.name}
              onChange={handleChange}
              required
            />

          </div>

          {/* CATEGORY + UNIT */}

          <div className="form-row">

            <div className="form-group">

              <label>
                Category *
              </label>

              <select
                name="category"
                value={product.category}
                onChange={handleChange}
              >
                <option value="Vegetables">
                  Vegetables
                </option>

                <option value="Fruits">
                  Fruits
                </option>

                <option value="Leafy Greens">
                  Leafy Greens
                </option>

                <option value="Grains">
                  Grains
                </option>

                <option value="Pulses">
                  Pulses
                </option>

                <option value="Dairy">
                  Dairy
                </option>
              </select>

            </div>

            <div className="form-group">

              <label>
                Unit
              </label>

              <select
                name="unit"
                value={product.unit}
                onChange={handleChange}
              >
                <option value="kg">
                  kg
                </option>

                <option value="500 g">
                  500 g
                </option>

                <option value="piece">
                  piece
                </option>

                <option value="litre">
                  litre
                </option>

                <option value="packet">
                  packet
                </option>

                <option value="bundle">
                  bundle
                </option>
              </select>

            </div>

          </div>

          {/* PRICE + STOCK */}

          <div className="form-row">

            <div className="form-group">

              <label>
                Price (₹) *
              </label>

              <input
                type="number"
                name="price"
                min="0"
                placeholder="Enter price"
                value={product.price}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label>
                Stock *
              </label>

              <input
                type="number"
                name="stock"
                min="0"
                placeholder="Available quantity"
                value={product.stock}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {/* IMAGE */}

          <div className="form-group">

            <label>
              Product Image URL
            </label>

            <input
              type="text"
              name="image"
              placeholder="Paste image URL"
              value={product.image}
              onChange={handleChange}
            />

          </div>

          {/* IMAGE PREVIEW */}

          {product.image && (
            <div className="image-preview">

              <img
                src={product.image}
                alt="Product preview"
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";
                }}
              />

            </div>
          )}

          {/* DESCRIPTION */}

          <div className="form-group">

            <label>
              Description
            </label>

            <textarea
              name="description"
              rows="5"
              placeholder="Describe your product..."
              value={product.description}
              onChange={handleChange}
            />

          </div>

          {/* BUTTONS */}

          <div className="form-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-product-btn"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : "+ Add Product"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddProduct;