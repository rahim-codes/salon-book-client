import CategoriesPage from "@/components/HomePage/CategoryPage"
import FeaturedServices from "@/components/HomePage/FeaturedServices"
import HeroSection from "@/components/HomePage/HeroSection"
import HowItWorksSection from "@/components/HomePage/HowItWorksSection"

export default function Page() {
  return (
    <div>
      <HeroSection />
      <FeaturedServices />
      <CategoriesPage />
      <HowItWorksSection />
    </div>
  )
}
