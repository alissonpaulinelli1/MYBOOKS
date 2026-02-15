// ===== MyMagicStoryBooks - demo preview =====
// This makes the uploaded photo appear in "Before (Your Upload)"
// and also creates a simple "After" preview (for now: same photo + effect).

const kidPhoto = document.getElementById("kidPhoto");
const beforeImg = document.getElementById("beforeImg");
const afterImg = document.getElementById("afterImg");
const beforeText = document.getElementById("beforeText");

const generateBtn = document.getElementById("generateBtn");
const childName = document.getElementById("childName");
const childAge = document.getElementById("childAge");
const themeSelect = document.getElementById("themeSelect");

// When user uploads photo -> show in BEFORE immediately
kidPhoto.addEventListener("change", function () {
  const file = kidPhoto.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  beforeImg.src = url;

  // hide placeholder text
  if (beforeText) beforeText.style.display = "none";
});

// Create Preview button -> generate AFTER (simple demo style)
generateBtn.addEventListener("click", function () {
  const file = kidPhoto.files[0];
  if (!file) {
    alert("Please upload a photo first.");
    return;
  }

  const url = URL.createObjectURL(file);

  // For now, AFTER = same image (demo). Later we can generate book-style using Canvas/AI.
  afterImg.src = url;

  // Optional: show info in console
  console.log("Preview created:", {
    name: childName.value,
    age: childAge.value,
    theme: themeSelect.value
  });
});
