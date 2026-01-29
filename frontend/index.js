const API_URL = 'http://localhost:3000/api/tasks';

const listaPendientes = document.getElementById('listaPendientes');
const listaFinalizadas = document.getElementById('listaFinalizadas');
const btnGuardar = document.getElementById('btnGuardar');

document.addEventListener('DOMContentLoaded', cargarTareas);

async function cargarTareas() {
    const res = await fetch(API_URL);
    const tareas = await res.json();

    listaPendientes.innerHTML = '';
    listaFinalizadas.innerHTML = '';

    tareas.forEach(tarea => {
        const li = document.createElement('li');

        const infoDiv = document.createElement('div');
        infoDiv.className = 'tarea-info';

        const textSpan = document.createElement('span');
        textSpan.innerHTML = `<strong>${tarea.titulo}</strong> (${tarea.tecnologia})`;

        const estadoLink = document.createElement('a');
        estadoLink.href = "#";

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

        if (tarea.estado) {
            listaPendientes.appendChild(li);
        } else {
            listaFinalizadas.appendChild(li);
        }
    });
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
    const estadoInput = document.getElementById('estado');

    if (!tituloInput.value) return alert("El título es obligatorio");

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            titulo: tituloInput.value,
            tecnologia: tecnologiaInput.value,
            estado: estadoInput.value === "true"
        })
    });

    tituloInput.value = '';
    tecnologiaInput.value = '';
    await cargarTareas();
});
