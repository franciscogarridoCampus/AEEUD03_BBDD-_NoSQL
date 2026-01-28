const API_URL = 'http://localhost:3000/api/tasks';
const lista = document.getElementById('listaTareas');
const btnGuardar = document.getElementById('btnGuardar');

document.addEventListener('DOMContentLoaded', cargarTareas);

async function cargarTareas() {
    try {
        const res = await fetch(API_URL);
        const tareas = await res.json();
        
        lista.innerHTML = ''; 

        tareas.forEach(tarea => {
            const li = document.createElement('li');
            
            const infoDiv = document.createElement('div');
            infoDiv.className = 'tarea-info';
            
            const textSpan = document.createElement('span');
            textSpan.innerHTML = `<strong>${tarea.titulo}</strong> (${tarea.tecnologia})`;
            // Ya no añadimos la clase 'completada' para evitar el tachado

            const estadoLink = document.createElement('a');
            estadoLink.href = "#";
            
            // ASIGNACIÓN DE CLASES POR COLOR
            if (tarea.estado) {
                estadoLink.className = 'estado-toggle estado-pendiente';
                estadoLink.textContent = "Pendiente";
            } else {
                estadoLink.className = 'estado-toggle estado-finalizado';
                estadoLink.textContent = "Finalizado";
            }

            estadoLink.onclick = (e) => {
                e.preventDefault();
                alternarEstado(tarea._id);
            };

            const btnBorrar = document.createElement('button');
            btnBorrar.textContent = 'X';
            btnBorrar.className = 'btn-borrar';
            btnBorrar.onclick = () => borrarTarea(tarea._id);

            infoDiv.appendChild(textSpan);
            infoDiv.appendChild(document.createTextNode(' - '));
            infoDiv.appendChild(estadoLink);
            
            li.appendChild(infoDiv);
            li.appendChild(btnBorrar);
            lista.appendChild(li);
        });
    } catch (error) {
        console.error("Error al cargar:", error);
    }
}

async function alternarEstado(id) {
    await fetch(`${API_URL}/${id}`, { method: 'PUT' });
    await cargarTareas();
}

async function borrarTarea(id) {
    if (!confirm("¿Deseas eliminar esta tarea?")) return;
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    await cargarTareas();
}

btnGuardar.addEventListener('click', async () => {
    const tituloInput = document.getElementById('titulo');
    const tecnologiaInput = document.getElementById('tecnologia');

    if (!tituloInput.value) return alert("El título es obligatorio");

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            titulo: tituloInput.value,
            tecnologia: tecnologiaInput.value,
            estado: true 
        })
    });

    tituloInput.value = '';
    tecnologiaInput.value = '';
    await cargarTareas();
});