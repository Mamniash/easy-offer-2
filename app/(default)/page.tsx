export const metadata = {
  title: "PreOffer — подготовка к собеседованиям",
  description: "Платформа для уверенной подготовки к IT-собеседованиям",
};

import Hero from "@/components/hero-home";
import BusinessCategories from "@/components/business-categories";
import FeaturesPlanet from "@/components/features-planet";
import LargeTestimonial from "@/components/large-testimonial";
import Cta from "@/components/cta";
import RedirectIfAuthed from "@/components/home/redirect-if-authed";

export default function Home() {
  return (
    <RedirectIfAuthed>
      <Hero />
      <BusinessCategories />
      <FeaturesPlanet />
      <LargeTestimonial />
      <Cta />
    </RedirectIfAuthed>
  );
}
