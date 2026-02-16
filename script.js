// ==============================
// MyMagicStoryBooks - script.js (robusto)
// ==============================

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Helper: tenta achar um elemento por várias opções
function pickFirst(...selectors) {
  for (const sel of selectors) {
    const el = typeof sel === "string" ? document.querySelector(sel) : sel;
    if (el) return el;
  }
  return null;
}

// ====== ELEMENTOS (pega por id OU por placeholder/name) ======
const kidPhotoInput = pickFirst(
  document.getElementById("kidPhoto"),
  'input[type="file"]'
);

const beforeImg = pickFirst(
  document.getElementById("beforeImg"),
  "#beforeImg",
  'img[data-role="before"]'
);

const afterImg = pickFirst(
  document.getElementById("afterImg"),
  "#afterImg",
  'img[data-role="after"]'
);

const generateBtn = pickFirst(
  document.getElementById("generateBtn"),
  "#generateBtn",
  'button#generateBtn',
  'button[type="button"]',
  'button'
);

const nameInput = pickFirst(
  document.getElementById("childName"),
  '#childName',
  'input[name="childName"]',
  'input[placeholder*="nome" i]',
  'input[placeholder*="name" i]'
);

const ageInput = pickFirst(
  document.getElementById("age"),
  '#age',
  'input[name="age"]',
  'input[inputmode="numeric"]',
  'input[placeholder*="idade" i]',
  'input[placeholder*="age" i]'
);

const themeInput = pickFirst(
  document.getElementById("theme"),
  "#theme",
  'input[name="theme"]',
  'input[name="hobby"]',
  'input[placeholder*="hobbie" i]',
  'input[placeholder*="hobby" i]',
  'input[placeholder*="tema" i]',
  'input[placeholder*="theme" i]'
);

// Debug rápido (pra ver se achou certo)
console.log("FOUND:", { kidPhotoInput, nameInput, ageInput, themeInput, generateBtn });

// MOSTRA FOTO BEFORE
kidPhotoInput?.addEventListener("change", () => {
  const file = kidPhotoInput.files?.[0];
  if (!file) return;
  if (beforeImg) {
    beforeImg.src = URL.createObjectURL(file);
    beforeImg.style.display = "block";
  }
});

// CLICK
generateBtn?.addEventListener("click", async () => {
  try {
    const file = kidPhotoInput?.files?.[0];
    if (!file) {
      alert("Upload a photo first");
      return;
    }

    // Se algum input não foi encontrado, avisa claramente
    if (!nameInput) {
      alert('Não achei o campo "Nome". Verifique o id/placeholder do input.');
      return;
    }
    if (!ageInput) {
      alert('Não achei o campo "Idade". Verifique o id/placeholder do input.');
      return;
    }
    if (!themeInput) {
      alert('Não achei o campo "Hobbie/Tema". Verifique o id/placeholder do input.');
      return;
    }

    const childName = (nameInput.value || "").trim();
    const ageRaw = (ageInput.value || "").trim();
    const theme = (themeInput.value || "").trim();

    if (!childName) {
      alert("Type the name");
      return;
    }

    // CORREÇÃO: transforma " 2 " => 2 e valida
    const ageNum = parseInt(ageRaw, 10);
    if (!ageRaw || Number.isNaN(ageNum) || ageNum <= 0) {
      alert("Type the age");
      return;
    }

    if (!theme) {
      alert("Type the theme / hobby");
      return;
    }

    // UI
    generateBtn.disabled = true;
    const originalText = generateBtn.innerText;
    generateBtn.innerText = "Creating illustration...";

    const imageBase64 = await fileToBase64(file);

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

    if (afterImg) {
      afterImg.src = data.image;
      afterImg.style.display = "block";
    }
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
