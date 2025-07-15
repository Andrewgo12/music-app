import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion'; // Not used
import { X, Music, Image, Save, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';

const PlaylistModal = ({
  isOpen,
  onClose,
  onSave,
  playlist = null,
  mode = 'create'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    isPublic: true
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data when modal opens or playlist changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && playlist) {
        setFormData({
          name: playlist.name || '',
          description: playlist.description || '',
          imageUrl: playlist.imageUrl || '',
          isPublic: playlist.isPublic !== false
        });
      } else {
        setFormData({
          name: '',
          description: '',
          imageUrl: '',
          isPublic: true
        });
      }
      setErrors({});
    }
  }, [isOpen, playlist, mode]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Playlist name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Playlist name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Playlist name must be less than 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid image URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await onSave({
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim()
      });

      // Modal will be closed by parent component
    } catch (error) {
      console.error('Error saving playlist:', error);
      setErrors({ submit: 'Failed to save playlist. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const generateRandomImage = () => {
    const colors = ['blue', 'green', 'purple', 'red', 'yellow', 'pink', 'indigo'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const imageUrl = `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center&auto=format&q=80&bg=${randomColor}`;
    handleInputChange('imageUrl', imageUrl);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {mode === 'edit' ? 'Edit Playlist' : 'Create New Playlist'}
              </h2>
              <p className="text-sm text-gray-400">
                {mode === 'edit' ? 'Update your playlist details' : 'Add a new playlist to your library'}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Playlist Image Preview */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt="Playlist cover"
                  className="w-20 h-20 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder-playlist.jpg';
                  }}
                />
              ) : (
                <div className="w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center">
                  <Music className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={generateRandomImage}
                className="text-blue-400 hover:text-blue-300"
              >
                <Image className="w-4 h-4 mr-2" />
                Generate Random Cover
              </Button>
            </div>
          </div>

          {/* Playlist Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Playlist Name *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter playlist name..."
              className={`w-full ${errors.name ? 'border-red-500' : ''}`}
              disabled={isLoading}
              maxLength={100}
            />
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-1"
              >
                {errors.name}
              </motion.p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Add a description for your playlist..."
              className={`
                w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white
                placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none
                ${errors.description ? 'border-red-500' : ''}
              `}
              rows={3}
              disabled={isLoading}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.description && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm"
                >
                  {errors.description}
                </motion.p>
              )}
              <span className="text-xs text-gray-500 ml-auto">
                {formData.description.length}/500
              </span>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cover Image URL
            </label>
            <Input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className={`w-full ${errors.imageUrl ? 'border-red-500' : ''}`}
              disabled={isLoading}
            />
            {errors.imageUrl && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-1"
              >
                {errors.imageUrl}
              </motion.p>
            )}
          </div>

          {/* Privacy Setting */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-300">Make playlist public</h4>
              <p className="text-xs text-gray-500">Anyone can see and play this playlist</p>
            </div>
            <button
              type="button"
              onClick={() => handleInputChange('isPublic', !formData.isPublic)}
              disabled={isLoading}
              className={`
                relative w-12 h-6 rounded-full transition-colors duration-200
                ${formData.isPublic ? 'bg-blue-500' : 'bg-gray-600'}
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <motion.div
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                animate={{ x: formData.isPublic ? 24 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/20 border border-red-500/30 rounded-lg p-3"
            >
              <p className="text-red-400 text-sm">{errors.submit}</p>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading || !formData.name.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? (
                <motion.div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {mode === 'edit' ? 'Update Playlist' : 'Create Playlist'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default PlaylistModal;
