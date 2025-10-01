import mongoose from 'mongoose';

interface IPromotionBanner {
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  customTitle?: string; // Título personalizado opcional para mostrar en el banner
  customDescription?: string; // Descripción personalizada opcional para mostrar en el banner
  filename?: string; // Cloudinary public_id
  originalName?: string; // Nombre original del archivo
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const promotionBannerSchema = new mongoose.Schema<IPromotionBanner>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 200
  },
  imageUrl: {
    type: String,
    required: true
  },
  linkUrl: {
    type: String,
    trim: true
  },
  customTitle: {
    type: String,
    trim: true,
    maxlength: 100
  },
  customDescription: {
    type: String,
    trim: true,
    maxlength: 200
  },
  filename: {
    type: String,
    trim: true
  },
  originalName: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient querying
promotionBannerSchema.index({ isActive: 1, order: 1 });

const PromotionBanner = mongoose.models.PromotionBanner || mongoose.model<IPromotionBanner>('PromotionBanner', promotionBannerSchema);

export default PromotionBanner;
export type { IPromotionBanner };