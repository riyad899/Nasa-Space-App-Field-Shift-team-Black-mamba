import Script from "next/script";

export function ComputerStoreSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ComputerStore",
    name: "TechSpace & Computer Hub",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80",
    description: "Premium computers, high-performance workstations, custom gaming rigs, and certified electronics.",
    telephone: "+1-800-555-TECH",
    address: {
      "@type": "PostalAddress",
      streetAddress: "450 Innovation Parkway",
      addressLocality: "Houston",
      addressRegion: "TX",
      postalCode: "77058",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "29.5593",
      longitude: "-95.0900",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "20:00",
      },
    ],
    priceRange: "$$",
  };

  return (
    <Script
      id="computer-store-schema"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default ComputerStoreSchema;
