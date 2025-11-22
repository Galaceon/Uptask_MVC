(function() {
    // Boton para mostrar el modal de agregar tarea
    const nuevaTareaBtn = document.querySelector('#agregar-tarea');
    nuevaTareaBtn.addEventListener('click', mostrarFormulario);

    obtenerTareas(); // Iniciar y obtener tareas al cargar la página
    let tareas = []; // Arreglo global de tareas al iniciar la aplicación


    async function obtenerTareas() {
        try {
            const id = obtenerProyecto(); // Obtener la URL/id del proyecto actual desde la barra del navegador
            const url = `/api/tareas?url=${id}`; // Construir la URL para la petición al backend
            const respuesta = await fetch(url); // Realizar la petición
            const resultado = await respuesta.json(); // Parsear la respuesta JSON

            // Asignar las tareas obtenidas al arreglo global
            tareas = resultado.tareas

            // Mostrar las tareas en la interfaz
            mostrarTareas(); 
        } catch (error) {
            console.log(error);
        }
    }

    function mostrarTareas() {
        // Limpiar las tareas previas(para evitar duplicados al añadir nuevas tareas)
        limpiarTareas();

        // Se detiene la ejecución si no hay tareas
        if(tareas.length === 0) {
            const contenedorTareas = document.querySelector('#listado-tareas');

            const textoNoTareas = document.createElement('LI');
            textoNoTareas.textContent = 'No hay Tareas';
            textoNoTareas.classList.add('no-tareas');

            contenedorTareas.appendChild(textoNoTareas);
            return;
        }
        
        // Diccionario para estados de tareas
        const estados = {
            0: 'Pendiente',
            1: 'Completa'
        }

        // Scripting de las tareas
        tareas.forEach(tarea => {
            // Cada tarea: li > p + div.opciones > button.estado + button.eliminar

            const contenedorTarea = document.createElement('LI');
            contenedorTarea.dataset.tareaId = tarea.id;
            contenedorTarea.classList.add('tarea');

            const nombreTarea = document.createElement('P');
            nombreTarea.textContent = tarea.nombre;

            const opcionesDiv = document.createElement('DIV');
            opcionesDiv.classList.add('opciones');

            // Botones
            const btnEstadoTarea = document.createElement('BUTTON');
            btnEstadoTarea.classList.add('estado-tarea');
            btnEstadoTarea.classList.add(`${estados[tarea.estado].toLowerCase()}`);
            btnEstadoTarea.textContent = estados[tarea.estado];
            btnEstadoTarea.dataset.estadoTarea = tarea.estado;
            btnEstadoTarea.onclick = function() { 
                cambiarEstadoTarea({...tarea}); // Pasar una copia del objeto tarea para evitar mutaciones directas
            }

            const btnEliminarTarea = document.createElement('BUTTON');
            btnEliminarTarea.classList.add('eliminar-tarea');
            btnEliminarTarea.dataset.idTarea = tarea.id;
            btnEliminarTarea.textContent = 'Eliminar';
            btnEliminarTarea.onclick = function() {
                confirmarEliminarTarea({...tarea}); // Pasar una copia del objeto tarea para evitar mutaciones directas
            }

            opcionesDiv.appendChild(btnEstadoTarea);
            opcionesDiv.appendChild(btnEliminarTarea);

            contenedorTarea.appendChild(nombreTarea);
            contenedorTarea.appendChild(opcionesDiv);

            const listadoTareas = document.querySelector(".listado-tareas");
            listadoTareas.appendChild(contenedorTarea);
        })
    }

    // Función para mostrar el formulario modal
    function mostrarFormulario() {
        const modal = document.createElement('DIV');
        modal.classList.add('modal');
        modal.innerHTML =  `
            <form class="formulario nueva-tarea">
                <legend>Añade una nueva tarea</legend>
                <div class="campo">
                    <label for"tarea" class="tarea-label">Tarea</label>
                    <input class="tarea" type="text" name="tarea" placeholder="Añadir Tarea al Proyecto Actual" id="tarea"/>
                </div>
                <div class="opciones">
                    <input type="submit" class="submit-nueva-tarea" value="Añadir Tarea"/>
                    <button type="button" class="cerrar-modal">Cancelar</button>
                </div>
            </form>
        `; // Template literal del contenido del modal

        // Agregar el modal al DOM
        document.querySelector('.dashboard').appendChild(modal);

        // Animar la aparición del modal
        setTimeout(() => {
            const formulario = document.querySelector(".formulario");
            formulario.classList.add('active')
        }, 0)

        // Escuchar los clics en el modal
        modal.addEventListener('click', function(e) {
            // Prevenir el comportamiento por defecto por el botón submit
            e.preventDefault();

            // Buscar si se dio click en el botón con la clase cerrar-modal para cerrar el modal
            if(e.target.classList.contains('cerrar-modal')) {
                const formulario = document.querySelector(".formulario");
                formulario.classList.add('cerrar');

                setTimeout(() => {
                    modal.remove();
                }, 350)
            }

            // Buscar si se dio click en el botón submit para agregar la nueva tarea
            if(e.target.classList.contains('submit-nueva-tarea')) {
                submitFormularioNuevaTarea();
            }
        })
    }

    // Función para manejar el envío del formulario de nueva tarea
    function submitFormularioNuevaTarea() {
        // .trim por si el usuario ingresa muchos espacios en blanco
        const tarea = document.querySelector('#tarea').value.trim();

        if(tarea === '') {
            // Mostrar una alerta de error
            mostrarAlerta('El nombre de la tarea es obligatorio', 'error', document.querySelector('.formulario legend'), true);
            return;
        }

        // Si pasa la validación, se agrega la tarea
        agregarTarea(tarea);
    }

    // Muestra un mensaje de alerta en la interfaz
    function mostrarAlerta(mensaje, tipo, referencia, animacion = false) {
        // Previene la creación de varias alertas
        const alertaPrevia = document.querySelector('.alerta');
        if(alertaPrevia) {
            alertaPrevia.remove();
        }

        const alerta = document.createElement('DIV');
        alerta.classList.add('alerta', tipo);
        if(animacion) { // Si se requiere animación, agrega clase de animación según el tipo(éxito o error)
            alerta.classList.add(`animacion-${tipo}`) 
        }
        alerta.textContent = mensaje;

        // Colocar aleta debajo de la referencia
        referencia.parentElement.insertBefore(alerta, referencia.nextElementSibling);
        
        // Eliminar la alerta tras 3 segundos
        setTimeout(() => {
            alerta.remove();
        }, 3000)
    }

    // Consultar el servidor para añadir una tarea actual
    async function agregarTarea(tarea) {
        // Construir la petición (mandamos nombre de la tarea y el url/id del proyecto)
        const datos = new FormData();
        datos.append('nombre', tarea);
        datos.append('proyectoId', obtenerProyecto());

        try {
            const url = 'http://localhost:3000/api/tareas';
            const respuesta = await fetch(url, {
                method: 'POST',
                body: datos
            });

            const resultado = await respuesta.json();
            mostrarAlerta(resultado.mensaje, resultado.tipo, document.querySelector('.formulario legend'), resultado.animacion);

            if(resultado.tipo === "exito") {
                const modal = document.querySelector('.modal');

                // Deshabilitar el botón de submit para evitar múltiples envíos de la misma tarea
                const submitBtn = document.querySelector('.submit-nueva-tarea');
                submitBtn.disabled = true;
                submitBtn.classList.add('disabled');
                
                // Eliminar el modal tras 3 segundos
                setTimeout(() => {
                    modal.remove();
                }, 3000);

                // Agregar el objeto de tarea al global de tareas(para mostrarlo en la interfaz sin recargar la página)
                const tareaObj = {
                    id: String(resultado.id),
                    nombre: tarea,
                    estado: "0",
                    proyectoId: resultado.proyectoId
                };
                tareas = [...tareas, tareaObj]; // agregar la nueva tarea al arreglo global de tareas sin mutarlo
                mostrarTareas();
            }
        } catch(error) {
            console.log(error)
        }
    }

    function cambiarEstadoTarea(tarea) {
        const nuevoEstado = tarea.estado === "1" ? "0" : "1"; // Si está completa(1), cambiar a pendiente(0) y viceversa
        tarea.estado = nuevoEstado;
        actualizarTarea(tarea);
    }

    // Actualizar una tarea en el servidor
    async function actualizarTarea(tarea) {
        // Detructuring del objeto tarea
        const {estado, id, nombre, proyectoId} = tarea;
        
        const datos = new FormData();
        datos.append('id', id);
        datos.append('nombre', nombre);
        datos.append('estado', estado);
        datos.append('proyectoId', obtenerProyecto());

        try {
            const url = 'http://localhost:3000/api/tarea/actualizar';

            const respuesta = await fetch(url, {
                method: 'POST',
                body: datos
            });
            const resultado = await respuesta.json();

            if(resultado.respuesta.tipo === 'exito') {
                // alertar de éxito al cambiar el estado de una tarea
                mostrarAlerta(
                    resultado.respuesta.mensaje, 
                    resultado.respuesta.tipo, 
                    document.querySelector('.contenedor-nueva-tarea'), 
                    resultado.respuesta.animacion
                );

                // Crear un nuevo array de tareas(para no mutar el original) con el estado actualizado de la tarea modificada
                tareas = tareas.map(tareaMemoria => {
                    if(tareaMemoria.id === id) {
                        tareaMemoria.estado = estado;
                    }
                    return tareaMemoria;
                });

                mostrarTareas();
            }

        } catch (error) {
            console.log(error);
        }
    }

    function confirmarEliminarTarea(tarea) {
        Swal.fire({
            title: `¿Quieres eliminar la tarea ${tarea.nombre}?`,
            width: '40rem',
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
            customClass: {
                popup: 'swal-grande',
                confirmButton: 'btn-grande',
                cancelButton: 'btn-grande'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarTarea(tarea);
            }
        });
    }

    async function eliminarTarea(tarea) {
        // Detructuring del objeto tarea
        const {estado, id, nombre, proyectoId} = tarea;
        
        const datos = new FormData();
        datos.append('id', id);
        datos.append('nombre', nombre);
        datos.append('estado', estado);
        datos.append('proyectoId', obtenerProyecto());

        try {
            const url = 'http://localhost:3000/api/tarea/eliminar';
            const respuesta = await fetch(url, {
                method: 'POST',
                body: datos
            })

            const resultado = await respuesta.json();
            
            if(resultado.resultado === true) {
                Swal.fire({
                    title: 'Eliminado!',
                    text: resultado.mensaje,
                    icon: 'success',
                    width: '42rem',
                    customClass: {
                        popup: 'swal-grande',
                        confirmButton: 'btn-grande',
                    }
                });

                tareas = tareas.filter(tareaMemoria => tareaMemoria.id !== tarea.id);
                mostrarTareas();
            }

        } catch(error) {
            console.log(error);
        }
    }
        

    // Obtener el ID del proyecto actual mediante URL
    function obtenerProyecto() {
        // URLSearchParams nos permite acceder a los query params (parámetros de la URL)
        const proyectoParams = new URLSearchParams(window.location.search);

        // fromEntries convierte los parámetros en un objeto y accedemos a la propiedad url
        const proyecto = Object.fromEntries(proyectoParams.entries());
        return proyecto.url;
    }

    // Limpiar las tareas previas del DOM
    function limpiarTareas() {
        const listadoTareas = document.querySelector('#listado-tareas');
        // listadoTareas.innerHTML = ''; menos codigo pero más lento en cuanto a performance

        // mas codigo pero más rápido en performance
        while(listadoTareas.firstChild) { // Mientras haya un primer hijo, lo elimina
            listadoTareas.removeChild(listadoTareas.firstChild);
        }
    }
})();