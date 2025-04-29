// Estados de la aplicación
const APP_STATES = {
    LOGIN: 'login',
    DASHBOARD: 'dashboard',
    RESERVA: 'reserva',
    QR_SCANNER: 'qr_scanner',
    FORMACION: 'formacion',
    PERFIL: 'perfil'
};

// Estado actual de la aplicación
let currentState = APP_STATES.LOGIN;
let currentUser = null;

// Usuarios predefinidos
const USUARIOS = {
    'docente@institucion.com': {
        password: 'docente123',
        role: 'docente',
        nombre: 'Profesor Ejemplo',
        departamento: 'Matemáticas',
        reservas: [
            { sala: '101', fecha: '15/03/2024', hora: '10:00', estado: 'activa' },
            { sala: '203', fecha: '16/03/2024', hora: '14:00', estado: 'completada' }
        ]
    },
    'admin@institucion.com': {
        password: 'admin123',
        role: 'administrativo',
        nombre: 'Administrador',
        departamento: 'Administración',
        reservas: []
    }
};

// Agregar salas disponibles
const SALAS = [
    { id: '101', capacidad: 30, equipamiento: ['proyector', 'pizarra'], accesibilidad: true },
    { id: '102', capacidad: 25, equipamiento: ['proyector'], accesibilidad: false },
    { id: '201', capacidad: 40, equipamiento: ['proyector', 'pizarra', 'accesibilidad'], accesibilidad: true },
    { id: '202', capacidad: 20, equipamiento: ['pizarra'], accesibilidad: false },
    { id: '203', capacidad: 35, equipamiento: ['proyector', 'pizarra'], accesibilidad: true }
];

// Agregar cursos de capacitación
const CURSOS = [
    {
        id: 1,
        titulo: 'Curso Básico',
        duracion: '2 horas',
        descripcion: 'Introducción al sistema de reserva de salas',
        completado: false
    },
    {
        id: 2,
        titulo: 'Uso de Proyector',
        duracion: '1 hora',
        descripcion: 'Aprende a usar el proyector de manera efectiva',
        completado: false
    },
    {
        id: 3,
        titulo: 'Pizarra Digital',
        duracion: '1.5 horas',
        descripcion: 'Dominio de la pizarra digital interactiva',
        completado: false
    }
];

// Función para cambiar entre pantallas
function changeScreen(screen) {
    currentState = screen;
    const app = document.getElementById('app');
    app.innerHTML = '';

    switch (screen) {
        case APP_STATES.LOGIN:
            renderLoginScreen();
            break;
        case APP_STATES.DASHBOARD:
            renderDashboardScreen();
            break;
        case APP_STATES.RESERVA:
            renderReservaScreen();
            break;
        case APP_STATES.QR_SCANNER:
            renderQRScannerScreen();
            break;
        case APP_STATES.FORMACION:
            renderFormacionScreen();
            break;
        case APP_STATES.PERFIL:
            renderPerfilScreen();
            break;
    }
}

// Función para agregar botón de volver
function addBackButton(screen) {
    return `
        <button class="btn-back" onclick="changeScreen('${screen}')">
            <span class="material-icons">arrow_back</span>
            Volver
        </button>
    `;
}

// Renderizar pantalla de login
function renderLoginScreen() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container">
            <div class="login-container">
                <div class="logo">
                    <img src="assets/logo.png" alt="Logo Institucional">
                </div>
                <form id="loginForm">
                    <div class="form-group">
                        <label for="email">Correo electrónico</label>
                        <input type="email" id="email" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Contraseña</label>
                        <input type="password" id="password" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-primary">
                        <span class="material-icons">login</span>
                        Iniciar sesión
                    </button>
                    <div class="text-center mt-3">
                        <a href="#" id="forgotPassword">¿Olvidaste tu contraseña?</a>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('forgotPassword').addEventListener('click', handleForgotPassword);
}

// Manejador de login
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (USUARIOS[email] && USUARIOS[email].password === password) {
        currentUser = {
            email: email,
            role: USUARIOS[email].role,
            nombre: USUARIOS[email].nombre
        };
        changeScreen(APP_STATES.DASHBOARD);
    } else {
        mostrarError('Credenciales incorrectas');
    }
}

// Manejador de olvido de contraseña
function handleForgotPassword(e) {
    e.preventDefault();
    alert('Funcionalidad de recuperación de contraseña en desarrollo');
}

