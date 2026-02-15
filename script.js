// MyMagicStoryBooks - demo preview generator (no AI)
// - Shows BEFORE = uploaded photo
// - Generates AFTER + Cover + Page1 + Page2 (book-style) using Canvas

const $ = (sel) => document.querySelector(sel);

const kidNameEl = $("#kidName");
const kidAgeEl = $("#kidAge");
const kidPhotoEl = $("#kidPhoto");
const themeEl = $("#themeSelect");
const createBtn = $("#createBtn");

const selectedThemeLabel = $("#selectedThemeLabel");

const beforeImg = $("#beforeImg");
const afterImg = $("#afterImg");
const coverImg = $("#coverImg");
const page1Img = $("#page1Img");
const page2Img = $("#page2Img");

const storyTitleEl = $("#storyTitle");
const storyBulletsEl = $("#storyBullets");

let uploadedObjectUrl = null;
let uploadedImage = null; // HTMLImageElement

const THEMES = [
  {
    id: "adventure",
    label: "Adventure / Aventura",
    title: (name) => `The Brave Little Explorer`,
    bullets: (name, age) => ([
      `${name} (age ${age}) discovered a secret map and followed it into a friendly forest full of surprises.`,
      `With courage and kindness, ${name} helped new friends and found a bright treasure: confidence.`
    ])
  },
  {
    id: "bedtime",
    label: "Bedtime / Dormir",
    title: (name) => `Goodnight, Little Star`,
    bullets: (name, age) => ([
      `${name} (age ${age}) looked outside and saw a sleepy star waving softly. “Come,” the star said, “let’s breathe slow and rest.”`,
      `Clouds became pillows, the moon sang a lullaby, and ${name} drifted into the sweetest dream—safe, warm, and loved.`
    ])
  },
  {
    id: "emotions",
    label: "Emotions / Emoções",
    title: (name) => `The Rainbow of Feelings`,
    bullets: (name, age) => ([
      `${name} (age ${age}) met five friendly colors—each one teaching a feeling and how to talk about it.`,
      `By the end, ${name} learned: all feelings are okay, and sharing them makes the heart lighter.`
    ])
  },
  {
    id: "friendship",
    label: "Friendship / Amizade",
    title: (name) => `Best Friends Forever`,
    bullets: (name, age) => ([
      `${name} (age ${age}) made a new friend at the playground and learned how to share, wait, and cheer.`,
      `Together they built a “kindness castle” and promised to be brave helpers every day.`
    ])
  },
  {
    id: "animals",
    label: "Animals / Animais",
    title: (name) => `The Animal Parade`,
    bullets: (name, age) => ([
      `${name} (age ${age}) joined a parade of silly animals who needed help finding their homes.`,
      `${name} listened carefully, followed clues, and became the hero of the whole safari.`
    ])
  },
  {
    id: "princess",
    label: "Princess / Princesa",
    title: (name) => `The Kind Little Princess`,
    bullets: (name, age) => ([
      `${name} (age ${age}) wore a sparkling crown—but the real magic was being kind to everyone.`,
      `The kingdom celebrated: kindness is the best superpower of all.`
    ])
  },
  {
    id: "superhero",
    label: "Superhero / Super-herói",
    title: (name) => `Super ${name}`,
    bullets: (name, age) => ([
      `${name} (age ${age}) discovered a secret superpower: helping others with a big smile.`,
      `Every mission ended the same way—high-fives, hugs, and a happy heart.`
    ])
  },
  {
    id: "space",
    label: "Space / Espaço",
    title: (name) => `Rocket to the Stars`,
    bullets: (name, age) => ([
      `${name} (age ${age}) blasted off in a cozy rocket to visit friendly planets and glittery moons.`,
      `Among the stars, ${name} learned to dream big—and bring that courage back home.`
    ])
  }
];

function populateThemes() {
  themeEl.innerHTML = "";
  for (const t of THEMES) {
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = t.label;
    themeEl.appendChild(opt);
  }
  themeEl.value = "adventure";
  selectedThemeLabel.textContent = `Selected theme: ${getTheme().label}`;
}

