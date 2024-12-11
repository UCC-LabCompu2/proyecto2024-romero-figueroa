function Interaccion() {
  window.location.href = "interaccion.html";
}
function Inicio() {
  window.location.href = "index.html";
}

function calculo(event) {
  event.preventDefault(); // Previene el envío del formulario

  // Obtener los valores iniciales
  const alturaInicial = parseFloat(document.getElementById("height").value);
  const velocidadInicial = parseFloat(document.getElementById("vel0").value);
  const gravedad = 9.8; // Gravedad en m/s²

  if (isNaN(alturaInicial) || isNaN(velocidadInicial)) {
      alert("Por favor, ingresa valores válidos.");
      return;
  }

  const velocidadImpacto = Math.sqrt(velocidadInicial ** 2 + 2 * gravedad * alturaInicial);

  let tiempoTotal = (2 * alturaInicial) / (velocidadImpacto - velocidadInicial);

  // Cálculo de la altura máxima
  let alturaMaxima = alturaInicial;
  if (velocidadInicial > 0) {
      alturaMaxima += (velocidadInicial ** 2) / (2 * gravedad);
  }

  // Mostrar resultados en el div "resultado"
  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = `
      <p><strong>Resultados:</strong></p>
      <ul>
          <li>Altura máxima: ${alturaMaxima.toFixed(2)} m</li>
          <li>Tiempo total hasta el piso: ${tiempoTotal.toFixed(2)} s</li>
          <li>Velocidad de impacto: ${velocidadImpacto.toFixed(2)} m/s</li>
      </ul>
  `;

  // Inicia la simulación
  iniciarSimulacion(alturaInicial, velocidadInicial, alturaMaxima, tiempoTotal);
}

// Función para iniciar la simulación en el canvas
function iniciarSimulacion(alturaInicial, velocidadInicial, alturaMaxima, tiempoTotal) {
  const canvas = document.getElementById("simulationCanvas");
  const ctx = canvas.getContext("2d");

  // Configuración de la simulación
  const gravedad = 9.8;
  let altura = alturaInicial;
  let velocidad = velocidadInicial;
  const dt = 0.05; // Paso de tiempo para la simulación
  let tiempoTranscurrido = 0;

  // Limpiar el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Establecer el origen del sistema de coordenadas
  const origenY = canvas.height - 20; // El suelo se ubica en la parte inferior del canvas

  // Calcular la escala de la regla
  const escalaRegla = (origenY - 20) / alturaMaxima; // Escala de la regla (distancia entre marcas)

  // Dibujar la regla al lado derecho del canvas
  function dibujarRegla() {
      const reglaX = canvas.width - 20; // Colocamos la regla en el borde derecho
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(reglaX, 20);
      ctx.lineTo(reglaX, origenY);
      ctx.stroke();

      // Dibujar las marcas de la regla, cada 5 metros hasta la altura máxima
      for (let i = 0; i <= alturaMaxima; i += 5) {
          const y = origenY - i * escalaRegla; // Calcular la posición en el canvas
          ctx.beginPath();
          ctx.moveTo(reglaX - 5, y);
          ctx.lineTo(reglaX, y);
          ctx.stroke();
          ctx.fillText(i + " m", reglaX + 5, y); // Etiquetas de la regla
      }
  }

  // Función para dibujar la marca de la altura inicial y la altura máxima
  function dibujarMarcas() {
      // Dibujar marca de altura inicial
      const alturaInicialY = origenY - alturaInicial * escalaRegla;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, alturaInicialY, 5, 0, Math.PI * 2); // Marca en el punto inicial
      ctx.fillStyle = "green";
      ctx.fill();

      // Dibujar marca de altura máxima
      const alturaMaximaY = origenY - alturaMaxima * escalaRegla;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, alturaMaximaY, 5, 0, Math.PI * 2); // Marca en el punto máximo
      ctx.fillStyle = "red";
      ctx.fill();

      // Etiquetas de las marcas
      ctx.fillStyle = "green";
      ctx.fillText("Inicio", canvas.width / 2 + 10, alturaInicialY);
      ctx.fillStyle = "red";
      ctx.fillText("Altura Máxima", canvas.width / 2 + 10, alturaMaximaY);
  }

  // Animación de la caída
  function animar() {
      if (altura > 0) {
          // Actualizar la velocidad y la altura
          velocidad -= gravedad * dt; // La velocidad cambia con la aceleración de la gravedad
          altura += velocidad * dt;   // La altura cambia con la velocidad

          // Limitar la altura para no superar la altura máxima
          if (altura > alturaMaxima) {
              altura = alturaMaxima;
          }

          // Limpiar y redibujar el canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Dibujar la regla
          dibujarRegla();

          // Dibujar las marcas
          dibujarMarcas();

          // Dibujar la "pelota" que cae
          ctx.beginPath();
          ctx.arc(canvas.width / 2, origenY - altura * escalaRegla, 10, 0, Math.PI * 2);
          ctx.fillStyle = "blue";
          ctx.fill();

          // Dibujar el suelo
          ctx.fillStyle = "black";
          ctx.fillRect(0, origenY, canvas.width, 10); // Dibujar una línea representando el suelo

          // Continuar la animación si no ha tocado el suelo
          if (altura > 0) {
              requestAnimationFrame(animar);
          }
      }
  }

  // Iniciar la animación
  animar();
}
