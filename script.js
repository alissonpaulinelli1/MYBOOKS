document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("previewForm");
  const result = document.getElementById("result");

  const beforeImg = document.getElementById("beforeImg");
  const afterImg = document.getElementById("afterImg");
  const page1 = document.getElementById("page1");
  const page2 = document.getElementById("page2");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("kidPhoto");
    const file = fileInput.files && fileInput.files[0];

    if (!file) {
      alert("Please upload a photo first.");
      return;
    }

    // BEFORE: show uploaded photo
    beforeImg.src = URL.createObjectURL(file);

    // AFTER + PAGES: demo images
    afterImg.src = "https://picsum.photos/seed/after-kid/900/900";
    page1.src = "https://picsum.photos/seed/story-page-1/1200/800";
    page2.src = "https://picsum.photos/seed/story-page-2/1200/800";

    result.classList.remove("hidden");
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
