document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  // Toggle menu on click
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
  });

  // Optional: Close menu if a user clicks a link inside it
  const mobileLinks = mobileNav.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('active');
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.gallery-grid');
  
  // Lightbox DOM Elements
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  let allImages = []; // Global store for image paths
  let currentIndex = 0; // Tracks which image is currently blown up

  if (grid && lightbox) {
    grid.innerHTML = ''; // Clear hardcoded HTML templates

    fetch('gallery.json')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load gallery.json');
        return response.json();
      })
      .then(images => {
        allImages = images; // Save paths for the arrows to use

        images.forEach((imagePath, index) => {
          const item = document.createElement('div');
          item.classList.add('gallery-item');
          
          const img = document.createElement('img');
          img.src = imagePath; // Keeps the clean relative path from your JSON file
          img.alt = "Brinson Dirt Contracting Project Delivery";
          img.loading = "lazy";
          
          const overlay = document.createElement('div');
          overlay.classList.add('overlay');
          overlay.innerHTML = '<span>+</span>';
          
          item.appendChild(img);
          item.appendChild(overlay);
          grid.appendChild(item);

          // CLICK EVENT: Open this image in the lightbox
          item.addEventListener('click', (e) => {
            openLightbox(index);
          });
        });
      })
      .catch(err => console.error("Error generating gallery layout:", err));

    // Lightbox Control Functions
    function openLightbox(index) {
      currentIndex = index;
      
      // Pull path directly as it is written in gallery.json without adding leading slashes
      lightboxImg.src = allImages[currentIndex];
      
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden'; // Prevents background page scrolling
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = 'auto'; // Restores page scrolling
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % allImages.length;
      lightboxImg.src = allImages[currentIndex];
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + allImages.length) % allImages.length;
      lightboxImg.src = allImages[currentIndex];
    }

    // Event Listeners for explicit controls
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Stops click from spreading into background mask
        closeLightbox();
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showNext();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrev();
      });
    }

    // Close if user clicks the dark background mask space, not internal images/buttons
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Keyboard controls support
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    });
  }
});