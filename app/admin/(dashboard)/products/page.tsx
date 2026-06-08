import { getProducts } from "@/app/admin/_actions/products"
import { ProductForm, ProductList } from "@/app/admin/_components/products-form"

export default async function ProductsPage() {
  const rows = await getProducts()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Products</h1>
      <ProductForm />
      <div className="mt-8">
        <ProductList rows={rows} />
      </div>
    </div>
  )
}