// Renderizar dashboard
function renderDashboardScreen() {
    const app = document.getElementById('app');
    const isDocente = currentUser.role === 'docente';

    app.innerHTML = `
        <div class="container">
            <div class="app-header">
                <h1>Sistema de Reserva de Salas</h1>
            </div>
            <div class="main-content">
                <div class="dashboard-header">
                    <h2>Bienvenido, ${currentUser.nombre}</h2>
                    <div class="user-info">
                        <span class="role-badge ${currentUser.role}">${currentUser.role.toUpperCase()}</span>
                        <button class="btn btn-primary" onclick="changeScreen('${APP_STATES.PERFIL}')">
                            <span class="material-icons">person</span>
                            Mi Perfil
                        </button>
                    </div>
                </div>
                <div class="dashboard-content">
                    ${isDocente ? renderDashboardDocente() : renderDashboardAdmin()}
                </div>
            </div>
        </div>
    `;
}

// Renderizar dashboard para docentes
function renderDashboardDocente() {
    return `
        <div class="row">
            <div class="col-md-4">
                <div class="card">
                    <h3>Reservar Sala</h3>
                    <button class="btn btn-primary" onclick="changeScreen('${APP_STATES.RESERVA}')">
                        Nueva Reserva
                    </button>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <h3>Escanear QR</h3>
                    <button class="btn btn-primary" onclick="changeScreen('${APP_STATES.QR_SCANNER}')">
                        Abrir Escáner
                    </button>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <h3>Capacitación</h3>
                    <button class="btn btn-primary" onclick="changeScreen('${APP_STATES.FORMACION}')">
                        Ver Cursos
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Renderizar dashboard para administrativos
function renderDashboardAdmin() {
    return `
        <div class="row">
            <div class="col-md-4">
                <div class="card">
                    <h3>Gestionar Reservas</h3>
                    <button class="btn btn-primary" onclick="renderGestionReservas()">
                        Ver Reservas
                    </button>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <h3>Estadísticas</h3>
                    <button class="btn btn-primary" onclick="renderEstadisticas()">
                        Ver Estadísticas
                    </button>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <h3>Capacitación</h3>
                    <button class="btn btn-primary" onclick="changeScreen('${APP_STATES.FORMACION}')">
                        Ver Cursos
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Renderizar pantalla de reserva
function renderReservaScreen() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container">
            <div class="app-header">
                <h1>Reservar Sala</h1>
            </div>
            <div class="main-content">
                ${addBackButton(APP_STATES.DASHBOARD)}
                <div class="card">
                    <form id="reservaForm">
                        <div class="form-group">
                            <label for="fecha">Fecha</label>
                            <input type="date" id="fecha" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="hora">Hora</label>
                            <input type="time" id="hora" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="capacidad">Capacidad Requerida</label>
                            <input type="number" id="capacidad" class="form-control" min="1" required>
                        </div>
                        <div class="form-group">
                            <label>Requerimientos Adicionales</label>
                            <div>
                                <input type="checkbox" id="proyector">
                                <label for="proyector">Proyector</label>
                            </div>
                            <div>
                                <input type="checkbox" id="pizarra">
                                <label for="pizarra">Pizarra Digital</label>
                            </div>
                            <div>
                                <input type="checkbox" id="accesibilidad">
                                <label for="accesibilidad">Accesibilidad</label>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary">
                            <span class="material-icons">search</span>
                            Buscar Salas Disponibles
                        </button>
                    </form>
                </div>
                <div id="resultadosSalas" class="mt-4"></div>
            </div>
        </div>
    `;

    document.getElementById('reservaForm').addEventListener('submit', handleBuscarSalas);
}

// Manejador de búsqueda de salas
function handleBuscarSalas(e) {
    e.preventDefault();
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const capacidad = document.getElementById('capacidad').value;
    const proyector = document.getElementById('proyector').checked;
    const pizarra = document.getElementById('pizarra').checked;
    const accesibilidad = document.getElementById('accesibilidad').checked;

    const salasFiltradas = SALAS.filter(sala => {
        return (
            sala.capacidad >= capacidad &&
            (!proyector || sala.equipamiento.includes('proyector')) &&
            (!pizarra || sala.equipamiento.includes('pizarra')) &&
            (!accesibilidad || sala.accesibilidad)
        );
    });

    const resultados = document.getElementById('resultadosSalas');
    resultados.innerHTML = salasFiltradas.length > 0 
        ? salasFiltradas.map(sala => `
            <div class="card sala-card">
                <h3>Sala ${sala.id}</h3>
                <p><strong>Capacidad:</strong> ${sala.capacidad} personas</p>
                <p><strong>Equipamiento:</strong> ${sala.equipamiento.join(', ')}</p>
                <div class="sala-actions">
                    <button class="btn btn-primary" onclick="reservarSala('${sala.id}')">
                        <span class="material-icons">event_available</span>
                        Reservar
                    </button>
                    <button class="btn btn-secondary" onclick="verDetallesSala('${sala.id}')">
                        <span class="material-icons">info</span>
                        Ver Detalles
                    </button>
                </div>
            </div>
        `).join('')
        : '<div class="alert alert-info">No se encontraron salas disponibles con los criterios seleccionados</div>';
}

// Función para ver detalles de la sala
function verDetallesSala(salaId) {
    const sala = SALAS.find(s => s.id === salaId);
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container">
            <div class="app-header">
                <h1>Detalles de la Sala ${salaId}</h1>
            </div>
            <div class="main-content">
                ${addBackButton(APP_STATES.RESERVA)}
                <div class="card">
                    <h3>Sala ${sala.id}</h3>
                    <div class="sala-details">
                        <p><strong>Capacidad:</strong> ${sala.capacidad} personas</p>
                        <p><strong>Equipamiento:</strong></p>
                        <ul>
                            ${sala.equipamiento.map(eq => `<li>${eq}</li>`).join('')}
                        </ul>
                        <p><strong>Accesibilidad:</strong> ${sala.accesibilidad ? 'Sí' : 'No'}</p>
                    </div>
                    <div class="sala-actions">
                        <button class="btn btn-primary" onclick="reservarSala('${sala.id}')">
                            <span class="material-icons">event_available</span>
                            Reservar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Función para reservar sala
function reservarSala(numeroSala) {
    // Simulación de reserva exitosa
    alert(`Sala ${numeroSala} reservada exitosamente`);
    // Generar y mostrar QR
    mostrarQR(numeroSala);
}

// Función para mostrar QR
function mostrarQR(numeroSala) {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container">
            <div class="app-header">
                <h1>Reserva Exitosa</h1>
            </div>
            <div class="main-content">
                ${addBackButton(APP_STATES.DASHBOARD)}
                <div class="card">
                    <h3>Detalles de la Reserva</h3>
                    <div class="reserva-details">
                        <p><strong>Sala:</strong> ${numeroSala}</p>
                        <p><strong>Fecha:</strong> ${document.getElementById('fecha').value}</p>
                        <p><strong>Hora:</strong> ${document.getElementById('hora').value}</p>
                        <p><strong>Usuario:</strong> ${currentUser.nombre}</p>
                    </div>
                    <div class="qr-container">
                        <div id="qrCode">
                            <!-- Aquí iría el código QR generado -->
                            <p>QR Code placeholder</p>
                        </div>
                        <button class="btn btn-primary" onclick="descargarQR()">
                            <span class="material-icons">download</span>
                            Descargar QR
                        </button>
                    </div>
                    <div class="reserva-actions">
                        <button class="btn btn-secondary" onclick="enviarCorreoConfirmacion()">
                            <span class="material-icons">email</span>
                            Enviar por Correo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Función para descargar QR
function descargarQR() {
    alert('QR descargado exitosamente');
}

// Función para enviar correo de confirmación
function enviarCorreoConfirmacion() {
    alert('Correo de confirmación enviado');
}

// Renderizar pantalla de escáner QR
function renderQRScannerScreen() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container">
            <div class="app-header">
                <h1>Escanear QR</h1>
            </div>
            <div class="main-content">
                ${addBackButton(APP_STATES.DASHBOARD)}
                <div class="qr-scanner">
                    <div class="qr-frame">
                        <!-- Aquí iría el componente de escaneo QR -->
                        <p>Área de escaneo QR</p>
                    </div>
                    <button class="btn btn-primary" onclick="simularEscaneo()">
                        <span class="material-icons">qr_code_scanner</span>
                        Simular Escaneo
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Simular escaneo QR
function simularEscaneo() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container">
            <div class="card">
                <h2>Resultado del Escaneo</h2>
                <p>Sala: 101</p>
                <p>Usuario: ${currentUser.email}</p>
                <p>Estado: Válido</p>
                <button class="btn btn-primary" onclick="marcarIngreso()">
                    Marcar Ingreso
                </button>
            </div>
        </div>
    `;
}

