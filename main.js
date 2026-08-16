document.addEventListener('DOMContentLoaded', () => {
    
    // --- Data Definitions ---
    const featuredNfts = [
        { id: 'pink', name: 'Par0dy #731', meta: 'Featured Pink Demon Page', src: 'assets/nft_pink.jpg', isFeatured: true },
        { id: 'orange', name: 'Par0dy #192', meta: 'Featured Orange Demon Page', src: 'assets/nft_orange.jpg', isFeatured: true },
        { id: 'purple', name: 'Par0dy #814', meta: 'Featured Purple Demon Page', src: 'assets/nft_purple.jpg', isFeatured: true },
        { id: 'blue', name: 'Par0dy #591', meta: 'Featured Cobalt Blue Page', src: 'assets/nft_blue.jpg', isFeatured: true },
        { id: 'red', name: 'Par0dy #903', meta: 'Featured Crimson Red Page', src: 'assets/nft_red.jpg', isFeatured: true }
    ];

    // Generate list of 84 cropped tiles (6 rows, 14 columns)
    const gridNfts = [];
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 14; c++) {
            // Stable, realistic page number calculation
            const pageNum = 1 + (r * 14 + c) * 11;
            gridNfts.push({
                id: `grid_${r}_${c}`,
                name: `Page Sketch #${pageNum}`,
                meta: `Sketchbook Page #${pageNum} (Row ${r + 1}, Col ${c + 1})`,
                src: `assets/nfts/grid_6x14/nft_${r}_${c}.png`,
                isFeatured: false
            });
        }
    }

    // Combine featured and grid NFTs
    // Place featured NFTs at semi-regular intervals to break up grid monotony
    const allNfts = [];
    let gridPtr = 0;
    let featPtr = 0;

    // Layout configuration:
    // Featured at start (index 0), then every ~12 items we insert another featured item
    const totalItems = featuredNfts.length + gridNfts.length;
    for (let i = 0; i < totalItems; i++) {
        if ((i === 0 || i === 8 || i === 18 || i === 28 || i === 40) && featPtr < featuredNfts.length) {
            allNfts.push(featuredNfts[featPtr++]);
        } else if (gridPtr < gridNfts.length) {
            allNfts.push(gridNfts[gridPtr++]);
        } else if (featPtr < featuredNfts.length) {
            // Fallback: push remaining featured if grid is exhausted
            allNfts.push(featuredNfts[featPtr++]);
        }
    }

    // --- Gallery Rendering ---
    const galleryGrid = document.getElementById('gallery-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    let itemsDisplayed = 0;
    const itemsPerLoad = 22; // Loaded items per chunk

    function renderNextItems() {
        const nextLimit = Math.min(itemsDisplayed + itemsPerLoad, allNfts.length);
        
        for (let i = itemsDisplayed; i < nextLimit; i++) {
            const nft = allNfts[i];
            
            const card = document.createElement('div');
            card.classList.add('gallery-item');
            if (nft.isFeatured) {
                card.classList.add('featured-item');
            }
            
            // Set slight random rotation CSS variable for organic sketchbook scattering
            const randomRotation = ((Math.random() - 0.5) * 4).toFixed(2);
            card.style.setProperty('--rand-rot', `${randomRotation}deg`);
            
            // Set HTML content
            card.innerHTML = `
                <img src="${nft.src}" alt="${nft.name}" loading="lazy">
                <div class="overlay-num">#${nft.id.includes('grid') ? nft.name.split('#')[1] : nft.name.split('#')[1]}</div>
            `;
            
            // Add click listener to open the preview modal
            card.addEventListener('click', () => openModal(nft));
            
            galleryGrid.appendChild(card);
        }
        
        itemsDisplayed = nextLimit;
        
        // Hide button or mark as complete if all items loaded
        if (itemsDisplayed >= allNfts.length) {
            loadMoreBtn.innerText = "No More Chaos Left";
            loadMoreBtn.disabled = true;
            loadMoreBtn.style.opacity = "0.5";
            loadMoreBtn.style.textDecoration = "line-through";
            loadMoreBtn.style.cursor = "default";
        }
    }

    // Initial Load
    renderNextItems();

    // Event listener for Load More button
    loadMoreBtn.addEventListener('click', () => {
        renderNextItems();
    });

    // --- Modal Handling ---
    const modal = document.getElementById('nft-preview-modal');
    const modalImg = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalMeta = document.getElementById('modal-number');
    const modalClose = document.getElementById('modal-close');

    function openModal(nft) {
        modalImg.src = nft.src;
        modalTitle.innerText = nft.name;
        modalMeta.innerText = nft.meta;
        
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Disable scroll on body when modal open
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Enable scroll
    }

    modalClose.addEventListener('click', closeModal);
    
    // Close modal on click outside of modal-content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // --- Hero Featured Card Click ---
    const heroCard = document.getElementById('featured-nft-card');
    heroCard.addEventListener('click', () => {
        // Find the red NFT in our array and display it
        const redNft = featuredNfts.find(n => n.id === 'red');
        if (redNft) {
            openModal(redNft);
        }
    });

    // --- Intersection Observer for Scroll Fade-in ---
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        root: null,
        rootMargin: '0px -10px',
        threshold: 0.1
    });

    fadeElements.forEach(el => {
        fadeObserver.observe(el);
    });
});
