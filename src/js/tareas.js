(function() {
    // Boton para mostrar el modal de agregar tarea
    const nuevaTareaBtn = document.querySelector('#agregar-tarea');
    nuevaTareaBtn.addEventListener('click', mostrarFormulario);

    obtenerTareas();
    let tareas = [];


    async function obtenerTareas() {
        try {
            const id = obtenerProyecto();
            const url = `/api/tareas?url=${id}`;
            const respuesta = await fetch(url);
            const resultado = await respuesta.json();
            
            tareas = resultado.tareas
            mostrarTareas();
        } catch (error) {
            console.log(error);
        }
    }

    function mostrarTareas() {
        limpiarTareas();
        if(tareas.length === 0) {
            const contenedorTareas = document.querySelector('#listado-tareas');

            const textoNoTareas = document.createElement('LI');
            textoNoTareas.textContent = 'No hay Tareas';
            textoNoTareas.classList.add('no-tareas');

            contenedorTareas.appendChild(textoNoTareas);
            return;
        }
        
        const estados = {
            0: 'Pendiente',
            1: 'Completa'
        }
        tareas.forEach(tarea => {
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
                cambiarEstadoTarea({...tarea});
            }

            const btnEliminarTarea = document.createElement('BUTTON');
            btnEliminarTarea.classList.add('eliminar-tarea');
            btnEliminarTarea.dataset.idTarea = tarea.id;
            btnEliminarTarea.textContent = 'Eliminar';

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
        modal.innerHTML = `
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
        `;

        document.querySelector('.dashboard').appendChild(modal);

        setTimeout(() => {
            const formulario = document.querySelector(".formulario");
            formulario.classList.add('active')
        }, 0)



        modal.addEventListener('click', function(e) {
            e.preventDefault();

            if(e.target.classList.contains('cerrar-modal')) {
                const formulario = document.querySelector(".formulario");
                formulario.classList.add('cerrar');

                setTimeout(() => {
                    modal.remove();
                }, 350)
            }

            if(e.target.classList.contains('submit-nueva-tarea')) {
                submitFormularioNuevaTarea();
            }
        })
    }

    function submitFormularioNuevaTarea() {
        const tarea = document.querySelector('#tarea').value.trim();

        if(tarea === '') {
            // Mostrar una alerta de error
            mostrarAlerta('El nombre de la tarea es obligatorio', 'error', document.querySelector('.formulario legend'), true);
            return;
        }

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
        if(animacion) {
            alerta.classList.add(`animacion-${tipo}`)
        }
        alerta.textContent = mensaje;

        referencia.parentElement.insertBefore(alerta, referencia.nextElementSibling);
        
        // Eliminar la alerta tras 5 segundos
        setTimeout(() => {
            alerta.remove();
        }, 3000)
    }

    // Consultar el servidor para añadir una tarea actual
    async function agregarTarea(tarea) {
        // Construir la petición
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
                const submitBtn = document.querySelector('.submit-nueva-tarea');

                submitBtn.disabled = true;
                submitBtn.classList.add('disabled');
                

                setTimeout(() => {
                    modal.remove();
                }, 3000);

                // Agregar el objeto de tarea al global de tareas
                const tareaObj = {
                    id: String(resultado.id),
                    nombre: tarea,
                    estado: "0",
                    proyectoId: resultado.proyectoId
                };

                tareas = [...tareas, tareaObj];
                mostrarTareas();
            }
        } catch(error) {
            console.log(error)
        }
    }

    function cambiarEstadoTarea(tarea) {
        const nuevoEstado = tarea.estado === "1" ? "0" : "1";
        tarea.estado = nuevoEstado;
        actualizarTarea(tarea);
    }

    async function actualizarTarea(tarea) {
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
                mostrarAlerta(
                    resultado.respuesta.mensaje, 
                    resultado.respuesta.tipo, 
                    document.querySelector('.contenedor-nueva-tarea'), 
                    resultado.respuesta.animacion
                );

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

    function obtenerProyecto() {
        const proyectoParams = new URLSearchParams(window.location.search);
        const proyecto = Object.fromEntries(proyectoParams.entries());
        return proyecto.url;
    }

    function limpiarTareas() {
        const listadoTareas = document.querySelector('#listado-tareas');
        // listadoTareas.innerHTML = '';

        while(listadoTareas.firstChild) {
            listadoTareas.removeChild(listadoTareas.firstChild);
        }
    }
})();