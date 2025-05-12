document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Set animation delay for mobile menu items
    const mobileNavItems = document.querySelectorAll('.mobile-nav li');
    mobileNavItems.forEach((item, index) => {
      item.style.setProperty('--item-index', index);
    });
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent event bubbling
      this.classList.toggle('active');
      mobileNav.classList.toggle('active');
      
      // Prevent scrolling when menu is open
      document.body.classList.toggle('menu-open');
    });
    
    // Mobile dropdown toggles
    const mobileDropdownToggle = document.querySelectorAll('.mobile-nav .has-dropdown > a');
    
    mobileDropdownToggle.forEach(function(toggle) {
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation(); // Prevent event bubbling
        this.parentNode.classList.toggle('open');
      });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      // Check if menu is active and click is outside the menu
      if (mobileNav.classList.contains('active') && 
          !mobileNav.contains(event.target) && 
          !menuToggle.contains(event.target)) {
        mobileNav.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
    
    // Prevent clicks inside mobile nav from closing it
    mobileNav.addEventListener('click', function(event) {
      event.stopPropagation(); // Stop clicks inside nav from reaching document
    });
    
    // Ensure proper display when resizing window
    window.addEventListener('resize', function() {
      if (window.innerWidth > 992 && mobileNav.classList.contains('active')) {
        mobileNav.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  });