// Variables globales para el cotizador
let cotizacionActual = {};

// PERSONALIZABLE: Precios base por objeto (en pesos colombianos)
const precios = {
    "colchón": 150000,
    "sofá": 100000,
    "sofacama": 170000,
    "silla sala": 70000,
    "vehículo": 100000,
    "silla comedor sencilla": 20000,
    "silla comedor forrada": 35000
};

// PERSONALIZABLE: Descuentos disponibles
const descuentos = {
    "referido": 0.10,        // 10% de descuento
    "promo_instagram": 0.15  // 15% de descuento
};

// PERSONALIZABLE: Número de WhatsApp (formato: código país + número sin espacios)
const numeroWhatsApp = "573112672513"; // Cambiar por tu número real

// Función para mostrar el cotizador
function mostrarCotizador() {
    const cotizadorSection = document.getElementById('cotizador');
    cotizadorSection.classList.add('active');
    cotizadorSection.scrollIntoView({ behavior: 'smooth' });
}

// Función para calcular la cotización
function calcularCotizacion() {
    const cliente = document.getElementById('cliente').value.trim();
    const objeto = document.getElementById('objeto').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const descuentoSeleccionado = document.getElementById('descuento').value;

    // Validaciones
    if (!cliente) {
        alert('Por favor, ingresa tu nombre');
        document.getElementById('cliente').focus();
        return;
    }

    if (!cantidad || cantidad < 1) {
        alert('Por favor, ingresa una cantidad válida');
        document.getElementById('cantidad').focus();
        return;
    }

    // Calcular precio base
    const precioBase = precios[objeto];
    let subtotal = precioBase * cantidad;

    // Aplicar descuento si existe
    let descuentoAplicado = 0;
    let textoDescuento = '';
    if (descuentoSeleccionado !== 'ninguno' && descuentos[descuentoSeleccionado]) {
        descuentoAplicado = subtotal * descuentos[descuentoSeleccionado];
        const porcentaje = descuentos[descuentoSeleccionado] * 100;
        textoDescuento = `Descuento ${descuentoSeleccionado.replace('_', ' ')} (${porcentaje}%): -$${descuentoAplicado.toLocaleString('es-CO')}`;
    }

    const total = subtotal - descuentoAplicado;

    // Guardar cotización actual para WhatsApp
    cotizacionActual = {
        cliente,
        objeto,
        cantidad,
        descuento: descuentoSeleccionado,
        subtotal,
        descuentoAplicado,
        total
    };

    // Mostrar resultado
    document.getElementById('totalPrecio').textContent = `$${total.toLocaleString('es-CO')}`;
    
    let detalles = `
        <div style="text-align: left; max-width: 400px; margin: 0 auto;">
            <p><strong>Cliente:</strong> ${cliente}</p>
            <p><strong>Servicio:</strong> ${objeto} (${cantidad} ${cantidad === 1 ? 'unidad' : 'unidades'})</p>
            <p><strong>Precio unitario:</strong> $${precioBase.toLocaleString('es-CO')}</p>
            <p><strong>Subtotal:</strong> $${subtotal.toLocaleString('es-CO')}</p>
            ${textoDescuento ? `<p style="color: #10b981;"><strong>${textoDescuento}</strong></p>` : ''}
            <hr style="margin: 1rem 0; border: 1px solid rgba(255,255,255,0.3);">
            <p style="font-size: 1.2rem;"><strong>Total:</strong> $${total.toLocaleString('es-CO')}</p>
        </div>
    `;
    
    document.getElementById('detalles').innerHTML = detalles;
    document.getElementById('resultado').classList.add('show');
}

// Función para enviar cotización por WhatsApp
function enviarWhatsApp() {
    if (!cotizacionActual.cliente) {
        alert('Primero debes calcular una cotización');
        return;
    }

    const mensaje = `Hola! Solicito cotización:

📋 *DETALLES DEL SERVICIO:*
• Cliente: ${cotizacionActual.cliente}
• Servicio: ${cotizacionActual.objeto}
• Cantidad: ${cotizacionActual.cantidad} ${cotizacionActual.cantidad === 1 ? 'unidad' : 'unidades'}
• Precio unitario: $${precios[cotizacionActual.objeto].toLocaleString('es-CO')}

💰 *RESUMEN DE COSTOS:*
• Subtotal: ${cotizacionActual.subtotal.toLocaleString('es-CO')}
${cotizacionActual.descuentoAplicado > 0 ? `• Descuento: -${cotizacionActual.descuentoAplicado.toLocaleString('es-CO')}` : ''}
• *TOTAL: ${cotizacionActual.total.toLocaleString('es-CO')}*

¿Cuándo podrían realizar el servicio?`;

    const whatsappUrl = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
}

// Código del carrusel de videos
document.addEventListener('DOMContentLoaded', () => {
    const videos = document.querySelectorAll('.video-carousel video');
    const controlsContainer = document.getElementById('carouselControls');
    const loadingElement = document.querySelector('.video-loading');
    let currentIndex = 0;

    // Crear dots de control para cada video
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
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            videos[0].classList.add('active');
            
            // Intentar reproducir el primer video
            const playPromise = videos[0].play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Autoplay prevented:', error);
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
            if (videosLoaded === 1) {
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
            if (loadingElement) {
                loadingElement.textContent = 'Videos no disponibles';
            }
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

    // Validación en tiempo real para el cotizador
    const clienteInput = document.getElementById('cliente');
    const cantidadInput = document.getElementById('cantidad');

    if (clienteInput) {
        clienteInput.addEventListener('input', function() {
            // Limpiar caracteres especiales innecesarios
            this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
        });
    }

    if (cantidadInput) {
        cantidadInput.addEventListener('input', function() {
            // Asegurar que solo sean números positivos
            if (this.value < 1) {
                this.value = 1;
            }
        });
    }
});

