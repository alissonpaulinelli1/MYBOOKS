// ===============================
// MYBOOKS - script.js (COMPLETO)
// ===============================

// Converte arquivo em base64 (DataURL)
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ELEMENTOS (IDs precisam existir no index.html)
const kidPhotoInput = document.getElementById("kidPhoto");
const beforeImg = document.getElementById("beforeImg");
const afterImg = document.getElementById("afterImg");

const nameInput = document.getElementById("childName"); // input nome
const ageInput = document.getElementById("age");        // input idade
const hobbyInput = document.getElementById("hobby");    // input hobby/tema

const generateBtn = document.getElementById("generateBtn");

// Mostra a foto BEFORE quando o usuário escolhe o arquivo
if (kidPhotoInput) {
  kidPhotoInput.addEventListener("change", () => {
    const file = kidPhotoInput.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    if (beforeImg) {
      beforeImg.src = url;
      beforeImg.style.display = "block";
    }
  });
}

// Clique no botão: chama a API e mostra AFTER
if (generateBtn) {
  generateBtn.addEventListener("click", async () => {
    const file = kidPhotoInput?.files?.[0];

    if (!file) {
      alert("Upload a photo first");
      return;
    }

    // Valida campos (opcional, mas ajuda)
    const childName = (nameInput?.value || "").trim();
    const age = (ageInput?.value || "").trim();
    const theme = (hobbyInput?.value || "").trim();

    if (!childName) {
      alert("Type the child's name");
      return;
    }
    if (!age) {
      alert("Type the age");
      return;
    }
    if (!theme) {
      alert("Type the hobby/theme");
      return;
    }

    generateBtn.disabled = true;
    const originalText = generateBtn.innerText;
    generateBtn.innerText = "Creating illustration...";

    try {
      // 1) arquivo -> base64
      const imageBase64 = await fileToBase64(file);

      // 2) chama API em JSON
      const res = await fetch("/api/illustrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64,
          childName,
          age,
          theme
        })
      });

      // 3) lê resposta
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.image) {
        throw new Error(data.details || data.error || "No image returned");
      }

      // 4) mostra AFTER
      if (afterImg) {
        afterImg.src = data.image;
        afterImg.style.display = "block";
      }
    } catch (err) {
      console.error(err);
      alert("Error generating illustration");
    } finally {
      generateBtn.disabled = false;
      generateBtn.innerText = originalText || "Create Preview";
    }
  });
}
