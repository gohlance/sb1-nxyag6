import { createApiClient } from './base';
import type { Product, Category } from '../../types/platform';

export class TikTokAPI {
  private client;

  constructor(apiKey: string) {
    this.client = createApiClient('https://open-api.tiktokglobalshop.com', apiKey);
  }

  async getCategories(): Promise<Category[]> {
    try {
      const response = await this.client.get('/api/products/categories');
      return response.data.categories;
    } catch (error) {
      console.error('Error fetching TikTok categories:', error);
      throw error;
    }
  }

  async uploadProduct(product: Product): Promise<string> {
    try {
      const imageUrls = await Promise.all(
        product.images.map(img => this.uploadImage(img.file))
      );

      const tiktokProduct = {
        title: product.title,
        description: product.description,
        price: {
          original_price: product.price,
          currency: "USD"
        },
        images: imageUrls,
        category_id: product.categories['tiktok'][0],
        // Add other TikTok-specific fields
      };

      const response = await this.client.post('/api/products/create', tiktokProduct);
      return response.data.product_id;
    } catch (error) {
      console.error('Error uploading product to TikTok:', error);
      throw error;
    }
  }

  private async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await this.client.post('/api/products/upload_image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.image_url;
  }
}