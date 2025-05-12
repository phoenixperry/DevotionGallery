/**
 * Simple gallery slideshow implementation
 * Based on original Squarespace gallery slideshow but simplified for static sites
 */

var GallerySlideshow = (function() {
    // Default configuration
    const DEFAULT_CONFIG = {
      slideTransition: 'fade', // 'fade' or 'swipe'
      slideDelay: 5, // seconds
      fadeDuration: 1, // seconds
      navigation: {
        autoPlayEnabled: true,
        slideDelay: 5,
        duration: 0.5,
        easing: 'easeOutStrong',
        fadeDuration: 1
      }
    };
    
    // Gallery class
    function Gallery(options) {
      this.options = Object.assign({}, DEFAULT_CONFIG, options);
      this.currentSlide = 0;
      this.isAnimating = false;
      this.slideWidth = 0;
      this.slideHeight = 0;
      this.totalSlides = 0;
      this.slides = [];
      this.container = null;
      this.frame = null;
      this.animatedFrame = null;
      this.slideElements = [];
      this.autoPlayTimer = null;
      this.initialized = false;
    }
    
    // Initialize the gallery
    Gallery.prototype.init = function(container, slides) {
      if (!container || !slides || !slides.length) {
        console.error('Gallery initialization failed: missing container or slides');
        return;
      }
      
      this.container = typeof container === 'string' ? document.getElementById(container) : container;
      this.slides = slides;
      this.totalSlides = slides.length;
      
      if (!this.container) {
        console.error('Gallery initialization failed: container not found');
        return;
      }
      
      this._setupDOM();
      this._setupEventListeners();
      this.goToSlide(0);
      
      if (this.options.navigation.autoPlayEnabled) {
        this._startAutoPlay();
      }
      
      this.initialized = true;
      return this;
    };
    
    // Set up DOM structure
    Gallery.prototype._setupDOM = function() {
      // Calculate dimensions
      this.slideWidth = this.container.offsetWidth;
      this.slideHeight = Math.round(this.slideWidth / 1.5); // Default aspect ratio
      
      // Create gallery structure
      this.container.classList.add('squarespace-slideshow-wrapper');
      
      const slideshow = document.createElement('div');
      slideshow.className = 'squarespace-slideshow';
      slideshow.style.width = this.slideWidth + 'px';
      slideshow.style.height = this.slideHeight + 'px';
      
      const frame = document.createElement('div');
      frame.className = 'squarespace-slideshow-frame';
      frame.style.width = this.slideWidth + 'px';
      
      const animatedFrame = document.createElement('div');
      animatedFrame.className = 'squarespace-slideshow-animated-frame type-' + this.options.slideTransition;
      
      if (this.options.slideTransition === 'swipe') {
        animatedFrame.style.width = (this.slideWidth * 3) + 'px';
        animatedFrame.style.height = this.slideHeight + 'px';
        animatedFrame.style.marginLeft = -this.slideWidth + 'px';
      } else {
        animatedFrame.style.width = this.slideWidth + 'px';
        animatedFrame.style.height = this.slideHeight + 'px';
      }
      
      // Create slides
      for (let i = 0; i < this.totalSlides; i++) {
        const slide = document.createElement('div');
        slide.className = 'sf';
        slide.style.width = this.slideWidth + 'px';
        slide.style.height = this.slideHeight + 'px';
        
        const img = document.createElement('img');
        img.className = 'slide-content';
        img.src = this.slides[i].url;
        img.alt = this.slides[i].title || '';
        
        slide.appendChild(img);
        animatedFrame.appendChild(slide);
        this.slideElements.push(slide);
      }
      
      // Create navigation buttons
      const prevButton = document.createElement('div');
      prevButton.className = 'frwd fnav';
      prevButton.setAttribute('aria-label', 'Previous Slide');
      
      const nextButton = document.createElement('div');
      nextButton.className = 'ffwd fnav';
      nextButton.setAttribute('aria-label', 'Next Slide');
      
      // Create indicators
      const indicatorWrapper = document.createElement('div');
      indicatorWrapper.className = 'squarespace-slideshow-indicator-wrapper slide-indicator-type-dotted';
      indicatorWrapper.style.width = this.slideWidth + 'px';
      
      const indicatorBox = document.createElement('div');
      indicatorBox.className = 'slide-indicator-box';
      
      // Create individual indicators
      for (let i = 0; i < this.totalSlides; i++) {
        const indicator = document.createElement('a');
        indicator.className = 'slide-indicator';
        indicator.setAttribute('data-index', i);
        indicator.href = 'javascript:void(0);';
        indicatorBox.appendChild(indicator);
      }
      
      // Assemble the DOM
      indicatorWrapper.appendChild(indicatorBox);
      frame.appendChild(animatedFrame);
      slideshow.appendChild(frame);
      slideshow.appendChild(prevButton);
      slideshow.appendChild(nextButton);
      slideshow.appendChild(indicatorWrapper);
      
      // Clear container and append new structure
      this.container.innerHTML = '';
      this.container.appendChild(slideshow);
      
      // Store references
      this.frame = frame;
      this.animatedFrame = animatedFrame;
      this.prevButton = prevButton;
      this.nextButton = nextButton;
      this.indicatorBox = indicatorBox;
    };
    
    // Set up event listeners
    Gallery.prototype._setupEventListeners = function() {
      const self = this;
      
      // Navigation buttons
      this.prevButton.addEventListener('click', function() {
        self._stopAutoPlay();
        self.prevSlide();
      });
      
      this.nextButton.addEventListener('click', function() {
        self._stopAutoPlay();
        self.nextSlide();
      });
      
      // Indicators
      const indicators = this.indicatorBox.querySelectorAll('.slide-indicator');
      indicators.forEach(function(indicator) {
        indicator.addEventListener('click', function() {
          const index = parseInt(this.getAttribute('data-index'));
          self._stopAutoPlay();
          self.goToSlide(index);
        });
      });
    };
    
    // Start autoplay
    Gallery.prototype._startAutoPlay = function() {
      const self = this;
      this._stopAutoPlay(); // Clear any existing timer
      
      this.autoPlayTimer = setInterval(function() {
        self.nextSlide();
      }, this.options.navigation.slideDelay * 1000);
    };
    
    // Stop autoplay
    Gallery.prototype._stopAutoPlay = function() {
      if (this.autoPlayTimer) {
        clearInterval(this.autoPlayTimer);
        this.autoPlayTimer = null;
      }
    };
    
    // Go to next slide
    Gallery.prototype.nextSlide = function() {
      if (this.isAnimating) return;
      
      const nextIndex = (this.currentSlide + 1) % this.totalSlides;
      this.goToSlide(nextIndex);
    };
    
    // Go to previous slide
    Gallery.prototype.prevSlide = function() {
      if (this.isAnimating) return;
      
      const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
      this.goToSlide(prevIndex);
    };
    
    // Go to specific slide
    Gallery.prototype.goToSlide = function(index) {
      if (this.isAnimating || index === this.currentSlide) return;
      
      this.isAnimating = true;
      
      // Update indicators
      const indicators = this.indicatorBox.querySelectorAll('.slide-indicator');
      indicators.forEach(function(indicator, i) {
        if (i === index) {
          indicator.classList.add('active');
        } else {
          indicator.classList.remove('active');
        }
      });
      
      // Transition slides
      if (this.options.slideTransition === 'fade') {
        this._fadeToSlide(index);
      } else {
        this._swipeToSlide(index);
      }
    };
    
    // Fade transition
    Gallery.prototype._fadeToSlide = function(index) {
      const self = this;
      const currentSlide = this.slideElements[this.currentSlide];
      const nextSlide = this.slideElements[index];
      const currentContent = currentSlide.querySelector('.slide-content');
      const nextContent = nextSlide.querySelector('.slide-content');
      
      // Fade out current slide
      currentSlide.classList.remove('active');
      this._fadeElement(currentContent, 1, 0, this.options.navigation.fadeDuration);
      
      // Fade in next slide
      nextSlide.classList.add('active');
      this._fadeElement(nextContent, 0, 1, this.options.navigation.fadeDuration, function() {
        self.currentSlide = index;
        self.isAnimating = false;
      });
    };
    
    // Swipe transition
    Gallery.prototype._swipeToSlide = function(index) {
      const self = this;
      const isNext = index > this.currentSlide || (this.currentSlide === this.totalSlides - 1 && index === 0);
      const direction = isNext ? -1 : 1;
      
      // Set up positions
      const currentPosition = parseInt(this.animatedFrame.style.marginLeft);
      const targetPosition = currentPosition + (this.slideWidth * direction);
      
      // Animate the slide
      this._animateProperty(
        this.animatedFrame,
        'marginLeft',
        currentPosition,
        targetPosition,
        this.options.navigation.duration,
        function() {
          // Reset position and update current slide
          if (isNext) {
            self.animatedFrame.appendChild(self.animatedFrame.firstChild);
          } else {
            self.animatedFrame.insertBefore(
              self.animatedFrame.lastChild,
              self.animatedFrame.firstChild
            );
          }
          
          self.animatedFrame.style.marginLeft = -self.slideWidth + 'px';
          self.currentSlide = index;
          self.isAnimating = false;
          
          // Update active classes
          self.slideElements.forEach(function(slide, i) {
            if (i === index) {
              slide.classList.add('active');
            } else {
              slide.classList.remove('active');
            }
          });
        }
      );
    };
    
    // Helper: Fade element
    Gallery.prototype._fadeElement = function(element, from, to, duration, callback) {
      this._animateProperty(element, 'opacity', from, to, duration, callback);
    };
    
    // Helper: Animate a property
    Gallery.prototype._animateProperty = function(element, property, from, to, duration, callback) {
      const self = this;
      const startTime = performance.now();
      
      function animate(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / (duration * 1000), 1);
        const easedProgress = self._easeOutStrong(progress);
        const currentValue = from + (to - from) * easedProgress;
        
        element.style[property] = (property === 'opacity') ? 
          currentValue : 
          currentValue + 'px';
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else if (callback) {
          callback();
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    // Helper: Easing function
    Gallery.prototype._easeOutStrong = function(t) {
      return 1 - Math.pow(1 - t, 4);
    };
    
    // Public API
    return {
      create: function(container, slides, options) {
        const gallery = new Gallery(options);
        return gallery.init(container, slides);
      }
    };
  })();
  
  // Initialize galleries on page load
  document.addEventListener('DOMContentLoaded', function() {
    // Example usage:
    // 
    // const slideshowElement = document.getElementById('my-slideshow');
    // const slides = [
    //   { url: 'image1.jpg', title: 'Slide 1' },
    //   { url: 'image2.jpg', title: 'Slide 2' },
    //   { url: 'image3.jpg', title: 'Slide 3' }
    // ];
    // 
    // const options = {
    //   slideTransition: 'fade',
    //   slideDelay: 5,
    //   navigation: {
    //     autoPlayEnabled: true
    //   }
    // };
    // 
    // const gallery = GallerySlideshow.create(slideshowElement, slides, options);
  });