function getTheme() {
  return THEMES.find(t => t.id === themeEl.value) || THEMES[0];
}

themeEl.addEventListener("change", () => {
  selectedThemeLabel.textContent = `Selected theme: ${getTheme().label}`;
});

kidPhotoEl.addEventListener("change", async () => {
  const file = kidPhotoEl.files && kidPhotoEl.files[0];
  if (!file) return;

  // clean old URL
  if (uploadedObjectUrl) {
    URL.revokeObjectURL(uploadedObjectUrl);
    uploadedObjectUrl = null;
  }

  uploadedObjectUrl = URL.createObjectURL(file);
  beforeImg.src = uploadedObjectUrl;
  beforeImg.classList.add("hasImage");

  uploadedImage = await loadImage(uploadedObjectUrl);

  // auto-generate preview instantly (no need to click)
  generateAll();
});

createBtn.addEventListener("click", (e) => {
  e.preventDefault();
  generateAll();
});

function sanitizeName(raw) {
  const name = (raw || "").trim();
  if (!name) return "your child";
  // Keep it simple: letters, numbers, spaces, apostrophes, hyphens
  return name.replace(/[^\p{L}\p{N}\s'\-]/gu, "").slice(0, 30) || "your child";
}

function sanitizeAge(raw) {
  const n = Number(String(raw || "").trim());
  if (!Number.isFinite(n)) return 6;
  const clamped = Math.max(1, Math.min(12, Math.round(n)));
  return clamped;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = reject;
    im.src = src;
  });
}

function generateAll() {
  const name = sanitizeName(kidNameEl.value);
  const age = sanitizeAge(kidAgeEl.value);
  const theme = getTheme();

  selectedThemeLabel.textContent = `Selected theme: ${theme.label}`;

  // story text
  const title = theme.title(name);
  const bullets = theme.bullets(name, age);

  storyTitleEl.textContent = title;
  storyBulletsEl.innerHTML = bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("");

  // need an uploaded image to create visuals
  if (!uploadedImage) {
    // show friendly placeholders if no image
    setImg(afterImg, makePlaceholderCard("After (book style)", "Upload a photo above"));
    setImg(coverImg, makePlaceholderCard("Cover", "Generated cover"));
    setImg(page1Img, makePlaceholderCard("Page 1", "Generated page"));
    setImg(page2Img, makePlaceholderCard("Page 2", "Generated page"));
    return;
  }

  // Generate after/cover/pages using the uploaded photo
  const palette = pickPalette(theme.id);

  const afterData = makeBookCover({
    w: 1100, h: 700,
    title,
    name,
    age,
    themeLabel: theme.label,
    photo: uploadedImage,
    palette,
    badge: "FREE PREVIEW"
  });

  const coverData = makeBookCover({
    w: 1000, h: 640,
    title,
    name,
    age,
    themeLabel: theme.label,
    photo: uploadedImage,
    palette,
    badge: "COVER"
  });

  const page1Data = makeBookPage({
    w: 1000, h: 640,
    title: `${title} — Page 1`,
    name,
    age,
    themeLabel: theme.label,
    photo: uploadedImage,
    palette,
    paragraph: bullets[0]
  });

  const page2Data = makeBookPage({
    w: 1000, h: 640,
    title: `${title} — Page 2`,
    name,
    age,
    themeLabel: theme.label,
    photo: uploadedImage,
    palette,
    paragraph: bullets[1]
  });

  setImg(afterImg, afterData);
  setImg(coverImg, coverData);
  setImg(page1Img, page1Data);
  setImg(page2Img, page2Data);
}

