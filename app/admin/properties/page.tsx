'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import PropertyBlobUpload from '@/components/PropertyBlobUpload';
import EmbeddedGoogleMap, { extractEmbedUrl } from '@/components/EmbeddedGoogleMap';
import { IProperty } from '@/lib/db/models/Property';
import { Pencil, Trash2, Plus, Eye, Bed, Bath, Waves, Home } from 'lucide-react';

export default function AdminPropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProperty, setCurrentProperty] = useState<IProperty | null>(null);
  
  // Formulario para nueva propiedad
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    hasPool: false,
    isFurnished: false,
    amenities: [''],
    images: [] as { url: string; filename?: string; originalName?: string }[],
    price: 0,
    location: '',
    googleMapUrl: '',
    isActive: true
  });
  
  // Estado para mostrar la URL original y convertida
  const [urlConversionInfo, setUrlConversionInfo] = useState<{
    original: string;
    converted: string;
    wasConverted: boolean;
  } | null>(null);
  
  useEffect(() => {
    fetchProperties();
  }, []);
  
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/properties');
      
      if (!response.ok) {
        throw new Error('Error al cargar las propiedades');
      }
      
      const data = await response.json();
      setProperties(data);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('No se pudieron cargar las propiedades. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Función especial para manejar el campo googleMapUrl con conversión automática
  const handleGoogleMapUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    // Limpiar información de conversión si el campo está vacío
    if (!value) {
      setUrlConversionInfo(null);
      setFormData(prev => ({ ...prev, googleMapUrl: value }));
      return;
    }
    
    // Si el usuario pegó una URL de Google Maps, intentar convertirla automáticamente
    if (value && (value.includes('google.com/maps') || value.includes('maps.google.com'))) {
      const convertedUrl = extractEmbedUrl(value);
      if (convertedUrl && convertedUrl !== value) {
        // La URL fue convertida exitosamente
        setUrlConversionInfo({
          original: value,
          converted: convertedUrl,
          wasConverted: true
        });
        setFormData(prev => ({ ...prev, googleMapUrl: convertedUrl }));
        return;
      } else if (convertedUrl) {
        // La URL ya estaba en formato correcto
        setUrlConversionInfo({
          original: value,
          converted: convertedUrl,
          wasConverted: false
        });
        setFormData(prev => ({ ...prev, googleMapUrl: convertedUrl }));
        return;
      }
    }
    
    // Si no es una URL de Google Maps o no se pudo convertir, usar el valor original
    setUrlConversionInfo(null);
    setFormData(prev => ({ ...prev, googleMapUrl: value }));
  };
  
  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      // Para el campo de precio, eliminar puntos y convertir a número
      const numericValue = value.replace(/\./g, '');
      setFormData(prev => ({ ...prev, [name]: parseInt(numericValue) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleAmenityChange = (index: number, value: string) => {
    const newAmenities = [...formData.amenities];
    newAmenities[index] = value;
    setFormData(prev => ({ ...prev, amenities: newAmenities }));
  };
  
  const addAmenity = () => {
    setFormData(prev => ({ ...prev, amenities: [...prev.amenities, ''] }));
  };
  
  const removeAmenity = (index: number) => {
    const newAmenities = [...formData.amenities];
    newAmenities.splice(index, 1);
    setFormData(prev => ({ ...prev, amenities: newAmenities }));
  };
  
  const handleImageUpload = (images: { url: string; filename?: string; originalName?: string }[]) => {
    setFormData(prev => ({ ...prev, images }));
  };
  
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'apartment',
      bedrooms: 1,
      bathrooms: 1,
      hasPool: false,
      isFurnished: false,
      amenities: [''],
      images: [],
      price: 0,
      location: '',
      googleMapUrl: '',
      isActive: true
    });
    setUrlConversionInfo(null);
  };
  
  const openEditDialog = (property: IProperty) => {
    setCurrentProperty(property);
    setFormData({
      title: property.title,
      description: property.description,
      type: property.type,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      hasPool: property.hasPool,
      isFurnished: property.isFurnished,
      amenities: property.amenities && property.amenities.length > 0 ? property.amenities : [''],
      images: property.images || [],
      price: property.price,
      location: property.location,
      googleMapUrl: property.googleMapUrl || '',
      isActive: property.isActive
    });
    setUrlConversionInfo(null);
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (property: IProperty) => {
    setCurrentProperty(property);
    setIsDeleteDialogOpen(true);
  };
  
  const handleAddProperty = async () => {
    try {
      // Validar campos requeridos
      if (!formData.title || !formData.description || !formData.type || !formData.price || !formData.location) {
        alert('Por favor, completa todos los campos requeridos');
        return;
      }
      
      // Filtrar amenidades vacías
      const filteredAmenities = formData.amenities.filter(amenity => amenity.trim() !== '');
      
      const propertyData = {
        ...formData,
        amenities: filteredAmenities
      };
      
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });
      
      if (!response.ok) {
        throw new Error('Error al crear la propiedad');
      }
      
      // Obtener la propiedad creada con su ID
      const newProperty = await response.json();
      
      // Actualización optimista: agregar inmediatamente al estado local
      setProperties(prevProperties => [newProperty, ...prevProperties]);
      
      // Cerrar diálogo y resetear formulario
      setIsAddDialogOpen(false);
      resetForm();
      
      // Opcional: Recargar desde el servidor para asegurar sincronización
      // fetchProperties();
    } catch (error) {
      console.error('Error adding property:', error);
      alert('Error al crear la propiedad. Por favor, intenta de nuevo.');
      // En caso de error, recargar la lista para mantener consistencia
      fetchProperties();
    }
  };
  
  const handleUpdateProperty = async () => {
    try {
      if (!currentProperty?._id) return;
      
      // Validar campos requeridos
      if (!formData.title || !formData.description || !formData.type || !formData.price || !formData.location) {
        alert('Por favor, completa todos los campos requeridos');
        return;
      }
      
      // Filtrar amenidades vacías
      const filteredAmenities = formData.amenities.filter(amenity => amenity.trim() !== '');
      
      const propertyData = {
        ...formData,
        amenities: filteredAmenities
      };
      
      const response = await fetch(`/api/properties/${currentProperty._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar la propiedad');
      }
      
      // Obtener la propiedad actualizada
      const updatedProperty = await response.json();
      
      // Actualización optimista: actualizar inmediatamente en el estado local
      setProperties(prevProperties => 
        prevProperties.map(prop => 
          prop._id === currentProperty._id ? updatedProperty : prop
        )
      );
      
      // Cerrar diálogo y resetear estado
      setIsEditDialogOpen(false);
      setCurrentProperty(null);
      resetForm();
      
      // Opcional: Recargar desde el servidor para asegurar sincronización
      // fetchProperties();
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Error al actualizar la propiedad. Por favor, intenta de nuevo.');
      // En caso de error, recargar la lista para mantener consistencia
      fetchProperties();
    }
  };
  
  const handleDeleteProperty = async () => {
    try {
      if (!currentProperty?._id) {
        console.error('No hay propiedad seleccionada para eliminar');
        return;
      }
      
      console.log('Eliminando propiedad con ID:', currentProperty._id);
      console.log('URL del request:', `/api/properties/${currentProperty._id}`);
      
      const response = await fetch(`/api/properties/${currentProperty._id}`, {
        method: 'DELETE',
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        throw new Error('Error al eliminar la propiedad');
      }
      
      // Actualización optimista: remover inmediatamente del estado local
      setProperties(prevProperties => 
        prevProperties.filter(prop => prop._id !== currentProperty._id)
      );
      
      // Cerrar diálogo y resetear estado
      setIsDeleteDialogOpen(false);
      setCurrentProperty(null);
      
      // Opcional: Recargar desde el servidor para asegurar sincronización
      // fetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Error al eliminar la propiedad. Por favor, intenta de nuevo.');
      // En caso de error, recargar la lista para mantener consistencia
      fetchProperties();
    }
  };
  
  // Filtrar propiedades según el tipo seleccionado
  const filteredProperties = properties.filter(property => {
    if (activeTab === 'apartment') return property.type === 'apartment';
    if (activeTab === 'country_house') return property.type === 'country_house';
    return true; // 'all' tab
  });
  
  const propertyTypeLabel = {
    apartment: 'Apartamento',
    country_house: 'Casa Finca'
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Administrar Propiedades</h1>
          <Button 
            onClick={() => router.push('/admin/dashboard')}
            variant="outline"
            size="sm"
          >
            Dashboard
          </Button>
        </div>
        <Button onClick={() => {
          resetForm();
          setIsAddDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Propiedad
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="apartment">Apartamentos</TabsTrigger>
          <TabsTrigger value="country_house">Casas Finca</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando propiedades...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-red-50 rounded-xl">
          <p className="text-red-600">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => fetchProperties()}
          >
            Intentar de nuevo
          </Button>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-600">No hay propiedades {activeTab === 'all' ? '' : activeTab === 'apartment' ? 'de tipo apartamento' : 'de tipo casa finca'} disponibles.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imagen</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Habitaciones</TableHead>
                <TableHead>Baños</TableHead>
                <TableHead>Características</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property._id}>
                  <TableCell>
                    <div className="relative h-16 w-16 rounded overflow-hidden">
                      <Image 
                        src={property.images && property.images.length > 0 ? property.images[0].url : '/placeholder.jpg'} 
                        alt={property.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{property.title}</TableCell>
                  <TableCell>{propertyTypeLabel[property.type as keyof typeof propertyTypeLabel]}</TableCell>
                  <TableCell>{property.bedrooms}</TableCell>
                  <TableCell>{property.bathrooms}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {property.hasPool && (
                        <div title="Piscina">
                          <Waves className="h-4 w-4 text-blue-500" />
                        </div>
                      )}
                      {property.isFurnished && (
                        <div title="Amoblado">
                          <Home className="h-4 w-4 text-amber-500" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>${property.price.toLocaleString('es-CO')}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${property.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {property.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => router.push(`/apartamentos/${property._id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(property)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="text-red-500" onClick={() => openDeleteDialog(property)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Diálogo para agregar propiedad */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agregar Nueva Propiedad</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  placeholder="Ej: Apartamento con vista al mar" 
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="type">Tipo de Propiedad *</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartamento</SelectItem>
                    <SelectItem value="country_house">Casa Finca</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Habitaciones *</Label>
                  <Input 
                    id="bedrooms" 
                    name="bedrooms" 
                    type="number" 
                    min="0" 
                    value={formData.bedrooms} 
                    onChange={handleNumberInputChange} 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Baños *</Label>
                  <Input 
                    id="bathrooms" 
                    name="bathrooms" 
                    type="number" 
                    min="0" 
                    value={formData.bathrooms} 
                    onChange={handleNumberInputChange} 
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="hasPool" 
                    checked={formData.hasPool} 
                    onCheckedChange={(checked) => handleSwitchChange('hasPool', checked)} 
                  />
                  <Label htmlFor="hasPool">Tiene piscina</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="isFurnished" 
                    checked={formData.isFurnished} 
                    onCheckedChange={(checked) => handleSwitchChange('isFurnished', checked)} 
                  />
                  <Label htmlFor="isFurnished">Está amoblado</Label>
                </div>
              </div>
              
              <div>
                <Label htmlFor="price">Precio por noche (COP) *</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="text" 
                  value={formData.price.toLocaleString('es-CO')} 
                  onChange={handleNumberInputChange} 
                  required 
                  placeholder="Ej: 3.200.000"
                />
              </div>
              
              <div>
                <Label htmlFor="location">Ubicación *</Label>
                <Input 
                  id="location" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleInputChange} 
                  placeholder="Ej: Bocagrande, Cartagena" 
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="googleMapUrl">URL del Mapa de Google (Opcional)</Label>
                <Input 
                  id="googleMapUrl" 
                  name="googleMapUrl" 
                  value={formData.googleMapUrl} 
                  onChange={handleGoogleMapUrlChange} 
                  placeholder="Pega cualquier URL de Google Maps aquí - se convertirá automáticamente" 
                />
                
                {/* Información de conversión de URL */}
                {urlConversionInfo && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    {urlConversionInfo.wasConverted ? (
                      <div>
                        <p className="text-sm font-medium text-blue-800 mb-2">✅ URL convertida automáticamente</p>
                        <div className="text-xs space-y-1">
                          <div>
                            <span className="font-medium text-gray-600">URL original:</span>
                            <div className="bg-white p-1 rounded border text-gray-700 break-all">
                              {urlConversionInfo.original}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-green-600">URL convertida:</span>
                            <div className="bg-green-50 p-1 rounded border border-green-200 text-green-700 break-all">
                              {urlConversionInfo.converted}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-blue-700">✅ URL ya está en formato correcto para embed</p>
                    )}
                  </div>
                )}
                
                <div className="text-sm text-gray-600 mt-1">
                      <p className="mb-1">✨ <strong>¡Conversión automática activada!</strong></p>
                      <div className="bg-green-50 border border-green-200 rounded p-2 text-xs">
                        <p className="font-medium text-green-800 mb-1">Simplemente pega cualquier URL de Google Maps:</p>
                        <ul className="list-disc list-inside space-y-1 text-green-700">
                          <li>URL normal de Google Maps</li>
                          <li>URL de compartir</li>
                          <li>URL de iframe (src)</li>
                          <li>URL con coordenadas</li>
                        </ul>
                        <p className="mt-2 text-green-600 font-medium">El sistema convertirá automáticamente la URL al formato correcto para mostrar el mapa.</p>
                      </div>
                    </div>
                {/* Vista previa del mapa */}
                {formData.googleMapUrl && (
                  <div className="mt-3">
                    <Label className="text-sm font-medium mb-2 block">Vista Previa del Mapa:</Label>
                    <div className="border rounded-lg overflow-hidden">
                      <EmbeddedGoogleMap 
                        googleMapUrl={formData.googleMapUrl}
                        title={`Vista previa - ${formData.title || 'Ubicación'}`}
                        className="w-full h-48"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="isActive" 
                  checked={formData.isActive} 
                  onCheckedChange={(checked) => handleSwitchChange('isActive', checked)} 
                />
                <Label htmlFor="isActive">Propiedad activa</Label>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Descripción *</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  placeholder="Describe la propiedad..." 
                  className="min-h-[150px]" 
                  required 
                />
              </div>
              
              <div>
                <Label className="mb-2 block">Amenidades</Label>
                {formData.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Input 
                      value={amenity} 
                      onChange={(e) => handleAmenityChange(index, e.target.value)} 
                      placeholder="Ej: WiFi, Aire acondicionado, etc." 
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      onClick={() => removeAmenity(index)}
                      disabled={formData.amenities.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addAmenity}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Amenidad
                </Button>
              </div>
              
              <div>
                <Label className="mb-2 block">Imágenes</Label>
                <PropertyBlobUpload 
                  value={formData.images.map(img => img.url)} 
                  onChange={(urls) => {
                    // Convertir URLs a formato de imagen
                    const images = urls.map(url => ({ url }));
                    handleImageUpload(images);
                  }} 
                  onRemove={(url) => {
                    const newImages = formData.images.filter(img => img.url !== url);
                    handleImageUpload(newImages);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddProperty}>Guardar Propiedad</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo para editar propiedad */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Propiedad</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Título *</Label>
                <Input 
                  id="edit-title" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  placeholder="Ej: Apartamento con vista al mar" 
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="edit-type">Tipo de Propiedad *</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartamento</SelectItem>
                    <SelectItem value="country_house">Casa Finca</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-bedrooms">Habitaciones *</Label>
                  <Input 
                    id="edit-bedrooms" 
                    name="bedrooms" 
                    type="number" 
                    min="0" 
                    value={formData.bedrooms} 
                    onChange={handleNumberInputChange} 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="edit-bathrooms">Baños *</Label>
                  <Input 
                    id="edit-bathrooms" 
                    name="bathrooms" 
                    type="number" 
                    min="0" 
                    value={formData.bathrooms} 
                    onChange={handleNumberInputChange} 
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="edit-hasPool" 
                    checked={formData.hasPool} 
                    onCheckedChange={(checked) => handleSwitchChange('hasPool', checked)} 
                  />
                  <Label htmlFor="edit-hasPool">Tiene piscina</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="edit-isFurnished" 
                    checked={formData.isFurnished} 
                    onCheckedChange={(checked) => handleSwitchChange('isFurnished', checked)} 
                  />
                  <Label htmlFor="edit-isFurnished">Está amoblado</Label>
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-price">Precio por noche (COP) *</Label>
                <Input 
                  id="edit-price" 
                  name="price" 
                  type="text" 
                  value={formData.price.toLocaleString('es-CO')} 
                  onChange={handleNumberInputChange} 
                  required 
                  placeholder="Ej: 3.200.000"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-location">Ubicación *</Label>
                <Input 
                  id="edit-location" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleInputChange} 
                  placeholder="Ej: Bocagrande, Cartagena" 
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="edit-googleMapUrl">URL del Mapa de Google (Opcional)</Label>
                <Input 
                  id="edit-googleMapUrl" 
                  name="googleMapUrl" 
                  value={formData.googleMapUrl} 
                  onChange={handleGoogleMapUrlChange} 
                  placeholder="Pega cualquier URL de Google Maps aquí - se convertirá automáticamente" 
                />
                
                {/* Información de conversión de URL */}
                {urlConversionInfo && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    {urlConversionInfo.wasConverted ? (
                      <div>
                        <p className="text-sm font-medium text-blue-800 mb-2">✅ URL convertida automáticamente</p>
                        <div className="text-xs space-y-1">
                          <div>
                            <span className="font-medium text-gray-600">URL original:</span>
                            <div className="bg-white p-1 rounded border text-gray-700 break-all">
                              {urlConversionInfo.original}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-green-600">URL convertida:</span>
                            <div className="bg-green-50 p-1 rounded border border-green-200 text-green-700 break-all">
                              {urlConversionInfo.converted}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-blue-700">✅ URL ya está en formato correcto para embed</p>
                    )}
                  </div>
                )}
                
                <div className="text-sm text-gray-600 mt-1">
                      <p className="mb-1">✨ <strong>¡Conversión automática activada!</strong></p>
                      <div className="bg-green-50 border border-green-200 rounded p-2 text-xs">
                        <p className="font-medium text-green-800 mb-1">Simplemente pega cualquier URL de Google Maps:</p>
                        <ul className="list-disc list-inside space-y-1 text-green-700">
                          <li>URL normal de Google Maps</li>
                          <li>URL de compartir</li>
                          <li>URL de iframe (src)</li>
                          <li>URL con coordenadas</li>
                        </ul>
                        <p className="mt-2 text-green-600 font-medium">El sistema convertirá automáticamente la URL al formato correcto para mostrar el mapa.</p>
                      </div>
                    </div>
                {/* Vista previa del mapa */}
                {formData.googleMapUrl && (
                  <div className="mt-3">
                    <Label className="text-sm font-medium mb-2 block">Vista Previa del Mapa:</Label>
                    <div className="border rounded-lg overflow-hidden">
                      <EmbeddedGoogleMap 
                        googleMapUrl={formData.googleMapUrl}
                        title={`Vista previa - ${formData.title || 'Ubicación'}`}
                        className="w-full h-48"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="edit-isActive" 
                  checked={formData.isActive} 
                  onCheckedChange={(checked) => handleSwitchChange('isActive', checked)} 
                />
                <Label htmlFor="edit-isActive">Propiedad activa</Label>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-description">Descripción *</Label>
                <Textarea 
                  id="edit-description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  placeholder="Describe la propiedad..." 
                  className="min-h-[150px]" 
                  required 
                />
              </div>
              
              <div>
                <Label className="mb-2 block">Amenidades</Label>
                {formData.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Input 
                      value={amenity} 
                      onChange={(e) => handleAmenityChange(index, e.target.value)} 
                      placeholder="Ej: WiFi, Aire acondicionado, etc." 
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      onClick={() => removeAmenity(index)}
                      disabled={formData.amenities.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addAmenity}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Amenidad
                </Button>
              </div>
              
              <div>
                <Label className="mb-2 block">Imágenes</Label>
                <PropertyBlobUpload 
                  value={formData.images.map(img => img.url)} 
                  onChange={(urls) => {
                    // Convertir URLs a formato de imagen
                    const images = urls.map(url => ({ url }));
                    handleImageUpload(images);
                  }} 
                  onRemove={(url) => {
                    const newImages = formData.images.filter(img => img.url !== url);
                    handleImageUpload(newImages);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateProperty}>Actualizar Propiedad</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo para confirmar eliminación */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
          </DialogHeader>
          <p className="py-4">¿Estás seguro de que deseas eliminar la propiedad "{currentProperty?.title}"? Esta acción no se puede deshacer.</p>
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteProperty}>Eliminar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}