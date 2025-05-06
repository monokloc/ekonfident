body {
  margin: 0;
  font-family: 'Orbitron', sans-serif;
  background: linear-gradient(135deg, #0f0f1b, #1a1a2e);
  color: #00ffea;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.container {
  width: 90%;
  max-width: 400px;
  text-align: center;
  padding: 20px;
  border: 2px solid #ff00cc;
  border-radius: 12px;
  background-color: #1f1f2f;
  box-shadow: 0 0 25px #ff00cc;
}

h1 {
  font-size: 1.5em;
  margin-bottom: 20px;
  text-shadow: 0 0 10px #00ffe5;
}

input, button {
  width: 80%; /* Skrócenie szerokości */
  margin: 10px 0;
  padding: 10px;
  border: none;
  font-size: 1em;
  border-radius: 6px;
}

input {
  background-color: #2a2a3d;
  color: #00ffe5;
  border: 1px solid #00ffe5;
}

button {
  background-color: #ff00cc;
  color: white;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 0 10px #ff00f2;
  transition: transform 0.2s;
}

button:hover {
  transform: scale(1.05);
}

canvas {
  margin-top: 20px;
  width: 100%;
  height: auto;
  border: 1px solid #00ffe5;
  box-shadow: 0 0 10px #00ffe5;
  display: none; /* Ukrywamy canvas na początku */
}

/* Nowy styl dla przycisku wyboru zdjęcia */
#fileInputContainer {
  position: relative;
  width: 80%;
  margin: 10px auto;
}

#zdjecie {
  display: none; /* Ukryj standardowy przycisk pliku */
}

#fileInputLabel {
  display: inline-block;
  background-color: #00ffe5;
  color: #1f1f2f;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 0 10px #00ffe5;
  transition: transform 0.2s;
}

#fileInputLabel:hover {
  transform: scale(1.05);
}

#fileInputLabel:active {
  background-color: #ff00cc;
}

#fileInputContainer input[type="file"]:valid + #fileInputLabel {
  background-color: #00ffe5;
}

/* Styl dla przycisku pobierania */
#downloadButton {
  display: block;
  width: 200px; /* Możesz dostosować szerokość */
  padding: 8px 16px; /* Zmniejszenie paddingu */
  font-size: 14px; /* Zmniejszenie rozmiaru czcionki */
  background-color: #ff00cc;
  color: white;
  border: none;
  border-radius: 6px;
  margin: 20px auto; /* Wyśrodkowanie przycisku */
  cursor: pointer;
  box-shadow: 0 0 10px #ff00f2;
  transition: transform 0.2s;
}

#downloadButton:hover {
  transform: scale(1.05); /* Efekt powiększenia po najechaniu */
}




function dopasujTekstRozciagany(ctx, text, xStart, y, maxWidth, maxFontSize, fontName) {
    let fontSize = maxFontSize;
    ctx.font = ${fontSize}px ${fontName};
    
    // Dopasuj wielkość fontu do dostępnej szerokości
    while (ctx.measureText(text).width > maxWidth && fontSize > 8) {
      fontSize -= 1;
      ctx.font = ${fontSize}px ${fontName};
    }
  
    // Wycentruj tekst w podanej szerokości
    const textWidth = ctx.measureText(text).width;
    const x = xStart + (maxWidth - textWidth) / 2;
  
    ctx.fillText(text, x, y);
}

function generujKarte() {
    const imie = document.getElementById('imie').value;
    const ksywka = document.getElementById('ksywka').value;
    const input = document.getElementById('zdjecie');
    const file = input.files[0];
  
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
  
    // Ustawienia canvas
    canvas.width = 600;
    canvas.height = 750;
  
    // Ukrywamy canvas przed wygenerowaniem obrazu
    canvas.style.display = 'none';
  
    const szablon = new Image();
    szablon.src = 'img/szablon.png';
  
    szablon.onload = () => {
      ctx.drawImage(szablon, 0, 0, canvas.width, canvas.height);
  
      // Neonowy styl
      ctx.fillStyle = "000000";
      ctx.shadowColor = "000000";
      ctx.shadowBlur = 8;
  
      // Teksty dopasowane symetrycznie w 500px przestrzeni od x=135
      dopasujTekstRozciagany(ctx, imie, 5, 464, 278, 17, "Orbitron");
      dopasujTekstRozciagany(ctx, ksywka, 5, 553, 278, 17, "Orbitron");
  
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          const img = new Image();
          img.onload = () => {
            const x = 48;
            const y = 100;
            const width = 230;
            const height = 280;
            const radius = 30;
  
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            ctx.clip();
  
            ctx.drawImage(img, x, y, width, height);
            ctx.restore();
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
  
      // Po wygenerowaniu obrazu, pokaż canvas
      canvas.style.display = 'block';
  
      // Pokaż przycisk pobierania po wygenerowaniu obrazu
      document.getElementById('downloadButton').style.display = 'block';
    };
}

function downloadImage() {
  const canvas = document.getElementById('canvas');
  const imageUrl = canvas.toDataURL("image/png"); // Pobieranie obrazu z canvas w formacie PNG

  // Tworzenie linku do pobrania
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = 'karta_konfidenta.png'; // Nazwa pliku do pobrania
  link.click(); // Symulowanie kliknięcia, aby pobrać obraz
}
