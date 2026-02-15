// =========================
// MyMagicStoryBooks - script.js
// Upload -> shows BEFORE + fills AFTER/COVER/PAGES with the same photo (demo)
// =========================

(function () {
  const $ = (id) => document.getElementById(id);

  // REQUIRED IDs
  const kidPhoto = $("kidPhoto");
  const beforeImg = $("beforeImg"); // <img id="beforeImg">
  const afterImg = $("afterImg");   // <img id="afterImg">
  const coverImg = $("coverImg");   // <img id="coverImg">
  const page1Img = $("page1Img");   // <img id="page1Img">
  const page2Img = $("page2Img");   // <img id="page2Img">

  // Optional elements (if you have them)
  const kidName = $("kidName");
  const kidAge = $("kidAge");
  const generateBtn = $("generateBtn");
  const beforeText = $("beforeText"); // if you have a text under before
  const debug = $("debugBox"); // optional small debug box

  let currentObjectUrl = null;

  function setImg(imgEl, src) {
    if (!imgEl) return;
    imgEl.src = src;
    imgEl.style.display = "block";
  }

  function clearImg(imgEl) {
    if (!imgEl) return;
    imgEl.removeAttribute("src");
    imgEl.style.display = "none";
  }

  function revokeOldUrl() {
    try {
      if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
    } catch (e) {}
    currentObjectUrl = null;
  }

  function fillAllPreviewsFromUpload(file) {
    if (!file) return;

    revokeOldUrl();
    currentObjectUrl = URL.createObjectURL(file);

    // BEFORE = real upload photo
    setImg(beforeImg, currentObjectUrl);

    // AFTER / COVER / PAGES = demo (same photo for now)
    // Later you can replace these with AI-generated book images
    setImg(afterImg, currentObjectUrl);
    setImg(coverImg, currentObjectUrl);
    setImg(page1Img, currentObjectUrl);
    setImg(page2Img, currentObjectUrl);

    if (beforeText) {
      beforeText.textContent = "Upload OK ✅";
    }

    if (debug) {
      debug.textContent =
        "JS OK\n" +
        "kidPhoto: FOUND\n" +
        "beforeImg: " + (beforeImg ? "FOUND" : "MISSING") + "\n" +
        "afterImg: " + (afterImg ? "FOUND" : "MISSING") + "\n" +
        "coverImg: " + (coverImg ? "FOUND" : "MISSING") + "\n" +
        "page1Img: " + (page1Img ? "FOUND" : "MISSING") + "\n" +
        "page2Img: " + (page2Img ? "FOUND" : "MISSING") + "\n";
    }
  }

  function resetPreviews() {
    revokeOldUrl();
    clearImg(beforeImg);
    clearImg(afterImg);
    clearImg(coverImg);
    clearImg(page1Img);
    clearImg(page2Img);
    if (beforeText) beforeText.textContent = "Upload a photo above";
  }

  // 1) When user picks a file -> instantly update previews
  if (kidPhoto) {
    kidPhoto.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return resetPreviews();
      fillAllPreviewsFromUpload(file);
    });
  }

  // 2) Button (if you want it to also force showing preview)
  if (generateBtn) {
    generateBtn.addEventListener("click", () => {
      const file = kidPhoto && kidPhoto.files && kidPhoto.files[0];
      if (!file) {
        alert("Please upload a photo first.");
        return;
      }
      fillAllPreviewsFromUpload(file);

      // optional: scroll to preview
      const preview = document.querySelector("#preview");
      if (preview) preview.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // Safety: if page reloads and input cleared
  window.addEventListener("beforeunload", revokeOldUrl);
})();
