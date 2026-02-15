// ===== Themes + Stories (8) =====
const THEMES = [
  {
    id: "adventure",
    name: "Adventure / Aventura",
    icon: "🧭",
    desc: "Your child becomes a brave explorer in a magical journey.",
    palette: ["#7c5cff", "#2ee9a6", "#ffcf4a"],
    storyTitle: "The Brave Little Explorer",
    p1: (n, a) => `One sunny morning, ${n} (age ${a}) found a glowing map under the pillow. It whispered: “A treasure needs a hero!”`,
    p2: (n) => `${n} crossed rainbow bridges, helped a tiny dragon, and discovered the greatest treasure of all: courage inside the heart.`
  },
  {
    id: "bedtime",
    name: "Bedtime / Dormir",
    icon: "🌙",
    desc: "A calm story that helps your child relax and sleep peacefully.",
    palette: ["#3b82f6", "#a78bfa", "#ffcf4a"],
    storyTitle: "Goodnight, Little Star",
    p1: (n, a) => `${n} (age ${a}) looked outside and saw a sleepy star waving softly. “Come,” the star said, “let’s breathe slow and rest.”`,
    p2: (n) => `Clouds became pillows, the moon sang a lullaby, and ${n} drifted into the sweetest dream—safe, warm, and loved.`
  },
  {
    id: "emotions",
    name: "Emotions / Emoções",
    icon: "😊",
    desc: "A gentle story that teaches feelings and how to handle them.",
    palette: ["#ff5aa5", "#2ee9a6", "#60a5fa"],
    storyTitle: "The Color of Feelings",
    p1: (n, a) => `${n} (age ${a}) opened a magic paint box. Each feeling had a color: happy yellow, calm blue, brave green.`,
    p2: (n) => `When a stormy gray feeling appeared, ${n} took deep breaths and asked for help—then painted hope into the sky again.`
  },
  {
    id: "friendship",
    name: "Friendship / Amizade",
    icon: "🤝",
    desc: "A story about kindness, sharing, and making friends.",
    palette: ["#2ee9a6", "#f472b6", "#ffcf4a"],
    storyTitle: "The Best New Friend",
    p1: (n, a) => `${n} (age ${a}) met a shy little creature near the playground. It wanted to play, but didn’t know how to ask.`,
    p2: (n) => `${n} smiled, shared a toy, and said, “Let’s play together.” The shy creature became a best friend forever.`
  },
  {
    id: "family",
    name: "Family / Família",
    icon: "🏡",
    desc: "A warm story about love, hugs, and family adventures.",
    palette: ["#fb7185", "#fdba74", "#60a5fa"],
    storyTitle: "Our Family Magic",
    p1: (n, a) => `${n} (age ${a}) found a “Love Compass.” It always pointed to family—where hugs, laughter, and help live.`,
    p2: (n) => `No matter where ${n} traveled, the compass reminded: “Home is the people who love you.”`
  },
  {
    id: "school",
    name: "School / Escola",
    icon: "🎒",
    desc: "A story that makes school feel exciting and safe.",
    palette: ["#60a5fa", "#34d399", "#fbbf24"],
    storyTitle: "First Day Superstar",
    p1: (n, a) => `${n} (age ${a}) walked into school with a tiny butterfly in the tummy. The classroom felt big and new.`,
    p2: (n) => `With one friendly hello, ${n} became a superstar—learning, laughing, and feeling proud all day long.`
  },
  {
    id: "courage",
    name: "Courage / Coragem",
    icon: "🦁",
    desc: "A story about bravery—facing fears and feeling strong.",
    palette: ["#fbbf24", "#fb7185", "#7c5cff"],
    storyTitle: "The Courage Roar",
    p1: (n, a) => `${n} (age ${a}) heard a scary sound at night. A tiny lion appeared and said, “You already have courage.”`,
    p2: (n) => `${n} practiced the “courage roar,” turned on a gentle light, and felt brave—because brave means doing it even when nervous.`
  },
  {
    id: "fantasy",
    name: "Fantasy / Fantasia",
    icon: "🦄",
    desc: "A magical kingdom story with castles, sparkles, and wonder.",
    palette: ["#a78bfa", "#22c55e", "#ffcf4a"],
    storyTitle: "The Magic Kingdom Key",
    p1: (n, a) => `${n} (age ${a}) discovered a golden key that opened a hidden door. Behind it: a candy-colored kingdom!`,
    p2: (n) => `${n} rode a friendly unicorn, met giggling fairies, and learned the kingdom’s secret: kindness is the strongest magic.`
  }
];

// Default selected theme
let selectedThemeId = "adventure";

