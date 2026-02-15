async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
// ELEMENTOS
const kidPhotoInput = document.getElementById("kidPhoto");
const beforeImg = document.getElementById("beforeImg");
const afterImg = document.getElementById("afterImg");
const generateBtn = document.getElementById("generateBtn");

// MOSTRA A FOTO "BEFORE"
kidPhotoInput.addEventListener("change", () => {
  const file = kidPhotoInput.files[0];
  if (!!file) return;

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
    async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

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
