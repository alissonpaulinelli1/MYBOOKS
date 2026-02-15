// MyMagicStoryBooks — demo preview (no broken images)
// - Always shows placeholders
// - When user uploads a photo, generates "book style" images using canvas

document.addEventListener("DOMContentLoaded", () => {
  // Elements (safe)
  const el = (id) => document.getElementById(id);

  const kidName   = el("kidName");
  const kidAge    = el("kidAge");
  const kidPhoto  = el("kidPhoto");
  const createBtn = el("createBtn");

  const beforeImg = el("beforeImg");
  const afterImg  = el("afterImg");
  const coverImg  = el("coverImg");
  const page1Img  = el("page1Img");
  const page2Img  = el("page2Img");

  const themeSelect = el("themeSelect");
  const selectedThemeText = el("selectedThemeText");

  const storyTitle = el("storyTitle");
  const storyBullets = el("storyBullets");

  // ---------- THEMES (8) ----------
  const THEMES = [
    { key:"adventure", label:"Adventure / Aventura", title:"The Brave Little Explorer", pt:"O Pequeno Explorador Corajoso" },
    { key:"bedtime",   label:"Bedtime / Dormir",     title:"Goodnight, Little Star",  pt:"Boa Noite, Estrelinha" },
    { key:"animals",   label:"Animals / Animais",    title:"Friends of the Forest",  pt:"Amigos da Floresta" },
    { key:"princess",  label:"Princess / Princesa",  title:"The Kind Royal Heart",   pt:"O Coração Real Bondoso" },
    { key:"superhero", label:"Superhero / Herói",    title:"The Super Helper",       pt:"O Super Ajudante" },
    { key:"dinosaurs", label:"Dinosaurs / Dinossauros", title:"Dino Day!",           pt:"Dia de Dino!" },
    { key:"space",     label:"Space / Espaço",       title:"Rocket to Wonder",       pt:"Foguete da Imaginação" },
    { key:"soccer",    label:"Soccer / Futebol",     title:"Goal of Courage",        pt:"Gol de Coragem" }
  ];

  // Fill select if exists
  if (themeSelect) {
    themeSelect.innerHTML = "";
    THEMES.forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t.key;
      opt.textContent = t.label;
      themeSelect.appendChild(opt);
    });
    themeSelect.value = "adventure";
    updateSelectedThemeLine();
    themeSelect.addEventListener("change", updateSelectedThemeLine);
  }

  function updateSelectedThemeLine(){
    const t = getTheme();
    if (selectedThemeText) selectedThemeText.textContent = `Selected theme: ${t.label}`;
  }

  function getTheme(){
    const key = themeSelect ? themeSelect.value : "adventure";
    return THEMES.find(t => t.key === key) || THEMES[0];
  }

  // ---------- PLACEHOLDERS (avoid broken icons) ----------
  const placeholderBefore = makePlaceholder("Before (your upload)", "Upload a photo above");
  const placeholderAfter  = makePlaceholder("After (book style)", "Preview will appear here");
  const placeholderCover  = makePlaceholder("Cover", "Generated cover");
  const placeholderP1     = makePlaceholder("Page 1", "Generated page");
  const placeholderP2     = makePlaceholder("Page 2", "Generated page");

  safeSetImg(beforeImg, placeholderBefore);
  safeSetImg(afterImg,  placeholderAfter);
  safeSetImg(coverImg,  placeholderCover);
  safeSetImg(page1Img,  placeholderP1);
  safeSetImg(page2Img,  placeholderP2);

  // ---------- ACTION ----------
  if (!createBtn) return;

  createBtn.addEventListener("click", async () => {
    const name = (kidName?.value || "").trim();
    const age  = (kidAge?.value  || "").trim();
    const file = kidPhoto?.files?.[0];

    if (!name || !age || !file) {
      alert("Please fill Child's Name, Age, and upload a photo.");
      return;
    }

    const theme = getTheme();

    // Read file => dataURL
    const dataURL = await readFileAsDataURL(file);

    // Show BEFORE = actual upload
    safeSetImg(beforeImg, dataURL);

    // Create a book-style set with canvas
    const img = await loadImage(dataURL);

    const after = renderBookCard(img, name, age, theme, "AFTER");
    const cover = renderBookCard(img, name, age, theme, "COVER");
    const p1    = renderPage(img, name, age, theme, 1);
    const p2    = renderPage(img, name, age, theme, 2);

    safeSetImg(afterImg, after);
    safeSetImg(coverImg, cover);
    safeSetImg(page1Img, p1);
    safeSetImg(page2Img, p2);

    // Story text (simple demo)
    if (storyTitle) storyTitle.textContent = `${theme.title} — ${name} (age ${age})`;
    if (storyBullets) {
      storyBullets.innerHTML = `
        • ${name} discovered a magical surprise and chose courage.<br>
        • A friendly helper showed ${name} a new way to try again.<br>
        • By the end, ${name} smiled proudly — the hero of the story ✨
      `;
    }
  });

  // ---------- HELPERS ----------
  function safeSetImg(node, src){
    if (!node) return;
    node.src = src;
    node.style.display = "block";
  }

  function readFileAsDataURL(file){
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  function loadImage(src){
    return new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.crossOrigin = "anonymous";
      i.src = src;
    });
  }

  function makePlaceholder(title, subtitle){
    const svg =
`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#dff6ff"/>
      <stop offset="0.5" stop-color="#fff2c9"/>
      <stop offset="1" stop-color="#f3e5ff"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" rx="40" fill="url(#g)"/>
  <rect x="60" y="60" width="1080" height="680" rx="32" fill="rgba(255,255,255,0.65)" stroke="rgba(31,36,64,0.12)"/>
  <text x="110" y="180" font-family="Arial" font-size="54" font-weight="800" fill="#1f2440">${escapeXML(title)}</text>
  <text x="110" y="250" font-family="Arial" font-size="30" font-weight="700" fill="rgba(31,36,64,0.7)">${escapeXML(subtitle)}</text>
  <circle cx="240" cy="450" r="90" fill="rgba(124,92,255,0.18)"/>
  <circle cx="520" cy="450" r="90" fill="rgba(46,233,166,0.16)"/>
  <circle cx="800" cy="450" r="90" fill="rgba(255,90,165,0.16)"/>
  <circle cx="1000" cy="450" r="90" fill="rgba(255,207,74,0.20)"/>
</svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  function escapeXML(s){
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }

  function renderBookCard(photo, name, age, theme, mode){
    // 1200x800
    const c = document.createElement("canvas");
    c.width = 1200;
    c.height = 800;
    const ctx = c.getContext("2d");

    // background
    const g = ctx.createLinearGradient(0,0,1200,800);
    g.addColorStop(0,   "#7c5cff");
    g.addColorStop(0.5, "#2ee9a6");
    g.addColorStop(1,   "#ffcf4a");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,1200,800);

    // card
    roundRect(ctx, 70, 70, 1060, 660, 36);
    ctx.fillStyle = "rgba(255,255,255,0.78)";
    ctx.fill();
    ctx.strokeStyle = "rgba(31,36,64,0.12)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // title
    ctx.fillStyle = "#1f2440";
    ctx.font = "bold 54px Arial";
    ctx.fillText(mode === "COVER" ? `${theme.title}` : `${theme.title}`, 120, 170);

    ctx.font = "bold 28px Arial";
    ctx.fillStyle = "rgba(31,36,64,0.75)";
    ctx.fillText(`Starring: ${name} • Age ${age}`, 120, 220);

    // photo circle
    const cx = 250, cy = 430, r = 120;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI*2);
    ctx.closePath();
    ctx.clip();
    // draw cropped photo
    drawCoverCrop(ctx, photo, cx - r, cy - r, r*2, r*2);
    ctx.restore();

    // circle border
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI*2);
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 10;
    ctx.stroke();

    // theme pill
    pill(ctx, 120, 270, `Theme: ${theme.label}`);

    // bullets
    ctx.fillStyle = "rgba(31,36,64,0.75)";
    ctx.font = "bold 22px Arial";
    const bullets = [
      "• Personalized story",
      "• Kid-friendly preview",
      "• Your child as the hero",
      "• Cover + pages preview"
    ];
    bullets.forEach((b, i) => ctx.fillText(b, 120, 330 + i*34));

    // “made with love”
    roundRect(ctx, 120, 620, 520, 60, 999);
    ctx.fillStyle = "rgba(124,92,255,0.14)";
    ctx.fill();
    ctx.fillStyle = "#1f2440";
    ctx.font = "bold 22px Arial";
    ctx.fillText("Made with love for kids 💛", 150, 660);

    return c.toDataURL("image/png");
  }

  function renderPage(photo, name, age, theme, pageNo){
    // 1200x800
    const c = document.createElement("canvas");
    c.width = 1200;
    c.height = 800;
    const ctx = c.getContext("2d");

    // soft background
    const g = ctx.createLinearGradient(0,0,1200,800);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(1, "#f3f4ff");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,1200,800);

    // page card
    roundRect(ctx, 70, 70, 1060, 660, 36);
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.fill();
    ctx.strokeStyle = "rgba(31,36,64,0.12)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // header
    ctx.fillStyle = "#1f2440";
    ctx.font = "bold 34px Arial";
    ctx.fillText(`${theme.title} — Page ${pageNo}`, 120, 150);

    ctx.font = "bold 22px Arial";
    ctx.fillStyle = "rgba(31,36,64,0.7)";
    ctx.fillText(`Featuring: ${name} (age ${age})`, 120, 190);

    // illustration box (book style)
    roundRect(ctx, 120, 240, 420, 420, 28);
    ctx.fillStyle = "rgba(124,92,255,0.12)";
    ctx.fill();
    ctx.save();
    ctx.beginPath();
    roundedClip(ctx, 120, 240, 420, 420, 28);
    ctx.clip();
    drawCoverCrop(ctx, photo, 120, 240, 420, 420);
    ctx.restore();

    // story box
    roundRect(ctx, 580, 240, 490, 420, 28);
    ctx.fillStyle = "rgba(46,233,166,0.10)";
    ctx.fill();

    ctx.fillStyle = "#1f2440";
    ctx.font = "bold 26px Arial";
    ctx.fillText("Story", 620, 300);

    ctx.font = "bold 22px Arial";
    ctx.fillStyle = "rgba(31,36,64,0.78)";
    const lines = pageNo === 1
      ? [
          `${name} found a tiny spark of magic in the air.`,
          `“Come with me,” whispered the wind, smiling.`,
          `${name} took a deep breath and stepped forward.`
        ]
      : [
          `Soon, the magic became a bright, warm light.`,
          `${name} learned: brave hearts try again.`,
          `And the story ended with laughter and hugs.`
        ];
    wrapLines(ctx, lines.join(" "), 620, 350, 420, 34);

    // footer tags
    pill(ctx, 120, 690, theme.label);
    pill(ctx, 420, 690, `Made for ${name}`);
    pill(ctx, 720, 690, `Preview pages (demo)`);

    return c.toDataURL("image/png");
  }

  function wrapLines(ctx, text, x, y, maxWidth, lineHeight){
    const words = text.split(" ");
    let line = "";
    let yy = y;
    for (let n=0; n<words.length; n++){
      const testLine = line + words[n] + " ";
      const w = ctx.measureText(testLine).width;
      if (w > maxWidth && n > 0){
        ctx.fillText(line, x, yy);
        line = words[n] + " ";
        yy += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, yy);
  }

  function pill(ctx, x, y, text){
    ctx.font = "bold 18px Arial";
    const padX = 16;
    const w = ctx.measureText(text).width + padX*2;
    const h = 40;

    roundRect(ctx, x, y, w, h, 999);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fill();
    ctx.strokeStyle = "rgba(31,36,64,0.12)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "rgba(31,36,64,0.8)";
    ctx.fillText(text, x + padX, y + 26);
  }

  function roundRect(ctx, x, y, w, h, r){
    const rr = Math.min(r, w/2, h/2);
    ctx.beginPath();
    ctx.moveTo(x+rr, y);
    ctx.arcTo(x+w, y, x+w, y+h, rr);
    ctx.arcTo(x+w, y+h, x, y+h, rr);
    ctx.arcTo(x, y+h, x, y, rr);
    ctx.arcTo(x, y, x+w, y, rr);
    ctx.closePath();
  }

  function roundedClip(ctx, x, y, w, h, r){
    const rr = Math.min(r, w/2, h/2);
    ctx.moveTo(x+rr, y);
    ctx.arcTo(x+w, y, x+w, y+h, rr);
    ctx.arcTo(x+w, y+h, x, y+h, rr);
    ctx.arcTo(x, y+h, x, y, rr);
    ctx.arcTo(x, y, x+w, y, rr);
    ctx.closePath();
  }

  function drawCoverCrop(ctx, img, x, y, w, h){
    // cover crop (center)
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    const ir = iw / ih;
    const r = w / h;

    let sx=0, sy=0, sw=iw, sh=ih;
    if (ir > r){
      // wider -> crop sides
      sh = ih;
      sw = ih * r;
      sx = (iw - sw) / 2;
      sy = 0;
    } else {
      // taller -> crop top/bottom
      sw = iw;
      sh = iw / r;
      sx = 0;
      sy = (ih - sh) / 2;
    }
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  }
});