// ===== Helpers =====
function svgToDataUri(svg) {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

function getTheme(id) {
  return THEMES.find(t => t.id === id) || THEMES[0];
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (m) => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    "\"":"&quot;",
    "'":"&#039;"
  }[m]));
}

// ===== SVG Book Templates (Cover + 2 pages) =====
function makeCoverSVG(theme, kidName, kidAge, photoUrl) {
  const [c1, c2, c3] = theme.palette;
  const title = escapeHtml(theme.storyTitle);
  const n = escapeHtml(kidName);

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}" stop-opacity="0.9"/>
      <stop offset="0.55" stop-color="${c2}" stop-opacity="0.85"/>
      <stop offset="1" stop-color="${c3}" stop-opacity="0.85"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#0f1223" flood-opacity="0.25"/>
    </filter>
    <clipPath id="photoClip">
      <circle cx="250" cy="300" r="140"/>
    </clipPath>
  </defs>

  <rect x="0" y="0" width="1200" height="800" rx="42" fill="url(#bg)"/>
  <circle cx="1040" cy="120" r="90" fill="white" opacity="0.22"/>
  <circle cx="1020" cy="650" r="140" fill="white" opacity="0.14"/>
  <circle cx="140" cy="680" r="120" fill="white" opacity="0.12"/>

  <!-- Book frame -->
  <rect x="60" y="60" width="1080" height="680" rx="42" fill="rgba(255,255,255,0.80)" filter="url(#shadow)"/>
  <rect x="60" y="60" width="1080" height="680" rx="42" fill="none" stroke="rgba(31,36,64,0.12)" stroke-width="3"/>

  <!-- Title -->
  <text x="520" y="190" font-size="54" font-family="Baloo 2, Arial" font-weight="900" fill="#1f2440">${title}</text>
  <text x="520" y="235" font-size="28" font-family="Nunito, Arial" font-weight="800" fill="rgba(31,36,64,0.75)">Starring: ${n} • Age ${kidAge}</text>

  <!-- Photo sticker -->
  <circle cx="250" cy="300" r="158" fill="rgba(255,255,255,0.95)" stroke="rgba(31,36,64,0.10)" stroke-width="4"/>
  <image href="${photoUrl}" x="110" y="160" width="280" height="280" preserveAspectRatio="xMidYMid slice" clip-path="url(#photoClip)"/>
  <text x="250" y="490" text-anchor="middle" font-size="22" font-family="Nunito, Arial" font-weight="900" fill="rgba(31,36,64,0.78)">Your Child’s Photo</text>

  <!-- Cute stickers -->
  <g opacity="0.95">
    <rect x="520" y="280" width="280" height="58" rx="29" fill="rgba(255,255,255,0.82)" stroke="rgba(31,36,64,0.10)" />
    <text x="660" y="318" text-anchor="middle" font-size="22" font-family="Nunito, Arial" font-weight="900" fill="#1f2440">FREE PREVIEW ✨</text>

    <rect x="520" y="350" width="520" height="300" rx="28" fill="rgba(255,255,255,0.70)" stroke="rgba(31,36,64,0.10)"/>
    <text x="550" y="405" font-size="22" font-family="Nunito, Arial" font-weight="900" fill="rgba(31,36,64,0.85)">Theme:</text>
    <text x="620" y="405" font-size="22" font-family="Nunito, Arial" font-weight="900" fill="#1f2440">${escapeHtml(theme.name)}</text>

    <text x="550" y="450" font-size="18" font-family="Nunito, Arial" font-weight="800" fill="rgba(31,36,64,0.72)">• Personalized story</text>
    <text x="550" y="485" font-size="18" font-family="Nunito, Arial" font-weight="800" fill="rgba(31,36,64,0.72)">• Kid-friendly illustrations</text>
    <text x="550" y="520" font-size="18" font-family="Nunito, Arial" font-weight="800" fill="rgba(31,36,64,0.72)">• Your child as the hero</text>
    <text x="550" y="555" font-size="18" font-family="Nunito, Arial" font-weight="800" fill="rgba(31,36,64,0.72)">• Cover + pages preview</text>

    <rect x="550" y="595" width="420" height="44" rx="22" fill="rgba(124,92,255,0.18)" stroke="rgba(31,36,64,0.10)"/>
    <text x="760" y="623" text-anchor="middle" font-size="18" font-family="Nunito, Arial" font-weight="900" fill="#1f2440">Made with love for kids 💛</text>
  </g>
