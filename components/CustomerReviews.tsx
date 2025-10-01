'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import AOS from 'aos';
import ReviewStructuredData from './ReviewStructuredData';

interface Review {
  _id: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  customerImage?: {
    url: string;
    filename: string;
    originalName: string;
  };
  customerVideo?: {
    url: string;
    filename: string;
    originalName: string;
  };
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

const CustomerReviews = () => {
  const [currentReview, setCurrentReview] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar reseñas desde la API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews?all=true');
        if (response.ok) {
          const data = await response.json();
          setReviews(data || []);
        } else {
          setError('Error al cargar las reseñas');
        }
      } catch (error) {
        setError('Error de conexión');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const goToReview = (index: number) => {
    setCurrentReview(index);
  };

  // Removed auto-slide functionality for manual user control

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-xl ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ⭐
      </span>
    ));
  };

  // Mostrar loading o mensaje cuando no hay reseñas
  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando reseñas...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-playfair-display text-dark-blue mb-4">
              Lo que Dicen Nuestros Clientes
            </h2>
            <p className="text-lg text-gray-600">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
      <ReviewStructuredData reviews={reviews.map(review => ({
        _id: review._id,
        name: review.customerName,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt
      }))} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16" data-aos="fade-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-playfair-display text-dark-blue mb-4">
            Lo que Dicen Nuestros Clientes
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Experiencias reales de huéspedes satisfechos
          </p>
          <div className="w-24 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto mt-6"></div>
        </div>

        {/* Reviews Carousel */}
        <div className="relative max-w-4xl mx-auto" data-aos="fade-up" data-aos-delay="200">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8 lg:p-10">
            {reviews.length > 0 && reviews[currentReview] && (
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-4">
                  <Image
                    src={reviews[currentReview].customerImage?.url || '/placeholder-user.jpg'}
                    alt={reviews[currentReview].customerName}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>

                {/* Featured Badge */}
                {reviews[currentReview].isFeatured && (
                  <div className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 bg-yellow-100 text-yellow-800">
                    ⭐ Reseña Destacada
                  </div>
                )}

                {/* Stars */}
                <div className="flex justify-center mb-4">
                  {renderStars(reviews[currentReview].rating)}
                </div>

                {/* Comment */}
                <blockquote className="text-gray-700 text-lg sm:text-xl leading-relaxed mb-6 max-w-3xl">
                  "{reviews[currentReview].comment}"
                </blockquote>

                {/* Video del cliente si existe */}
                {reviews[currentReview].customerVideo?.url && (
                  <div className="mb-6">
                    <video
                      src={reviews[currentReview].customerVideo.url}
                      className="w-full max-w-md mx-auto rounded-lg"
                      controls
                      poster={reviews[currentReview].customerImage?.url}
                    />
                  </div>
                )}

                {/* Author Info */}
                <div className="text-center">
                  <h4 className="font-bold text-dark-blue text-lg">
                    {reviews[currentReview].customerName}
                  </h4>
                  <p className="text-gray-500 text-sm">
                    {new Date(reviews[currentReview].createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Arrows - Solo mostrar si hay reseñas */}
          {reviews.length > 0 && (
            <>
              <button
                onClick={prevReview}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-dark-blue p-3 rounded-full shadow-lg transition-all duration-300 z-10"
                aria-label="Reseña anterior"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextReview}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-dark-blue p-3 rounded-full shadow-lg transition-all duration-300 z-10"
                aria-label="Siguiente reseña"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Indicators - Solo mostrar si hay reseñas */}
        {reviews.length > 0 && (
          <div className="flex justify-center mt-8 space-x-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => goToReview(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentReview
                    ? 'bg-gold scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Ir a reseña ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 sm:mt-16" data-aos="fade-up" data-aos-delay="400">
          <div className="text-center bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl sm:text-4xl font-bold text-gold mb-2">100+</div>
            <div className="text-gray-600">huéspedes satisfechos</div>
          </div>
          <div className="text-center bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl sm:text-4xl font-bold text-gold mb-2">
              {reviews.length > 0 ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1) : '5.0'}
            </div>
            <div className="text-gray-600">Calificación Promedio</div>
          </div>
          <div className="text-center bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl sm:text-4xl font-bold text-gold mb-2">
              {reviews.length > 0 ? Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100) : 100}%
            </div>
            <div className="text-gray-600">Recomendación</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;