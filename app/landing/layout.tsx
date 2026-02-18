import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stepwise - Landing Page Variants",
  description: "Explore different landing page designs for Stepwise - Interactive Product Demo Builder",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Source+Sans+3:wght@300;400;600&family=Nunito:wght@400;600;700;800&family=Lora:wght@400;500&family=Chakra+Petch:wght@400;500;600;700&family=Work+Sans:wght@300;400;500&family=Raleway:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
        rel="stylesheet"
      />
      {children}
    </>
  );
}
