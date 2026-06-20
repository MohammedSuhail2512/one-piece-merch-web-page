// Shopping Cart Data
let cart = [];
let currentBuyNow = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  setupNavigation();
  setupCartFunctionality();
  setupProductButtons();
});

// Navigation functionality
function setupNavigation() {
  var reviewsTab = document.getElementById('reviews-tab');
  var topReviewsSection = document.getElementById('section4');
  if (reviewsTab && topReviewsSection) {
    reviewsTab.addEventListener('click', function() {
      topReviewsSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  var trendingTab = document.getElementById('trending-tab');
  var trendingSection = document.getElementById('section3');
  if (trendingTab && trendingSection) {
    trendingTab.addEventListener('click', function() {
      trendingSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  var contactTab = document.getElementById('contact-tab');
  var contactSection = document.getElementById('section5');
  if (contactTab && contactSection) {
    contactTab.addEventListener('click', function() {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  var servicesTab = document.getElementById('services-tab');
  var servicesSection = document.getElementById('section2');
  if (servicesTab && servicesSection) {
    servicesTab.addEventListener('click', function() {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  var homeTab = document.getElementById('home');
  if (homeTab) {
    homeTab.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// Cart functionality
function setupCartFunctionality() {
  var cartIcon = document.getElementById('cart-icon');
  var cartModal = document.getElementById('cartModal');
  var closeCart = document.querySelector('.close-cart');

  if (cartIcon && cartModal) {
    cartIcon.addEventListener('click', openCart);
  }

  if (closeCart && cartModal) {
    closeCart.addEventListener('click', function() {
      cartModal.style.display = 'none';
    });
  }

  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target == cartModal) {
      cartModal.style.display = 'none';
    }
  });
}

// Setup product buttons
function setupProductButtons() {
  // Get all product cards
  const productCards = document.querySelectorAll('.t1');
  
  productCards.forEach(card => {
    const productNameElement = card.querySelector('h4');
    const priceElement = card.querySelector('h3');
    
    if (productNameElement && priceElement) {
      const productName = productNameElement.textContent.trim();
      const priceText = priceElement.textContent.trim();
      const price = parseInt(priceText.replace(/[^\d]/g, ''));
      
      // Setup Buy button
      const buyButton = card.querySelectorAll('.buynow')[0];
      if (buyButton && !buyButton.classList.contains('add-to-cart-btn')) {
        buyButton.onclick = () => buyNow(productName, price);
      }
      
      // Setup Add to Cart button
      const addToCartButton = card.querySelectorAll('.buynow')[1];
      if (addToCartButton) {
        addToCartButton.onclick = () => addToCart(productName, price);
      }
    }
  });
}

// Add to cart function
function addToCart(productName, price) {
  const existingItem = cart.find(item => item.name === productName);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      name: productName,
      price: price,
      quantity: 1
    });
  }
  
  updateCartCount();
  showNotification(productName + ' added to cart!');
}

// Remove from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartCount();
  displayCartItems();
}

// Update quantity
function updateQuantity(index, quantity) {
  if (quantity <= 0) {
    removeFromCart(index);
  } else {
    cart[index].quantity = quantity;
    displayCartItems();
  }
}

// Update cart count badge
function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) {
    cartCount.textContent = totalItems;
  }
}

// Open cart modal
function openCart() {
  const cartModal = document.getElementById('cartModal');
  displayCartItems();
  if (cartModal) {
    cartModal.style.display = 'block';
  }
}

// Display cart items
function displayCartItems() {
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  
  if (!cartItemsContainer) return;
  
  cartItemsContainer.innerHTML = '';
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
    if (cartTotal) cartTotal.textContent = 'RS 0';
    return;
  }
  
  let total = 0;
  
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    const cartItemHTML = `
      <div class="cart-item">
        <div class="item-info">
          <div class="item-name">${item.name}</div>
          <div class="item-price">RS ${item.price} each</div>
        </div>
        <div class="item-quantity">
          <button class="quantity-btn" onclick="updateQuantity(${index}, ${item.quantity - 1})">-</button>
          <span>${item.quantity}</span>
          <button class="quantity-btn" onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
        </div>
        <div style="min-width: 100px; text-align: right;">
          <div style="font-weight: bold; color: rgb(0, 141, 68);">RS ${itemTotal}</div>
          <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
        </div>
      </div>
    `;
    
    cartItemsContainer.innerHTML += cartItemHTML;
  });
  
  if (cartTotal) {
    cartTotal.textContent = 'RS ' + total;
  }
}

// Checkout function
function checkout() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  alert('Thank you for your order!\nTotal Amount: RS ' + total + '\nOrder will be processed shortly.');
  cart = [];
  updateCartCount();
  document.getElementById('cartModal').style.display = 'none';
  displayCartItems();
}

// Continue shopping
function continueShopping() {
  document.getElementById('cartModal').style.display = 'none';
}

// Buy Now function
function buyNow(productName, price) {
  currentBuyNow = {
    name: productName,
    price: price,
    quantity: 1
  };
  
  const buyNowModal = document.getElementById('buyNowModal');
  const orderSummary = document.getElementById('orderSummary');
  
  const summaryHTML = `
    <div class="summary-item">
      <div class="summary-label">Product:</div>
      <div class="summary-value">${productName}</div>
    </div>
    <div class="summary-item">
      <div class="summary-label">Price:</div>
      <div class="summary-value">RS ${price}</div>
    </div>
    <div class="summary-item">
      <div class="summary-label">Total Amount:</div>
      <div class="summary-value">RS ${price}</div>
    </div>
  `;
  
  if (orderSummary) {
    orderSummary.innerHTML = summaryHTML;
  }
  
  if (buyNowModal) {
    buyNowModal.style.display = 'block';
  }
}

// Confirm Buy Now
function confirmBuyNow() {
  if (!currentBuyNow) return;
  
  alert('Thank you for your purchase!\n\nProduct: ' + currentBuyNow.name + '\nTotal: RS ' + currentBuyNow.price + '\n\nYour order has been confirmed!');
  closeBuyNowModal();
}

// Close Buy Now Modal
function closeBuyNowModal() {
  const buyNowModal = document.getElementById('buyNowModal');
  if (buyNowModal) {
    buyNowModal.style.display = 'none';
  }
  currentBuyNow = null;
}

// Close modal when clicking X button
document.addEventListener('DOMContentLoaded', function() {
  const closeBtn = document.querySelector('.close');
  const buyNowModal = document.getElementById('buyNowModal');
  
  if (closeBtn && buyNowModal) {
    closeBtn.addEventListener('click', closeBuyNowModal);
  }
  
  // Close when clicking outside modal
  window.addEventListener('click', function(event) {
    if (event.target == buyNowModal) {
      closeBuyNowModal();
    }
  });
});

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background-color: rgb(0, 141, 68);
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    z-index: 1001;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 2000);
}