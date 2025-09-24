import mongoose from 'mongoose';

interface IAdminUser {
  username: string;
  password: string;
  email?: string;
  role: 'admin' | 'super_admin';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

const AdminUserSchema = new mongoose.Schema<IAdminUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AdminUser = mongoose.models.AdminUser || mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);

export default AdminUser;
export type { IAdminUser };