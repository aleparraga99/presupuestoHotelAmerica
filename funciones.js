

// Habilita la cantidad de noches de cochera si se elige //
function controlarCochera() {
    const cochera = Number(document.getElementById("cochera").value);
    const nochesCocheraInput = document.getElementById("nochesCochera");

    if (cochera === 0) {
        nochesCocheraInput.value = 0;
        nochesCocheraInput.disabled = true;
    } else {
        nochesCocheraInput.disabled = false;
        if (nochesCocheraInput.value == 0) {
            nochesCocheraInput.value = 1;
        }
    }
}

// Calcula el presupuesto //
function calcular() {
    const precioBase = Number(document.getElementById("habitacion").value);
    const descuento = Number(document.getElementById("descuento").value);
    const nochesHabitacion = Number(document.getElementById("nochesHabitacion").value);
    const cochera = Number(document.getElementById("cochera").value);
    const nochesCochera = cochera === 0 ? 0 : Number(document.getElementById("nochesCochera").value);

    // Totales sin descuento
    const totalHabitacion = precioBase * nochesHabitacion;
    const totalCochera = cochera * nochesCochera;
    const subtotal = totalHabitacion + totalCochera;

    // Descuento aplicado al total
    const montoDescuento = subtotal * descuento;
    const totalFinal = subtotal - montoDescuento;

   const sena = totalFinal * 0.2;
const saldo = totalFinal - sena;

document.getElementById("resultado").innerHTML = `
  Total habitación: $${totalHabitacion.toLocaleString("es-AR")} <br>
  Total cochera: $${totalCochera.toLocaleString("es-AR")} <br>
  Descuento: -$${montoDescuento.toLocaleString("es-AR")} <br><br>

  <strong>Total estadía: $${totalFinal.toLocaleString("es-AR")}</strong><br>
  <strong>Seña (20%): $${sena.toLocaleString("es-AR")}</strong><br>
  <strong>Saldo: $${saldo.toLocaleString("es-AR")}</strong> efectivo contado al check-in
`;

}

// Estado inicial
controlarCochera();

// Generar PDF //
function generarPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  // Obtener elementos
  const habitacion = document.getElementById("habitacion");
  const checkIn = document.getElementById("checkin").value;
  const checkOut = document.getElementById("checkout").value;
  const nochesHabitacion = Number(document.getElementById("nochesHabitacion").value);
  const cochera = document.getElementById("cochera");
  const nochesCochera = Number(document.getElementById("nochesCochera").value);
  const descuento = document.getElementById("descuento");

  // Recalcular totales
  const precioBase = Number(habitacion.value);
  const totalHabitacion = precioBase * nochesHabitacion;
  const totalCochera = Number(cochera.value) * nochesCochera;
  const subtotal = totalHabitacion + totalCochera;

  const descuentoValor = Number(descuento.value);
  const montoDescuento = subtotal * descuentoValor;
  const totalFinal = subtotal - montoDescuento;

  const sena = totalFinal * 0.2;
  const saldo = totalFinal - sena;

  // Título
  pdf.setFontSize(16);
  pdf.text("Comprobante de Reserva", 20, 20);

  // Contenido
  pdf.setFontSize(12);
  let y = 40;

  pdf.text(`Tipo de habitación: ${habitacion.options[habitacion.selectedIndex].text}`, 20, y);
  y += 10;

  pdf.text(`Check-in: ${formatearFecha(checkIn)}`, 20, y);
  y += 10;

  pdf.text(`Check-out: ${formatearFecha(checkOut)}`, 20, y);
  y += 10;

  pdf.text(`Cantidad de noches: ${nochesHabitacion}`, 20, y);
  y += 10;

  pdf.text(`Cochera: ${cochera.options[cochera.selectedIndex].text}`, 20, y);
  y += 10;

  pdf.text(`Noches cochera: ${nochesCochera}`, 20, y);
  y += 10;

  pdf.text(`Descuento: ${descuento.options[descuento.selectedIndex].text}`, 20, y);
  y += 15;

  // Totales
  pdf.text(`Total estadía: $${totalFinal.toLocaleString("es-AR")}`, 20, y);
  y += 10;

  pdf.text(`Seña (20%): $${sena.toLocaleString("es-AR")}`, 20, y);
  y += 10;

  pdf.text(`Saldo a abonar en check-in: $${saldo.toLocaleString("es-AR")}`, 20, y);

  // Guardar PDF
  pdf.save("comprobante-reserva.pdf");
}


function formatearFecha(fecha) {
    if (!fecha) return "-";
    const [anio, mes, dia] = fecha.split("-");
    return `${dia}/${mes}/${anio}`;
}


function calcularNochesEstadia() {
    const checkin = document.getElementById("checkin").value;
    const checkout = document.getElementById("checkout").value;

    if (!checkin || !checkout) return;

    const fechaIngreso = new Date(checkin);
    const fechaSalida = new Date(checkout);

    // Validación
    if (fechaSalida <= fechaIngreso) {
        alert("El check-out debe ser posterior al check-in");
        document.getElementById("nochesHabitacion").value = "";
        return;
    }

    // Diferencia en milisegundos
    const diferenciaMs = fechaSalida - fechaIngreso;

    // Conversión a noches
    const noches = diferenciaMs / (1000 * 60 * 60 * 24);

    document.getElementById("nochesHabitacion").value = noches;
    document.getElementById("nochesCochera").value = noches;
}

