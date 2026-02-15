// MyMagicStoryBooks - demo (no real AI yet)
// This script shows the uploaded photo ("Before") and generates a "book-style" preview ("After")
// using Canvas (cover + page 1 + page 2) based on the selected theme.

const themes = [
  {
    id: "adventure",
    label: "Adventure / Aventura",
    title: (name) => `The Brave Little Explorer`,
    subtitle: (name, age) => `Starring: ${name} • Age ${age}`,
    story: (name, age) => [
      `${name} (age ${age}) found a tiny map tucked inside a favorite book.`,
      `With a brave smile, ${name} followed the clues and discovered a magical surprise—right in the heart.`
    ]
  },
  {
    id: "bedtime",
    label: "Bedtime / Dormir",
    title: () => `Goodnight, Little Star`,
    subtitle: (name, age) => `Starring: ${name} • Age ${age}`,
    story: (name, age) => [
      `${name} (age ${age}) looked outside and saw a sleepy star waving softly.`,
      `Clouds became pillows, the moon sang a lullaby, and ${name} drifted into the sweetest dream—safe, warm, and loved.`
    ]
  },
  {
    id: "emotions",
    label: "Emotions / Emoções",
    title: () => `The Rainbow of Feelings`,
    subtitle: (name, age) => `Starring: ${name} • Age ${age}`,
    story: (name, age) => [
      `${name} (age ${age}) met a friendly rainbow who explained each feeling with a color.`,
      `By the end, ${name} learned every feeling is okay—and sharing them makes hearts lighter.`
    ]
  },
  {
    id: "friendship",
    label: "Friendship / Amizade",
    title: () => `Best Friends Forever`,
    subtitle: (name, age) => `Starring: ${name} • Age ${age}`,
    story: (name, age) => [
      `${name} (age ${age}) helped a new friend feel welcome with a kind hello.`,
      `Together they laughed, played, and learned that friendship grows with kindness.`
    ]
  },
  {
    id: "animals",
    label: "Animals / Animais",
    title: () => `The Little Animal Helper`,
    subtitle: (name, age) => `Starring: ${name} • Age ${age}`,
    story: (name, age) => [
      `${name} (age ${age}) discovered a tiny animal village that needed help.`,
      `With gentle hands, ${name} saved the day and earned a crown of leaves and smiles.`
    ]
  },
  {
    id: "princess",
    label: "Princess / Princesa",
    title: () => `The Kind Kingdom`,
    subtitle: (name, age) => `Starring: ${name} • Age ${age}`,
    story: (name, age) => [
      `${name} (age ${age}) was invited to a kind kingdom where everyone helps each other.`,
      `A simple act of kindness by ${name} made the whole castle sparkle brighter.`
    ]
  },
  {
    id: "superhero",
    label: "Superhero / Super-herói",
    title: () => `Super ${"Kid"} to the Rescue`,
    subtitle: (name, age) => `Starring: ${name} • Age ${age}`,
    story: (name, age) => [
      `${name} (age ${age}) discovered a secret superhero cape that appears when someone needs help.`,
      `With courage and a big heart, ${name} saved the day—one good deed at a time.`
    ]
  },
  {
    id: "space",
    label: "Space / Espaço",
    title: () => `Rocket to the Stars`,
    subtitle: (name, age) => `Starring: ${name} • Age ${age}`,
    story: (name, age) => [
      `${name} (age ${age}) climbed into a shiny rocket made of dreams and stardust.`,
      `On a gentle space trip, ${name} learned that curiosity is the brightest star.`
    ]
  }
];

let selectedTheme = themes[0];
let uploadedObjectUrl = null;

const el = (id) => document.getElementById(id);

const themeSelect = el("themeSelect");
const themePills = el("themePills");

const kidName = el("kidName");
const kidAge = el("kidAge");
const kidPhoto = el("kidPhoto");
const createBtn = el("createBtn");
const selectedThemeText = el("selectedThemeText");

const beforeImg = el("beforeImg");
const afterImg = el("afterImg");
const coverImg = el("coverImg");
const page1Img = el("page1Img");
const page2Img = el("page2Img");
const storyTitle = el("storyTitle");
const storyBullets = el("storyBullets");

function escapeHtml(s) {
  return (s || "").replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[m]));
}

function setSelectedThemeById(id) {
  const found = themes.find(t => t.id === id);
  if (!found) return;
  selectedTheme = found;
  selectedThemeText.textContent = `Selected theme: ${selectedTheme.label}`;
  themeSelect.value = selectedTheme.id;

  // pills active
  [...themePills.querySelectorAll("button")].forEach(btn => {
    btn.classList.toggle("active", btn.dataset.theme === selectedTheme.id);
  });
}

