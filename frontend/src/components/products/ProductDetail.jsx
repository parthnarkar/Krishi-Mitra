import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaLeaf, FaCartPlus, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch product details
    setTimeout(() => {
      // This would be replaced with a real API call in production
      const mockProduct = {
        id: parseInt(id),
        name: 'Organic Tomatoes',
        price: 40,
        image: 'https://images.unsplash.com/photo-1592924357236-864f0aecab26?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dG9tYXRvZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        category: 'Vegetables',
        seller: 'Green Farms Ltd.',
        rating: 4.5,
        reviews: 28,
        description: 'Freshly harvested organic tomatoes grown without pesticides. Rich in vitamins and antioxidants. Perfect for salads, cooking, and sauces.',
        origin: 'Maharashtra, India',
        availableQuantity: 50,
        unit: 'kg',
        harvestedDate: '2023-03-15',
        nutritionFacts: [
          { name: 'Calories', value: '18 kcal' },
          { name: 'Carbohydrates', value: '3.9 g' },
          { name: 'Protein', value: '0.9 g' },
          { name: 'Fat', value: '0.2 g' },
          { name: 'Vitamin C', value: '13.7 mg' }
        ],
        relatedProducts: [
          { id: 2, name: 'Fresh Potatoes', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655' },
          { id: 5, name: 'Fresh Carrots', image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979' },
          { id: 7, name: 'Organic Onions', image: 'https://images.unsplash.com/photo-1508747703725-719777637510' }
        ]
      };
      
      setProduct(mockProduct);
      setIsLoading(false);
    }, 800);
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.availableQuantity || 1)) {
      setQuantity(value);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    if (quantity < (product?.availableQuantity || 1)) {
      setQuantity(quantity + 1);
    }
  };

  const addToCart = () => {
    console.log(`Added ${quantity} ${quantity > 1 ? 'units' : 'unit'} of ${product?.name} to cart`);
    // In a real app, this would dispatch to a cart state or API
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="star" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="star" />);
      } else {
        stars.push(<FaRegStar key={i} className="star" />);
      }
    }
    
    return stars;
  };

  if (isLoading) {
    return (
      <div className="product-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="back-to-products">
          <FaArrowLeft /> Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <Link to="/products" className="back-link">
        <FaArrowLeft /> Back to Products
      </Link>
      
      <div className="product-detail-content">
        <div className="product-detail-image">
          <img src={product.image} alt={product.name} />
        </div>
        
        <div className="product-detail-info">
          <div className="product-category">
            <FaLeaf /> {product.category}
          </div>
          
          <h1 className="product-name">{product.name}</h1>
          
          <div className="product-rating">
            <div className="stars">
              {renderRatingStars(product.rating)}
            </div>
            <span>{product.rating} ({product.reviews} reviews)</span>
          </div>
          
          <div className="product-seller">
            by <span>{product.seller}</span>
          </div>
          
          <div className="product-price">
            ₹{product.price}/{product.unit}
          </div>
          
          <div className="product-availability">
            <span className={product.availableQuantity > 0 ? 'in-stock' : 'out-of-stock'}>
              {product.availableQuantity > 0 
                ? `In Stock (${product.availableQuantity} ${product.unit} available)` 
                : 'Out of Stock'}
            </span>
          </div>
          
          <div className="product-quantity-control">
            <label htmlFor="quantity">Quantity:</label>
            <div className="quantity-inputs">
              <button 
                className="quantity-btn" 
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >-</button>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                max={product.availableQuantity}
              />
              <button 
                className="quantity-btn" 
                onClick={incrementQuantity}
                disabled={quantity >= product.availableQuantity}
              >+</button>
            </div>
          </div>
          
          <div className="total-price">
            Total: ₹{(product.price * quantity).toFixed(2)}
          </div>
          
          <button className="add-to-cart-btn" onClick={addToCart}>
            <FaCartPlus /> Add to Cart
          </button>
          
          <div className="product-origin">
            Origin: {product.origin}
          </div>
          
          <div className="harvest-date">
            Harvested on: {new Date(product.harvestedDate).toLocaleDateString()}
          </div>
        </div>
      </div>
      
      <div className="product-detail-tabs">
        <div className="tab-buttons">
          <button 
            className={activeTab === 'description' ? 'active' : ''} 
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button 
            className={activeTab === 'nutrition' ? 'active' : ''} 
            onClick={() => setActiveTab('nutrition')}
          >
            Nutrition Facts
          </button>
          <button 
            className={activeTab === 'reviews' ? 'active' : ''} 
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({product.reviews})
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'description' && (
            <div className="description-tab">
              <p>{product.description}</p>
            </div>
          )}
          
          {activeTab === 'nutrition' && (
            <div className="nutrition-tab">
              <h3>Nutrition Information (per 100g)</h3>
              <table className="nutrition-table">
                <tbody>
                  {product.nutritionFacts.map((fact, index) => (
                    <tr key={index}>
                      <td>{fact.name}</td>
                      <td>{fact.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div className="reviews-tab">
              <p>Reviews will be displayed here</p>
              {/* In a real app, you would fetch and display actual reviews */}
            </div>
          )}
        </div>
      </div>
      
      <div className="related-products">
        <h2>Related Products</h2>
        <div className="related-products-grid">
          {product.relatedProducts.map(relatedProduct => (
            <Link to={`/product/${relatedProduct.id}`} key={relatedProduct.id} className="related-product-card">
              <div className="related-product-image">
                <img src={relatedProduct.image} alt={relatedProduct.name} />
              </div>
              <h3>{relatedProduct.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 