import { createApiClient } from './base';
import type { Product, Category } from '../../types/platform';

export class LazadaAPI {
  private client;

  constructor(apiKey: string) {
    this.client = createApiClient('https://api.lazada.com/rest', apiKey);
  }

  async getCategories(): Promise<Category[]> {
    try {
      const response = await this.client.get('/category/tree/get');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching Lazada categories:', error);
      throw error;
    }
  }

  async uploadProduct(product: Product): Promise<string> {
    try {
      const imageUrls = await Promise.all(
        product.images.map(img => this.uploadImage(img.file))
      );

      const lazadaProduct = {
        name: product.title,
        description: product.description,
        price: product.price,
        images: imageUrls,
        primary_category: product.categories['lazada'][0],
        // Add other Lazada-specific fields
      };

      const response = await this.client.post('/product/create', lazadaProduct);
      return response.data.item_id;
    } catch (error) {
      console.error('Error uploading product to Lazada:', error);
      throw error;
    }
  }

  private async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await this.client.post('/image/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.image_url;
  }
}