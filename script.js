// MyMagicStoryBooks - script.js (FINAL)
// - Shows Before (upload)
// - Generates book-style Cover + Page 1 + Page 2 (canvas) using uploaded photo + theme
// - Puts Cover into "After (Book Style)" and fills the 3 small cards with images

(function () {
  const kidPhoto = document.getElementById("kidPhoto");
  const beforeImg = document.getElementById("beforeImg");
  const afterImg = document.getElementById("afterImg");
  const beforeText = document.getElementById("beforeText");
  const generateBtn = document.getElementById("generateBtn");

  const childNameEl = document.getElementById("childName");
  const childAgeEl = document.getElementById("childAge");
  const themeSelect = document.getElementById("themeSelect");

  // Where to place generated cover/page images (the three small cards)
  const smallCards = Array.from(document.querySelectorAll(".bookPreview .previewCard.small .fakePage"));

  let uploadedObjectUrl = null;

  const THEMES = {
    "Adventure / Aventura": {
      badge: "Adventure / Aventura",
      titleEN: "The Brave Little Explorer",
      titlePT: "O Pequeno Explorador Corajoso",
      colors: ["#6EE7B7", "#60A5FA", "#A78BFA"],
      storyEN: [
        "Today, {name} packed a tiny backpack and followed a map made of giggles.",
        "In a sparkly forest, {name} found a secret path and helped a lost bird fly home."
      ],
      storyPT: [
        "Hoje, {name} colocou uma mochilinha e seguiu um mapa feito de risadas.",
        "Na floresta brilhante, {name} achou um caminho secreto e ajudou um passarinho a voltar pra casa."
      ]
    },
    "Bedtime / Dormir": {
      badge: "Bedtime / Dormir",
      titleEN: "Goodnight, Little Star",
      titlePT: "Boa Noite, Estrelinha",
      colors: ["#93C5FD", "#A78BFA", "#FBCFE8"],
      storyEN: [
        "{name} watched the moon yawn softly. “Come,” whispered a sleepy star.",
        "Clouds became pillows, and {name} drifted into the sweetest dream—safe, warm, and loved."
      ],
      storyPT: [
        "{name} viu a lua bocejar bem baixinho. “Vem,” sussurrou uma estrelinha sonolenta.",
        "As nuvens viraram travesseiros e {name} dormiu no sonho mais doce—seguro(a), quentinho(a) e amado(a)."
      ]
    },
    "Emotions / Emoções": {
      badge: "Emotions / Emoções",
      titleEN: "The Rainbow of Feelings",
      titlePT: "O Arco-Íris das Emoções",
      colors: ["#FDE68A", "#FCA5A5", "#86EFAC"],
      storyEN: [
        "{name} found a rainbow jar: happy, silly, calm, and brave feelings swirled inside.",
        "{name} learned: every feeling is okay—and sharing it makes hearts lighter."
      ],
      storyPT: [
        "{name} achou um potinho arco-íris: alegria, bobeira, calma e coragem rodopiavam lá dentro.",
        "{name} aprendeu: toda emoção é bem-vinda—e dividir o que sente deixa o coração mais leve."
      ]
    },
    "Friendship / Amizade": {
      badge: "Friendship / Amizade",
      titleEN: "Best Friends Forever",
      titlePT: "Amigos Pra Sempre",
      colors: ["#FBCFE8", "#93C5FD", "#86EFAC"],
      storyEN: [
        "{name} met a new friend at the playground and shared the biggest smile.",
        "Together they built a castle of kindness—one block, one hug, one laugh."
      ],
      storyPT: [
        "{name} conheceu um novo amigo no parquinho e compartilhou o maior sorriso.",
        "Juntos, construíram um castelo de bondade—um bloquinho, um abraço, uma risada."
      ]
    },
    "Animals / Animais": {
      badge: "Animals / Animais",
      titleEN: "The Animal Parade",
      titlePT: "A Festa dos Animais",
      colors: ["#86EFAC", "#FDE68A", "#93C5FD"],
      storyEN: [
        "{name} heard a “plop-plop” sound—tiny animal friends were marching in a parade!",
        "{name} danced with the animals and learned each one had a special talent."
      ],
      storyPT: [
        "{name} ouviu um “ploc-ploc”—os animaizinhos estavam fazendo um desfile!",
        "{name} dançou com eles e descobriu que cada bichinho tinha um talento especial."
      ]
    },
    "Princess & Magic / Princesa & Magia": {
      badge: "Princess & Magic / Princesa & Magia",
      titleEN: "The Magic Crown",
      titlePT: "A Coroa Mágica",
      colors: ["#A78BFA", "#FBCFE8", "#93C5FD"],
      storyEN: [
        "{name} found a tiny crown that sparkled with gentle magic.",
        "With a wave and a kind word, {name} turned worries into glittery smiles."
      ],
      storyPT: [
        "{name} encontrou uma coroinha que brilhava com magia boazinha.",
        "Com um aceno e uma palavra gentil, {name} transformou preocupações em sorrisos brilhantes."
      ]
    },
    "Superhero / Super-herói": {
      badge: "Superhero / Super-herói",
      titleEN: "Super {name}",
      titlePT: "Super {name}",
      colors: ["#FCA5A5", "#93C5FD", "#FDE68A"],
      storyEN: [
        "{name} put on a hero cape and listened for a call: “Help needed!”",
        "{name} used superpowers—kindness, courage, and teamwork—to save the day."
      ],
      storyPT: [
        "{name} vestiu a capa e ouviu um chamado: “Precisa de ajuda!”",
        "{name} usou superpoderes—bondade, coragem e trabalho em equipe—pra salvar o dia."
      ]
    },
    "School / Escola": {
      badge: "School / Escola",
      titleEN: "My First Big Day",
      titlePT: "Meu Primeiro Grande Dia",
      colors: ["#93C5FD", "#86EFAC", "#FDE68A"],
      storyEN: [
        "{name} walked into school with a heart full of “I can do it!”",
        "{name} learned new things, made friends, and went home proud and happy."
      ],
      storyPT: [
        "{name} chegou na escola com o coração dizendo “Eu consigo!”",
        "{name} aprendeu coisas novas, fez amigos e voltou pra casa orgulhoso(a) e feliz."
      ]
    }
  };

  // Helpers
  function safeName() {
    const v = (childNameEl?.value || "").trim();
    return v ? v : "Your Child";
  }
  function safeAge() {
    const v = (childAgeEl?.value || "").toString().trim();
    return v ? v : "";
  }
  function currentThemeKey() {
    return themeSelect?.value || "Adventure / Aventura";
  }
  function isPortugueseTheme(key) {
    // Simple heuristic: if user picked a theme with "/"
    // We'll render bilingual labels anyway; story pages will be EN + PT.
    return true;
  }

  function loadImageFromFile(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      const url = URL.createObjectURL(file);
      img.src = url;
      // keep for cleanup
      uploadedObjectUrl = url;
    });
  }

  function roundedRect(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function drawSticker(ctx, x, y, text, bg) {
    ctx.save();
    ctx.font = "800 16px Nunito, system-ui, Arial";
    const padX = 12, padY = 8;
    const w = ctx.measureText(text).width + padX * 2;
    const h = 34;
    ctx.fillStyle = bg;
    roundedRect(ctx, x, y, w, h, 999);
    ctx.fill();
    ctx.fillStyle = "rgba(20,20,30,.85)";
    ctx.fillText(text, x + padX, y + 22);
    ctx.restore();
  }

  function fitCoverPhoto(ctx, img, x, y, w, h, r) {
    // Cover-style crop
    const imgRatio = img.width / img.height;
    const boxRatio = w / h;
    let sx, sy, sw, sh;
    if (imgRatio > boxRatio) {
      sh = img.height;
      sw = sh * boxRatio;
      sx = (img.width - sw) / 2;
      sy = 0;
    } else {
      sw = img.width;
      sh = sw / boxRatio;
      sx = 0;
      sy = (img.height - sh) / 2;
    }
    ctx.save();
    roundedRect(ctx, x, y, w, h, r);
    ctx.clip();
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
    ctx.restore();
  }

  function makeCanvas(w, h) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    return c;
  }

  function renderCover(photoImg, theme, name, age) {
    const W = 1200, H = 800;
    const c = makeCanvas(W, H);
    const ctx = c.getContext("2d");

    // Background gradient
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, theme.colors[1]);
    g.addColorStop(0.5, theme.colors[2]);
    g.addColorStop(1, theme.colors[0]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Soft overlay
    ctx.fillStyle = "rgba(255,255,255,.20)";
    ctx.fillRect(0, 0, W, H);

    // Big card
    ctx.fillStyle = "rgba(255,255,255,.78)";
    ctx.strokeStyle = "rgba(30,35,70,.12)";
    ctx.lineWidth = 2;
    roundedRect(ctx, 70, 70, W - 140, H - 140, 32);
    ctx.fill();
    ctx.stroke();

    // Left photo area
    fitCoverPhoto(ctx, photoImg, 110, 140, 320, 320, 26);

    // Right info area
    ctx.fillStyle = "rgba(255,255,255,.90)";
    ctx.strokeStyle = "rgba(30,35,70,.10)";
    roundedRect(ctx, 470, 140, 620, 320, 26);
    ctx.fill();
    ctx.stroke();

    // Title
    ctx.fillStyle = "rgba(25,28,55,.95)";
    ctx.font = "900 44px Nunito, system-ui, Arial";
    const title = (theme.titleEN || "My Magic Book").replace("{name}", name);
    ctx.fillText(title, 520, 210);

    ctx.font = "800 22px Nunito, system-ui, Arial";
    const sub = `Starring: ${name}${age ? " • Age " + age : ""}`;
    ctx.fillStyle = "rgba(25,28,55,.80)";
    ctx.fillText(sub, 520, 250);

    // Badge + bullets
    drawSticker(ctx, 520, 275, "FREE PREVIEW ✨", "rgba(255,255,255,.85)");

    ctx.fillStyle = "rgba(25,28,55,.72)";
    ctx.font = "800 18px Nunito, system-ui, Arial";
    const bullets = [
      `Theme: ${theme.badge}`,
      "Personalized story",
      "Kid-friendly preview",
      "Your child as the hero",
      "Cover + pages preview"
    ];
    let by = 340;
    bullets.forEach((b) => {
      ctx.fillText("• " + b, 520, by);
      by += 30;
    });

    // Footer ribbon
    ctx.fillStyle = "rgba(255,255,255,.70)";
    roundedRect(ctx, 110, 500, W - 220, 70, 20);
    ctx.fill();

    ctx.font = "900 22px Nunito, system-ui, Arial";
    ctx.fillStyle = "rgba(25,28,55,.85)";
    ctx.fillText("Made with love for kids 💛", 150, 545);

    // Little confetti dots
    const dots = [
      ["rgba(167,139,250,.65)", 720, 530],
      ["rgba(147,197,253,.65)", 780, 555],
      ["rgba(134,239,172,.65)", 840, 540],
      ["rgba(253,230,138,.65)", 900, 555]
    ];
    dots.forEach(([col, x, y]) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.fill();
    });

    return c.toDataURL("image/png");
  }

  function renderPage(photoImg, theme, name, age, pageNumber, lines) {
    const W = 1200, H = 800;
    const c = makeCanvas(W, H);
    const ctx = c.getContext("2d");

    // Background
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(1, "rgba(255,255,255,1)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Soft theme border
    const borderG = ctx.createLinearGradient(0, 0, W, 0);
    borderG.addColorStop(0, theme.colors[1]);
    borderG.addColorStop(0.5, theme.colors[2]);
    borderG.addColorStop(1, theme.colors[0]);

    ctx.fillStyle = "rgba(255,255,255,.85)";
    ctx.strokeStyle = "rgba(30,35,70,.10)";
    ctx.lineWidth = 2;
    roundedRect(ctx, 70, 70, W - 140, H - 140, 32);
    ctx.fill();
    ctx.stroke();

    // Gradient strip
    ctx.fillStyle = borderG;
    roundedRect(ctx, 90, 90, W - 180, 14, 999);
    ctx.fill();

    // Header
    ctx.fillStyle = "rgba(25,28,55,.95)";
    ctx.font = "900 28px Nunito, system-ui, Arial";
    const head = `${(theme.titleEN || "My Book").replace("{name}", name)} — Page ${pageNumber}`;
    ctx.fillText(head, 110, 150);

    ctx.font = "800 18px Nunito, system-ui, Arial";
    ctx.fillStyle = "rgba(25,28,55,.70)";
    ctx.fillText(`Featuring: ${name}${age ? " • Age " + age : ""}`, 110, 182);

    // Photo block left
    fitCoverPhoto(ctx, photoImg, 110, 220, 360, 360, 26);

    // Story block right
    ctx.fillStyle = "rgba(255,255,255,.95)";
    ctx.strokeStyle = "rgba(30,35,70,.10)";
    roundedRect(ctx, 510, 220, 580, 360, 26);
    ctx.fill();
    ctx.stroke();

    drawSticker(ctx, 540, 245, "Story", "rgba(255,255,255,.90)");

    ctx.fillStyle = "rgba(25,28,55,.85)";
    ctx.font = "800 20px Nunito, system-ui, Arial";

    const wrapText = (text, x, y, maxW, lineH) => {
      const words = text.split(" ");
      let line = "";
      for (let i = 0; i < words.length; i++) {
        const test = line + words[i] + " ";
        const w = ctx.measureText(test).width;
        if (w > maxW && i > 0) {
          ctx.fillText(line, x, y);
          line = words[i] + " ";
          y += lineH;
        } else {
          line = test;
        }
      }
      ctx.fillText(line, x, y);
      return y + lineH;
    };

    let y = 305;
    lines.forEach((ln) => {
      y = wrapText(ln, 540, y, 520, 28);
      y += 12;
    });

    // Bottom tags
    const tagY = 620;
    drawSticker(ctx, 110, tagY, theme.badge, "rgba(255,255,255,.90)");
    drawSticker(ctx, 280, tagY, `Made for ${name}`, "rgba(255,255,255,.90)");
    drawSticker(ctx, 460, tagY, `Preview pages (demo)`, "rgba(255,255,255,.90)");

    return c.toDataURL("image/png");
  }

  function setFakePageImage(fakePageEl, dataUrl) {
    if (!fakePageEl) return;
    fakePageEl.innerHTML = "";
    const img = document.createElement("img");
    img.src = dataUrl;
    img.alt = "Generated preview";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    img.style.borderRadius = "14px";
    img.style.display = "block";
    fakePageEl.appendChild(img);
  }

  async function generatePreview() {
    const file = kidPhoto?.files?.[0];
    if (!file) {
      alert("Please upload a photo first.");
      return;
    }

    const themeKey = currentThemeKey();
    const theme = THEMES[themeKey] || THEMES["Adventure / Aventura"];

    const name = safeName();
    const age = safeAge();

    // Load image
    const photoImg = await loadImageFromFile(file);

    // Story lines (we’ll show EN + PT mixed, book-like)
    const en = theme.storyEN.map((s) => s.replaceAll("{name}", name));
    const pt = theme.storyPT.map((s) => s.replaceAll("{name}", name));
    const page1Lines = [en[0], "—", pt[0]];
    const page2Lines = [en[1], "—", pt[1]];

    // Generate images
    const coverUrl = renderCover(photoImg, theme, name, age);
    const page1Url = renderPage(photoImg, theme, name, age, 1, page1Lines);
    const page2Url = renderPage(photoImg, theme, name, age, 2, page2Lines);

    // Put cover in AFTER
    afterImg.src = coverUrl;

    // Fill the small cards: Cover / Page1 / Page2
    if (smallCards.length >= 3) {
      setFakePageImage(smallCards[0], coverUrl);
      setFakePageImage(smallCards[1], page1Url);
      setFakePageImage(smallCards[2], page2Url);
    }
  }

  // Upload -> BEFORE
  if (kidPhoto) {
    kidPhoto.addEventListener("change", () => {
      const file = kidPhoto.files && kidPhoto.files[0];
      if (!file) return;

      // cleanup previous
      try {
        if (uploadedObjectUrl) URL.revokeObjectURL(uploadedObjectUrl);
      } catch {}

      uploadedObjectUrl = URL.createObjectURL(file);
      beforeImg.src = uploadedObjectUrl;
      if (beforeText) beforeText.style.display = "none";
    });
  }

  // Generate button
  if (generateBtn) {
    generateBtn.addEventListener("click", () => {
      generatePreview().catch((err) => {
        console.error(err);
        alert("Preview failed. Open Console to see the error.");
      });
    });
  }

  // If theme changes, auto update label (index also does this, but safe)
  if (themeSelect) {
    themeSelect.addEventListener("change", () => {
      const label = document.getElementById("selectedThemeLabel");
      if (label) label.textContent = themeSelect.value;
    });
  }
})();
