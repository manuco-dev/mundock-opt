import React from 'react';

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewStructuredDataProps {
  reviews: Review[];
}

export default function ReviewStructuredData({ reviews }: ReviewStructuredDataProps) {
  if (!reviews || reviews.length === 0) return null;

  const aggregateRating = {
    ratingValue: (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1),
    reviewCount: reviews.length,
    bestRating: 5,
    worstRating: 1
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://mundovacacional.com/#organization",
    "name": "Mundo Vacacional",
    "url": "https://mundovacacional.com",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": aggregateRating.ratingValue,
      "reviewCount": aggregateRating.reviewCount,
      "bestRating": aggregateRating.bestRating,
      "worstRating": aggregateRating.worstRating
    },
    "review": reviews.slice(0, 10).map(review => ({
      "@type": "Review",
      "@id": `https://mundovacacional.com/reviews/${review._id}`,
      "author": {
        "@type": "Person",
        "name": review.name
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": 5,
        "worstRating": 1
      },
      "reviewBody": review.comment,
      "datePublished": new Date(review.createdAt).toISOString(),
      "itemReviewed": {
        "@type": "LocalBusiness",
        "name": "Mundo Vacacional",
        "url": "https://mundovacacional.com"
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}