function initThemesUI() {
  // select
  themeSelect.innerHTML = themes.map(t => `<option value="${t.id}">${t.label}</option>`).join("");
  themeSelect.addEventListener("change", (e) => setSelectedThemeById(e.target.value));

  // pills
  themePills.innerHTML = themes.map(t => `
    <button type="button" class="pill" data-theme="${t.id}">
      ${t.label}
    </button>
  `).join("");
  themePills.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-theme]");
    if (!btn) return;
    setSelectedThemeById(btn.dataset.theme);
    // smooth scroll to preview
    document.querySelector("#preview")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  setSelectedThemeById(themes[0].id);
}

function showBeforePreviewFromFile(file) {
  if (uploadedObjectUrl) {
    try { URL.revokeObjectURL(uploadedObjectUrl); } catch {}
    uploadedObjectUrl = null;
  }
  uploadedObjectUrl = URL.createObjectURL(file);
  beforeImg.src = uploadedObjectUrl;
  beforeImg.classList.add("hasImage");
}

kidPhoto.addEventListener("change", () => {
  const file = kidPhoto.files && kidPhoto.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    alert("Please upload an image file (JPG/PNG).");
    kidPhoto.value = "";
    return;
  }
  showBeforePreviewFromFile(file);
});

function makeCanvas(w, h) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  return c;
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w/2, h/2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawSoftBackground(ctx, w, h) {
  // pastel gradient background
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "rgba(124,92,255,0.18)");
  g.addColorStop(0.5, "rgba(60,219,176,0.16)");
  g.addColorStop(1, "rgba(255,201,84,0.18)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // bubbles
  const bubbles = [
    {x: w*0.18, y: h*0.74, r: 34, c:"rgba(124,92,255,0.25)"},
    {x: w*0.32, y: h*0.74, r: 34, c:"rgba(60,219,176,0.22)"},
    {x: w*0.46, y: h*0.74, r: 34, c:"rgba(255,90,165,0.18)"},
    {x: w*0.60, y: h*0.74, r: 34, c:"rgba(255,201,84,0.22)"},
  ];
  for (const b of bubbles) {
    ctx.beginPath();
    ctx.fillStyle = b.c;
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function clipRounded(ctx, x, y, w, h, r) {
  ctx.save();
  drawRoundedRect(ctx, x, y, w, h, r);
  ctx.clip();
}

function drawPhoto(ctx, img, x, y, w, h, r) {
  clipRounded(ctx, x, y, w, h, r);
  // cover center-crop
  const iw = img.width, ih = img.height;
  const ir = iw / ih;
  const tr = w / h;
  let sx=0, sy=0, sw=iw, sh=ih;
  if (ir > tr) {
    // image is wider
    sh = ih;
    sw = ih * tr;
    sx = (iw - sw) / 2;
  } else {
    sw = iw;
    sh = iw / tr;
    sy = (ih - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  ctx.restore();

  // subtle border
  ctx.strokeStyle = "rgba(31,36,64,0.14)";
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, x, y, w, h, r);
  ctx.stroke();
}

function drawCoverOrPage({img, name, age, theme, type}) {
  // type: "cover" | "page1" | "page2" | "afterCard"
  const W = 1200, H = 760;
  const c = makeCanvas(W, H);
  const ctx = c.getContext("2d");

  // outer
  drawSoftBackground(ctx, W, H);

  // card frame
  const pad = 42;
  ctx.fillStyle = "rgba(255,255,255,0.80)";
  ctx.strokeStyle = "rgba(31,36,64,0.12)";
  ctx.lineWidth = 3;
  drawRoundedRect(ctx, pad, pad, W - pad*2, H - pad*2, 36);
  ctx.fill();
  ctx.stroke();

  // left image block
  const photoX = pad + 40;
  const photoY = pad + 70;
  const photoW = 340;
  const photoH = 340;

  // circle photo for cover/afterCard
  const useCircle = (type === "cover" || type === "afterCard");
  if (useCircle) {
    // circle crop
    const cx = photoX + photoW/2;
    const cy = photoY + photoH/2;
    const cr = 150;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI*2);
    ctx.clip();

    // draw photo cover-crop into circle bounds
    // We'll draw into a square, then clipped by circle
    const sqX = cx - cr, sqY = cy - cr, sqS = cr*2;
    const iw = img.width, ih = img.height;
    const ir = iw/ih, tr = 1;
    let sx=0, sy=0, sw=iw, sh=ih;
    if (ir > tr) {
      sh = ih; sw = ih*tr; sx = (iw - sw)/2;
    } else {
      sw = iw; sh = iw/tr; sy = (ih - sh)/2;
    }
    ctx.drawImage(img, sx, sy, sw, sh, sqX, sqY, sqS, sqS);
    ctx.restore();

    // circle ring
    ctx.strokeStyle = "rgba(31,36,64,0.16)";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI*2);
    ctx.stroke();

    // label
    ctx.fillStyle = "rgba(31,36,64,0.75)";
    ctx.font = "700 24px Nunito, system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.fillText("Your Child’s Photo", photoX + 70, photoY + photoH + 30);

  } else {
    drawPhoto(ctx, img, photoX, photoY, photoW, photoH, 28);
  }

  // Title area
  ctx.fillStyle = "#1f2440";
  ctx.font = "900 54px 'Baloo 2', system-ui, -apple-system, Segoe UI, Roboto, Arial";
  const title = (type === "cover" || type === "afterCard") ? theme.title(name) : `${theme.title(name)} — ${type === "page1" ? "Page 1" : "Page 2"}`;
  ctx.fillText(title, pad + 430, pad + 150);

  ctx.fillStyle = "rgba(31,36,64,0.74)";
  ctx.font = "800 26px Nunito, system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillText(theme.subtitle(name, age), pad + 430, pad + 195);

  // tags pills
  const tags = [
    theme.label,
    `Made for ${name}`,
    type === "cover" ? "Cover" : (type === "afterCard" ? "Book style" : "Preview page")
  ];
  let tx = pad + 430;
  let ty = pad + 230;
  for (let i=0;i<tags.length;i++){
    const t = tags[i];
    const w = ctx.measureText(t).width + 34;
    ctx.fillStyle = "rgba(255,255,255,0.82)";
    ctx.strokeStyle = "rgba(31,36,64,0.12)";
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, tx, ty, w, 44, 999);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = "rgba(31,36,64,0.82)";
    ctx.font = "900 18px Nunito, system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.fillText(t, tx + 18, ty + 29);
    tx += w + 12;
  }

  // story block on pages
  if (type === "page1" || type === "page2") {
    const blockX = pad + 430;
    const blockY = pad + 290;
    const blockW = W - blockX - (pad + 40);
    const blockH = 300;

    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.strokeStyle = "rgba(31,36,64,0.10)";
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, blockX, blockY, blockW, blockH, 26);
    ctx.fill(); ctx.stroke();

    const lines = theme.story(name, age);
    const text = (type === "page1") ? lines[0] : lines[1];

    ctx.fillStyle = "rgba(31,36,64,0.86)";
    ctx.font = "800 24px Nunito, system-ui, -apple-system, Segoe UI, Roboto, Arial";
    wrapText(ctx, text, blockX + 26, blockY + 48, blockW - 52, 34);
  }

  // small footer
  ctx.fillStyle = "rgba(31,36,64,0.55)";
  ctx.font = "800 18px Nunito, system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillText("Demo preview — real AI generation comes next.", pad + 44, H - pad - 22);

  return c.toDataURL("image/png");
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = (text || "").split(" ");
  let line = "";
  let yy = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, yy);
      line = words[n] + " ";
      yy += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, yy);
}

async function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    const url = URL.createObjectURL(file);
    img.src = url;
    // release later
    img._objectUrl = url;
  });
}

function setImg(elm, dataUrl) {
  elm.src = dataUrl;
  elm.classList.add("hasImage");
}

function validateForm() {
  const name = (kidName.value || "").trim();
  const age = (kidAge.value || "").trim();
  const file = kidPhoto.files && kidPhoto.files[0];

  if (!name) return { ok:false, msg:"Please enter the child’s name." };
  if (!age) return { ok:false, msg:"Please enter the age." };
  if (!file) return { ok:false, msg:"Please upload a photo." };
  return { ok:true, name, age, file };
}

createBtn.addEventListener("click", async () => {
  const v = validateForm();
  if (!v.ok) { alert(v.msg); return; }

  const { name, age, file } = v;

  // ensure before is shown
  showBeforePreviewFromFile(file);

  // load image for canvas generation
  let img;
  try {
    img = await loadImageFromFile(file);
  } catch (e) {
    alert("Could not read the image. Try another photo.");
    return;
  }

  // generate book-style images
  const afterCard = drawCoverOrPage({ img, name, age, theme: selectedTheme, type: "afterCard" });
  const cover = drawCoverOrPage({ img, name, age, theme: selectedTheme, type: "cover" });
  const p1 = drawCoverOrPage({ img, name, age, theme: selectedTheme, type: "page1" });
  const p2 = drawCoverOrPage({ img, name, age, theme: selectedTheme, type: "page2" });

  setImg(afterImg, afterCard);
  setImg(coverImg, cover);
  setImg(page1Img, p1);
  setImg(page2Img, p2);

  // story text
  storyTitle.textContent = selectedTheme.title(name);
  const lines = selectedTheme.story(name, age);
  storyBullets.innerHTML = `
    <li>${escapeHtml(lines[0])}</li>
    <li>${escapeHtml(lines[1])}</li>
  `;

  // cleanup object URL created in loadImageFromFile
  try { URL.revokeObjectURL(img._objectUrl); } catch {}

  // scroll to preview output
  document.querySelector("#previewOut")?.scrollIntoView({ behavior:"smooth", block:"start" });
});

initThemesUI();
