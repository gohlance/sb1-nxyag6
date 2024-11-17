import { createApiClient } from './base';
import type { Product, Category } from '../../types/platform';

export class ShopeeAPI {
  private client;

  constructor(apiKey: string) {
    this.client = createApiClient('https://partner.shopeemobile.com/api/v2', apiKey);
  }

  async getCategories(): Promise<Category[]> {
    try {
      const response = await this.client.get('/product/get_category');
      return response.data.categories;
    } catch (error) {
      console.error('Error fetching Shopee categories:', error);
      throw error;
    }
  }

  async uploadProduct(product: Product): Promise<string> {
    try {
      // Upload images first
      const imageUrls = await Promise.all(
        product.images.map(img => this.uploadImage(img.file))
      );

      const shopeeProduct = {
        name: product.title,
        description: product.description,
        price: product.price * 100, // Shopee uses cents
        images: imageUrls,
        category_id: product.categories['shopee'][0],
        // Add other Shopee-specific fields
      };

      const response = await this.client.post('/product/add_item', shopeeProduct);
      return response.data.item_id;
    } catch (error) {
      console.error('Error uploading product to Shopee:', error);
      throw error;
    }
  }

  private async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await this.client.post('/media/upload_image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.image_url;
  }
}