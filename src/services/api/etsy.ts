import { createApiClient } from './base';
import type { Product, Category } from '../../types/platform';

export class EtsyAPI {
  private client;

  constructor(apiKey: string) {
    this.client = createApiClient('https://openapi.etsy.com/v3', apiKey);
  }

  async getCategories(): Promise<Category[]> {
    try {
      const response = await this.client.get('/application/seller-taxonomy/nodes');
      return this.transformCategories(response.data.results);
    } catch (error) {
      console.error('Error fetching Etsy categories:', error);
      throw error;
    }
  }

  async uploadProduct(product: Product): Promise<string> {
    try {
      // Create draft listing
      const draftListing = await this.client.post('/application/shops/:shop_id/listings', {
        title: product.title,
        description: product.description,
        price: product.price,
        quantity: product.variants[0].stock,
        taxonomy_id: product.categories['etsy'][0],
        who_made: 'i_did',
        when_made: 'made_to_order',
        is_supply: false,
        state: 'draft'
      });

      // Upload images
      const imagePromises = product.images.map(async (img, index) => {
        const formData = new FormData();
        formData.append('image', img.file);
        formData.append('rank', index.toString());

        return this.client.post(
          `/application/shops/:shop_id/listings/${draftListing.data.listing_id}/images`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        );
      });

      await Promise.all(imagePromises);

      // Publish listing
      await this.client.put(`/application/shops/:shop_id/listings/${draftListing.data.listing_id}`, {
        state: 'active'
      });

      return draftListing.data.listing_id;
    } catch (error) {
      console.error('Error uploading product to Etsy:', error);
      throw error;
    }
  }

  private transformCategories(etsyCategories: any[]): Category[] {
    return etsyCategories.map(cat => ({
      id: cat.id.toString(),
      name: cat.name,
      parentId: cat.parent_id ? cat.parent_id.toString() : undefined,
      children: cat.children ? this.transformCategories(cat.children) : undefined
    }));
  }
}