const playlist = [
    { archivo: "musica1.mp3", titulo: "NCS - Prueba " },
    { archivo: "musica2.mp3", titulo: "Tame Impala - Let it happen" },
    { archivo: "musica3.mp3", titulo: "Joey Valance y Brae - Punk Tactics" },
    { archivo: "musica4.mp3", titulo: "Mac DeMarco - Chamber of Reflection" },
    { archivo: "musica5.mp3", titulo: "Radiohead - No Surprises" },
    { archivo: "musica6.mp3", titulo: "Chezile - Beanie" },
    { archivo: "musica7.mp3", titulo: "Kanye West - Runaway" },
    { archivo: "musica8.mp3", titulo: "Steve Lacy - Dark Red" },
    { archivo: "musica9.mp3", titulo: "Boa - Duvet" },
    { archivo: "musica10.mp3", titulo: "Los Retro - Amtrak" },
    { archivo: "musica11.mp3", titulo: "Konrad Old Money - Dagga" },
    { archivo: "musica12.mp3", titulo: "Tyler, The Creator - NEW MAGIC WAND" },
    { archivo: "musica13.mp3", titulo: "ween - Ocean Man" },
    { archivo: "musica14.mp3", titulo: "CAFUNE - Tek it" },
    { archivo: "musica15.mp3", titulo: "Fleetwood Mac - The Chain" },
    { archivo: "musica16.mp3", titulo: "Surf Curse - Disco" },
    { archivo: "musica17.mp3", titulo: "The Notorious B.I.G. - Big Poppa" },
    { archivo: "musica18.mp3", titulo: "Kanye West - Flashing Lights" },
    { archivo: "musica19.mp3", titulo: "Eminem - Superman (con Dina Rae)" },
    { archivo: "musica20.mp3", titulo: "Teddybears - Punkrocker" },
];

let currentTrackIndex = 0;
let isPlaying = false;
const audio = new Audio();

// Elementos de la Interfaz con protección por si no existen en el HTML
const getEl = (id) => document.getElementById(id);

// ==========================================
// 3. LÓGICA PRINCIPAL DE RENDERS Y CARGAS
// ==========================================

// Función para cargar la playlist de la izquierda de forma limpia
function inicializarPlaylist() {
    const listaUI = getEl('tracks-list-ui');
    if (!listaUI) return; // Si no encuentra la lista, evita que se rompa el código

    listaUI.innerHTML = ""; // Limpieza total para evitar duplicados

    playlist.forEach((cancion, index) => {
        const item = document.createElement('li');
        item.textContent = cancion.titulo;

        if (index === currentTrackIndex) {
            item.classList.add('active');
        }

        item.addEventListener('click', () => {
            currentTrackIndex = index;
            cargarCancion(currentTrackIndex);
            reproducirCancion();
        });

        listaUI.appendChild(item);
    });
}

// Carga el archivo de audio en el buffer y actualiza la pantalla
function cargarCancion(index) {
    if (index < 0 || index >= playlist.length) return;
    
    audio.src = playlist[index].archivo;
    
    const lcdTitle = getEl('lcd-title');
    if (lcdTitle) {
        lcdTitle.textContent = playlist[index].titulo;
    }
    
    const progressBar = getEl('progress-bar');
    if (progressBar) {
        progressBar.value = 0;
    }
    
    actualizarEstiloLista();
}

// Resalta la canción activa en la barra lateral
function actualizarEstiloLista() {
    const items = document.querySelectorAll('#tracks-list-ui li');
    items.forEach((item, index) => {
        if (index === currentTrackIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// ==========================================
// 4. CONTROL DE REPRODUCCIÓN Y ANIMACIÓN
// ==========================================

function actualizarAnimacionVinilo(estado) {
    const vinylWrapper = document.querySelector('.vinyl-wrapper');
    if (vinylWrapper) {
        vinylWrapper.style.animationPlayState = estado;
    }
}

function reproducirCancion() {
    audio.play()
        .then(() => {
            isPlaying = true;
            actualizarAnimacionVinilo('running');
        })
        .catch(err => console.log("Esperando interacción para reproducir: ", err));
}

function pausarCancion() {
    audio.pause();
    isPlaying = false;
    actualizarAnimacionVinilo('paused');
}

function detenerCancion() {
    audio.pause();
    audio.currentTime = 0;
    isPlaying = false;
    const progressBar = getEl('progress-bar');
    if (progressBar) progressBar.value = 0;
    actualizarAnimacionVinilo('paused');
}

function siguienteCancion() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    cargarCancion(currentTrackIndex);
    if (isPlaying) reproducirCancion();
}

function anteriorCancion() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    cargarCancion(currentTrackIndex);
    if (isPlaying) reproducirCancion();
}

// ==========================================
// 5. ASIGNACIÓN DE EVENTOS CON VERIFICACIÓN
// ==========================================
const btnPlay = getEl('btn-play');
const btnPause = getEl('btn-pause');
const btnStop = getEl('btn-stop');
const btnNext = getEl('btn-next');
const btnPrev = getEl('btn-prev');

if (btnPlay) btnPlay.addEventListener('click', () => { if (!isPlaying) reproducirCancion(); });
if (btnPause) btnPause.addEventListener('click', () => { if (isPlaying) pausarCancion(); });
if (btnStop) btnStop.addEventListener('click', detenerCancion);
if (btnNext) btnNext.addEventListener('click', siguienteCancion);
if (btnPrev) btnPrev.addEventListener('click', anteriorCancion);

// Salto automático al terminar el tema
audio.addEventListener('ended', siguienteCancion);

// Actualizar la barra de progreso de tiempo
const progressBar = getEl('progress-bar');
if (progressBar) {
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const porcentaje = (audio.currentTime / audio.duration) * 100;
            progressBar.value = porcentaje;
        }
    });

    progressBar.addEventListener('input', (e) => {
        if (audio.duration) {
            const nuevoTiempo = (e.target.value / 100) * audio.duration;
            audio.currentTime = nuevoTiempo;
        }
    });
}

// ==========================================
// 6. CONTROLADOR DEL BUSCADOR (BLINDADO)
// ==========================================
const searchInput = getEl('search-input');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const textoBusqueda = e.target.value.toLowerCase().trim();
        const listaUI = getEl('tracks-list-ui');
        
        if (!listaUI) return;

        // Si se vacía el input, regresa al estado inicial ordenado
        if (textoBusqueda === "") {
            inicializarPlaylist();
            return;
        }
        
        const cancionesFiltradas = playlist.filter(cancion => 
            cancion.titulo.toLowerCase().includes(textoBusqueda)
        );
        
        listaUI.innerHTML = "";
        
        cancionesFiltradas.forEach((cancion) => {
            const item = document.createElement('li');
            item.textContent = cancion.titulo;
            
            if (playlist[currentTrackIndex].archivo === cancion.archivo) {
                item.classList.add('active');
            }
            
            item.addEventListener('click', () => {
                const indiceReal = playlist.findIndex(p => p.archivo === cancion.archivo);
                if (indiceReal !== -1) {
                    currentTrackIndex = indiceReal;
                    cargarCancion(currentTrackIndex);
                    reproducirCancion();
                }
            });
            
            listaUI.appendChild(item);
        });
    });
}

// ==========================================
// 7. ARRANQUE INICIAL DEL SISTEMA
// ==========================================
// Se ejecutan inmediatamente al cargar el script
cargarCancion(currentTrackIndex);
inicializarPlaylist();