// Marcar ingreso
function marcarIngreso() {
    alert('Ingreso registrado exitosamente');
    changeScreen(APP_STATES.DASHBOARD);
}

// Renderizar pantalla de formación
function renderFormacionScreen() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container">
            <div class="app-header">
                <h1>Formación y Capacitación</h1>
            </div>
            <div class="main-content">
                ${addBackButton(APP_STATES.DASHBOARD)}
                <div class="progress-container">
                    <h3>Progreso de Formación</h3>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${calcularProgreso()}%"></div>
                    </div>
                    <p class="progress-text">${calcularProgreso()}% completado</p>
                </div>
                <div class="cursos-grid">
                    ${CURSOS.map(curso => `
                        <div class="card curso-card ${curso.completado ? 'completado' : ''}">
                            <h3>${curso.titulo}</h3>
                            <p class="duracion">Duración: ${curso.duracion}</p>
                            <p class="descripcion">${curso.descripcion}</p>
                            <div class="curso-actions">
                                <button class="btn btn-primary" onclick="iniciarCurso(${curso.id})">
                                    <span class="material-icons">play_circle</span>
                                    ${curso.completado ? 'Repetir Curso' : 'Iniciar Curso'}
                                </button>
                                ${!curso.completado && `
                                    <button class="btn btn-secondary" onclick="marcarCompletado(${curso.id})">
                                        <span class="material-icons">check_circle</span>
                                        Marcar como Completado
                                    </button>
                                `}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// Función para calcular progreso de formación
function calcularProgreso() {
    const totalCursos = CURSOS.length;
    const cursosCompletados = CURSOS.filter(curso => curso.completado).length;
    return Math.round((cursosCompletados / totalCursos) * 100);
}

// Función para iniciar curso
function iniciarCurso(cursoId) {
    const curso = CURSOS.find(c => c.id === cursoId);
    alert(`Iniciando curso: ${curso.titulo}`);
}

// Función para marcar curso como completado
function marcarCompletado(cursoId) {
    const curso = CURSOS.find(c => c.id === cursoId);
    curso.completado = true;
    renderFormacionScreen();
}

// Renderizar pantalla de perfil
function renderPerfilScreen() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container">
            <div class="app-header">
                <h1>Mi Perfil</h1>
            </div>
            <div class="main-content">
                ${addBackButton(APP_STATES.DASHBOARD)}
                <div class="card">
                    <form id="perfilForm">
                        <div class="form-group">
                            <label for="nombre">Nombre</label>
                            <input type="text" id="nombre" class="form-control" value="${currentUser.nombre}">
                        </div>
                        <div class="form-group">
                            <label for="email">Correo Electrónico</label>
                            <input type="email" id="email" class="form-control" value="${currentUser.email}" disabled>
                        </div>
                        <button type="button" class="btn btn-primary" onclick="cambiarContrasena()">
                            <span class="material-icons">lock</span>
                            Cambiar Contraseña
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <span class="material-icons">save</span>
                            Guardar Cambios
                        </button>
                    </form>
                    <div class="mt-4">
                        <h3>Historial de Reservas</h3>
                        <div class="card">
                            <p>Sala 101 - 15/03/2024 - 10:00</p>
                            <p>Sala 203 - 16/03/2024 - 14:00</p>
                        </div>
                    </div>
                    <button class="btn btn-primary mt-3" onclick="cerrarSesion()">
                        <span class="material-icons">logout</span>
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Función para cambiar contraseña
function cambiarContrasena() {
    const nuevaContrasena = prompt('Ingrese su nueva contraseña:');
    if (nuevaContrasena) {
        alert('Contraseña cambiada exitosamente');
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    currentUser = null;
    changeScreen(APP_STATES.LOGIN);
}

// Función para mostrar mensajes de error
function mostrarError(mensaje) {
    const app = document.getElementById('app');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-error fade-in';
    errorDiv.textContent = mensaje;
    app.insertBefore(errorDiv, app.firstChild);
    setTimeout(() => errorDiv.remove(), 3000);
}

// Función para renderizar la sección de gestión de reservas
function renderGestionReservas() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container">
            <div class="app-header">
                <h1>Gestión de Reservas</h1>
            </div>
            <div class="main-content">
                ${addBackButton(APP_STATES.DASHBOARD)}
                <div class="gestion-reservas-section active">
                    <div class="filtros">
                        <div class="form-group">
                            <label for="filtroFecha">Fecha</label>
                            <input type="date" id="filtroFecha" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="filtroSala">Sala</label>
                            <select id="filtroSala" class="form-control">
                                <option value="">Todas las salas</option>
                                ${SALAS.map(sala => `<option value="${sala.id}">Sala ${sala.id}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="filtroEstado">Estado</label>
                            <select id="filtroEstado" class="form-control">
                                <option value="">Todos los estados</option>
                                <option value="activa">Activa</option>
                                <option value="completada">Completada</option>
                                <option value="cancelada">Cancelada</option>
                            </select>
                        </div>
                    </div>
                    <div class="acciones-tabla">
                        <button class="btn btn-primary" onclick="exportarReservas()">
                            <span class="material-icons">file_download</span>
                            Exportar
                        </button>
                    </div>
                    <table class="tabla-reservas">
                        <thead>
                            <tr>
                                <th>Sala</th>
                                <th>Usuario</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${generarFilasReservas()}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    // Agregar event listeners para los filtros
    document.getElementById('filtroFecha').addEventListener('change', filtrarReservas);
    document.getElementById('filtroSala').addEventListener('change', filtrarReservas);
    document.getElementById('filtroEstado').addEventListener('change', filtrarReservas);
}

// Función para renderizar la sección de estadísticas
function renderEstadisticas() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container">
            <div class="app-header">
                <h1>Estadísticas</h1>
            </div>
            <div class="main-content">
                ${addBackButton(APP_STATES.DASHBOARD)}
                <div class="estadisticas-section active">
                    <div class="filtros">
                        <div class="form-group">
                            <label for="periodoEstadisticas">Período</label>
                            <select id="periodoEstadisticas" class="form-control">
                                <option value="semana">Última semana</option>
                                <option value="mes">Último mes</option>
                                <option value="trimestre">Último trimestre</option>
                                <option value="año">Último año</option>
                            </select>
                        </div>
                    </div>
                    <div class="grid-estadisticas">
                        <div class="tarjeta-estadistica">
                            <div class="etiqueta">Total Reservas</div>
                            <div class="valor">150</div>
                            <div class="variacion positiva">+12% vs período anterior</div>
                        </div>
                        <div class="tarjeta-estadistica">
                            <div class="etiqueta">Tasa de Ocupación</div>
                            <div class="valor">75%</div>
                            <div class="variacion positiva">+5% vs período anterior</div>
                        </div>
                        <div class="tarjeta-estadistica">
                            <div class="etiqueta">Salas más Reservadas</div>
                            <div class="valor">201</div>
                            <div class="variacion">40 reservas este mes</div>
                        </div>
                    </div>
                    <div class="graficos">
                        <div class="grafico-container">
                            <h3>Reservas por Sala</h3>
                            <div id="graficoReservasPorSala"></div>
                        </div>
                        <div class="grafico-container">
                            <h3>Ocupación por Día</h3>
                            <div id="graficoOcupacionPorDia"></div>
                        </div>
                    </div>
                    <div class="exportar-datos">
                        <button onclick="exportarEstadisticas()">
                            <span class="material-icons">download</span>
                            Exportar Reporte
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Aquí se agregarían las llamadas para generar los gráficos
    // Por ejemplo, usando Chart.js o una librería similar
    inicializarGraficos();
}

