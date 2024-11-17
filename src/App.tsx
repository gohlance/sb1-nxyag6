import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Store, Image as ImageIcon } from 'lucide-react';
import ProductForm from './components/ProductForm';
import PlatformSelector from './components/PlatformSelector';
import ImageUploader from './components/ImageUploader';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">
                Multi-Platform Product Manager
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Left Column - Platform Selection */}
          <div className="md:col-span-1">
            <PlatformSelector />
          </div>

          {/* Middle Column - Product Form */}
          <div className="md:col-span-1">
            <ProductForm />
          </div>

          {/* Right Column - Image Upload */}
          <div className="md:col-span-1">
            <ImageUploader />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;