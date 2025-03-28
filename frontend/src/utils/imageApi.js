/**
 * Utility for fetching product images from Unsplash API
 */

const UNSPLASH_ACCESS_KEY = 'Ajjau5YERsOxKhBhd6EdOyGJJKsjuGtn8HyYtkifM6k'; // Replace with your actual Unsplash API key

/**
 * Fetch product images from Unsplash API
 * @param {string} query - The search query for product images
 * @param {number} count - Number of images to fetch (default: 1)
 * @returns {Array} Array of image objects with url, id, alt, and credit info
 */
export const fetchProductImages = async (query, count = 1) => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=${count}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    );
    
    const data = await response.json();
    return data.results.map(photo => ({
      id: photo.id,
      url: photo.urls.regular,
      alt: photo.alt_description,
      credit: {
        name: photo.user.name,
        link: photo.user.links.html
      }
    }));
  } catch (error) {
    console.error("Error fetching images from Unsplash:", error);
    return null;
  }
};

/**
 * Fetch farmer images from Unsplash API
 * These should be images of farmers working in fields or with produce
 * @param {number} count - Number of images to fetch
 * @returns {Array} Array of farmer image objects
 */
export const fetchFarmerImages = async (count = 3) => {
  try {
    // Using specific search terms to get authentic farmer images
    const searchTerms = ['indian farmer', 'organic farmer', 'farmer portrait'];
    const farmerImages = [];
    
    // Fetch one image for each search term
    for (let i = 0; i < Math.min(count, searchTerms.length); i++) {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${searchTerms[i]}&per_page=1&orientation=portrait`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
          }
        }
      );
      
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        farmerImages.push({
          id: data.results[0].id,
          url: data.results[0].urls.regular,
          alt: data.results[0].alt_description || `${searchTerms[i]} working in field`,
          credit: {
            name: data.results[0].user.name,
            link: data.results[0].user.links.html
          }
        });
      }
    }
    
    return farmerImages;
  } catch (error) {
    console.error("Error fetching farmer images from Unsplash:", error);
    return null;
  }
}; 