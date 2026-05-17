// ==========================================
// LISTADO DE CANCIONES (HASTA 100+)
// ==========================================
// 'archivo': El nombre real del .mp3 en tu carpeta (Fácil, sin errores).
// 'titulo': El nombre bonito que se mirará en la pantalla LCD.
const playlist = [
    { archivo: "musica1.mp3", titulo: "NCS - Prueba " },
    { archivo: "musica2.mp3", titulo: "Tame Impala - Let in happen" },
    { archivo: "musica3.mp3", titulo: "Joey Valance y Brae - Punk Tactics" },
    { archivo: "musica4.mp3", titulo: "Mac DeMarco - Chamber of Reflection" },
    { archivo: "musica5.mp3", titulo: "Radiohead - No Surprises" },
    { archivo: "musica6.mp3", titulo: "Chezile - Beanie" },
    { archivo: "musica7.mp3", titulo: "Kanye West- Runaway" }
    // { archivo: "musica6.mp3", titulo: "Nombre de la Canción" }
];

// ==========================================
// LÓGICA INTERNA DEL REPRODUCTOR
// ==========================================
const statusText = document.getElementById('status');
const trackName = document.getElementById('track-name');
const progressBar = document.getElementById('progress-bar');

const btnPlay = document.getElementById('btn-play');
const btnPause = document.getElementById('btn-pause');
const btnStop = document.getElementById('btn-stop');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');

// ==========================================
// 3. CONFIGURACIÓN DEL REPRODUCTOR
// ==========================================
let indiceActual = 0;
const audio = new Audio(); 

function cargarCancion(reproducir = false) {
    if (playlist.length === 0) {
        trackName.innerText = "No hay canciones";
        return;
    }

    // Detenemos lo que esté sonando y cargamos la nueva ruta
    audio.pause();
    audio.src = playlist[indiceActual].archivo;
    audio.load(); 
    
    // Mostramos el título en la pantalla LCD
    trackName.innerText = playlist[indiceActual].titulo;

    // Reseteamos la barrita a 0
    if (progressBar) progressBar.value = 0;

    if (reproducir) {
        // Ejecución segura para evitar bloqueos del navegador
        audio.oncanplaythrough = () => {
            audio.play().catch(err => console.log("Bloqueo de autoplay evitado"));
            audio.oncanplaythrough = null; 
        };
        
        statusText.innerText = "REPRODUCIENDO";
        statusText.style.color = "#00f2fe"; 
    } else {
        statusText.innerText = "SISTEMA LISTO";
        statusText.style.color = "white";
    }
}

// Inicializar el reproductor al cargar la página
window.onload = () => {
    cargarCancion(false);
};

// ==========================================
// 4. LOGICA DE LA BARRITA DE PROGRESO
// ==========================================
audio.ontimeupdate = () => {
    if (audio.duration && progressBar) {
        const porcentaje = (audio.currentTime / audio.duration) * 100;
        progressBar.value = porcentaje;
    }
};

if (progressBar) {
    progressBar.oninput = () => {
        if (audio.duration) {
            const nuevoTiempo = (progressBar.value / 100) * audio.duration;
            audio.currentTime = nuevoTiempo;
        }
    };
}

// ==========================================
// 5. CONTROLES DE LOS BOTONES
// ==========================================
btnPlay.onclick = () => {
    if (playlist.length > 0) {
        audio.play();
        statusText.innerText = "REPRODUCIENDO";
        statusText.style.color = "#00f2fe";
    }
};

btnPause.onclick = () => {
    audio.pause();
    statusText.innerText = "PAUSADO";
    statusText.style.color = "#ffcc00"; 
};

btnStop.onclick = () => {
    audio.pause();
    audio.currentTime = 0;
    statusText.innerText = "DETENIDO";
    statusText.style.color = "#ef4444"; 
};

btnNext.onclick = () => {
    if (playlist.length > 0) {
        indiceActual = (indiceActual + 1) % playlist.length;
        cargarCancion(true);
    }
};

btnPrev.onclick = () => {
    if (playlist.length > 0) {
        indiceActual = (indiceActual - 1 + playlist.length) % playlist.length;
        cargarCancion(true);
    }
};

// Auto-avanzar al terminar la canción
audio.onended = () => {
    btnNext.click();
};