function setImg(imgEl, dataUrl) {
  imgEl.src = dataUrl;
  imgEl.classList.add("hasImage");
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function pickPalette(themeId) {
  // Pastel kids palettes
  const map = {
    adventure: ["#7C5CFF", "#29D3C2", "#FFD46A", "#FF7AA2"],
    bedtime: ["#6B5CFF", "#79D7FF", "#B8FFCC", "#FFE199"],
    emotions: ["#FF6FAE", "#7AE7FF", "#B7FF6A", "#FFD46A"],
    friendship: ["#7C5CFF", "#FFB86B", "#62E6A8", "#FF7AA2"],
    animals: ["#57D6FF", "#7CFF9A", "#FFD46A", "#FF7AA2"],
    princess: ["#FF6FAE", "#CFA7FF", "#7AE7FF", "#FFD46A"],
    superhero: ["#7C5CFF", "#FF4D6D", "#57D6FF", "#FFD46A"],
    space: ["#6B5CFF", "#57D6FF", "#62E6A8", "#FFD46A"]
  };
  return map[themeId] || ["#7C5CFF", "#29D3C2", "#FFD46A", "#FF7AA2"];
}

function makePlaceholderCard(title, subtitle) {
  const w = 1000, h = 640;
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");

  // background
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "rgba(124,92,255,.18)");
  g.addColorStop(.5, "rgba(87,214,255,.16)");
  g.addColorStop(1, "rgba(255,212,106,.16)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  roundRect(ctx, 40, 40, w - 80, h - 80, 36);
  ctx.fillStyle = "rgba(255,255,255,.85)";
  ctx.fill();

  ctx.fillStyle = "rgba(31,36,64,.92)";
  ctx.font = "900 52px 'Baloo 2', system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillText(title, 90, 170);

  ctx.fillStyle = "rgba(31,36,64,.65)";
  ctx.font = "800 26px 'Nunito', system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillText(subtitle, 90, 220);

  // cute circles
  const colors = ["#7C5CFF", "#62E6A8", "#FF7AA2", "#FFD46A"];
  for (let i = 0; i < 4; i++) {
    ctx.globalAlpha = 0.65;
    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.arc(210 + i * 160, 430, 58, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  return c.toDataURL("image/png");
}

function makeBookCover({ w, h, title, name, age, themeLabel, photo, palette, badge }) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");

  // bg gradient
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, hexToRgba(palette[0], 0.22));
  g.addColorStop(0.45, hexToRgba(palette[1], 0.18));
  g.addColorStop(1, hexToRgba(palette[2], 0.18));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // card
  roundRect(ctx, 44, 44, w - 88, h - 88, 42);
  ctx.fillStyle = "rgba(255,255,255,.88)";
  ctx.fill();

  // border
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(31,36,64,.10)";
  ctx.stroke();

  // left photo circle
  const cx = 190, cy = 190, r = 92;

  // outer ring
  ctx.beginPath();
  ctx.arc(cx, cy, r + 10, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,.95)";
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = hexToRgba(palette[0], 0.55);
  ctx.stroke();

  // clip circle + draw photo
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  drawCoverCropped(ctx, photo, cx - r, cy - r, r * 2, r * 2);
  ctx.restore();

  // Title & details
  ctx.fillStyle = "rgba(31,36,64,.95)";
  ctx.font = "900 54px 'Baloo 2', system-ui, -apple-system, Segoe UI, Roboto, Arial";
  wrapText(ctx, title, 320, 150, w - 420, 62);

  ctx.fillStyle = "rgba(31,36,64,.75)";
  ctx.font = "800 26px 'Nunito', system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillText(`Starring: ${name} • Age ${age}`, 320, 240);

  // badge
  pill(ctx, 320, 275, badge, palette[0]);

  // theme pill
  pill(ctx, 320, 320, `Theme: ${themeLabel}`, palette[1], true);

  // bullets
  ctx.fillStyle = "rgba(31,36,64,.78)";
  ctx.font = "800 22px 'Nunito', system-ui, -apple-system, Segoe UI, Roboto, Arial";
  const bulletLines = [
    "• Personalized story",
    "• Kid-friendly preview",
    "• Your child as the hero",
    "• Cover + pages preview"
  ];
  let y = 380;
  for (const line of bulletLines) {
    ctx.fillText(line, 330, y);
    y += 34;
  }

  // footer ribbon
  roundRect(ctx, 290, h - 150, w - 380, 62, 18);
  ctx.fillStyle = "rgba(124,92,255,.10)";
  ctx.fill();
  ctx.fillStyle = "rgba(31,36,64,.78)";
  ctx.font = "900 22px 'Nunito', system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillText("Made with love for kids 💛", 330, h - 110);

  // confetti dots
  confetti(ctx, w, h, palette);

  return c.toDataURL("image/png");
}

function makeBookPage({ w, h, title, name, age, themeLabel, photo, palette, paragraph }) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");

  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, hexToRgba(palette[3], 0.18));
  g.addColorStop(0.6, hexToRgba(palette[1], 0.14));
  g.addColorStop(1, "rgba(255,255,255,.0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  roundRect(ctx, 44, 44, w - 88, h - 88, 42);
  ctx.fillStyle = "rgba(255,255,255,.90)";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(31,36,64,.10)";
  ctx.stroke();

  // top header
  ctx.fillStyle = "rgba(31,36,64,.92)";
  ctx.font = "900 34px 'Baloo 2', system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillText(title, 90, 120);

  ctx.fillStyle = "rgba(31,36,64,.65)";
  ctx.font = "800 22px 'Nunito', system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillText(`Featuring: ${name} • age ${age}`, 90, 155);

  // photo box (left)
  roundRect(ctx, 90, 195, 300, 300, 28);
  ctx.fillStyle = "rgba(124,92,255,.08)";
  ctx.fill();
  ctx.save();
  roundRect(ctx, 110, 215, 260, 260, 22);
  ctx.clip();
  drawCoverCropped(ctx, photo, 110, 215, 260, 260);
  ctx.restore();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(31,36,64,.10)";
  roundRect(ctx, 110, 215, 260, 260, 22);
  ctx.stroke();

  // story text (right)
  ctx.fillStyle = "rgba(31,36,64,.88)";
  ctx.font = "900 22px 'Nunito', system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillText("Story", 430, 230);

  ctx.fillStyle = "rgba(31,36,64,.78)";
  ctx.font = "800 20px 'Nunito', system-ui, -apple-system, Segoe UI, Roboto, Arial";
  wrapText(ctx, paragraph, 430, 265, w - 520, 30);

  // bottom pills
  pill(ctx, 90, h - 140, themeLabel, palette[0], true);
  pill(ctx, 320, h - 140, `Made for ${name}`, palette[1], true);
  pill(ctx, 560, h - 140, `Preview pages (demo)`, palette[2], true);

  confetti(ctx, w, h, palette);

  return c.toDataURL("image/png");
}

