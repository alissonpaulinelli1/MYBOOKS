// ==============================
// MyMagicStoryBooks - script.js
// ==============================

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const kidPhotoInput = document.querySelector('input[type="file"]');
const beforeImg = document.getElementById("beforeImg");
const afterImg = document.getElementById("afterImg");
const generateBtn = document.querySelector("button");

const nameInput = document.querySelector('input[placeholder*="name" i], input[placeholder*="nome" i]');
const ageInput = document.querySelector('input[placeholder*="age" i], input[placeholder*="idade" i]');


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

    const childName = (nameInput?.value || "").trim();
    const ageRaw = (ageInput?.value || "").trim();
    const ageNum = parseInt(ageRaw, 10);

    if (!childName) {
      alert("Type the name");
      return;
    }

    if (!ageRaw || Number.isNaN(ageNum) || ageNum <= 0) {
      alert("Type the age");
      return;
    }

    generateBtn.disabled = true;
    generateBtn.innerText = "Creating illustration...";

    const imageBase64 = await fileToBase64(file);

    const res = await fetch("/api/illustrate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageBase64,
        childName,
        age: ageNum
      })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.image) {
      throw new Error("No image returned");
    }

    if (afterImg) {
      afterImg.src = data.image;
      afterImg.style.display = "block";
    }

  } catch (err) {
    console.error(err);
    alert("Error generating illustration");
  } finally {
    generateBtn.disabled = false;
    generateBtn.innerText = "Create Preview";
  }
});
