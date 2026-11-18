// Acceso de demostración. La autenticación real se valida en el servidor.
const claveSesionPersonal = 'petmatch-sesion-personal-demo';
const accesoPersonal = document.getElementById('login-personal');
const cerrarSesion = document.getElementById('cerrar-sesion');

if (accesoPersonal) {
  accesoPersonal.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const usuario = document.getElementById('usuario-personal');
    const clave = document.getElementById('clave-personal');
    const aviso = document.getElementById('login-aviso');

    if (usuario.value.trim().toLowerCase() !== 'veterinaria' || clave.value !== 'Doca2026') {
      aviso.textContent = 'El usuario o la contraseña de prueba son incorrectos.';
      clave.value = '';
      clave.focus();
      return;
    }

    sessionStorage.setItem(claveSesionPersonal, 'activa');
    accesoPersonal.reset();
    aviso.textContent = '';
    location.assign('panel.html');
  });
}

if (cerrarSesion) {
  const panelPersonal = document.getElementById('contenido');

  function comprobarSesion() {
    const sesionActiva = sessionStorage.getItem(claveSesionPersonal) === 'activa';
    panelPersonal.hidden = !sesionActiva;
    if (!sesionActiva) location.replace('personal.html');
  }

  comprobarSesion();
  window.addEventListener('pageshow', comprobarSesion);
  cerrarSesion.addEventListener('click', () => {
    sessionStorage.removeItem(claveSesionPersonal);
    panelPersonal.hidden = true;
    location.replace('personal.html');
  });
}