function drawCoverCropped(ctx, img, x, y, w, h) {
  // cover-crop to fill w/h
  const ir = img.width / img.height;
  const tr = w / h;
  let sx, sy, sw, sh;

  if (ir > tr) {
    sh = img.height;
    sw = sh * tr;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    sw = img.width;
    sh = sw / tr;
    sx = 0;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function pill(ctx, x, y, text, color, soft = false) {
  ctx.save();
  ctx.font = "900 18px 'Nunito', system-ui, -apple-system, Segoe UI, Roboto, Arial";
  const padX = 14;
  const padY = 10;
  const w = ctx.measureText(text).width + padX * 2;
  const h = 40;

  roundRect(ctx, x, y, w, h, 999);
  ctx.fillStyle = soft ? hexToRgba(color, 0.14) : hexToRgba(color, 0.18);
  ctx.fill();

  ctx.lineWidth = 2;
  ctx.strokeStyle = hexToRgba(color, 0.25);
  ctx.stroke();

  ctx.fillStyle = "rgba(31,36,64,.85)";
  ctx.fillText(text, x + padX, y + 26);
  ctx.restore();
}

function confetti(ctx, w, h, palette) {
  ctx.save();
  for (let i = 0; i < 26; i++) {
    const x = 80 + Math.random() * (w - 160);
    const y = 80 + Math.random() * (h - 160);
    const r = 4 + Math.random() * 7;
    const c = palette[i % palette.length];
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

function hexToRgba(hex, a) {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map(ch => ch + ch).join("") : h;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${a})`;
}

// init
populateThemes();
generateAll();
