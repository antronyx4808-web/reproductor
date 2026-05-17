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
    { archivo: "musica13.mp3", titulo: "ween - Ocean Man" },
    { archivo: "musica14.mp3", titulo: "CAFUNE - Tek it" },
    { archivo: "musica15.mp3", titulo: "Fleetwood Mac - The Chain" },
    { archivo: "musica16.mp3", titulo: "Surf Curse - Disco" },
];

// ==========================================
// 2. ESTADOS GLOBALES DEL REPRODUCTOR
// ==========================================
let currentTrackIndex = 0;
let isPlaying = false;
const audio = new Audio();

// Elementos de la Interfaz (DOM)
const lcdTitle = document.getElementById('lcd-title'); // Pantalla donde sale el nombre
const progressBar = document.getElementById('progress-bar'); // Tu barrita de tiempo
const vinylWrapper = document.querySelector('.vinyl-wrapper'); // Contenedor del disco de fondo

// Botones de control
const btnPlay = document.getElementById('btn-play');
const btnPause = document.getElementById('btn-pause');
const btnStop = document.getElementById('btn-stop');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');

// ==========================================
// 3. LOGICA PRINCIPAL DE RENDERS Y CARGAS
// ==========================================

// Función para inicializar y redibujar la barra lateral limpia
function inicializarPlaylist() {
    const listaUI = document.getElementById('tracks-list-ui');
    if (!listaUI) return;

    listaUI.innerHTML = ""; // Limpieza total para evitar duplicados

    playlist.forEach((cancion, index) => {
        const item = document.createElement('li');
        item.textContent = cancion.titulo;

        // Le ponemos la clase activa si es la que está seleccionada
        if (index === currentTrackIndex) {
            item.classList.add('active');
        }

        // Evento de clic directo a la posición exacta
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
    if (lcdTitle) {
        lcdTitle.textContent = playlist[index].titulo;
    }
    if (progressBar) {
        progressBar.value = 0;
    }
    
    // Refrescamos los estilos visuales en la barra lateral
    actualizarEstiloLista();
}

// Resalta la canción que está sonando actualmente en la lista
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

function reproducirCancion() {
    audio.play()
        .then(() => {
            isPlaying = true;
            // Encendemos el motor del vinilo en el CSS
            if (vinylWrapper) vinylWrapper.style.animationPlayState = 'running';
        })
        .catch(err => console.log("Error al reproducir audio: ", err));
}

function pausarCancion() {
    audio.pause();
    isPlaying = false;
    // Congelamos el vinilo en su posición actual
    if (vinylWrapper) vinylWrapper.style.animationPlayState = 'paused';
}

function detenerCancion() {
    audio.pause();
    audio.currentTime = 0;
    isPlaying = false;
    if (progressBar) progressBar.value = 0;
    // Detiene el giro por completo
    if (vinylWrapper) vinylWrapper.style.animationPlayState = 'paused';
}

// Siguiente y Anterior
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
// 5. ASIGNACIÓN DE EVENTOS A LOS BOTONES
// ==========================================
if (btnPlay) btnPlay.addEventListener('click', () => {
    if (!isPlaying) reproducirCancion();
});

if (btnPause) btnPause.addEventListener('click', () => {
    if (isPlaying) pausarCancion();
});

if (btnStop) btnStop.addEventListener('click', detenerCancion);
if (btnNext) btnNext.addEventListener('click', siguienteCancion);
if (btnPrev) btnPrev.addEventListener('click', anteriorCancion);

// Salto automático cuando termina el track actual
audio.addEventListener('ended', siguienteCancion);

// Sincronizar la barra de progreso mientras avanza el tiempo
if (progressBar) {
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const porcentaje = (audio.currentTime / audio.duration) * 100;
            progressBar.value = porcentaje;
        }
    });

    // Evento por si el usuario arrastra la barra para adelantar/atrasar
    progressBar.addEventListener('input', (e) => {
        if (audio.duration) {
            const nuevoTiempo = (e.target.value / 100) * audio.duration;
            audio.currentTime = nuevoTiempo;
        }
    });
}

// ==========================================
// 6. CONTROLADOR DEL BUSCADOR INTEGRADO
// ==========================================
const searchInput = document.getElementById('search-input');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const textoBusqueda = e.target.value.toLowerCase().trim();
        const listaUI = document.getElementById('tracks-list-ui');
        
        if (!listaUI) return;

        // Si borra el texto, reseteamos a la lista original limpia
        if (textoBusqueda === "") {
            inicializarPlaylist();
            return;
        }
        
        // Filtramos las coincidencias del buscador
        const cancionesFiltradas = playlist.filter(cancion => 
            cancion.titulo.toLowerCase().includes(textoBusqueda)
        );
        
        // Vaciamos el contenedor antes de dibujar los resultados
        listaUI.innerHTML = "";
        
        cancionesFiltradas.forEach((cancion) => {
            const item = document.createElement('li');
            item.textContent = cancion.titulo;
            
            // Si coincide con la que suena, se marca activa
            if (playlist[currentTrackIndex].archivo === cancion.archivo) {
                item.classList.add('active');
            }
            
            // IMPORTANTE: Busca el índice de la lista interna global usando el archivo .mp3
            item.addEventListener('click', () => {
                const indiceReal = playlist.findIndex(p => p.archivo === cancion.archivo);
                if (indiceReal !== -1) {
                    currentTrackIndex = indiceReal;
                    cargarCancion(currentTrackIndex);
                    reproducirCancion();
                    
                    // Actualización visual de la selección en la búsqueda
                    document.querySelectorAll('#tracks-list-ui li').forEach(li => li.classList.remove('active'));
                    item.classList.add('active');
                }
            });
            
            listaUI.appendChild(item);
        });
    });
}
