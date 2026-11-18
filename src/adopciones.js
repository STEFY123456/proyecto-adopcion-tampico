const mascotas = window.mascotasDemo;
const clave = 'petmatch-solicitudes-demo';
const porId = (id) => document.getElementById(id);

function leerSolicitudes() {
  return JSON.parse(localStorage.getItem(clave) || '[]');
}

function disponible(mascotaId, solicitudes) {
  return !solicitudes.some((solicitud) =>
    solicitud.mascotaId === mascotaId && solicitud.estado === 'Aprobada'
  );
}

function elemento(tipo, texto, clase = '') {
  const nodo = document.createElement(tipo);
  nodo.className = clase;
  nodo.textContent = texto;
  return nodo;
}

function enlace(texto, destino, clase) {
  const nodo = elemento('a', texto, clase);
  nodo.href = destino;
  return nodo;
}

function foto(mascota) {
  const marco = elemento('div', '', 'dog-photo');
  const imagen = document.createElement('img');
  imagen.src = mascota.photo;
  imagen.alt = mascota.name;
  imagen.width = 400;
  imagen.height = 400;
  imagen.loading = 'lazy';
  marco.append(imagen);
  return marco;
}

function datos(mascota) {
  const edad = mascota.age === 1 ? '1 año' : mascota.age + ' años';
  return [mascota.breed, edad, mascota.gender, mascota.color].join(' · ');
}

function tarjeta(mascota) {
  const articulo = elemento('article', '', 'dog-card');
  const detalle = elemento('div', '', 'dog-details');
  const titulo = elemento('div', '', 'dog-title');
  titulo.append(elemento('h3', mascota.name));
  const ficha = enlace('Ver ficha', 'mascota.html?id=' + mascota.id, 'button dog-cta');
  ficha.setAttribute('aria-label', 'Ver ficha de ' + mascota.name);
  detalle.append(titulo, elemento('p', datos(mascota), 'dog-breed'),
    elemento('p', mascota.description, 'dog-description'), ficha);
  articulo.append(foto(mascota), detalle);
  return articulo;
}

const filtros = porId('filtros');
if (filtros) {
  const color = porId('color');
  for (const opcion of new Set(mascotas.map((mascota) => mascota.color))) {
    color.add(new Option(opcion));
  }

  function mostrarCatalogo() {
    const solicitudes = leerSolicitudes();
    const edad = porId('edad').value;
    const genero = porId('genero').value;
    const resultados = mascotas.filter((mascota) =>
      disponible(mascota.id, solicitudes)
      && (!edad || (edad === '1' ? mascota.age <= 1 : mascota.age >= 2))
      && (!genero || mascota.gender === genero)
      && (!color.value || mascota.color === color.value)
    );
    porId('adoption-grid').replaceChildren(...resultados.map(tarjeta));
    porId('resultados').textContent = resultados.length
      ? resultados.length + (resultados.length === 1 ? ' mascota disponible' : ' mascotas disponibles')
      : 'No hay mascotas que coincidan. Prueba con otros filtros.';
  }

  filtros.addEventListener('submit', (evento) => evento.preventDefault());
  filtros.addEventListener('change', mostrarCatalogo);
  filtros.addEventListener('reset', () => setTimeout(mostrarCatalogo, 0));
  window.addEventListener('pageshow', mostrarCatalogo);
  mostrarCatalogo();
}

const mascotaId = Number(new URLSearchParams(location.search).get('id'));
const mascota = mascotas.find((registro) => registro.id === mascotaId);

const ficha = porId('ficha');
if (ficha) {
  window.addEventListener('pageshow', () => {
    if (!mascota || !disponible(mascotaId, leerSolicitudes())) {
      ficha.replaceChildren(elemento('p', 'Esta mascota ya no está disponible para adopción.'));
      return;
    }
    ficha.replaceChildren(foto(mascota), elemento('h2', mascota.name),
      elemento('p', datos(mascota)), elemento('p', mascota.description, 'adoption-status'),
      enlace('Solicitar adopción', 'solicitud.html?id=' + mascotaId, 'button button-primary'));
  });
}

const formulario = porId('solicitud-form');
if (formulario) {
  const aviso = porId('aviso-solicitud');
  porId('mascota-seleccionada').textContent = mascota ? mascota.name : 'Mascota no disponible';
  formulario.hidden = !mascota || !disponible(mascotaId, leerSolicitudes());
  if (formulario.hidden) aviso.textContent = 'Regresa al catálogo y elige una mascota disponible.';

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const valor = (id) => porId(id).value.trim();
    const motivo = valor('motivo');
    const persona = {
      nombre: valor('nombre'),
      correo: valor('correo'),
      telefono: valor('telefono'),
      ciudad: valor('ciudad'),
      direccion: valor('direccion'),
      fechaNacimiento: valor('nacimiento')
    };
    if (!persona.nombre || !persona.telefono || !persona.ciudad) {
      aviso.textContent = 'Completa el nombre, el teléfono y la ciudad.';
      return;
    }
    if (!motivo) {
      aviso.textContent = 'Escribe el motivo de adopción.';
      porId('motivo').focus();
      return;
    }
    try {
      const solicitudes = leerSolicitudes();
      if (!disponible(mascotaId, solicitudes)) {
        formulario.hidden = true;
        aviso.textContent = 'Esta mascota ya no está disponible.';
        return;
      }
      const id = solicitudes.length + 1;
      const solicitud = {
        id,
        mascotaId,
        candidatoId: id,
        candidato: {
          persona,
          tipoVivienda: valor('vivienda'),
          tieneMascotas: valor('tiene-mascotas') === 'Sí',
          experiencia: valor('experiencia')
        },
        motivo,
        fecha: new Date().toISOString(),
        estado: 'Pendiente'
      };
      localStorage.setItem(clave, JSON.stringify([...solicitudes, solicitud]));
      formulario.hidden = true;
      aviso.textContent = 'Solicitud de prueba n.º ' + solicitud.id + ' registrada. Estado: Pendiente.';
    } catch {
      aviso.textContent = 'No se pudo guardar la solicitud. Intenta nuevamente.';
    }
  });
}

