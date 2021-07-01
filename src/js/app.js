let pagina = 1;

const cita = {
  nombre: "",
  fecha: "",
  hora: "",
  servicios: [],
};

document.addEventListener("DOMContentLoaded", () => {
  iniciarApp();
});

function iniciarApp() {
  mostrarServicios();

  mostrarSeccion();

  cambiarSeccion();

  paginaSiguiente();

  paginaAnterior();

  botonesPaginador();

  mostrarResumen();

  nombreCita();

  fechaCita();

  deshabilitarFechaAnterior();

  horaCita();
}

async function mostrarServicios() {
  try {
    const resultado = await fetch("./servicios.json");

    const db = await resultado.json();

    const servicios = db.servicios;
    //generar html
    servicios.forEach((servicio) => {
      const { id, nombre, precio } = servicio;

      // Dom scripting
      //nombre
      const nombreServicio = document.createElement("p");
      nombreServicio.textContent = nombre;
      nombreServicio.classList.add("nombre-servicio");

      //precio
      const precioServicio = document.createElement("p");
      precioServicio.textContent = `$ ${precio}`;
      precioServicio.classList.add("precio-servicio");

      //contenedor servicio
      const servicioDiv = document.createElement("div");
      servicioDiv.classList.add("servicio");
      servicioDiv.dataset.idServicio = id;

      //selecciona un servicio

      servicioDiv.onclick = seleccionarServicio;

      //inyectar precio y nombre al contenedor
      servicioDiv.appendChild(nombreServicio);
      servicioDiv.appendChild(precioServicio);

      //inyectar html
      document.querySelector("#servicios").appendChild(servicioDiv);
    });
  } catch (error) {
    console.log(error);
  }
}

function seleccionarServicio(e) {
  let elemento;

  if (e.target.tagName === "p") {
    elemento = e.target.parentElement;
  } else {
    elemento = e.target;
  }

  if (elemento.classList.contains("seleccionado")) {
    elemento.classList.remove("seleccionado");

    const id = parseInt(elemento.dataset.idServicio);

    eliminarServicio(id);
  } else {
    elemento.classList.add("seleccionado");

    const servicioObj = {
      id: parseInt(elemento.dataset.idServicio),
      nombre: elemento.firstElementChild.textContent,
      precio: elemento.firstElementChild.nextElementSibling.textContent,
    };
    agregarServicio(servicioObj);
  }
}

function eliminarServicio(id) {
  const { servicios } = cita;

  cita.servicios = servicios.filter((servicio) => servicio.id !== id);

  console.log(cita);
}

function agregarServicio(servicioObj) {
  const { servicios } = cita;

  cita.servicios = [...servicios, servicioObj];

  console.log(cita);
}

function mostrarSeccion() {
  const seccionAnterior = document.querySelector(".mostrar-seccion");
  if (seccionAnterior) {
    seccionAnterior.classList.remove("mostrar-seccion");
  }

  const seccionActual = document.querySelector(`#paso-${pagina}`);
  seccionActual.classList.add("mostrar-seccion");

  const tabAnterior = document.querySelector(".tabs .actual");
  if (tabAnterior) {
    tabAnterior.classList.remove("actual");
  }

  const tab = document.querySelector(`[data-paso="${pagina}"]`);
  tab.classList.add("actual");
}

function cambiarSeccion() {
  const enlaces = document.querySelectorAll(".tabs button");

  enlaces.forEach((enlace) => {
    enlace.addEventListener("click", (e) => {
      e.preventDefault;

      pagina = parseInt(e.target.dataset.paso);

      mostrarSeccion();

      botonesPaginador();
    });
  });
}

function paginaSiguiente() {
  const paginaSiguiente = document.querySelector("#siguiente");
  paginaSiguiente.addEventListener("click", () => {
    pagina++;

    botonesPaginador();
  });
}

function paginaAnterior() {
  const paginaAnterior = document.querySelector("#anterior");
  paginaAnterior.addEventListener("click", () => {
    pagina--;

    botonesPaginador();
  });
}

function botonesPaginador() {
  const paginaSiguiente = document.querySelector("#siguiente");
  const paginaAnterior = document.querySelector("#anterior");

  if (pagina === 1) {
    paginaAnterior.classList.add("ocultar");
  } else if (pagina === 3) {
    paginaSiguiente.classList.add("ocultar");
    paginaAnterior.classList.remove("ocultar");

    mostrarResumen();
  } else {
    paginaAnterior.classList.remove("ocultar");
    paginaSiguiente.classList.remove("ocultar");
  }
  mostrarSeccion();
}

