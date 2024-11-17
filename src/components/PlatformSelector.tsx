import React from 'react';
import { Store } from 'lucide-react';

const platforms = [
  { id: 'shopee', name: 'Shopee', connected: true },
  { id: 'lazada', name: 'Lazada', connected: true },
  { id: 'tiktok', name: 'TikTok Shop', connected: false },
  { id: 'instagram', name: 'Instagram Store', connected: false },
  { id: 'amazon', name: 'Amazon', connected: false },
  { id: 'etsy', name: 'Etsy', connected: false },
  { id: 'woocommerce', name: 'WooCommerce', connected: false },
  { id: 'shopify', name: 'Shopify', connected: false },
];

const PlatformSelector = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Select Platforms
      </h2>
      <div className="space-y-3">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center">
              <Store className="h-5 w-5 text-gray-500" />
              <span className="ml-2 text-sm font-medium text-gray-900">
                {platform.name}
              </span>
            </div>
            <div className="flex items-center">
              {platform.connected ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Connected
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Connect
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformSelector;