// MyMagicStoryBooks — demo preview (no broken images)
// - Always shows placeholders
// - When user uploads a photo, generates "book style" images using canvas

document.addEventListener("DOMContentLoaded", () => {
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

  const THEMES = [
    { key:"adventure", label:"Adventure / Aventura", title:"The Brave Little Explorer" },
    { key:"bedtime",   label:"Bedtime / Dormir",     title:"Goodnight, Little Star"  },
    { key:"animals",   label:"Animals / Animais",    title:"Friends of the Forest"   },
    { key:"princess",  label:"Princess / Princesa",  title:"The Kind Royal Heart"    },
    { key:"superhero", label:"Superhero / Herói",    title:"The Super Helper"        },
    { key:"dinosaurs", label:"Dinosaurs / Dinossauros", title:"Dino Day!"            },
    { key:"space",     label:"Space / Espaço",       title:"Rocket to Wonder"        },
    { key:"soccer",    label:"Soccer / Futebol",     title:"Goal of Courage"         }
  ];

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

  function getTheme(){
    const key = themeSelect ? themeSelect.value : "adventure";
    return THEMES.find(t => t.key === key) || THEMES[0];
  }

  function updateSelectedThemeLine(){
    const t = getTheme();
    if (selectedThemeText) selectedThemeText.textContent = `Selected theme: ${t.label}`;
  }

  // placeholders (avoid broken icons)
  safeSetImg(beforeImg, makePlaceholder("Before (your upload)", "Upload a photo above"));
  safeSetImg(afterImg,  makePlaceholder("After (book style)", "Preview will appear here"));
  safeSetImg(coverImg,  makePlaceholder("Cover", "Generated cover"));
  safeSetImg(page1Img,  makePlaceholder("Page 1", "Generated page"));
  safeSetImg(page2Img,  makePlaceholder("Page 2", "Generated page"));

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

    const dataURL = await readFileAsDataURL(file);
    safeSetImg(beforeImg, dataURL);

    const photo = await loadImage(dataURL);

    safeSetImg(afterImg, renderBookCard(photo, name, age, theme, "AFTER"));
    safeSetImg(coverImg, renderBookCard(photo, name, age, theme, "COVER"));
    safeSetImg(page1Img, renderPage(photo, name, age, theme, 1));
    safeSetImg(page2Img, renderPage(photo, name, age, theme, 2));

    if (storyTitle) storyTitle.textContent = `${theme.title} — ${name} (age ${age})`;
    if (storyBullets) {
      storyBullets.innerHTML = `
        • ${name} discovered a magical surprise and chose courage.<br>
        • A friendly helper showed ${name} a new way to try again.<br>
        • By the end, ${name} smiled proudly — the hero of the story ✨
      `;
    }
  });

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

  function renderBookCard(photo, name, age, theme){
    const c = document.createElement("canvas");
    c.width = 1200; c.height = 800;
    const ctx = c.getContext("2d");

    const g = ctx.createLinearGradient(0,0,1200,800);
    g.addColorStop(0, "#7c5cff");
    g.addColorStop(0.5, "#2ee9a6");
    g.addColorStop(1, "#ffcf4a");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,1200,800);

    roundRect(ctx, 70, 70, 1060, 660, 36);
    ctx.fillStyle = "rgba(255,255,255,0.82)";
    ctx.fill();
    ctx.strokeStyle = "rgba(31,36,64,0.12)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#1f2440";
    ctx.font = "bold 54px Arial";
    ctx.fillText(theme.title, 120, 170);

    ctx.font = "bold 28px Arial";
    ctx.fillStyle = "rgba(31,36,64,0.75)";
    ctx.fillText(`Starring: ${name} • Age ${age}`, 120, 220);

    // photo circle
    const cx=250, cy=430, r=120;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI*2);
    ctx.closePath();
    ctx.clip();
    drawCoverCrop(ctx, photo, cx-r, cy-r, r*2, r*2);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI*2);
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 10;
    ctx.stroke();

    pill(ctx, 120, 270, `Theme: ${theme.label}`);

    ctx.fillStyle = "rgba(31,36,64,0.78)";
    ctx.font = "bold 22px Arial";
    const bullets = [
      "• Personalized story",
      "• Kid-friendly preview",
      "• Your child as the hero",
      "• Cover + pages preview"
    ];
    bullets.forEach((b, i) => ctx.fillText(b, 120, 330 + i*34));

    roundRect(ctx, 120, 620, 520, 60, 999);
    ctx.fillStyle = "rgba(124,92,255,0.14)";
    ctx.fill();
    ctx.fillStyle = "#1f2440";
    ctx.font = "bold 22px Arial";
    ctx.fillText("Made with love for kids 💛", 150, 660);

    return c.toDataURL("image/png");
  }

  function renderPage(photo, name, age, theme, pageNo){
    const c = document.createElement("canvas");
    c.width = 1200; c.height = 800;
    const ctx = c.getContext("2d");

    const g = ctx.createLinearGradient(0,0,1200,800);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(1, "#f3f4ff");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,1200,800);

    roundRect(ctx, 70, 70, 1060, 660, 36);
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.fill();
    ctx.strokeStyle = "rgba(31,36,64,0.12)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#1f2440";
    ctx.font = "bold 34px Arial";
    ctx.fillText(`${theme.title} — Page ${pageNo}`, 120, 150);

    ctx.font = "bold 22px Arial";
    ctx.fillStyle = "rgba(31,36,64,0.7)";
    ctx.fillText(`Featuring: ${name} (age ${age})`, 120, 190);

    roundRect(ctx, 120, 240, 420, 420, 28);
    ctx.fillStyle = "rgba(124,92,255,0.12)";
    ctx.fill();
    ctx.save();
    ctx.beginPath();
    roundedPath(ctx, 120, 240, 420, 420, 28);
    ctx.clip();
    drawCoverCrop(ctx, photo, 120, 240, 420, 420);
    ctx.restore();

    roundRect(ctx, 580, 240, 490, 420, 28);
    ctx.fillStyle = "rgba(46,233,166,0.10)";
    ctx.fill();

    ctx.fillStyle = "#1f2440";
    ctx.font = "bold 26px Arial";
    ctx.fillText("Story", 620, 300);

    ctx.font = "bold 22px Arial";
    ctx.fillStyle = "rgba(31,36,64,0.78)";
    const lines = pageNo === 1
      ? `${name} found a tiny spark of magic in the air. “Come with me,” whispered the wind. ${name} took a deep breath and stepped forward.`
      : `Soon, the magic became a bright, warm light. ${name} learned: brave hearts try again. And the story ended with laughter and hugs.`;
    wrapText(ctx, lines, 620, 350, 420, 34);

    pill(ctx, 120, 690, theme.label);
    pill(ctx, 420, 690, `Made for ${name}`);
    pill(ctx, 720, 690, `Preview pages (demo)`);

    return c.toDataURL("image/png");
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight){
    const words = text.split(" ");
    let line = "";
    let yy = y;
    for (let n=0; n<words.length; n++){
      const testLine = line + words[n] + " ";
      if (ctx.measureText(testLine).width > maxWidth && n>0){
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

  function roundedPath(ctx, x, y, w, h, r){
    const rr = Math.min(r, w/2, h/2);
    ctx.moveTo(x+rr, y);
    ctx.arcTo(x+w, y, x+w, y+h, rr);
    ctx.arcTo(x+w, y+h, x, y+h, rr);
    ctx.arcTo(x, y+h, x, y, rr);
    ctx.arcTo(x, y, x+w, y, rr);
    ctx.closePath();
  }

  function drawCoverCrop(ctx, img, x, y, w, h){
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    const ir = iw / ih;
    const r = w / h;

    let sx=0, sy=0, sw=iw, sh=ih;
    if (ir > r){
      sh = ih;
      sw = ih * r;
      sx = (iw - sw) / 2;
      sy = 0;
    } else {
      sw = iw;
      sh = iw / r;
      sx = 0;
      sy = (ih - sh) / 2;
    }
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  }
});
