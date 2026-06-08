import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { getProductCount } from "@/lib/data"

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const productCount = await getProductCount()

  return (
    <>
      <Navbar showProducts={productCount > 0} />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
