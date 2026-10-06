"use client";

import { use } from "react";
import { useState } from "react";
import { useEffect } from "react";

export default function EditProductPage({ params }) {
    const { id } = use(params)

    const [product, setProduct] = useState(null)
    const [productName, setProductName] = useState("")
    const [description, setDescription] = useState("")
    const [brand, setBrand] = useState("")
    const [price, setPrice] = useState("")
    const [stock, setStock] = useState("")
    const [condition, setCondition] = useState("New")
    const [usedCondition, setUsedCondition] = useState("")
    const [productAge, setProductAge] = useState("")
    const [defects, setDefects] = useState("")
    const [repairHistory, setRepairHistory] = useState("")
    const [accessories, setAccessories] = useState("")
    const [images, setImages] = useState([])
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    

    async function handleUpdate() {
        setMessage("")
        setError("")
        try {
            const formData = new FormData()

            formData.append("product_name", productName)
            formData.append("product_description", description)
            formData.append("product_brand", brand)
            formData.append("product_price", price)
            formData.append("count_in_stock", stock)
            formData.append("product_condition", condition)

            for (const image of images) {
                formData.append("product_image", image)
            }

            if (condition === "Used") {
                formData.append("usedCondition", usedCondition)
                formData.append("productAge", productAge)
                formData.append("defects", defects)
                formData.append("repairHistory", repairHistory)
                formData.append("accessories", accessories)
            }

            const response = await fetch(
                `http://localhost:5000/api/product/${id}`,
                {
                    method: "PUT",
                    body: formData,
                }
            );

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to update product")
            }

            console.log("Product updated:", data)
            setMessage("Product updated successfully!")
        } catch (error) {
            console.error("Update error:", error)
            setError(error.message);
        }
    }

    useEffect(() => {
        async function getProduct() {
            const response = await fetch(
                `http://localhost:5000/api/product/${id}`
            );

            const data = await response.json()

            console.log("Product:", data)
            setProduct(data)
        }

        getProduct()
    }, [id])

    useEffect(() => {
        if (product) {
            setProductName(product.product_name || "")
            setDescription(product.product_description || "")
            setBrand(product.product_brand || "")
            setPrice(product.product_price || "")
            setStock(product.count_in_stock || "")
            setCondition(product.product_condition || "New")
            setUsedCondition(product.usedCondition || "")
            setProductAge(product.productAge || "")
            setDefects(product.defects || "")
            setRepairHistory(product.repairHistory || "")
            setAccessories(product.accessories || "")
        }
    }, [product])

    if (!product) {
        return (
            <main>
                <h1>Product Not Found</h1>
                <p>This product does not exist or has been deleted.</p>
            </main>
        );
    }
    return (
        <main>
            <h1>Edit Product</h1>
            {product && (
                <div>
                    {/* Product Name */}
                    <div>
                        <label>Product Name</label>
                        <input
                            type="text"
                            value={productName}
                            onChange={(event) => setProductName(event.target.value)}
                        />
                    </div><br/>

                    {/* Description */}
                    <div>
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                        />
                    </div><br/>

                    {/* Brand */}
                    <div>
                        <label>Brand</label>
                        <input
                            type="text"
                            value={brand}
                            onChange={(event) => setBrand(event.target.value)}
                        />
                    </div><br/>

                    {/* Price */}
                    <div>
                        <label>Price</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(event) => setPrice(event.target.value)}
                        />
                    </div><br/>

                    {/* Stock */}
                    <div>
                        <label>Stock</label>
                        <input
                            type="number"
                            value={stock}
                            onChange={(event) => setStock(event.target.value)}
                        />
                    </div><br/>

                    {/* Condition */}
                    <div>
                        <label>Condition</label>
                        <select
                            value={condition}
                            onChange={(event) => setCondition(event.target.value)}
                        >
                            <option value="New">New</option>
                            <option value="Used">Used</option>
                        </select>
                    </div><br/>

                    {/* Keep this immediately after Condition */}
                    {condition === "Used" && (
                        <div>
                            <h2>Used Product Details</h2>

                            <div>
                                <label>Used Condition</label>
                                <select
                                    value={usedCondition}
                                    onChange={(event) => setUsedCondition(event.target.value)}
                                >
                                    <option value="">Select condition</option>
                                    <option value="Like New">Like New</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Good">Good</option>
                                    <option value="Fair">Fair</option>
                                </select>
                            </div>

                            <div>
                                <label>Product Age (years)</label>
                                <input
                                    type="number"
                                    value={productAge}
                                    onChange={(event) => setProductAge(event.target.value)}
                                />
                            </div>

                            <div>
                                <label>Defects</label>
                                <textarea
                                    value={defects}
                                    onChange={(event) => setDefects(event.target.value)}
                                />
                            </div>

                            <div>
                                <label>Repair History</label>
                                <textarea
                                    value={repairHistory}
                                    onChange={(event) => setRepairHistory(event.target.value)}
                                />
                            </div>

                            <div>
                                <label>Accessories</label>
                                <textarea
                                    value={accessories}
                                    onChange={(event) => setAccessories(event.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {product?.product_image?.[0] && (
                <img
                    src={product.product_image[0]}
                    alt={product.product_name}
                    width="300"
                />
            )}

            <div>
                <label>Update Images</label>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(event) => setImages(Array.from(event.target.files))}
                />
            </div>

            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
            
            <button type="button" onClick={handleUpdate}>
                Update Product
            </button>
        </main>
    );
}