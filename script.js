document.addEventListener('DOMContentLoaded', () => {
    const videos = document.querySelectorAll('.video-carousel video');
    const controlsContainer = document.getElementById('carouselControls');
    const loadingElement = document.querySelector('.video-loading');
    let currentIndex = 0;
    let isPlaying = false;

    // Crear dots de control
    videos.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `control-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToVideo(index));
        controlsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.control-dot');

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToVideo(index) {
        if (index === currentIndex) return;

        // Pausar video actual
        if (videos[currentIndex]) {
            videos[currentIndex].pause();
            videos[currentIndex].classList.remove('active');
        }

        currentIndex = index;

        // Activar nuevo video
        videos[currentIndex].classList.add('active');
        videos[currentIndex].currentTime = 0;
        
        // Intentar reproducir
        const playPromise = videos[currentIndex].play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Autoplay prevented:', error);
            });
        }

        updateDots();
    }

    function changeVideo() {
        const nextIndex = (currentIndex + 1) % videos.length;
        goToVideo(nextIndex);
    }

    // Inicializar primer video
    function initializeCarousel() {
        if (videos.length > 0) {
            loadingElement.style.display = 'none';
            videos[0].classList.add('active');
            
            // Intentar reproducir el primer video
            const playPromise = videos[0].play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isPlaying = true;
                }).catch(error => {
                    console.log('Autoplay prevented:', error);
                    // Mostrar mensaje de que el usuario debe hacer clic para reproducir
                });
            }

            // Cambiar video cada 8 segundos
            setInterval(changeVideo, 8000);
        }
    }

    // Verificar si los videos están listos
    let videosLoaded = 0;
    videos.forEach(video => {
        video.addEventListener('loadeddata', () => {
            videosLoaded++;
            if (videosLoaded === 1) { // Iniciar cuando el primer video esté listo
                initializeCarousel();
            }
        });

        video.addEventListener('error', (e) => {
            console.log('Error loading video:', e);
            videosLoaded++;
            if (videosLoaded === 1) {
                initializeCarousel();
            }
        });
    });

    // Fallback si los videos no cargan
    setTimeout(() => {
        if (videosLoaded === 0) {
            loadingElement.textContent = 'Videos no disponibles';
            initializeCarousel();
        }
    }, 3000);

    // Animaciones de scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animar
    document.querySelectorAll('.service-card, .carousel-section').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease-out';
        observer.observe(el);
    });

    // Smooth scroll para navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
