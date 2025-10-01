'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Trash2, 
  LogOut, 
  Image as ImageIcon, 
  Video, 
  Plus,
  Loader2,
  Eye,
  EyeOff,
  Home,
  Building,
  Star,
  Users,
  UserPlus
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import HeroBlobUpload from '@/components/HeroBlobUpload';
import ImageUpload from '@/components/ImageUpload';
import { useAuth } from '@/hooks/use-auth';
import AuthGuard from '@/components/AuthGuard';

interface HeroImage {
  _id: string;
  filename: string;
  originalName: string;
  url: string;
  type: 'image' | 'video';
  isActive: boolean;
  order: number;
  createdAt: string;
}

interface PromotionBanner {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  customTitle?: string;
  customDescription?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
}

interface User {
  id: string;
  username: string;
  role: string;
}

interface AdminUser {
  _id: string;
  username: string;
  email?: string;
  role: 'admin' | 'super_admin';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export default function AdminDashboard() {
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const [images, setImages] = useState<HeroImage[]>([]);
  const [banners, setBanners] = useState<PromotionBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isBannerUploading, setIsBannerUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string>('');
  const [uploadedBannerImageUrl, setUploadedBannerImageUrl] = useState<string>('');
  const [fileType, setFileType] = useState<'image' | 'video'>('image');
  const [fileOrder, setFileOrder] = useState(0);


  const [bannerCustomTitle, setBannerCustomTitle] = useState('');
  const [bannerCustomDescription, setBannerCustomDescription] = useState('');
  const [bannerOrder, setBannerOrder] = useState(0);
  const [activeTab, setActiveTab] = useState<'hero' | 'banners' | 'users'>('hero');
  
  // Estados para gestión de usuarios
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [newUserData, setNewUserData] = useState({
    username: '',
    password: '',
    email: '',
    role: 'admin' as 'admin' | 'super_admin'
  });
  const router = useRouter();

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
      return;
    }
    
