"use client";
import { useRouter } from "next/navigation";

export default function DeleteProductButton({ productId }) {
    const router = useRouter();
    async function handleDelete() {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        )

        if (!confirmed) {
            return
        }

        const response = await fetch(
             `${process.env.NEXT_PUBLIC_API_URL}/api/product/${id}`,
            {
                method: "DELETE",
            }
        )

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || "Failed to delete product")
        }

        console.log("Product deleted:", data)
        router.push("/products")
    }

    return (
        <button type="button" onClick={handleDelete}>
            Delete Product
        </button>
    )
}