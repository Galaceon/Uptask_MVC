(function() {
    // Boton para mostrar el modal de agregar tarea
    const nuevaTareaBtn = document.querySelector('#agregar-tarea');
    nuevaTareaBtn.addEventListener('click', mostrarFormulario);

    obtenerTareas();
    async function obtenerTareas() {
        try {
            const id = obtenerProyecto();
            const url = `/api/tareas?url=${id}`;
            const respuesta = await fetch(url);
            const resultado = await respuesta.json();
            
            const { tareas } = resultado;
            mostrarTareas(tareas);
        } catch (error) {
            console.log(error);
        }
    }

    function mostrarTareas(tareas) {
        if(tareas.length === 0) {
            const contenedorTareas = document.querySelector('#listado-tareas');

            const textoNoTareas = document.createElement('LI');
            textoNoTareas.textContent = 'No hay Tareas';
            textoNoTareas.classList.add('no-tareas');

            contenedorTareas.appendChild(textoNoTareas);
            return;
        }
        
        tareas.forEach(tarea => {
            const contenedorTarea = document.createElement('LI');
            contenedorTarea.dataset.tareaId = tarea.id;
            contenedorTarea.classList.add('tarea');

            const nombreTarea = document.createElement('P');
            nombreTarea.textContent = tarea.nombre;

            console.log(tarea);
            console.log(nombreTarea);

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
            }
        } catch(error) {
            console.log(error)
        }
        
    }

    function obtenerProyecto() {
        const proyectoParams = new URLSearchParams(window.location.search);
        const proyecto = Object.fromEntries(proyectoParams.entries());
        return proyecto.url;
        
    }
})();