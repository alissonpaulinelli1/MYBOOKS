// ================= ELEMENTS =================
const kidPhotoInput = document.getElementById("kidPhoto");
const beforeImg = document.getElementById("beforeImg");
const afterImg = document.getElementById("afterImg");
const generateBtn = document.getElementById("generateBtn");

// ================= STATE =================
let uploadedImageURL = "";

// ================= UPLOAD HANDLER =================
kidPhotoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  uploadedImageURL = url;

  // BEFORE IMAGE
  beforeImg.src = url;
  beforeImg.style.display = "block";

  // Reset AFTER until generate
  afterImg.src = "";
});

// ================= GENERATE PREVIEW =================
generateBtn.addEventListener("click", () => {
  if (!uploadedImageURL) {
    alert("Please upload a photo first.");
    return;
  }

  // Simulate book-style image (for now)
  afterImg.src = uploadedImageURL;
  afterImg.style.display = "block";

  // Add soft book effect
  afterImg.style.borderRadius = "18px";
  afterImg.style.boxShadow =
    "0 20px 40px rgba(0,0,0,0.15)";
});
