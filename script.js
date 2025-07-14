document.addEventListener('DOMContentLoaded', () => {
    const videos = document.querySelectorAll('.video-carousel video');
    let currentIndex = 0;

    function changeVideo() {
        // Detener el video actual
        videos[currentIndex].pause();
        videos[currentIndex].classList.remove('active');

        // Cambiar al siguiente video
        currentIndex = (currentIndex + 1) % videos.length;

        // Activar y reproducir el siguiente video
        videos[currentIndex].classList.add('active');
        videos[currentIndex].currentTime = 0; // Reinicia el video
        videos[currentIndex].play();
    }

    // Inicializa el primer video
    videos[currentIndex].classList.add('active');
    videos[currentIndex].play();

    // Cambia de video cada 10 segundos
    setInterval(changeVideo, 10000);
});