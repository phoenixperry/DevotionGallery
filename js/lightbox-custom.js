/**
 * Lightweight Lightbox implementation
 * Replaces the Squarespace lightbox with a simpler version
 */

var Lightbox = (function() {
    const LIGHTBOX_BORDER_WIDTH = 14;
    const LIGHTBOX_DISPLAY_SPEED = 0.2;
    const ARROW_INACTIVE_OPACITY = 0.8;
    
    let overlay, container, image, prevButton, nextButton, closeButton, caption;
    let currentIndex = 0;
    let images = [];
    let isOpen = false;
    
    // Initialize lightbox
    function init() {
      createElements();
      setupEventListeners();
      collectImages();
    }
    
    // Create DOM elements
    function createElements() {
      // Create overlay
      overlay = document.createElement('div');
      overlay.id = 'lightbox-overlay';
      overlay.className = 'lightbox-overlay';
      overlay.style.display = 'none';
      
      // Create container
      container = document.createElement('div');
      container.id = 'lightbox-container';
      container.className = 'lightbox-container';
      container.style.display = 'none';
      
      // Create image element
      image = document.createElement('img');
      image.id = 'lightbox-image';
      image.className = 'lightbox-image';
      
      // Create navigation buttons
      prevButton = document.createElement('div');
      prevButton.id = 'lightbox-prev';
      prevButton.className = 'lightbox-nav lightbox-prev';
      prevButton.innerHTML = '&lsaquo;';
      
      nextButton = document.createElement('div');
      nextButton.id = 'lightbox-next';
      nextButton.className = 'lightbox-nav lightbox-next';
      nextButton.innerHTML = '&rsaquo;';
      
      // Create close button
      closeButton = document.createElement('div');
      closeButton.id = 'lightbox-close';
      closeButton.className = 'lightbox-close';
      closeButton.innerHTML = '&times;';
      
      // Create caption
      caption = document.createElement('div');
      caption.id = 'lightbox-caption';
      caption.className = 'lightbox-caption';
      
      // Assemble the lightbox
      container.appendChild(image);
      container.appendChild(prevButton);
      container.appendChild(nextButton);
      container.appendChild(closeButton);
      container.appendChild(caption);
      
      // Add to document
      document.body.appendChild(overlay);
      document.body.appendChild(container);
      
      // Add CSS if not already present
      if (!document.getElementById('lightbox-styles')) {
        const style = document.createElement('style');
        style.id = 'lightbox-styles';
        style.textContent = `
          .lightbox-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 9000;
          }
          
          .lightbox-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;
            padding: ${LIGHTBOX_BORDER_WIDTH}px;
            z-index: 9001;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
          }
          
          .lightbox-image {
            display: block;
            max-width: 90vw;
            max-height: 80vh;
          }
          
          .lightbox-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            font-size: 60px;
            color: #fff;
            background-color: rgba(0, 0, 0, 0.3);
            width: 50px;
            height: 80px;
            line-height: 70px;
            text-align: center;
            cursor: pointer;
            user-select: none;
            opacity: ${ARROW_INACTIVE_OPACITY};
            transition: opacity 0.2s;
          }
          
          .lightbox-nav:hover {
            opacity: 1;
          }
          
          .lightbox-prev {
            left: 10px;
          }
          
          .lightbox-next {
            right: 10px;
          }
          
          .lightbox-close {
            position: absolute;
            top: -30px;
            right: -30px;
            font-size: 30px;
            color: #fff;
            cursor: pointer;
            user-select: none;
          }
          
          .lightbox-caption {
            position: absolute;
            bottom: -40px;
            left: 0;
            right: 0;
            color: #fff;
            text-align: center;
            padding: 10px;
          }
        `;
        document.head.appendChild(style);
      }
    }
    
    // Set up event listeners
    function setupEventListeners() {
      // Close lightbox
      overlay.addEventListener('click', close);
      closeButton.addEventListener('click', close);
      
      // Navigation
      prevButton.addEventListener('click', showPrevious);
      nextButton.addEventListener('click', showNext);
      
      // Keyboard navigation
      document.addEventListener('keydown', function(e) {
        if (!isOpen) return;
        
        switch(e.key) {
          case 'Escape':
            close();
            break;
          case 'ArrowLeft':
            showPrevious();
            break;
          case 'ArrowRight':
            showNext();
            break;
        }
      });
      
      // Window resize
      window.addEventListener('resize', function() {
        if (isOpen) {
          adjustImageSize();
        }
      });
    }
    
    // Collect all lightbox images
    function collectImages() {
      const links = document.querySelectorAll('a[rel="lightbox"]');
      
      images = [];
      links.forEach(function(link) {
        const img = {
          href: link.href,
          title: link.getAttribute('title') || '',
          element: link
        };
        
        images.push(img);
        
        // Add click event
        link.addEventListener('click', function(e) {
          e.preventDefault();
          open(this.href);
        });
      });
    }
    
    // Open lightbox
    function open(url) {
      // Find index of the image
      let index = -1;
      for (let i = 0; i < images.length; i++) {
        if (images[i].href === url) {
          index = i;
          break;
        }
      }
      
      if (index === -1) {
        // If not found in the collection, just open the image
        image.onload = function() {
          adjustImageSize();
          showLightbox();
        };
        image.src = url;
        caption.textContent = '';
      } else {
        // Open from the collection
        currentIndex = index;
        showImage(currentIndex);
      }
    }
    
    // Show specific image by index
    function showImage(index) {
      if (index < 0 || index >= images.length) return;
      
      currentIndex = index;
      
      // Show loading state
      container.classList.add('loading');
      
      // Load the image
      image.onload = function() {
        adjustImageSize();
        container.classList.remove('loading');
        
        // Update caption
        caption.textContent = images[currentIndex].title;
        
        // Show the lightbox if not already visible
        if (!isOpen) {
          showLightbox();
        }
      };
      
      image.src = images[currentIndex].href;
      
      // Update navigation visibility
      updateNavigation();
    }
    
    // Show previous image
    function showPrevious() {
      if (currentIndex > 0) {
        showImage(currentIndex - 1);
      }
    }
    
    // Show next image
    function showNext() {
      if (currentIndex < images.length - 1) {
        showImage(currentIndex + 1);
      }
    }
    
    // Show the lightbox
    function showLightbox() {
      overlay.style.display = 'block';
      container.style.display = 'block';
      isOpen = true;
      
      // Apply fade-in effect
      overlay.style.opacity = 0;
      container.style.opacity = 0;
      
      setTimeout(function() {
        overlay.style.transition = `opacity ${LIGHTBOX_DISPLAY_SPEED}s ease-in-out`;
        container.style.transition = `opacity ${LIGHTBOX_DISPLAY_SPEED}s ease-in-out`;
        overlay.style.opacity = 1;
        container.style.opacity = 1;
      }, 10);
      
      // Disable scrolling on the body
      document.body.style.overflow = 'hidden';
    }
    
    // Close the lightbox
    function close() {
      overlay.style.opacity = 0;
      container.style.opacity = 0;
      
      setTimeout(function() {
        overlay.style.display = 'none';
        container.style.display = 'none';
        isOpen = false;
        
        // Re-enable scrolling
        document.body.style.overflow = '';
      }, LIGHTBOX_DISPLAY_SPEED * 1000);
    }
    
    // Adjust image size
    function adjustImageSize() {
      // Reset styles to get natural dimensions
      image.style.width = '';
      image.style.height = '';
      
      // Get max dimensions
      const maxWidth = window.innerWidth * 0.9 - (LIGHTBOX_BORDER_WIDTH * 2);
      const maxHeight = window.innerHeight * 0.8 - (LIGHTBOX_BORDER_WIDTH * 2);
      
      // Scale down if needed
      if (image.naturalWidth > maxWidth || image.naturalHeight > maxHeight) {
        const widthRatio = maxWidth / image.naturalWidth;
        const heightRatio = maxHeight / image.naturalHeight;
        const ratio = Math.min(widthRatio, heightRatio);
        
        image.style.width = Math.round(image.naturalWidth * ratio) + 'px';
        image.style.height = Math.round(image.naturalHeight * ratio) + 'px';
      }
    }
    
    // Update navigation visibility
    function updateNavigation() {
      prevButton.style.display = currentIndex > 0 ? 'block' : 'none';
      nextButton.style.display = currentIndex < images.length - 1 ? 'block' : 'none';
    }
    
    // Public API
    return {
      init: init,
      open: open,
      close: close
    };
  })();
  
  // Initialize lightbox on page load
  document.addEventListener('DOMContentLoaded', function() {
    Lightbox.init();
  });
  
  // Function to open an image directly
  function showImage(url) {
    Lightbox.open(url);
  }