</svg>`;
}

function makePageSVG(theme, pageNumber, kidName, kidAge, photoUrl, storyLine) {
  const [c1, c2, c3] = theme.palette;
  const n = escapeHtml(kidName);
  const line = escapeHtml(storyLine);

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="bgp" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c2}" stop-opacity="0.35"/>
      <stop offset="0.55" stop-color="${c3}" stop-opacity="0.28"/>
      <stop offset="1" stop-color="${c1}" stop-opacity="0.30"/>
    </linearGradient>
    <filter id="shadow2" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#0f1223" flood-opacity="0.22"/>
    </filter>
    <clipPath id="photoClip2">
      <rect x="90" y="160" width="420" height="420" rx="34"/>
    </clipPath>
  </defs>

  <rect x="0" y="0" width="1200" height="800" rx="42" fill="url(#bgp)"/>
  <rect x="60" y="60" width="1080" height="680" rx="42" fill="rgba(255,255,255,0.86)" filter="url(#shadow2)"/>
  <rect x="60" y="60" width="1080" height="680" rx="42" fill="none" stroke="rgba(31,36,64,0.10)" stroke-width="3"/>

  <text x="100" y="125" font-size="24" font-family="Baloo 2, Arial" font-weight="900" fill="#1f2440">${escapeHtml(theme.storyTitle)} — Page ${pageNumber}</text>
  <text x="100" y="152" font-size="16" font-family="Nunito, Arial" font-weight="900" fill="rgba(31,36,64,0.70)">Featuring ${n} (age ${kidAge})</text>

  <!-- Photo area -->
  <rect x="90" y="160" width="420" height="420" rx="34" fill="rgba(255,255,255,0.92)" stroke="rgba(31,36,64,0.10)" />
  <image href="${photoUrl}" x="90" y="160" width="420" height="420" preserveAspectRatio="xMidYMid slice" clip-path="url(#photoClip2)"/>

  <!-- Story bubble -->
  <rect x="540" y="160" width="560" height="420" rx="34" fill="rgba(255,255,255,0.78)" stroke="rgba(31,36,64,0.10)" />
  <text x="575" y="235" font-size="22" font-family="Nunito, Arial" font-weight="900" fill="#1f2440">Story</text>

  <foreignObject x="575" y="260" width="500" height="280">
    <div xmlns="http://www.w3.org/1999/xhtml"
      style="font-family: Nunito, Arial; font-weight: 900; font-size: 22px; color: rgba(31,36,64,0.78); line-height: 1.35;">
      ${line}
    </div>
  </foreignObject>

  <!-- Bottom stickers -->
  <g>
    <rect x="90" y="610" width="260" height="52" rx="26" fill="rgba(255,207,74,0.55)" stroke="rgba(31,36,64,0.10)"/>
    <text x="220" y="644" text-anchor="middle" font-size="18" font-family="Nunito, Arial" font-weight="900" fill="#1f2440">${theme.icon} ${escapeHtml(theme.name)}</text>

    <rect x="370" y="610" width="310" height="52" rx="26" fill="rgba(124,92,255,0.18)" stroke="rgba(31,36,64,0.10)"/>
    <text x="525" y="644" text-anchor="middle" font-size="18" font-family="Nunito, Arial" font-weight="900" fill="#1f2440">Made for ${n}</text>

    <rect x="700" y="610" width="400" height="52" rx="26" fill="rgba(46,233,166,0.22)" stroke="rgba(31,36,64,0.10)"/>
    <text x="900" y="644" text-anchor="middle" font-size="18" font-family="Nunito, Arial" font-weight="900" fill="#1f2440">Preview pages (demo)</text>
  </g>
</svg>`;
}

