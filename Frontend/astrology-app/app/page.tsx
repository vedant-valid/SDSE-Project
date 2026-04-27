import Navbar from '@/components/layout/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import GoldDivider from '@/components/landing/GoldDivider'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import StatsSection from '@/components/landing/StatsSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import ServicesSection from '@/components/landing/ServicesSection'
import WordsOfJoySection from '@/components/landing/WordsOfJoySection'
import CtaBanner from '@/components/landing/CtaBanner'
import Footer from '@/components/landing/Footer'

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-void text-starlight">
      <Navbar />
      <HeroSection />
      <GoldDivider />
      <TestimonialsSection />
      <StatsSection />
      <HowItWorksSection />
      <ServicesSection />
      <WordsOfJoySection />
      <GoldDivider />
      <CtaBanner />
      <Footer />
    </main>
  )
}
