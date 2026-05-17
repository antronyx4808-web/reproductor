const playlist = [
    { archivo: "musica1.mp3", titulo: "NCS - Prueba " },
    { archivo: "musica2.mp3", titulo: "Tame Impala - Let it happen" },
    { archivo: "musica3.mp3", titulo: "Joey Valance y Brae - Punk Tactics" },
    { archivo: "musica4.mp3", titulo: "Mac DeMarco - Chamber of Reflection" },
    { archivo: "musica5.mp3", titulo: "Radiohead - No Surprises" },
    { archivo: "musica6.mp3", titulo: "Chezile - Beanie" },
    { archivo: "musica7.mp3", titulo: "Kanye West- Runaway" },
    { archivo: "musica8.mp3", titulo: "Steve Lacy - Dark Red" },
    { archivo: "musica9.mp3", titulo: "Boa - Duvet" },
    { archivo: "musica10.mp3", titulo: "Los Retro - Amtrak" },
    { archivo: "musica11.mp3", titulo: "Konrad OLd Money - Dagga" },
    { archivo: "musica12.mp3", titulo: "Tyler, The Creator - NEW MAGIC WAND" },
];

// ==========================================
// 2. SELECCIÓN DE ELEMENTOS DEL HTML
// ==========================================
const statusText = document.getElementById('status');
const trackName = document.getElementById('track-name');
const progressBar = document.getElementById('progress-bar');
const vinyl = document.getElementById('vinyl-record');
const tracksListUi = document.getElementById('tracks-list-ui'); // Lista izquierda

const btnPlay = document.getElementById('btn-play');
const btnPause = document.getElementById('btn-pause');
const btnStop = document.getElementById('btn-stop');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');

let indiceActual = 0;
const audio = new Audio(); 

// ==========================================
// 3. FUNCIÓN PARA DIBUJAR LA LISTA EN PANTALLA
// ==========================================
function construirListaUI() {
    if (!tracksListUi) return;
    tracksListUi.innerHTML = ""; // Limpiamos la lista por seguridad

    playlist.forEach((cancion, index) => {
        const li = document.createElement('li');
        li.innerText = cancion.titulo;
        
        // Si es la canción que está seleccionada actualmente, le pone la clase activa
        if (index === indiceActual) {
            li.classList.add('active-track');
        }

        // Evento mágico: Si el usuario le da clic a este elemento de la lista izquierda
        li.onclick = () => {
            indiceActual = index;
            cargarCancion(true); // Carga y reproduce de inmediato
        };

        tracksListUi.appendChild(li);
    });
}

// ==========================================
// 4. CONFIGURACIÓN DEL REPRODUCTOR
// ==========================================
function cargarCancion(reproducir = false) {
    if (playlist.length === 0) {
        trackName.innerText = "No hay canciones";
        return;
    }

    audio.pause();
    audio.src = playlist[indiceActual].archivo;
    audio.load(); 
    
    trackName.innerText = playlist[indiceActual].titulo;
    if (progressBar) progressBar.value = 0;

    // Actualizamos visualmente cuál canción está marcada en la lista izquierda
    construirListaUI();

    if (reproducir) {
        audio.oncanplaythrough = () => {
            audio.play().catch(err => console.log("Bloqueo de autoplay evitado"));
            audio.oncanplaythrough = null; 
        };
        
        statusText.innerText = "REPRODUCIENDO";
        statusText.style.color = "#00f2fe"; 
        if (vinyl) vinyl.classList.add('playing');
    } else {
        statusText.innerText = "SISTEMA LISTO";
        statusText.style.color = "white";
        if (vinyl) vinyl.classList.remove('playing');
    }
}

// Inicializar el sistema al cargar la página
window.onload = () => {
    cargarCancion(false);
};
// Hace que la barra avance con la música
audio.ontimeupdate = () => {
    if (audio.duration && progressBar) {
        const porcentaje = (audio.currentTime / audio.duration) * 100;
        progressBar.value = porcentaje;
    }
};

// Te permite hacer clic en cualquier parte de la barra para adelantar la canción
if (progressBar) {
    progressBar.oninput = () => {
        if (audio.duration) {
            const nuevoTiempo = (progressBar.value / 100) * audio.duration;
            audio.currentTime = nuevoTiempo;
        }
    };
}
// ==========================================
// 5. LÓGICA DE LA BARRITA DE PROGRESO
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
// 6. CONTROLES DE LOS BOTONES
// ==========================================
btnPlay.onclick = () => {
    if (playlist.length > 0) {
        audio.play();
        statusText.innerText = "REPRODUCIENDO";
        statusText.style.color = "#00f2fe";
        if (vinyl) vinyl.classList.add('playing');
    }
};

btnPause.onclick = () => {
    audio.pause();
    statusText.innerText = "PAUSADO";
    statusText.style.color = "#ffcc00"; 
    if (vinyl) vinyl.classList.remove('playing');
};

btnStop.onclick = () => {
    audio.pause();
    audio.currentTime = 0;
    statusText.innerText = "DETENIDO";
    statusText.style.color = "#ef4444"; 
    if (vinyl) vinyl.classList.remove('playing');
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
