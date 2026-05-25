import {
  Nav,
  Hero,
  Strip,
  Steps,
  Features,
  Showcase,
  Pricing,
  Faq,
  CtaBand,
  Footer,
} from "@/components/landing";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Strip />
        <Steps />
        <Features />
        <Showcase />
        <Pricing />
        <Faq />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
