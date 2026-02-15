// ===== DEBUG: mostra na tela se o JS está carregando e se os IDs existem =====
(function () {
  const badge = document.createElement("div");
  badge.style.cssText =
    "position:fixed;bottom:12px;right:12px;z-index:999999;background:#111;color:#0f0;padding:10px 12px;border-radius:12px;font:14px Arial;font-weight:700;max-width:320px;white-space:pre-line;box-shadow:0 10px 30px rgba(0,0,0,.25)";
  document.body.appendChild(badge);

  const ids = ["kidPhoto", "beforeImg", "afterImg", "generateBtn", "beforeText"];
  const found = {};
  ids.forEach((id) => (found[id] = !!document.getElementById(id)));

  badge.textContent =
    "✅ JS OK\n" +
    ids.map((id) => `${id}: ${found[id] ? "FOUND" : "MISSING"}`).join("\n");

  // Se estiver faltando algo, para aqui (não tenta rodar o resto)
  if (!found.kidPhoto || !found.beforeImg || !found.afterImg || !found.generateBtn) return;

  // ===== Funcionalidade: upload mostra BEFORE e botão mostra AFTER =====
  const kidPhoto = document.getElementById("kidPhoto");
  const beforeImg = document.getElementById("beforeImg");
  const afterImg = document.getElementById("afterImg");
  const beforeText = document.getElementById("beforeText");
  const generateBtn = document.getElementById("generateBtn");

  kidPhoto.addEventListener("change", () => {
    const file = kidPhoto.files && kidPhoto.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    beforeImg.src = url;
    if (beforeText) beforeText.style.display = "none";
  });

  generateBtn.addEventListener("click", () => {
    const file = kidPhoto.files && kidPhoto.files[0];
    if (!file) return alert("Upload a photo first.");

    const url = URL.createObjectURL(file);
    afterImg.src = url;
  });
})();
