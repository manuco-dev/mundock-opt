import mongoose from 'mongoose';

export interface IProperty {
  _id?: string;
  title: string;
  description: string;
  type: 'apartment' | 'country_house'; // apartamento o casa finca
  bedrooms: number;
  bathrooms: number;
  hasPool: boolean;
  isFurnished: boolean;
  amenities: string[];
  images: {
    url: string;
    filename?: string; // Cloudinary public_id
    originalName?: string;
  }[];
  price: number;
  location: string;
  googleMapUrl?: string; // URL del mapa de Google Maps
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new mongoose.Schema<IProperty>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['apartment', 'country_house']
  },
  bedrooms: {
    type: Number,
    required: true,
    min: 0
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 0
  },
  hasPool: {
    type: Boolean,
    default: false
  },
  isFurnished: {
    type: Boolean,
    default: false
  },
  amenities: {
    type: [String],
    default: []
  },
  images: [
    {
      url: {
        type: String,
        required: true
      },
      filename: {
        type: String,
        trim: true
      },
      originalName: {
        type: String,
        trim: true
      }
    }
  ],
  price: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  googleMapUrl: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices para búsquedas eficientes
propertySchema.index({ type: 1, isActive: 1 });
propertySchema.index({ bedrooms: 1, bathrooms: 1 });
propertySchema.index({ hasPool: 1, isFurnished: 1 });

const Property = mongoose.models.Property || mongoose.model<IProperty>('Property', propertySchema);

export default Property;