// ===== UI Render =====
function renderThemes() {
  const grid = document.getElementById("themeGrid");
  grid.innerHTML = "";

  THEMES.forEach(t => {
    const card = document.createElement("div");
    card.className = "themeCard" + (t.id === selectedThemeId ? " selected" : "");
    card.dataset.theme = t.id;

    card.innerHTML = `
      <div class="themeIcon">${t.icon}</div>
      <div class="themeTitle">${t.name}</div>
      <p class="themeDesc">${t.desc}</p>
    `;

    card.addEventListener("click", () => {
      selectedThemeId = t.id;
      document.getElementById("selectedThemeLabel").textContent = t.name;
      renderThemes();
      // auto scroll to preview for convenience
      document.getElementById("preview").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    grid.appendChild(card);
  });

  document.getElementById("selectedThemeLabel").textContent = getTheme(selectedThemeId).name;
}

function renderExamples() {
  const grid = document.getElementById("exampleGrid");
  grid.innerHTML = "";

  // Use a built-in demo "photo" (cute avatar SVG) for examples:
  const demoPhoto = svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#ff5aa5" stop-opacity="0.35"/>
          <stop offset="0.5" stop-color="#7c5cff" stop-opacity="0.30"/>
          <stop offset="1" stop-color="#2ee9a6" stop-opacity="0.32"/>
        </linearGradient>
      </defs>
      <rect width="800" height="800" rx="60" fill="url(#g)"/>
      <circle cx="400" cy="340" r="190" fill="rgba(255,255,255,0.85)"/>
      <circle cx="330" cy="310" r="18" fill="#1f2440"/>
      <circle cx="470" cy="310" r="18" fill="#1f2440"/>
      <path d="M320 390 Q400 450 480 390" fill="none" stroke="#1f2440" stroke-width="18" stroke-linecap="round"/>
      <rect x="260" y="520" width="280" height="120" rx="60" fill="rgba(255,255,255,0.82)"/>
      <text x="400" y="595" text-anchor="middle" font-family="Baloo 2, Arial" font-size="40" font-weight="900" fill="#1f2440">KID</text>
    </svg>
  `);

  THEMES.forEach(t => {
    const kidName = "Laura";
    const kidAge = "6";
    const cover = svgToDataUri(makeCoverSVG(t, kidName, kidAge, demoPhoto));

    const card = document.createElement("div");
    card.className = "exCard";
    card.innerHTML = `
      <div class="exTopRow">
        <div class="exName">${t.icon} ${t.name}</div>
        <button class="exBtn" type="button">View</button>
      </div>
      <img class="exThumb" src="${cover}" alt="Example cover">
    `;

    card.querySelector(".exBtn").addEventListener("click", () => openExampleModal(t, kidName, kidAge, demoPhoto));
    grid.appendChild(card);
  });
}

function openExampleModal(theme, kidName, kidAge, photoUrl) {
  const modal = document.getElementById("modal");
  const title = document.getElementById("modalTitle");
  const c = document.getElementById("modalCover");
  const p1 = document.getElementById("modalPage1");
  const p2 = document.getElementById("modalPage2");

  const storyTitle = document.getElementById("modalStoryTitle");
  const storyLines = document.getElementById("modalStoryLines");

  const line1 = theme.p1(kidName, kidAge);
  const line2 = theme.p2(kidName);

  title.textContent = `Example: ${theme.name}`;
  c.src = svgToDataUri(makeCoverSVG(theme, kidName, kidAge, photoUrl));
  p1.src = svgToDataUri(makePageSVG(theme, 1, kidName, kidAge, photoUrl, line1));
  p2.src = svgToDataUri(makePageSVG(theme, 2, kidName, kidAge, photoUrl, line2));

  storyTitle.textContent = theme.storyTitle;
  storyLines.innerHTML = `• ${escapeHtml(line1)}<br/><br/>• ${escapeHtml(line2)}`;

  modal.classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

// ===== Preview generation using uploaded photo =====
function setupPreviewForm() {
  const form = document.getElementById("previewForm");
  const result = document.getElementById("result");

  const coverImg = document.getElementById("coverImg");
  const page1Img = document.getElementById("page1Img");
  const page2Img = document.getElementById("page2Img");

  const storyTitle = document.getElementById("storyTitle");
  const storyLines = document.getElementById("storyLines");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const kidName = document.getElementById("kidName").value.trim();
    const kidAge = document.getElementById("kidAge").value.trim();
    const fileInput = document.getElementById("kidPhoto");
    const file = fileInput.files && fileInput.files[0];

    if (!file) {
      alert("Please upload a photo first.");
      return;
    }

    const theme = getTheme(selectedThemeId);

    // Use uploaded photo as local URL
    const photoUrl = URL.createObjectURL(file);

    const line1 = theme.p1(kidName, kidAge);
    const line2 = theme.p2(kidName);

    coverImg.src = svgToDataUri(makeCoverSVG(theme, kidName, kidAge, photoUrl));
    page1Img.src = svgToDataUri(makePageSVG(theme, 1, kidName, kidAge, photoUrl, line1));
    page2Img.src = svgToDataUri(makePageSVG(theme, 2, kidName, kidAge, photoUrl, line2));

    storyTitle.textContent = theme.storyTitle;
    storyLines.innerHTML = `• ${escapeHtml(line1)}<br/><br/>• ${escapeHtml(line2)}`;

    result.classList.remove("hidden");
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
  renderThemes();
  renderExamples();
  setupPreviewForm();

  // modal events
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalBackdrop").addEventListener("click", closeModal);

  // Default selected theme label
  document.getElementById("selectedThemeLabel").textContent = getTheme(selectedThemeId).name;
});
