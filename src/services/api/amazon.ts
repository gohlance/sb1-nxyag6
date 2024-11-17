import { createApiClient } from './base';
import type { Product, Category } from '../../types/platform';

export class AmazonAPI {
  private client;

  constructor(apiKey: string) {
    this.client = createApiClient('https://sellingpartnerapi.amazon.com', apiKey);
  }

  async getCategories(): Promise<Category[]> {
    try {
      const response = await this.client.get('/catalog/2022-04-01/categories');
      return this.transformCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching Amazon categories:', error);
      throw error;
    }
  }

  async uploadProduct(product: Product): Promise<string> {
    try {
      // Upload images first to get ASIN references
      const imageUrls = await Promise.all(
        product.images.map(img => this.uploadImage(img.file))
      );

      // Create product listing
      const amazonProduct = {
        messageType: 'Product',
        messageVersion: '1.0',
        product: {
          title: product.title,
          description: product.description,
          brandName: product.platformSpecificData.amazon?.brandName || '',
          category: product.categories['amazon'][0],
          productType: product.platformSpecificData.amazon?.productType,
          images: imageUrls.map(url => ({
            type: 'MAIN',
            url: url
          })),
          price: {
            amount: product.price,
            currency: 'USD'
          },
          inventory: {
            fulfillmentType: 'MFN',
            quantity: product.variants[0].stock
          }
        }
      };

      const response = await this.client.post('/catalog/2022-04-01/items', amazonProduct);
      return response.data.asin;
    } catch (error) {
      console.error('Error uploading product to Amazon:', error);
      throw error;
    }
  }

  private async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const uploadResponse = await this.client.post('/uploads/2022-04-01/uploadDestinations', {
      contentType: file.type,
      resourceType: 'PRODUCT_IMAGE'
    });

    // Upload to the pre-signed URL
    await fetch(uploadResponse.data.uploadDestination, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    });

    return uploadResponse.data.url;
  }

  private transformCategories(amazonCategories: any[]): Category[] {
    return amazonCategories.map(cat => ({
      id: cat.id,
      name: cat.name,
      parentId: cat.parent?.id,
      children: cat.children ? this.transformCategories(cat.children) : undefined
    }));
  }
}