// Función auxiliar para generar filas de reservas
function generarFilasReservas() {
    // Simulación de datos de reservas
    const reservas = [
        { sala: '101', usuario: 'Juan Pérez', fecha: '2024-03-15', hora: '10:00', estado: 'activa' },
        { sala: '202', usuario: 'María García', fecha: '2024-03-16', hora: '14:00', estado: 'completada' },
        { sala: '303', usuario: 'Carlos López', fecha: '2024-03-17', hora: '11:00', estado: 'cancelada' }
    ];

    return reservas.map(reserva => `
        <tr>
            <td>Sala ${reserva.sala}</td>
            <td>${reserva.usuario}</td>
            <td>${reserva.fecha}</td>
            <td>${reserva.hora}</td>
            <td><span class="estado-badge ${reserva.estado}">${reserva.estado}</span></td>
            <td>
                <div class="acciones-tabla">
                    <button class="btn-editar" onclick="editarReserva('${reserva.sala}')">
                        <span class="material-icons">edit</span>
                    </button>
                    <button class="btn-cancelar" onclick="cancelarReserva('${reserva.sala}')">
                        <span class="material-icons">cancel</span>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Funciones auxiliares para las acciones
function filtrarReservas() {
    // Implementar la lógica de filtrado
    console.log('Filtrando reservas...');
}

function exportarReservas() {
    alert('Exportando reservas...');
}

function editarReserva(salaId) {
    alert(`Editando reserva de la sala ${salaId}`);
}

function cancelarReserva(salaId) {
    alert(`Cancelando reserva de la sala ${salaId}`);
}

function exportarEstadisticas() {
    alert('Exportando estadísticas...');
}

function inicializarGraficos() {
    // Aquí se implementaría la lógica para generar los gráficos
    console.log('Inicializando gráficos...');
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    changeScreen(APP_STATES.LOGIN);
}); 