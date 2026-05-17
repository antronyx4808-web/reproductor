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
    { archivo: "musica5.mp3", titulo: "Radiohead - No Surprises" }
    { archivo: "musica6.mp3", titulo: "Chezile - Beanie" }
    { archivo: "musica7.mp3", titulo: "Kanye West- Runaway" } 
    // { archivo: "musica6.mp3", titulo: "Nombre de la Canción" }
];

// ==========================================
// LÓGICA INTERNA DEL REPRODUCTOR
// ==========================================
const statusText = document.getElementById('status');
const trackName = document.getElementById('track-name');

const btnPlay = document.getElementById('btn-play');
const btnPause = document.getElementById('btn-pause');
const btnStop = document.getElementById('btn-stop');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');

let indiceActual = 0;
const audio = new Audio(); 

function cargarCancion(reproducir = false) {
    if (playlist.length === 0) {
        trackName.innerText = "No hay canciones";
        return;
    }

    // El reproductor jala el archivo simplificado (ej: musica1.mp3)
    audio.src = playlist[indiceActual].archivo;
    
    // Pero en la pantalla LCD se muestra el título estético
    trackName.innerText = playlist[indiceActual].titulo;

    if (reproducir) {
        audio.play().catch(err => console.log("Esperando interacción..."));
        statusText.innerText = "REPRODUCIENDO";
        statusText.style.color = "#00f2fe"; 
    } else {
        statusText.innerText = "SISTEMA LISTO";
        statusText.style.color = "white";
    }
}

window.onload = () => {
    cargarCancion(false);
};

// ==========================================
// CONTROLES DE LOS BOTONES
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

audio.onended = () => {
    btnNext.click();
};