const panel = porId('solicitudes-pendientes');
if (panel) {
  const aviso = porId('panel-aviso');

  function revisar(id, aprobar, observaciones) {
    try {
      const solicitudes = leerSolicitudes();
      const solicitud = solicitudes.find((registro) => registro.id === id);
      if (!solicitud || solicitud.estado !== 'Pendiente'
        || !disponible(solicitud.mascotaId, solicitudes)) {
        mostrarPanel('Esta solicitud ya no está disponible para revisión.');
        return;
      }

      solicitud.estado = aprobar ? 'Aprobada' : 'Rechazada';
      solicitud.observaciones = observaciones;
      solicitud.fechaEvaluacion = new Date().toISOString();

      if (aprobar) {
        solicitud.adopcion = { id: id, estado: 'Activa', fecha: solicitud.fechaEvaluacion };
        for (const pendiente of solicitudes) {
          if (pendiente.mascotaId === solicitud.mascotaId && pendiente.estado === 'Pendiente') {
            pendiente.estado = 'Rechazada';
            pendiente.observaciones = 'La mascota fue adoptada.';
            pendiente.fechaEvaluacion = solicitud.fechaEvaluacion;
          }
        }
      }

      localStorage.setItem(clave, JSON.stringify(solicitudes));
      mostrarPanel(aprobar ? 'Adopción de prueba n.º ' + id + ' confirmada. Estado: Activa.'
        : 'Solicitud n.º ' + id + ' rechazada.');
    } catch {
      aviso.textContent = 'No se pudo guardar la decisión. Intenta nuevamente.';
    }
  }

  function mostrarPanel(mensaje = '') {
    const pendientes = leerSolicitudes().filter((registro) => registro.estado === 'Pendiente');
    aviso.textContent = [mensaje, pendientes.length ? '' : 'No hay solicitudes pendientes.']
      .filter(Boolean).join(' ');
    panel.replaceChildren();

    for (const solicitud of pendientes) {
      const elegida = mascotas.find((registro) => registro.id === solicitud.mascotaId);
      const bloque = elemento('article', '', 'contact-card adoption-card');
      const form = elemento('form', '', 'form-fields');
      const campo = document.createElement('textarea');
      campo.id = 'observaciones-' + solicitud.id;
      campo.maxLength = 500;
      campo.required = true;

      const etiqueta = elemento('label', 'Observaciones de la revisión');
      etiqueta.htmlFor = campo.id;

      const acciones = elemento('div', '', 'adoption-actions');
      const confirmar = elemento('button', 'Confirmar adopción', 'button button-primary');
      const rechazar = elemento('button', 'Rechazar solicitud', 'button button-outline');
      confirmar.type = rechazar.type = 'submit';
      acciones.append(confirmar, rechazar);
      form.append(etiqueta, campo, acciones);
      form.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const observaciones = campo.value.trim();
        if (!observaciones) {
          aviso.textContent = 'Escribe las observaciones de la revisión.';
          campo.focus();
          return;
        }
        revisar(solicitud.id, evento.submitter !== rechazar, observaciones);
      });

      bloque.append(elemento('h2', 'Solicitud n.º ' + solicitud.id + ' · ' + elegida.name),
        elemento('p', solicitud.candidato
          ? 'Candidato: ' + solicitud.candidato.persona.nombre
          : 'Candidato de prueba · ID ' + solicitud.candidatoId),
        elemento('p', 'Motivo: ' + solicitud.motivo, 'adoption-status'), form);
      if (solicitud.candidato) {
        const { persona, tipoVivienda, tieneMascotas, experiencia } = solicitud.candidato;
        const datosCandidato = elemento('details', '', 'adoption-status');
        datosCandidato.append(elemento('summary', 'Ver datos del candidato'));
        const datosPersona = [persona.correo, persona.telefono, persona.ciudad,
          persona.direccion, persona.fechaNacimiento].filter(Boolean);
        datosCandidato.append(elemento('p', datosPersona.join(' · ')),
          elemento('p', 'Vivienda: ' + tipoVivienda),
          elemento('p', 'Tiene o ha tenido mascotas: ' + (tieneMascotas ? 'Sí' : 'No')));
        if (experiencia) datosCandidato.append(elemento('p', 'Experiencia: ' + experiencia));
        bloque.insertBefore(datosCandidato, form);
      }
      panel.append(bloque);
    }
  }

  mostrarPanel();
  window.addEventListener('storage', (evento) => {
    if (evento.key === clave || evento.key === null) mostrarPanel();
  });
}

const vistaInicio = document.querySelector('#preview-title');
if (vistaInicio) {
  const actualizar = () => {
    const solicitudes = leerSolicitudes();
    for (const tarjeta of document.querySelectorAll('.dog-card')) {
      const vinculo = tarjeta.querySelector('a[href^="mascota.html?id="]');
      if (!vinculo) continue;
      const id = Number(vinculo.getAttribute('href').split('=')[1]);
      tarjeta.hidden = !disponible(id, solicitudes);
    }
  };
  window.addEventListener('pageshow', actualizar);
}
