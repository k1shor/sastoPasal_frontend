"use client";

// useState lets us store and update values inside the page
import { useState } from "react";
import ProductCard from "@/app/components/ProductCard";

// Fetch all products from the backend API
async function getAllProducts() {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product`
    )

    if (!response.ok) {
        throw new Error("Failed to fetch products")
    }

    return response.json()
}


// Search products from the backend API
async function searchProducts(keyword) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product/search?keyword=${keyword}`
    )

    if (!response.ok) {
        throw new Error("Failed to search products")
    }

    return response.json()
}


// Send price range to backend and return filtered products
async function filterProducts(minPrice, maxPrice) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/filterproduct`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                product_price: [Number(minPrice), Number(maxPrice)],
            }),
        }
    )

    if (!response.ok) {
        const errorData = await response.text()
        console.log("Backend error:", errorData)
        throw new Error(`Filter failed: ${response.status}`)
    }

    return response.json()
}

export default function ProductsPage(){

    const [keyword, setKeyword] = useState("")
    const [products, setProducts] = useState([])

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const [minPrice, setMinPrice] = useState("")
    const [maxPrice, setMaxPrice] = useState("")
    const [sortBy, setSortBy] = useState("")
    
    {/*Sort Products*/}
    function sortProducts(){
        const sortedProducts = [...products].sort((a, b) => {
            if (sortBy === "price-low") {
                return Number(a.product_price) - Number(b.product_price)
            }

            if (sortBy === "price-high") {
                return Number(b.product_price) - Number(a.product_price)
            }

            if (sortBy === "newest") {
                return new Date(b.createdAt) - new Date(a.createdAt)
            }

            return 0
        })
        return sortedProducts
    }

    // Handle the Search button click
    async function handleSearch() {

        try {
            setLoading(true)
            setError("");
            // Call searchProducts and pass the keyword
            const data = await searchProducts(keyword)
            setProducts(data)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    // Handle the Show All Products button click
    async function handleGetAllProducts() {

        try {
            setLoading(true)
            setError("")

            // Call the get-all-products API function
            const data = await getAllProducts()
            setProducts(data)

        } catch (error) {
            setError(error.message)

        } finally {
            setLoading(false)
        }
    }

    //Handle product filtering bassed on min, max price
    async function handleFilter() {
        try {
            setLoading(true)
            setError("")

            const data = await filterProducts(minPrice, maxPrice)

            setProducts(data)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main>
            <h1> Products </h1>
            <p>  Browse products available on Sasto Pasal </p><br />

            <button onClick={handleGetAllProducts}  className="px-4 py-2"> Show All Products</button> <br />

            {/* Search section */}
            <section>
                <h2>Search Products</h2>
                <input 
                    type="text" placeholder="Search Product" value={keyword}
                    // Update keyword whenever the user types
                    onChange = {(event) => setKeyword(event.target.value)}
                />
                <button onClick={handleSearch}>Search</button> <br /> 

                {/*Filter by Price*/ }
                <h2>Filter by Price</h2>
                <input
                    type="number"
                    placeholder="Minimum Price"
                    value={minPrice}
                    onChange={(event) => setMinPrice(event.target.value)}
                 /> 

                <input
                    type="number"
                    placeholder="Maximum Price"
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                />

                <button onClick={handleFilter}>
                    Filter
                </button>

                {/* Sort Products */ }
                <h2>Sort Products</h2>
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                    <option value="">Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                </select>

                {loading && <p>Loading products...</p>}
                {error && <p>{error}</p>}
            </section>

             {/* Products section */}
            <section>
                <h2>All Products</h2>
                <div>
                    {products.length === 0 ? (
                        <p>No products found.</p>
                    ) : (
                        sortProducts().map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                            />
                        ))
                    )}
                </div>
            </section>
        </main>  
    )
}