    if (isAuthenticated) {
      fetchImages();
      fetchBanners();
      setIsLoading(false);
    }
  }, [isAuthenticated, authLoading, router]);

  // Cargar usuarios cuando se selecciona la pestaña de usuarios
  useEffect(() => {
    if (activeTab === 'users' && isAuthenticated) {
      fetchUsers();
    }
  }, [activeTab, isAuthenticated]);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/hero-images');
      if (response.ok) {
        const data = await response.json();
        setImages(data.images);
      }
    } catch (error) {
      setError('Error al cargar las imágenes');
    }
  };

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/promotion-banners');
      if (response.ok) {
        const data = await response.json();
        setBanners(data.banners);
      }
    } catch (error) {
      setError('Error al cargar los banners');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  // Funciones para gestión de usuarios
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setAdminUsers(data.users);
      } else {
        setError('Error al cargar usuarios');
      }
    } catch (error) {
      setError('Error al cargar usuarios');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserData.username || !newUserData.password) {
      setError('Username y contraseña son requeridos');
      return;
    }

    setIsLoadingUsers(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Usuario creado exitosamente');
        setNewUserData({ username: '', password: '', email: '', role: 'admin' });
        setShowCreateUserForm(false);
        fetchUsers();
      } else {
        setError(data.error || 'Error al crear usuario');
      }
    } catch (error) {
      setError('Error al crear usuario');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Usuario eliminado exitosamente');
        fetchUsers();
      } else {
        setError(data.error || 'Error al eliminar usuario');
      }
    } catch (error) {
      setError('Error al eliminar usuario');
    }
  };



  const handleSaveToHero = async (url: string, type: 'image' | 'video') => {
    if (!url) return;

    setIsUploading(true);
    setError('');
    setSuccess('');

    try {
      // Extraer filename de la URL local
      const filename = url.split('/').pop() || '';
      
      const response = await fetch('/api/hero-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          filename: filename,
          type: type,
          order: fileOrder,
          originalName: `hero_${Date.now()}`
        }),
      });

      if (response.ok) {
        setSuccess(`${type === 'image' ? 'Imagen' : 'Video'} guardado en hero exitosamente`);
        fetchImages(); // Recargar lista
        
        // Limpiar la vista previa después de 3 segundos para mostrar el resultado
        setTimeout(() => {
          if (type === 'image') {
            setUploadedImageUrl('');
          } else {
            setUploadedVideoUrl('');
          }
          setFileOrder(0);
        }, 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Error al guardar archivo');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setIsUploading(false);
    }
  };

  // Funciones para el componente HeroImageUpload
  const handleHeroImageChange = (url: string) => {
    setUploadedImageUrl(url);
  };

  const handleHeroVideoChange = (url: string) => {
    setUploadedVideoUrl(url);
  };

  const handleHeroImageRemove = () => {
    setUploadedImageUrl('');
  };

  const handleHeroVideoRemove = () => {
    setUploadedVideoUrl('');
  };

  const handleHeroUploadStart = () => {
    setIsUploading(true);
    setError('');
    setSuccess('');
  };

  const handleHeroUploadComplete = async (url: string, type: 'image' | 'video') => {
    try {
      // Guardar automáticamente en la base de datos
      await handleSaveToHero(url, type);
      setSuccess(`${type === 'image' ? 'Imagen' : 'Video'} subido y guardado exitosamente en el hero.`);
    } catch (error) {
      setError(`Error al guardar ${type === 'image' ? 'imagen' : 'video'} en el hero`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleHeroUploadError = (error: any) => {
    setError('Error al subir archivo: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    setIsUploading(false);
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) return;

    try {
      const response = await fetch(`/api/hero-images?id=${imageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Imagen eliminada exitosamente');
        fetchImages(); // Recargar lista
      } else {
        const data = await response.json();
        setError(data.error || 'Error al eliminar imagen');
      }
    } catch (error) {
      setError('Error de conexión');
    }
  };

  const handleBannerCloudinaryUpload = (url: string) => {
    setUploadedBannerImageUrl(url);
    setSuccess('Imagen subida a Cloudinary exitosamente');
    setError('');
    setIsBannerUploading(false); // Resetear estado de carga
  };

  const handleBannerCloudinaryUploadStart = () => {
    setIsBannerUploading(true);
    setError('');
    setSuccess('');
  };

  const handleBannerUpload = async () => {
    if (!uploadedBannerImageUrl) {
      setError('Imagen es requerida');
      return;
    }

    setIsBannerUploading(true);
    setError('');
    setSuccess('');

    try {
      // Extraer public_id de la URL de Cloudinary
      const urlParts = uploadedBannerImageUrl.split('/');
      const publicIdWithExtension = urlParts[urlParts.length - 1];
      const publicId = publicIdWithExtension.split('.')[0];
      const fullPublicId = `mundo-vacacional/banners/${publicId}`;
      
      // Detectar tipo de archivo automáticamente
      const fileExtension = publicIdWithExtension.split('.').pop()?.toLowerCase();
      const detectedType = ['mp4', 'mov', 'avi', 'webm'].includes(fileExtension || '') ? 'video' : 'image';
      
      const payload = {
        url: uploadedBannerImageUrl,
        public_id: fullPublicId,
        originalName: `banner-${Date.now()}.${fileExtension}`,
        title: bannerCustomTitle || 'Banner sin título',
        description: bannerCustomDescription || '',

        customTitle: bannerCustomTitle,
        customDescription: bannerCustomDescription,
        order: bannerOrder
      };

      const response = await fetch('/api/promotion-banners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSuccess('Banner creado exitosamente');
        setUploadedBannerImageUrl('');


        setBannerCustomTitle('');
        setBannerCustomDescription('');
        setBannerOrder(0);
        fetchBanners(); // Recargar lista
      } else {
        const data = await response.json();
        setError(data.error || 'Error al crear banner');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setIsBannerUploading(false);
    }
  };

  const handleBannerDelete = async (bannerId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este banner?')) return;

    try {
      const response = await fetch(`/api/promotion-banners/${bannerId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Banner eliminado exitosamente');
        fetchBanners(); // Recargar lista
      } else {
        const data = await response.json();
        setError(data.error || 'Error al eliminar banner');
      }
    } catch (error) {
      setError('Error de conexión');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Panel de Administración</h1>
              <p className="text-sm text-gray-500">Mundo Vacacional CK</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Bienvenido, {user?.username}</span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200 text-red-800">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('hero')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'hero'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Imágenes Hero
              </button>
              <button
                onClick={() => setActiveTab('banners')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'banners'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Banners Promocionales
              </button>
              {user?.role === 'super_admin' && (
                <button
                  onClick={() => setActiveTab('users')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'users'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Gestión de Usuarios
                </button>
              )}
            </nav>
          </div>
        </div>
        
        {/* Admin Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/admin/properties')}>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Propiedades</h3>
                <p className="text-sm text-gray-500">Gestionar apartamentos y casas finca</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/admin/reviews')}>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-medium">Reseñas</h3>
                <p className="text-sm text-gray-500">Gestionar reseñas de clientes</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hero Images Section */}
        {activeTab === 'hero' && (
          <>
            {/* Upload Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Subir Nueva Imagen/Video</span>
                </CardTitle>
                <CardDescription>
                  Sube imágenes o videos para el carrusel del hero. Los archivos se subirán y guardarán automáticamente.
                </CardDescription>
                <Alert className="mt-4 border-blue-200 bg-blue-50">
                  <ImageIcon className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700">
                    <strong>💡 Tip:</strong> Para mejorar la velocidad de carga, te recomendamos convertir tus imágenes a formato WebP antes de subirlas. 
                    Puedes usar herramientas online como <a href="https://convertio.co/es/jpg-webp/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800">Convertio</a> o 
                    <a href="https://squoosh.app/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800">Squoosh</a> para convertir tus imágenes fácilmente.
                  </AlertDescription>
                </Alert>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Label htmlFor="file-order">Orden de visualización</Label>
                  <Input
                    id="file-order"
                    type="number"
                    value={fileOrder}
                    onChange={(e) => setFileOrder(parseInt(e.target.value) || 0)}
                    className="mt-1 max-w-xs"
                    min="0"
                    placeholder="0"
                  />
                </div>
                
                <HeroBlobUpload
                  imageValue={uploadedImageUrl}
                  videoValue={uploadedVideoUrl}
                  onImageChange={handleHeroImageChange}
                  onVideoChange={handleHeroVideoChange}
                  onImageRemove={handleHeroImageRemove}
                  onVideoRemove={handleHeroVideoRemove}
                  disabled={isUploading}
                  onUploadStart={handleHeroUploadStart}
                  onUploadComplete={handleHeroUploadComplete}
                  onUploadError={handleHeroUploadError}
                />
                
                {/* Indicador de estado de carga */}
                {isUploading && (
                  <div className="mt-4 flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-blue-700 text-sm">Subiendo y guardando archivo...</span>
                  </div>
                )}
                
                {/* Vista previa después de la carga automática */}
                {(uploadedImageUrl || uploadedVideoUrl) && !isUploading && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-700 text-sm font-medium">Archivo guardado exitosamente</span>
                    </div>
                    {uploadedImageUrl && (
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden max-w-xs">
                        <Image
                          src={uploadedImageUrl}
                          alt="Vista previa"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    {uploadedVideoUrl && (
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden max-w-xs flex items-center justify-center">
                        <div className="flex flex-col items-center">
                          <Video className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">Video guardado</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Images Grid */}
            <Card>
          <CardHeader>
            <CardTitle>Imágenes del Hero ({images.length})</CardTitle>
            <CardDescription>
              Gestiona las imágenes y videos del carrusel principal
            </CardDescription>
          </CardHeader>
          <CardContent>
            {images.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ImageIcon className="mx-auto h-12 w-12 mb-4" />
                <p>No hay imágenes subidas aún</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {images.map((image) => (
                  <div key={image._id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                    <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                      {image.type === 'image' ? (
                        <Image
                          src={image.url}
                          alt={image.originalName}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full">
                          <Video className="h-8 w-8 text-gray-400" />
                          <span className="text-xs text-gray-500 mt-1">Video</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-2">
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          {image.order}
                        </Badge>
                        <Badge variant={image.type === 'image' ? 'default' : 'secondary'} className="text-xs px-1 py-0">
                          {image.type === 'image' ? (
                            <><ImageIcon className="h-2 w-2 mr-1" /> IMG</>
                          ) : (
                            <><Video className="h-2 w-2 mr-1" /> VID</>
                          )}
                        </Badge>
                      </div>
                      
                      <p className="text-xs font-medium text-gray-900 mb-1 truncate" title={image.originalName}>
                        {image.originalName}
                      </p>
                      <p className="text-xs text-gray-500 mb-2">
                        {new Date(image.createdAt).toLocaleDateString()}
                      </p>
                      
                      <Button
                        onClick={() => handleDelete(image._id)}
                        variant="destructive"
                        size="sm"
                        className="w-full text-xs py-1 h-6"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
            </Card>
          </>
        )}

        {/* Promotion Banners Section */}
        {activeTab === 'banners' && (
          <>
            {/* Banner Upload Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Crear Nuevo Banner Promocional</span>
                </CardTitle>
                <CardDescription>
                  Crea banners promocionales para mostrar entre el hero y la sección principal
                </CardDescription>
                <Alert className="mt-4 border-blue-200 bg-blue-50">
                  <ImageIcon className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700">
                    <strong>💡 Tip:</strong> Para mejorar la velocidad de carga, te recomendamos convertir tus imágenes a formato WebP antes de subirlas. 
                    Puedes usar herramientas online como <a href="https://convertio.co/es/jpg-webp/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800">Convertio</a> o 
                    <a href="https://squoosh.app/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800">Squoosh</a> para convertir tus imágenes fácilmente.
                  </AlertDescription>
                </Alert>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  

                  
                  <div>
                    <Label htmlFor="banner-custom-title">Título Personalizado (Opcional)</Label>
                    <Input
                      id="banner-custom-title"
                      type="text"
                      value={bannerCustomTitle}
                      onChange={(e) => setBannerCustomTitle(e.target.value)}
                      placeholder="Título que aparecerá en el banner"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="banner-custom-description">Descripción Personalizada (Opcional)</Label>
                    <Input
                      id="banner-custom-description"
                      type="text"
                      value={bannerCustomDescription}
                      onChange={(e) => setBannerCustomDescription(e.target.value)}
                      placeholder="Descripción que aparecerá en el banner"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="banner-order">Orden</Label>
                    <Input
                      id="banner-order"
                      type="number"
                      value={bannerOrder}
                      onChange={(e) => setBannerOrder(parseInt(e.target.value) || 0)}
                      className="mt-1"
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label>Imagen del Banner *</Label>
                  <div className="mt-1">
                    <ImageUpload
                      value={uploadedBannerImageUrl}
                      onChange={handleBannerCloudinaryUpload}
                      onUploadStart={handleBannerCloudinaryUploadStart}
                      onUploadError={() => setIsBannerUploading(false)}
                      onRemove={() => {
                        setUploadedBannerImageUrl('');
                        setIsBannerUploading(false);
                      }}
                      disabled={isBannerUploading}
                      folder="mundo-vacacional/banners"
                      transformation={{
                        width: 1200,
                        height: 400,
                        crop: 'fill'
                      }}
                    />
                  </div>
                </div>
                
                <Button
                  onClick={handleBannerUpload}
                  disabled={!uploadedBannerImageUrl || isBannerUploading}
                  className="mt-4 w-full md:w-auto"
                >
                  {isBannerUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando Banner...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Crear Banner
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Banners Grid */}
            <Card>
              <CardHeader>
                <CardTitle>Banners Promocionales ({banners.length})</CardTitle>
                <CardDescription>
                  Gestiona los banners promocionales del sitio web
                </CardDescription>
              </CardHeader>
              <CardContent>
                {banners.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ImageIcon className="mx-auto h-12 w-12 mb-4" />
                    <p>No hay banners creados aún</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {banners.map((banner) => (
                      <div key={banner._id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                        <div className="aspect-video bg-gray-100">
                          <img
                            src={banner.imageUrl}
                            alt={banner.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="default">
                              <ImageIcon className="h-3 w-3 mr-1" /> Banner
                            </Badge>
                            <Badge variant="outline">Orden: {banner.order}</Badge>
                          </div>
                          
                          <h3 className="text-sm font-medium text-gray-900 mb-1">
                            {banner.title}
                          </h3>
                          {banner.description && (
                            <p className="text-xs text-gray-600 mb-2">
                              {banner.description}
                            </p>
                          )}
                          {banner.linkUrl && (
                            <p className="text-xs text-blue-600 mb-2 truncate">
                              {banner.linkUrl}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mb-3">
                            {new Date(banner.createdAt).toLocaleDateString()}
                          </p>
                          
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleBannerDelete(banner._id)}
                              variant="destructive"
                              size="sm"
                              className="flex-1"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Users Management Section */}
        {activeTab === 'users' && user?.role === 'super_admin' && (
          <>
            {/* Create User Form */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gestión de Usuarios Admin</CardTitle>
                    <CardDescription>
                      Crear y gestionar usuarios administradores del sistema
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setShowCreateUserForm(!showCreateUserForm)}
                    className="flex items-center space-x-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Nuevo Usuario</span>
                  </Button>
                </div>
              </CardHeader>
              
              {showCreateUserForm && (
                <CardContent>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="username">Username *</Label>
                        <Input
                          id="username"
                          type="text"
                          value={newUserData.username}
                          onChange={(e) => setNewUserData({...newUserData, username: e.target.value})}
                          placeholder="Ingresa el username"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUserData.email}
                          onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                          placeholder="Ingresa el email (opcional)"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Contraseña *</Label>
                        <Input
                          id="password"
                          type="password"
                          value={newUserData.password}
                          onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                          placeholder="Ingresa la contraseña"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="role">Rol</Label>
                        <Select
                          value={newUserData.role}
                          onValueChange={(value: 'admin' | 'super_admin') => 
                            setNewUserData({...newUserData, role: value})
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="super_admin">Super Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button type="submit" disabled={isLoadingUsers}>
                        {isLoadingUsers ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <UserPlus className="h-4 w-4 mr-2" />
                        )}
                        Crear Usuario
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowCreateUserForm(false);
                          setNewUserData({ username: '', password: '', email: '', role: 'admin' });
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              )}
            </Card>

            {/* Users List */}
            <Card>
              <CardHeader>
                <CardTitle>Usuarios Administradores ({adminUsers.length})</CardTitle>
                <CardDescription>
                  Lista de todos los usuarios administradores del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingUsers ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : adminUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="mx-auto h-12 w-12 mb-4" />
                    <p>No hay usuarios administradores</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {adminUsers.map((adminUser) => (
                      <div key={adminUser._id} className="border rounded-lg p-4 bg-white shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className="bg-blue-100 p-2 rounded-full">
                                <Users className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{adminUser.username}</h3>
                                {adminUser.email && (
                                  <p className="text-sm text-gray-600">{adminUser.email}</p>
                                )}
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge 
                                    variant={adminUser.role === 'super_admin' ? 'default' : 'secondary'}
                                  >
                                    {adminUser.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                  </Badge>
                                  <Badge variant={adminUser.isActive ? 'default' : 'destructive'}>
                                    {adminUser.isActive ? 'Activo' : 'Inactivo'}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-right text-sm text-gray-500">
                              <p>Creado: {new Date(adminUser.createdAt).toLocaleDateString()}</p>
                              {adminUser.lastLogin && (
                                <p>Último login: {new Date(adminUser.lastLogin).toLocaleDateString()}</p>
                              )}
                            </div>
                            {adminUser._id !== user?.id && (
                              <Button
                                onClick={() => handleDeleteUser(adminUser._id)}
                                variant="destructive"
                                size="sm"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
      </div>
    </AuthGuard>
  );
}