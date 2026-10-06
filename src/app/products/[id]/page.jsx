import Link from "next/link";
import DeleteProductButton from "@/app/components/DeleteProductButton";

// Get one product from the backend using its ID
async function getProduct(id){
     const response = await fetch(
        `http://localhost:5000/api/product/${id}`
    );
    // Check if the API request was successful
    if(!response.ok){
        return null
    }
    // Convert the response into JSON data
    return response.json()

}

export default async function ProductDetailsPage({params}){
    const {id} = await params

    const product = await getProduct(id)
    if (!product) {
        return (
            <main>
                <h1>Product Not Found</h1>
                <p>This product does not exist or has been deleted.</p>
                <Link href="/products">Back to Products</Link>
            </main>
        );
    }

    return(
        <main>
            <h1> Product Details</h1>

            <h2>{product.product_name}</h2>

            <p>{product.product_description}</p>

            <p>Price: Rs. {product.product_price}</p>

            <p>Brand: {product.product_brand}</p>

            <p>Condition: {product.product_condition}</p>

            <p>Stock: {product.count_in_stock}</p>

            <p>Rating: {product.rating}</p>

            {product.product_condition === "Used" && (
                <div>
                    <h2>Used Product Details</h2>

                    <p>Used Condition: {product.usedCondition}</p>
                    <p>Product Age: {product.productAge} years</p>
                    <p>Defects: {product.defects || "None"}</p>
                    <p>Repair History: {product.repairHistory || "None"}</p>
                    <p>Accessories: {product.accessories || "None"}</p>
                </div>
            )}

            {/* Display the first product image if available */}
            {product.product_image?.[0] && (
                <img
                    src={product.product_image[0]}
                    alt={product.product_name}
                    width="300"
                />
            )}
            
            <Link href={`/products/${product._id}/edit`} className="edit-link">
                Edit Product
            </Link>

            <DeleteProductButton productId={product._id} />

        </main>
    )
}