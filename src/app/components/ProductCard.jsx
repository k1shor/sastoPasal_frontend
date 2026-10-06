import Link from "next/link";

export default function ProductCard({product}){
    return(
        // when click in this card, we will step too product's details page
        <Link href={`/products/${product._id}`}>
            <div>
                 {/* Display the first product image if available */}
                {product.product_image?.[0] && (
                    <img 
                        src={product.product_image?.[0]}
                        alt={product.product_name}
                    /> 
                )}
                <h3>
                    {product.product_name}
                </h3>
                <p>
                    Rs. {product.product_price}
                </p>
                <p>
                    Condition: {product.product_condition}
                </p>
                <p>
                    Brand: {product.product_brand}
                </p>
                <p> 
                    Stock: {product.count_in_stock}
                </p>
            </div>
        </Link>
    )
}