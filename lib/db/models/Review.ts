import mongoose from 'mongoose';

interface IReview {
  customerName: string;
  customerEmail?: string;
  rating: number; // 1-5 estrellas
  comment: string;
  customerImage?: {
    url: string;
    filename?: string; // Cloudinary public_id
    originalName?: string;
  };
  customerVideo?: {
    url: string;
    filename?: string; // Cloudinary public_id
    originalName?: string;
  };
  isActive: boolean;
  isFeatured: boolean; // Para destacar ciertas reseñas
  order: number; // Para ordenar las reseñas
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new mongoose.Schema<IReview>({
  customerName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  customerEmail: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido']
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  customerImage: {
    url: {
      type: String,
      trim: true
    },
    filename: {
      type: String,
      trim: true
    },
    originalName: {
      type: String,
      trim: true
    }
  },
  customerVideo: {
    url: {
      type: String,
      trim: true
    },
    filename: {
      type: String,
      trim: true
    },
    originalName: {
      type: String,
      trim: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Índices para búsquedas eficientes
reviewSchema.index({ isActive: 1, order: 1 });
reviewSchema.index({ rating: 1, isActive: 1 });
reviewSchema.index({ isFeatured: 1, isActive: 1 });
reviewSchema.index({ createdAt: -1 });

const Review = mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);

export default Review;
export type { IReview };