function mostrarResumen() {
  //destructuring

  const { nombre, fecha, hora, servicios } = cita;

  //selecionar el resumen
  const resumenDiv = document.querySelector(".contenido-resumen");

  while (resumenDiv.firstChild) {
    resumenDiv.removeChild(resumenDiv.firstChild);
  }

  //validacion objeto
  if (Object.values(cita).includes("")) {
    const noServicios = document.createElement("p");
    noServicios.textContent =
      "Faltan datos de Servicios, hora , fecha o nombre";

    noServicios.classList.add("invalidar-cita");

    //agregar a resumen div

    resumenDiv.appendChild(noServicios);

    return;
  }

  const headingCita = document.createElement("h3");
  headingCita.textContent = "Resumen de Cita";

  //mostrar resumen
  const nombreCita = document.createElement("p");
  nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

  const fechaCita = document.createElement("p");
  fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

  const horaCita = document.createElement("p");
  horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

  const serviciosCita = document.createElement("div");
  serviciosCita.classList.add("resumen-servicios");

  const headingServicios = document.createElement("h3");
  headingServicios.textContent = "Resumen de Servicios";

  serviciosCita.appendChild(headingServicios);
  //iterar sobre los servicios

  let cantidad = 0;

  servicios.forEach((servicio) => {
    const contenedorServicio = document.createElement("div");
    contenedorServicio.classList.add("contenedor-servicio");

    const textoServicio = document.createElement("p");
    textoServicio.textContent = servicio.nombre;

    const precioServicio = document.createElement("p");
    precioServicio.textContent = servicio.precio;
    precioServicio.classList.add("precio");

    const totalServicio = servicio.precio.split("$");

    cantidad += parseInt(totalServicio[1].trim());

    //colocar texto y precio en div

    contenedorServicio.appendChild(textoServicio);
    contenedorServicio.appendChild(precioServicio);

    serviciosCita.appendChild(contenedorServicio);
  });

  resumenDiv.appendChild(headingCita);
  resumenDiv.appendChild(nombreCita);
  resumenDiv.appendChild(fechaCita);
  resumenDiv.appendChild(horaCita);

  resumenDiv.appendChild(serviciosCita);

  const cantidadPagar = document.createElement("p");
  cantidadPagar.classList.add("total");
  cantidadPagar.innerHTML = `<span>Total a Pagar: </span> $ ${cantidad}`;

  resumenDiv.appendChild(cantidadPagar);
}

function nombreCita() {
  const nombreInput = document.querySelector("#nombre");

  nombreInput.addEventListener("input", (e) => {
    const nombreTexto = e.target.value.trim();

    //validacion
    if (nombreTexto === "" || nombreTexto.length < 3) {
      mostrarAlerta("Nombre no valido", "error");
    } else {
      const alerta = document.querySelector(".alerta");
      if (alerta) {
        alerta.remove();
      }
      cita.nombre = nombreTexto;
    }
  });
}

function mostrarAlerta(mensaje, tipo) {
  const alertaPrevia = document.querySelector(".alerta");

  if (alertaPrevia) {
    return;
  }

  const alerta = document.createElement("div");
  alerta.textContent = mensaje;
  alerta.classList.add("alerta");

  if (tipo === "error") {
    alerta.classList.add("error");
  }

  //insertar en el html

  const formulario = document.querySelector(".formulario");
  formulario.appendChild(alerta);

  setTimeout(() => {
    alerta.remove();
  }, 3000);
}

function fechaCita() {
  const fechaInput = document.querySelector("#fecha");
  fechaInput.addEventListener("input", (e) => {
    const dia = new Date(e.target.value).getUTCDay();

    if ([0, 6].includes(dia)) {
      e.preventDefault();
      fechaInput.value = "";
      mostrarAlerta("Fines de semana no son permitidos", "error");
    } else {
      cita.fecha = fechaInput.value;
    }
  });
}

function deshabilitarFechaAnterior() {
  const inputFecha = document.querySelector("#fecha");
  const fechaAhora = new Date();

  const year = fechaAhora.getFullYear();
  const mes = fechaAhora.getMonth() + 1;
  const dia = fechaAhora.getDate();

  const fechaDeshabilitar = `${year}-${mes < 10 ? `0${mes}` : mes}-${dia}`;

  inputFecha.min = fechaDeshabilitar;
}

function horaCita() {
  const inputHora = document.querySelector("#hora");
  inputHora.addEventListener("input", (e) => {
    const horaCita = e.target.value;
    const hora = horaCita.split(":");
    if (hora[0] < 10 || hora[0] > 18) {
      mostrarAlerta("Hora no valida", "error");
      inputHora.value = "";
    } else {
      cita.hora = horaCita;
    }
  });
}
