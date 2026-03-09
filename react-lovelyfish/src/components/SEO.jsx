import { Helmet } from "react-helmet-async";

function SEO({ 
  title = "Lovely Fish Aquarium",
  description = "Lovely Fish Aquarium provides high-quality aquarium equipment, fish tank accessories, filters, pumps, and aquarium supplies in New Zealand.",
  url = "https://lovelyfishaquarium.co.nz"
}) {
  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{title}</title>

      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Open Graph (for Facebook / social sharing) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}

export default SEO;