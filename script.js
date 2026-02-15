// ================= ELEMENTS =================
const kidPhotoInput = document.getElementById("kidPhoto");
const beforeImg = document.getElementById("beforeImg");
const afterImg = document.getElementById("afterImg");
const generateBtn = document.getElementById("generateBtn");

// ================= SAFETY CHECK =================
function must(el, name){
  if(!el){
    alert(`Missing element: ${name}. Check your HTML ids.`);
    throw new Error(`Missing element: ${name}`);
  }
  return el;
}
must(kidPhotoInput, "#kidPhoto");
must(beforeImg, "#beforeImg");
must(afterImg, "#afterImg");
must(generateBtn, "#generateBtn");

// IMPORTANT: if button is inside a <form>, prevent page reload
generateBtn.type = "button";

// ================= STATE =================
let uploadedImageURL = "";

// ================= UPLOAD HANDLER =================
kidPhotoInput.addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  // clear old url
  try { if (uploadedImageURL) URL.revokeObjectURL(uploadedImageURL); } catch(e){}

  uploadedImageURL = URL.createObjectURL(file);

  // BEFORE
  beforeImg.src = uploadedImageURL;
  beforeImg.style.display = "block";

  // reset AFTER until generate
  afterImg.src = "";
  afterImg.style.display = "none";
});

// ================= GENERATE PREVIEW =================
generateBtn.addEventListener("click", (e) => {
  e.preventDefault(); // stops form submit
  e.stopPropagation();

  if (!uploadedImageURL) {
    alert("Please upload a photo first.");
    return;
  }

  // AFTER (demo): show same photo with a “book” look
  afterImg.src = uploadedImageURL;
  afterImg.style.display = "block";

  // book-ish styling
  afterImg.style.borderRadius = "18px";
  afterImg.style.boxShadow = "0 18px 40px rgba(0,0,0,.18)";
  afterImg.style.border = "1px solid rgba(0,0,0,.08)";
});
