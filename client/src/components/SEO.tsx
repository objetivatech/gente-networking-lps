import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  structuredData?: object;
}

export function SEO({
  title,
  description,
  keywords,
  ogImage = "/images/logo-gente-networking.png",
  ogType = "website",
  canonicalUrl,
  structuredData,
}: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = `${title} | Gente Networking`;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const attribute = property ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute("content", content);
    };

    // Basic meta tags
    updateMetaTag("description", description);
    if (keywords) {
      updateMetaTag("keywords", keywords);
    }

    // Open Graph tags
    updateMetaTag("og:title", `${title} | Gente Networking`, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:type", ogType, true);
    updateMetaTag("og:image", `${window.location.origin}${ogImage}`, true);
    updateMetaTag("og:url", window.location.href, true);
    updateMetaTag("og:site_name", "Gente Networking", true);

    // Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", `${title} | Gente Networking`);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", `${window.location.origin}${ogImage}`);

    // Canonical URL
    if (canonicalUrl) {
      let linkElement = document.querySelector('link[rel="canonical"]');
      if (!linkElement) {
        linkElement = document.createElement("link");
        linkElement.setAttribute("rel", "canonical");
        document.head.appendChild(linkElement);
      }
      linkElement.setAttribute("href", canonicalUrl);
    }

    // Structured Data (JSON-LD)
    if (structuredData) {
      let scriptElement = document.querySelector('script[type="application/ld+json"]');
      if (!scriptElement) {
        scriptElement = document.createElement("script");
        scriptElement.setAttribute("type", "application/ld+json");
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(structuredData);
    }
  }, [title, description, keywords, ogImage, ogType, canonicalUrl, structuredData]);

  return null;
}

// Structured Data Helpers
export const createOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Gente Networking",
  "url": "https://gentenetworking.com.br",
  "logo": "https://gentenetworking.com.br/images/logo-gente-networking.png",
  "description": "Grupo de Networking Empresarial que conecta empresários e profissionais para gerar negócios através de relacionamentos estratégicos",
  "sameAs": [
    "https://www.linkedin.com/company/gente-networking",
    "https://www.instagram.com/gentenetworking",
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "email": "contato@gentenetworking.com.br",
  },
});

export const createEventSchema = (event: {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
  image?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  "name": event.name,
  "description": event.description,
  "startDate": event.startDate,
  "endDate": event.endDate,
  "location": event.location
    ? {
        "@type": "VirtualLocation",
        "url": "https://gentenetworking.com.br/gentehub",
      }
    : undefined,
  "image": event.image || "https://gentenetworking.com.br/images/gente-networking-pitch-publico.png",
  "organizer": {
    "@type": "Organization",
    "name": "Gente Networking",
    "url": "https://gentenetworking.com.br",
  },
  "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
  "eventStatus": "https://schema.org/EventScheduled",
});

export const createBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url,
  })),
});
