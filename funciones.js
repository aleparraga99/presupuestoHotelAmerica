function controlarCochera() {
    const cochera = Number(document.getElementById("cochera").value);
    const noches = document.getElementById("nochesCochera");
    noches.disabled = cochera === 0;
    if (cochera === 0) noches.value = 0;
}

function calcular() {
    const precio = Number(habitacion.value);
    const noches = Number(nochesHabitacion.value);
    const cocheraPrecio = Number(cochera.value);
    const nochesCochera = Number(nochesCocheraInput.value || 0);
    const desc = Number(descuento.value);

    const totalHab = precio * noches;
    const totalCoch = cocheraPrecio * nochesCochera;
    const subtotal = totalHab + totalCoch;
    const total = subtotal - subtotal * desc;
    const sena = total * 0.2;
    const saldo = total - sena;

    resultado.innerHTML = `
      Total habitación: $${totalHab.toLocaleString("es-AR")}<br>
      Total cochera: $${totalCoch.toLocaleString("es-AR")}<br>
      <strong>Total estadía: $${total.toLocaleString("es-AR")}</strong><br>
      Seña (20%): $${sena.toLocaleString("es-AR")}<br>
      Saldo: $${saldo.toLocaleString("es-AR")}
    `;
}

function calcularNochesEstadia() {
    if (!checkin.value || !checkout.value) return;
    const d1 = new Date(checkin.value);
    const d2 = new Date(checkout.value);
    if (d2 <= d1) return alert("Check-out inválido");
    const noches = (d2 - d1) / 86400000;
    nochesHabitacion.value = noches;
    nochesCochera.value = noches;
}

/* ====== RESERVAS CONFIRMADAS ====== */

let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

function confirmarReserva() {
    if (!checkin.value || !checkout.value) {
        alert("Completá fechas");
        return;
    }

    reservas.push({
        numero: numeroReserva.value,
        habitacion: habitacion.options[habitacion.selectedIndex].text,
        checkIn: checkin.value,
        checkOut: checkout.value
    });

    localStorage.setItem("reservas", JSON.stringify(reservas));
    alert("Reserva confirmada");
    renderCalendario();
}

function renderCalendario() {
    calendario.innerHTML = "";
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = hoy.getMonth();
    const ultimoDia = new Date(anio, mes + 1, 0).getDate();

    for (let d = 1; d <= ultimoDia; d++) {
        const fecha = new Date(anio, mes, d).toISOString().split("T")[0];
        const ocupado = reservas.some(r => fecha >= r.checkIn && fecha < r.checkOut);

        const div = document.createElement("div");
        div.className = "dia " + (ocupado ? "ocupado" : "libre");
        div.textContent = d;
        calendario.appendChild(div);
    }
}

renderCalendario();
