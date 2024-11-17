import { createApiClient } from './base';
import type { Product, Category } from '../../types/platform';

export class InstagramAPI {
  private client;
  private fbClient;

  constructor(apiKey: string, fbApiKey: string) {
    this.client = createApiClient('https://graph.instagram.com/v12.0', apiKey);
    this.fbClient = createApiClient('https://graph.facebook.com/v12.0', fbApiKey);
  }

  async getCategories(): Promise<Category[]> {
    try {
      // Instagram Shopping uses Facebook Commerce categories
      const response = await this.fbClient.get('/commerce_categories');
      return this.transformCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching Instagram/Facebook categories:', error);
      throw error;
    }
  }

  async uploadProduct(product: Product): Promise<string> {
    try {
      // First, upload images to Instagram
      const mediaIds = await Promise.all(
        product.images.map(img => this.uploadImage(img.file))
      );

      // Create catalog item in Facebook Commerce
      const catalogItem = {
        availability: 'in stock',
        brand: product.platformSpecificData.instagram?.brand || '',
        category: product.categories['instagram'][0],
        description: product.description,
        image_urls: mediaIds.map(id => `https://instagram.com/p/${id}`),
        name: product.title,
        price: product.price,
        currency: 'USD',
        condition: 'new',
        inventory: product.variants[0].stock
      };

      const response = await this.fbClient.post('/catalog/products', catalogItem);

      // Tag products in Instagram posts
      await Promise.all(mediaIds.map(mediaId =>
        this.client.post(`/${mediaId}/tags`, {
          product_id: response.data.id
        })
      ));

      return response.data.id;
    } catch (error) {
      console.error('Error uploading product to Instagram:', error);
      throw error;
    }
  }

  private async uploadImage(file: File): Promise<string> {
    // First, create a container for the image
    const containerResponse = await this.client.post('/media', {
      image_url: 'WILL_UPLOAD_FILE',
      caption: '',
      media_type: 'IMAGE'
    });

    // Upload the image
    const formData = new FormData();
    formData.append('image', file);

    await this.client.post(`/${containerResponse.data.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // Publish the container
    const publishResponse = await this.client.post(`/${containerResponse.data.id}/publish`, {});
    return publishResponse.data.id;
  }

  private transformCategories(fbCategories: any[]): Category[] {
    return fbCategories.map(cat => ({
      id: cat.id,
      name: cat.name,
      parentId: cat.parent_category_id,
      children: cat.children ? this.transformCategories(cat.children) : undefined
    }));
  }
}