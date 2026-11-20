import CategoriesPage from "@/components/HomePage/CategoryPage"
import FeaturedServices from "@/components/HomePage/FeaturedServices"
import HeroSection from "@/components/HomePage/HeroSection"

export default function Page() {
  return (
    <div>
      <HeroSection />
      <FeaturedServices />
      <CategoriesPage />
    </div>
  )
}
