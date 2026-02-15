/* ===========================
   MyMagicStoryBooks - script.js
   - Mostra BEFORE com a foto enviada
   - Cria AFTER estilo BOOK (Cover + Page1 + Page2) usando Canvas
   - 8 temas (bilingue)
   =========================== */

(() => {
  // ---------------------------
  // Helpers
  // ---------------------------
  const $ = (sel) => document.querySelector(sel);

  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  function pickThemeByValue(value) {
    return THEMES.find(t => t.value === value) || THEMES[0];
  }

  function safeText(s, fallback = "") {
    return (typeof s === "string" && s.trim().length) ? s.trim() : fallback;
  }

  function createObjectURLSafe(file) {
    try { return URL.createObjectURL(file); } catch { return null; }
  }

  function loadImageFromFile(file) {
    return new Promise((resolve, reject) => {
      const url = createObjectURLSafe(file);
      if (!url) return reject(new Error("Não consegui ler a imagem."));
      const img = new Image();
      img.onload = () => {
        // libera url
        try { URL.revokeObjectURL(url); } catch {}
        resolve(img);
      };
      img.onerror = () => reject(new Error("Imagem inválida ou corrompida."));
      img.src = url;
    });
  }

  function roundedRect(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function circleCrop(ctx, img, cx, cy, r) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // cover the circle area
    const targetSize = r * 2;
    const imgAspect = img.width / img.height;
    let dw = targetSize, dh = targetSize;
    if (imgAspect > 1) {
      // wide
      dh = targetSize;
      dw = targetSize * imgAspect;
    } else {
      // tall
      dw = targetSize;
      dh = targetSize / imgAspect;
    }
    const dx = cx - dw / 2;
    const dy = cy - dh / 2;

    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();
  }

  function drawSticker(ctx, x, y, text, bg) {
    ctx.save();
    ctx.font = "700 20px system-ui, -apple-system, Segoe UI, Roboto, Arial";
    const padX = 14, padY = 9;
    const w = ctx.measureText(text).width + padX * 2;
    const h = 34;
    ctx.fillStyle = bg;
    roundedRect(ctx, x, y, w, h, 999);
    ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,.75)";
    ctx.fillText(text, x + padX, y + 24);
    ctx.restore();
  }

  function createCoverCanvas({ kidImg, kidName, kidAge, theme }) {
    // “book cover style”
    const W = 1100, H = 700;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d");

    // background gradient
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, theme.colors[0]);
    g.addColorStop(1, theme.colors[1]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // big card
    ctx.fillStyle = "rgba(255,255,255,.82)";
    roundedRect(ctx, 70, 80, W - 140, H - 160, 34);
    ctx.fill();

    // top title
    ctx.fillStyle = "rgba(0,0,0,.85)";
    ctx.font = "800 54px system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.fillText(theme.bookTitle(kidName), 140, 170);

    ctx.fillStyle = "rgba(0,0,0,.65)";
    ctx.font = "650 24px system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.fillText(`Starring: ${kidName} • Age ${kidAge}`, 140, 215);

    // kid photo circle
    const cx = 230, cy = 370, r = 95;
    ctx.fillStyle = "rgba(255,255,255,.9)";
    ctx.beginPath(); ctx.arc(cx, cy, r + 10, 0, Math.PI * 2); ctx.fill();
    circleCrop(ctx, kidImg, cx, cy, r);

    // “Your child’s photo”
    ctx.fillStyle = "rgba(0,0,0,.55)";
    ctx.font = "700 20px system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.fillText("Your child’s photo", 150, 510);

    // bullet points
    ctx.fillStyle = "rgba(0,0,0,.75)";
    ctx.font = "650 22px system-ui, -apple-system, Segoe UI, Roboto, Arial";
    const bullets = [
      "Personalized story",
      "Kid-friendly illustrations (demo)",
      "Your child as the hero",
      "Cover + pages preview",
    ];
    let by = 310;
    bullets.forEach(b => {
      ctx.fillText("• " + b, 420, by);
      by += 38;
    });

    // theme badge
    drawSticker(ctx, 140, 250, `Theme: ${theme.labelEN} / ${theme.labelPT}`, "rgba(240,220,120,.9)");

    // small footer
    ctx.fillStyle = "rgba(0,0,0,.55)";
    ctx.font = "700 18px system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.fillText("FREE PREVIEW • Demo book layout — real AI generation comes next", 140, 610);

    return c;
  }

  function createPageCanvas({ kidImg, kidName, kidAge, theme, pageNumber, storyLines }) {
    const W = 1100, H = 700;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d");

    // soft background
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(1, "rgba(250,250,250,1)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // page frame
    ctx.fillStyle = "rgba(255,255,255,.92)";
    ctx.strokeStyle = "rgba(0,0,0,.08)";
    ctx.lineWidth = 2;
    roundedRect(ctx, 70, 70, W - 140, H - 140, 30);
    ctx.fill();
    ctx.stroke();

    // header
    ctx.fillStyle = "rgba(0,0,0,.78)";
    ctx.font = "800 28px system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.fillText(`${theme.bookTitle(kidName)} — Page ${pageNumber}`, 120, 125);

    ctx.fillStyle = "rgba(0,0,0,.55)";
    ctx.font = "650 18px system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.fillText(`Featuring: ${kidName} (age ${kidAge})`, 120, 155);

    // illustration block (left)
    const ix = 120, iy = 190, iw = 420, ih = 380;
    const ig = ctx.createLinearGradient(ix, iy, ix + iw, iy + ih);
    ig.addColorStop(0, theme.colors[0]);
    ig.addColorStop(1, theme.colors[1]);
    ctx.fillStyle = ig;
    roundedRect(ctx, ix, iy, iw, ih, 24);
    ctx.fill();

    // put kid photo as “character cameo” in illustration
    ctx.fillStyle = "rgba(255,255,255,.88)";
    ctx.beginPath();
    ctx.arc(ix + 105, iy + 110, 62, 0, Math.PI * 2);
    ctx.fill();
    circleCrop(ctx, kidImg, ix + 105, iy + 110, 54);

    // small sparkles
    ctx.fillStyle = "rgba(255,255,255,.8)";
    ctx.font = "800 38px system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.fillText("✦ ✨ ✦", ix + 230, iy + 115);

    // story area (right)
    ctx.fillStyle = "rgba(0,0,0,.82)";
    ctx.font = "800 26px system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.fillText("Story", 585, 240);

    ctx.fillStyle = "rgba(0,0,0,.68)";
    ctx.font = "650 22px system-ui, -apple-system, Segoe UI, Roboto, Arial";

    // wrap text
    const maxWidth = 430;
    let y = 285;
    storyLines.forEach(line => {
      const words = line.split(" ");
      let cur = "";
      for (const w of words) {
        const test = (cur ? cur + " " : "") + w;
        if (ctx.measureText(test).width > maxWidth) {
          ctx.fillText(cur, 585, y);
          y += 34;
          cur = w;
        } else {
          cur = test;
        }
      }
      if (cur) {
        ctx.fillText(cur, 585, y);
        y += 38;
      }
      y += 6;
    });

    // footer tags
    drawSticker(ctx, 120, 600, `${theme.labelEN} / ${theme.labelPT}`, "rgba(240,220,120,.9)");
    drawSticker(ctx, 320, 600, `Made for ${kidName}`, "rgba(180,230,200,.9)");
    drawSticker(ctx, 520, 600, `Preview pages (demo)`, "rgba(200,210,245,.9)");

    return c;
  }

  // ---------------------------
  // 8 THEMES (bilingue)
  // ---------------------------
  const THEMES = [
    {
      value: "adventure",
      labelEN: "Adventure",
      labelPT: "Aventura",
      colors: ["#B6D7FF", "#BDF3D0"],
      bookTitle: (name) => `The Brave Little Explorer`,
      story: (name) => ([
        `${name} found a tiny map that sparkled like a star.`,
        `“Follow me,” whispered the wind, and ${name} stepped into a magical trail.`,
        `A friendly dragon smiled, and together they discovered courage in every step.`
      ])
    },
    {
      value: "bedtime",
      labelEN: "Bedtime",
      labelPT: "Dormir",
      colors: ["#E8D7FF", "#CFF4FF"],
      bookTitle: (name) => `Goodnight, Little Star`,
      story: (name) => ([
        `${name} looked outside and saw a sleepy star waving softly.`,
        `“Come,” the star said, “let’s breathe slow and rest.”`,
        `Clouds became pillows, and ${name} drifted into the sweetest dream—safe, warm, and loved.`
      ])
    },
    {
      value: "emotions",
      labelEN: "Emotions",
      labelPT: "Emoções",
      colors: ["#FFE3B6", "#FFD1F0"],
      bookTitle: (name) => `Feelings are Superpowers`,
      story: (name) => ([
        `${name} met a rainbow that spoke with gentle colors.`,
        `“Happy, sad, mad, and proud… all feelings are okay,” the rainbow said.`,
        `${name} learned a calm trick: hand on heart, deep breath, and a brave smile.`
      ])
    },
    {
      value: "friendship",
      labelEN: "Friendship",
      labelPT: "Amizade",
      colors: ["#CFF7E9", "#D9E6FF"],
      bookTitle: (name) => `Best Friends Forever`,
      story: (name) => ([
        `${name} shared a snack with a shy little bunny in the park.`,
        `The bunny giggled, and soon a new friend joined the game.`,
        `Together they built a “kindness castle” where everyone was welcome.`
      ])
    },
    {
      value: "space",
      labelEN: "Space",
      labelPT: "Espaço",
      colors: ["#C9D2FF", "#BFF3FF"],
      bookTitle: (name) => `Captain ${safeText("")} & The Moon Mission`.replace("${safeText(\"\")}", ""),
      story: (name) => ([
        `${name} put on a tiny helmet and waved to planet Earth.`,
        `A friendly robot counted down: 3… 2… 1… blast off!`,
        `On the moon, ${name} planted a flag that read: “I can do hard things.”`
      ])
    },
    {
      value: "dinosaurs",
      labelEN: "Dinosaurs",
      labelPT: "Dinossauros",
      colors: ["#D7FFD2", "#FFF1B8"],
      bookTitle: (name) => `Dino Helper ${name}`,
      story: (name) => ([
        `${name} heard a “ROAR!”—but it was a dinosaur asking for help.`,
        `They fixed a wobbly nest with sticks and gentle care.`,
        `The dinosaur smiled: “You’re my hero,” and ${name} felt super brave.`
      ])
    },
    {
      value: "princess",
      labelEN: "Princess & Castle",
      labelPT: "Princesa & Castelo",
      colors: ["#FFE0F3", "#D7E6FF"],
      bookTitle: (name) => `The Kind Castle`,
      story: (name) => ([
        `${name} entered a castle where kindness was the rule.`,
        `A magical crown said: “Kind words make the strongest magic.”`,
        `${name} helped everyone share, and the castle sparkled brighter than ever.`
      ])
    },
    {
      value: "superhero",
      labelEN: "Superhero",
      labelPT: "Super-herói",
      colors: ["#FFD2D2", "#D2E6FF"],
      bookTitle: (name) => `${name} the Little Hero`,
      story: (name) => ([
        `${name} found a cape that fluttered like a friendly flag.`,
        `A tiny city needed help: someone lost a toy, and someone felt sad.`,
        `${name} used the best power—kindness—and saved the day with a hug.`
      ])
    }
  ];

  // ---------------------------
  // IDs expected in your HTML
  // ---------------------------
  // Inputs
  const kidNameEl = $("#kidName");
  const kidAgeEl = $("#kidAge");
  const kidPhotoEl = $("#kidPhoto"); // <input type="file">
  const themeEl = $("#themeSelect"); // <select> (opcional)
  const createBtn = $("#createBtn") || $("#createPreviewBtn") || $("#createPreview");

  // Preview images (set these IDs in HTML)
  const beforeImg = $("#beforeImg");     // <img id="beforeImg">
  const afterImg = $("#afterImg");       // <img id="afterImg"> (pode ser cover)
  const coverImg = $("#coverImg");       // <img id="coverImg">
  const page1Img = $("#page1Img");       // <img id="page1Img">
  const page2Img = $("#page2Img");       // <img id="page2Img">

  // Text outputs (opcional)
  const selectedThemeText = $("#selectedThemeText"); // <div id="selectedThemeText">
  const storyTitleEl = $("#storyTitle"); // <h4 id="storyTitle">
  const storyBulletsEl = $("#storyBullets"); // <div id="storyBullets"> or <ul id="storyBullets">

  let selectedFile = null;

  // ---------------------------
  // Make sure the <select> has 8 themes (if exists)
  // ---------------------------
  function ensureThemeOptions() {
    if (!themeEl) return;
    if (themeEl.options.length >= 8) return;

    themeEl.innerHTML = "";
    THEMES.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t.value;
      opt.textContent = `${t.labelEN} / ${t.labelPT}`;
      themeEl.appendChild(opt);
    });
  }

  // ---------------------------
  // Update “selected theme” label
  // ---------------------------
  function updateThemeLabel(theme) {
    if (!selectedThemeText) return;
    selectedThemeText.textContent = `Selected theme: ${theme.labelEN} / ${theme.labelPT}`;
  }

  // ---------------------------
  // Render story text (optional)
  // ---------------------------
  function renderStoryText(theme, name, age) {
    if (storyTitleEl) storyTitleEl.textContent = theme.bookTitle(name);

    if (storyBulletsEl) {
      const lines = theme.story(name);

      // if it's UL
      if (storyBulletsEl.tagName === "UL" || storyBulletsEl.tagName === "OL") {
        storyBulletsEl.innerHTML = "";
        lines.forEach(l => {
          const li = document.createElement("li");
          li.textContent = l;
          storyBulletsEl.appendChild(li);
        });
      } else {
        storyBulletsEl.innerHTML = lines.map(l => `• ${l}`).join("<br>");
      }
    }
  }

  // ---------------------------
  // Main: create preview
  // ---------------------------
  async function createPreview() {
    const kidName = safeText(kidNameEl?.value, "Laura");
    const kidAge = clamp(parseInt(kidAgeEl?.value || "6", 10) || 6, 1, 12);
    const theme = pickThemeByValue(themeEl?.value);

    if (!selectedFile) {
      alert("Por favor, clique em Upload Photo e escolha uma foto.");
      return;
    }

    updateThemeLabel(theme);

    // 1) Load uploaded photo
    const kidImg = await loadImageFromFile(selectedFile);

    // 2) Show BEFORE (uploaded photo)
    if (beforeImg) {
      const url = createObjectURLSafe(selectedFile);
      beforeImg.src = url || "";
      beforeImg.alt = "Before (Your upload)";
    }

    // 3) Create “AFTER” (book cover) + pages
    const coverCanvas = createCoverCanvas({ kidImg, kidName, kidAge, theme });
    const page1Canvas = createPageCanvas({
      kidImg, kidName, kidAge, theme,
      pageNumber: 1,
      storyLines: theme.story(kidName).slice(0, 2)
    });
    const page2Canvas = createPageCanvas({
      kidImg, kidName, kidAge, theme,
      pageNumber: 2,
      storyLines: theme.story(kidName).slice(1, 3)
    });

    const coverData = coverCanvas.toDataURL("image/png");
    const p1Data = page1Canvas.toDataURL("image/png");
    const p2Data = page2Canvas.toDataURL("image/png");

    // After image (if you have a single "after" slot)
    if (afterImg) {
      afterImg.src = coverData;
      afterImg.alt = "After (Book-style)";
    }

    // Individual slots
    if (coverImg) { coverImg.src = coverData; coverImg.alt = "Cover"; }
    if (page1Img) { page1Img.src = p1Data; page1Img.alt = "Page 1"; }
    if (page2Img) { page2Img.src = p2Data; page2Img.alt = "Page 2"; }

    // Story text (optional)
    renderStoryText(theme, kidName, kidAge);

    // Scroll to preview if exists
    const previewAnchor = $("#preview") || $("#yourPreview") || $("#bookPreview");
    if (previewAnchor) previewAnchor.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ---------------------------
  // File input handling
  // ---------------------------
  function onFileChange(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      alert("Selecione um arquivo de imagem (JPG/PNG/WebP).");
      return;
    }
    selectedFile = f;
  }

  // ---------------------------
  // Init
  // ---------------------------
  ensureThemeOptions();

  if (kidPhotoEl) kidPhotoEl.addEventListener("change", onFileChange);

  if (createBtn) {
    createBtn.addEventListener("click", (e) => {
      e.preventDefault();
      createPreview().catch(err => {
        console.error(err);
        alert("Deu erro ao criar o preview. Se quiser, me mande print do console (F12).");
      });
    });
  }

  // If theme changes, update label
  if (themeEl) {
    themeEl.addEventListener("change", () => {
      updateThemeLabel(pickThemeByValue(themeEl.value));
    });
    updateThemeLabel(pickThemeByValue(themeEl.value));
  }
})();
