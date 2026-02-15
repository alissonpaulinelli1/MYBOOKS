const kidPhoto = document.getElementById("kidPhoto");
const beforeImg = document.getElementById("beforeImg");
const afterImg = document.getElementById("afterImg");
const coverImg = document.getElementById("coverImg");
const page1Img = document.getElementById("page1Img");
const page2Img = document.getElementById("page2Img");

const childNameEl = document.getElementById("childName");
const ageEl = document.getElementById("age");
const themeEl = document.getElementById("themeSelect");
const generateBtn = document.getElementById("generateBtn");

// 1) PREVIEW do BEFORE (foto real)
kidPhoto?.addEventListener("change", () => {
  const file = kidPhoto.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = reader.result;
    beforeImg.src = dataUrl;
    beforeImg.style.display = "block";
  };
  reader.readAsDataURL(file);
});

// 2) GERAR AFTER (IA)
generateBtn?.addEventListener("click", async () => {
  const file = kidPhoto.files?.[0];
  if (!file) {
    alert("Please upload a photo first.");
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = "Generating...";

  try {
    const fd = new FormData();
    fd.append("photo", file);
    fd.append("theme", themeEl?.value || "Adventure");
    fd.append("childName", childNameEl?.value || "");
    fd.append("age", ageEl?.value || "");

    const resp = await fetch("/api/illustrate", {
      method: "POST",
      body: fd,
    });

    const json = await resp.json();
    if (!resp.ok) throw new Error(json?.error || "Request failed");

    // AFTER = ilustração IA
    afterImg.src = json.afterDataUrl;
    afterImg.style.display = "block";

    // Se você quiser usar o mesmo “after” como páginas/cover por enquanto:
    coverImg.src = json.afterDataUrl;
    page1Img.src = json.afterDataUrl;
    page2Img.src = json.afterDataUrl;

    coverImg.style.display = "block";
    page1Img.style.display = "block";
    page2Img.style.display = "block";
  } catch (e) {
    alert("Error: " + e.message);
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "Create Preview";
  }
});
