export const metadata = {
  title: "PreOffer — Подготовка к IT-собеседованию",
  description:
    "PreOffer помогает джунам и мидлам готовиться к IT-собеседованиям через частые вопросы и понятные ответы",
};

import Hero from "@/components/hero-home";
import BusinessCategories from "@/components/business-categories";
import FeaturesPlanet from "@/components/features-planet";
import LargeTestimonial from "@/components/large-testimonial";
import Cta from "@/components/cta";

export default function Home() {
  return (
    <>
      <Hero />
      <BusinessCategories />
      <FeaturesPlanet />
      <LargeTestimonial />
      <Cta />
    </>
  );
}
