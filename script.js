// ==============================
// MyMagicStoryBooks - script.js
// ==============================

// Converte arquivo (foto) para base64 (dataURL)
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
const generateBtn = document.getElementById("generateBtn");

const nameInput = document.getElementById("childName");
const ageInput = document.getElementById("age");
const hobbyInput = document.getElementById("theme"); // ou "hobby" se for esse o id no seu HTML

// MOSTRA A FOTO "BEFORE"
kidPhotoInput?.addEventListener("change", () => {
  const file = kidPhotoInput.files?.[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  beforeImg.src = url;
  beforeImg.style.display = "block";
});

// GERA A ILUSTRAÇÃO COM IA
generateBtn?.addEventListener("click", async () => {
  try {
    const file = kidPhotoInput.files?.[0];
    if (!file) {
      alert("Upload a photo first");
      return;
    }

    // ======= VALIDAÇÃO (CORREÇÃO DO "Type the age") =======
    const childName = (nameInput?.value || "").trim();
    const ageRaw = (ageInput?.value || "").trim();
    const theme = (hobbyInput?.value || "").trim();

    if (!childName) {
      alert("Type the name");
      return;
    }

    // Aqui é onde corrigimos: garante que idade existe e é número válido
    const ageNum = Number(ageRaw);
    if (!ageRaw || Number.isNaN(ageNum) || ageNum <= 0) {
      alert("Type the age");
      return;
    }

    if (!theme) {
      alert("Type the theme / hobby");
      return;
    }
    // ======================================================

    generateBtn.disabled = true;
    const originalText = generateBtn.innerText;
    generateBtn.innerText = "Creating illustration...";

    // Converte a imagem para base64
    const imageBase64 = await fileToBase64(file);

    // Chama sua API (/api/illustrate) enviando JSON
    const res = await fetch("/api/illustrate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageBase64,
        childName,
        age: ageNum,
        theme
      })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.image) {
      throw new Error(data.details || data.error || "No image returned");
    }

    afterImg.src = data.image;
    afterImg.style.display = "block";
  } catch (err) {
    console.error(err);
    alert("Error generating illustration");
  } finally {
    if (generateBtn) {
      generateBtn.disabled = false;
      generateBtn.innerText = "Create Preview";
    }
  }
});
