/**
 * Utility for fetching product images from Unsplash API
 */

import axios from 'axios';

// Unsplash image access key
const UNSPLASH_ACCESS_KEY = 'VdFG1phEHLZk3yX8kBEbcTR6a4OoSXOVmHZwWlcGXTE';  // Public demo key, replace with your own

/**
 * Fetches product images from Unsplash API
 * 
 * @param {string} query - Product name or search term
 * @param {number} count - Number of images to fetch
 * @returns {Promise<Array>} - Array of image objects with urls
 */
export const fetchProductImages = async (query, count = 3) => {
  try {
    // Using unsplash source API as a simple solution
    // For production, you would use the official Unsplash API with your API key
    const images = [];
    
    for (let i = 0; i < count; i++) {
      // Add random parameter to avoid caching
      const random = Math.floor(Math.random() * 1000);
      const url = `https://source.unsplash.com/800x600/?${encodeURIComponent(query)},organic&sig=${random}`;
      
      // Pre-load the image to ensure it's resolved
      await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Continue even if error
        img.src = url;
      });
      
      images.push({ url });
    }
    
    return images;
  } catch (error) {
    console.error('Error fetching images:', error);
    // Return fallback images in case of error
    return [
      { url: 'https://source.unsplash.com/800x600/?organic,vegetables' },
      { url: 'https://source.unsplash.com/800x600/?farm,produce' },
      { url: 'https://source.unsplash.com/800x600/?agriculture' }
    ];
  }
};

/**
 * Fetch farmer images from Unsplash API
 * @param {Number} count - Number of images to fetch
 * @returns {Array} Array of image objects with url and attribution
 */
export const fetchFarmerImages = async (count = 1) => {
  try {
    const query = 'indian farmer agriculture rural';
    
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.results.map(image => ({
      url: image.urls.regular,
      thumbnail: image.urls.thumb,
      attribution: {
        name: image.user.name,
        link: image.user.links.html
      }
    }));
  } catch (error) {
    console.error('Error fetching farmer images:', error);
    
    // Return fallback images
    return [
      {
        url: 'https://images.unsplash.com/photo-1597931752949-98c74b5b159f',
        thumbnail: 'https://images.unsplash.com/photo-1597931752949-98c74b5b159f?w=100',
        attribution: {
          name: 'Unsplash',
          link: 'https://unsplash.com'
        }
      },
      {
        url: 'https://images.unsplash.com/photo-1600411830259-18a533c79d1e',
        thumbnail: 'https://images.unsplash.com/photo-1600411830259-18a533c79d1e?w=100',
        attribution: {
          name: 'Unsplash',
          link: 'https://unsplash.com'
        }
      },
      {
        url: 'https://images.unsplash.com/photo-1581578017093-cd30fce4eeb7',
        thumbnail: 'https://images.unsplash.com/photo-1581578017093-cd30fce4eeb7?w=100',
        attribution: {
          name: 'Unsplash',
          link: 'https://unsplash.com'
        }
      }
    ].slice(0, count);
  }
};

/**
 * Get random product images for a category
 * @param {String} category - Product category
 * @param {Number} count - Number of images to fetch
 * @returns {Array} Array of image URLs
 */
export const getCategoryImages = async (category, count = 4) => {
  try {
    const enhancedQuery = `${category} organic food agriculture`;
    
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(enhancedQuery)}&per_page=${count}`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract image URLs
    return data.results.map(image => image.urls.regular);
  } catch (error) {
    console.error(`Error fetching images for category ${category}:`, error);
    
    // Fallback to random images
    return Array(count).fill().map((_, i) => 
      `https://source.unsplash.com/random/800x600/?${encodeURIComponent(category)}&sig=${i}`
    );
  }
}; 