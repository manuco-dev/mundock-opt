'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Star,
  Edit,
  Save,
  X
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import ReviewBlobUpload from '@/components/ReviewBlobUpload';
import { useAuth } from '@/hooks/use-auth';
import AuthGuard from '@/components/AuthGuard';

interface Review {
  _id: string;
  customerName: string;
  customerEmail?: string;
  rating: number;
  comment: string;
  customerImage?: {
    url: string;
    filename?: string;
    originalName?: string;
  };
  customerVideo?: {
    url: string;
    filename?: string;
    originalName?: string;
  };
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  username: string;
  role: string;
}

export default function AdminReviews() {
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    rating: 5,
    comment: '',
    customerImage: { url: '', filename: '', originalName: '' } as { url: string; filename?: string; originalName?: string },
    customerVideo: { url: '', filename: '', originalName: '' } as { url: string; filename?: string; originalName?: string },
    isFeatured: false,
    order: 0,
    customDate: new Date().toISOString().split('T')[0] // Fecha actual por defecto
  });
  
  const router = useRouter();

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
      return;
    }
    
    if (isAuthenticated) {
      fetchReviews();
      setIsLoading(false);
    }
  }, [isAuthenticated, authLoading, router]);

  // Limpiar mensajes después de 5 segundos
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews?all=true');
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      } else {
        setError('Error al cargar las reseñas');
      }
    } catch (error) {
      setError('Error al cargar las reseñas');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const handleCreateReview = async () => {
    if (!formData.customerName || !formData.comment) {
      setError('Nombre del cliente y comentario son requeridos');
      return;
    }

    setIsUploading(true);
    try {
      const reviewData = {
        ...formData,
        createdAt: new Date(formData.customDate).toISOString()
      };
      
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        setSuccess('Reseña creada exitosamente');
        setShowCreateForm(false);
        resetForm();
        fetchReviews();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al crear la reseña');
      }
    } catch (error) {
      setError('Error al crear la reseña');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateReview = async (reviewId: string, updatedData: Partial<Review>) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setSuccess('Reseña actualizada exitosamente');
        setEditingReview(null);
        fetchReviews();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al actualizar la reseña');
      }
    } catch (error) {
      setError('Error al actualizar la reseña');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Reseña eliminada exitosamente');
        fetchReviews();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al eliminar la reseña');
      }
    } catch (error) {
      setError('Error al eliminar la reseña');
    }
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerEmail: '',
      rating: 5,
      comment: '',
      customerImage: { url: '', filename: '', originalName: '' },
      customerVideo: { url: '', filename: '', originalName: '' },
      isFeatured: false,
      order: 0,
      customDate: new Date().toISOString().split('T')[0]
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
              <Badge variant="secondary">Reseñas</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Bienvenido, {user?.username}</span>
              <Button
                onClick={() => router.push('/admin/dashboard')}
                variant="outline"
                size="sm"
              >
                Dashboard
              </Button>
              <Button
                onClick={() => router.push('/admin/properties')}
                variant="outline"
                size="sm"
              >
                Propiedades
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Edit Review Form */}
        {editingReview && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Editar Reseña</CardTitle>
              <CardDescription>
                Modifica los datos de la reseña seleccionada
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editCustomerName">Nombre del Cliente *</Label>
                  <Input
                    id="editCustomerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Nombre completo"
                  />
                </div>
                <div>
                  <Label htmlFor="editCustomerEmail">Email del Cliente</Label>
                  <Input
                    id="editCustomerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="email@ejemplo.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="editRating">Calificación *</Label>
                  <Select
                    value={formData.rating.toString()}
                    onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <SelectItem key={rating} value={rating.toString()}>
                          {rating} estrella{rating > 1 ? 's' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editOrder">Orden</Label>
                  <Input
                    id="editOrder"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="editCustomDate">Fecha de la reseña</Label>
                  <Input
                    id="editCustomDate"
                    type="date"
                    value={formData.customDate}
                    onChange={(e) => setFormData({ ...formData, customDate: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="editIsFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                  />
                  <Label htmlFor="editIsFeatured">Destacar reseña</Label>
                </div>
              </div>
              
              <div>
                <Label htmlFor="editComment">Comentario *</Label>
                <Textarea
                  id="editComment"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Escribe el comentario de la reseña..."
                  rows={4}
                />
              </div>
              
              <div>
                 <ReviewBlobUpload
                   imageValue={formData.customerImage.url}
                   videoValue={formData.customerVideo.url}
                   onImageChange={(url) => {
                     setFormData({
                       ...formData,
                       customerImage: {
                         url,
                         filename: url.split('/').pop() || '',
                         originalName: url.split('/').pop() || ''
                       }
                     });
                   }}
                   onVideoChange={(url) => {
                     setFormData({
                       ...formData,
                       customerVideo: {
                         url,
                         filename: url.split('/').pop() || '',
                         originalName: url.split('/').pop() || ''
                       }
                     });
                   }}
                   onImageRemove={() => {
                     setFormData({
                       ...formData,
                       customerImage: { url: '', filename: '', originalName: '' }
                     });
                   }}
                   onVideoRemove={() => {
                     setFormData({
                       ...formData,
                       customerVideo: { url: '', filename: '', originalName: '' }
                     });
                   }}
                   disabled={isLoading}
                 />
               </div>
              
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    if (!formData.customerName || !formData.comment) {
                      setError('Nombre del cliente y comentario son requeridos');
                      return;
                    }
                    handleUpdateReview(editingReview, {
                      customerName: formData.customerName,
                      customerEmail: formData.customerEmail,
                      rating: formData.rating,
                      comment: formData.comment,
                      customerImage: formData.customerImage,
                      customerVideo: formData.customerVideo,
                      isFeatured: formData.isFeatured,
                      order: formData.order,
                      createdAt: new Date(formData.customDate).toISOString()
                    });
                  }}
                  disabled={isUploading}
                  className="flex-1"
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Guardar Cambios
                </Button>
                <Button
                  onClick={() => {
                    setEditingReview(null);
                    resetForm();
                  }}
                  variant="outline"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Create Review Form */}
        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Crear Nueva Reseña</CardTitle>
              <CardDescription>
                Agrega una nueva reseña de cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Nombre del Cliente *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Nombre completo"
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Email del Cliente</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="email@ejemplo.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="rating">Calificación *</Label>
                  <Select
                    value={formData.rating.toString()}
                    onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <SelectItem key={rating} value={rating.toString()}>
                          {rating} estrella{rating > 1 ? 's' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="order">Orden</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="customDate">Fecha de la reseña</Label>
                  <Input
                    id="customDate"
                    type="date"
                    value={formData.customDate}
                    onChange={(e) => setFormData({ ...formData, customDate: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                  />
                  <Label htmlFor="isFeatured">Destacar reseña</Label>
                </div>
              </div>
              
              <div>
                <Label htmlFor="comment">Comentario *</Label>
                <Textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Escribe el comentario de la reseña..."
                  rows={4}
                />
              </div>
              
              <div>
                 <ReviewBlobUpload
                   imageValue={formData.customerImage.url}
                   videoValue={formData.customerVideo.url}
                   onImageChange={(url) => {
                     setFormData({
                       ...formData,
                       customerImage: {
                         url,
                         filename: url.split('/').pop() || '',
                         originalName: url.split('/').pop() || ''
                       }
                     });
                   }}
                   onVideoChange={(url) => {
                     setFormData({
                       ...formData,
                       customerVideo: {
                         url,
                         filename: url.split('/').pop() || '',
                         originalName: url.split('/').pop() || ''
                       }
                     });
                   }}
                   onImageRemove={() => {
                     setFormData({
                       ...formData,
                       customerImage: { url: '', filename: '', originalName: '' }
                     });
                   }}
                   onVideoRemove={() => {
                     setFormData({
                       ...formData,
                       customerVideo: { url: '', filename: '', originalName: '' }
                     });
                   }}
                   disabled={isLoading}
                 />
               </div>
              
              <div className="flex space-x-2">
                <Button
                  onClick={handleCreateReview}
                  disabled={isUploading}
                  className="flex-1"
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Crear Reseña
                </Button>
                <Button
                  onClick={() => {
                    setShowCreateForm(false);
                    resetForm();
                  }}
                  variant="outline"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reviews List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Reseñas de Clientes</CardTitle>
                <CardDescription>
                  Gestiona las reseñas y testimonios de los clientes
                </CardDescription>
              </div>
              <Button
                onClick={() => setShowCreateForm(true)}
                disabled={showCreateForm}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Reseña
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay reseñas disponibles</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 font-medium text-gray-900">Cliente</th>
                      <th className="text-left p-3 font-medium text-gray-900">Calificación</th>
                      <th className="text-left p-3 font-medium text-gray-900">Comentario</th>
                      <th className="text-center p-3 font-medium text-gray-900">Estado</th>
                      <th className="text-center p-3 font-medium text-gray-900">Orden</th>
                      <th className="text-center p-3 font-medium text-gray-900">Fecha</th>
                      <th className="text-center p-3 font-medium text-gray-900">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((review) => (
                      <tr key={review._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center space-x-3">
                            {review.customerImage?.url ? (
                              <img
                                src={review.customerImage.url}
                                alt={review.customerName}
                                className="w-8 h-8 object-cover rounded-full"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-xs text-gray-500">
                                  {review.customerName.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-gray-900">{review.customerName}</div>
                              {review.customerEmail && (
                                <div className="text-xs text-gray-500">{review.customerEmail}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-1">
                            {renderStars(review.rating)}
                            <span className="text-sm text-gray-600 ml-1">({review.rating})</span>
                          </div>
                        </td>
                        <td className="p-3 max-w-xs">
                          <div className="text-sm text-gray-700 truncate" title={review.comment}>
                            {review.comment.length > 80 ? `${review.comment.substring(0, 80)}...` : review.comment}
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            {review.customerImage?.url && (
                              <div title="Tiene imagen">
                                <ImageIcon className="h-3 w-3 text-blue-500" />
                              </div>
                            )}
                            {review.customerVideo?.url && (
                              <div title="Tiene video">
                                <Video className="h-3 w-3 text-green-500" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex flex-col items-center space-y-1">
                            <Badge variant={review.isActive ? "default" : "secondary"}>
                              {review.isActive ? "Activa" : "Inactiva"}
                            </Badge>
                            {review.isFeatured && (
                              <Badge variant="outline" className="text-xs">
                                Destacada
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-sm font-medium">{review.order}</span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center space-x-1">
                            {/* Botón de activar/desactivar oculto
                            <Button
                              onClick={() => handleUpdateReview(review._id, { isActive: !review.isActive })}
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title={review.isActive ? "Desactivar" : "Activar"}
                            >
                              {review.isActive ? (
                                <EyeOff className="h-3 w-3" />
                              ) : (
                                <Eye className="h-3 w-3" />
                              )}
                            </Button>
                            */}
                            <Button
                              onClick={() => handleUpdateReview(review._id, { isFeatured: !review.isFeatured })}
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title={review.isFeatured ? "No destacar" : "Destacar"}
                            >
                              <Star className={`h-3 w-3 ${review.isFeatured ? 'fill-current text-yellow-400' : ''}`} />
                            </Button>
                            <Button
                              onClick={() => {
                                setEditingReview(review._id);
                                setFormData({
                                  customerName: review.customerName,
                                  customerEmail: review.customerEmail || '',
                                  rating: review.rating,
                                  comment: review.comment,
                                  customerImage: review.customerImage || { url: '', filename: '', originalName: '' },
                                  customerVideo: review.customerVideo || { url: '', filename: '', originalName: '' },
                                  isFeatured: review.isFeatured,
                                  order: review.order,
                                  customDate: new Date(review.createdAt).toISOString().split('T')[0]
                                });
                              }}
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Editar"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteReview(review._id)}
                              variant="destructive"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Eliminar"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      </div>
    </AuthGuard>
  );
}