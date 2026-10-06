"use client";
import { useState } from "react";

export default function AddProductPage() {

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

    async function handleSubmit(event) {
        event.preventDefault()

        setMessage("")
        setError("")

        try {
            const formData = new FormData();

            // Field names must match the backend validation/model
            formData.append("product_name", productName)
            formData.append("product_description", description)
            formData.append("product_brand", brand)
            formData.append("product_price", price)
            formData.append("count_in_stock", stock)
            formData.append("product_condition", condition)

            if (condition === "Used") {
                formData.append("usedCondition", usedCondition)
                formData.append("productAge", productAge)
                formData.append("defects", defects)
                formData.append("repairHistory", repairHistory)
                formData.append("accessories", accessories)
            }

            for (const image of images) {
                formData.append("product_image", image)
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/product`,
                {
                    method: "POST",
                    body: formData,
                }
            )

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to add product")
            }

            const data = await response.json()

            console.log("Product added:", data)
            setMessage("Product added successfully!")
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <main>
            <h1>Add Product</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Product Name</label>
                    <input
                        type="text"
                        value={productName}
                        onChange={(event) => setProductName(event.target.value)}
                    />
                </div><br/>

                <div>
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                    />
                </div><br/>

                <div>
                    <label>Product Images</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(event) => setImages(event.target.files)}
                    />
                </div><br/>

                <div>
                    <label>Brand</label>
                    <input
                        type="text"
                        value={brand}
                        onChange={(event) => setBrand(event.target.value)}
                    />
                </div><br/>


                <div>
                    <label>Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}
                    />
                </div><br/>

                <div>
                    <label>Stock</label>
                    <input
                        type="number"
                        value={stock}
                        onChange={(event) => setStock(event.target.value)}
                    />
                </div><br/>

                <div>
                    <label>Condition</label>
                    <select
                        value={condition}
                        onChange={(event) => setCondition(event.target.value)}
                    >
                        <option value="New">New</option>
                        <option value="Used">Used</option>
                    </select>
                    
                    {condition === "Used" && (
                        <div>
                            <h2>Used Product Details</h2>

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

                            <br />

                            <label>Product Age (years)</label>
                            <input
                                type="number"
                                value={productAge}
                                onChange={(event) => setProductAge(event.target.value)}
                            />
                            <br />

                            <label>Defects</label>
                            <textarea
                                value={defects}
                                onChange={(event) => setDefects(event.target.value)}
                            />

                            <br />

                            <label>Repair History</label>
                            <textarea
                                value={repairHistory}
                                onChange={(event) => setRepairHistory(event.target.value)}
                            />

                            <br />

                            <label>Accessories</label>
                            <textarea
                                value={accessories}
                                onChange={(event) => setAccessories(event.target.value)}
                            />
                        </div>
                    )}
                </div>
                <button type="submit">
                    Add Product
                </button>
            </form>
            {message && <p>{message}</p>}
            {error && <p>{error}</p>} 
        </main>
    )
}