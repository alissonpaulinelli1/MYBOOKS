// ELEMENTOS
const kidPhotoInput = document.getElementById("kidPhoto");
const beforeImg = document.getElementById("beforeImg");
const afterImg = document.getElementById("afterImg");
const generateBtn = document.getElementById("generateBtn");

// MOSTRA A FOTO "BEFORE"
kidPhotoInput.addEventListener("change", () => {
  const file = kidPhotoInput.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  beforeImg.src = url;
  beforeImg.style.display = "block";
});

// GERA A ILUSTRAÇÃO COM IA
generateBtn.addEventListener("click", async () => {
  const file = kidPhotoInput.files[0];
  if (!file) {
    alert("Upload a photo first");
    return;
  }

  generateBtn.disabled = true;
  generateBtn.innerText = "Creating illustration...";

  try {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/illustrate", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (!data.image) {
      throw new Error("No image returned");
    }

    afterImg.src = data.image;
    afterImg.style.display = "block";
  } catch (err) {
    console.error(err);
    alert("Error generating illustration");
  } finally {
    generateBtn.disabled = false;
    generateBtn.innerText = "Create Preview";
  }
});
