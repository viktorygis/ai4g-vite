//ai4g-vite\scripts\generate-technics.js
import fs from "node:fs";
import path from "node:path";

const data = JSON.parse(fs.readFileSync("src/data/technics.json", "utf8"));

const template = fs.readFileSync("src/templates/technic-template.html", "utf8");

function toArray(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value;
  }

  // если в json строка с переносами
  if (typeof value === "string") {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [value];
}

// Экранирование для текстовых полей, которые не должны содержать HTML
function escapeHtml(value) {
  if (value === null || value === undefined) return "";
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

/**
 * Подставляет content в плейсхолдер {{NAME}} внутри секции
 * <!-- SECTION:NAME -->...<!-- /SECTION:NAME -->.
 * Если content пустой (пустая строка/массив/null/undefined) — вся секция
 * целиком удаляется из HTML (включая заголовок и обёртку).
 */
function renderSection(html, name, content) {
  const regex = new RegExp(`<!-- SECTION:${name} -->[\\s\\S]*?<!-- /SECTION:${name} -->`, "g");

  const isEmpty = content === null || content === undefined || content === "" || (Array.isArray(content) && content.length === 0);

  return html.replace(regex, (block) => {
    if (isEmpty) return "";
    // убираем сами маркеры-комментарии, оставляя внутреннюю разметку с подставленным значением
    return block.replace(`<!-- SECTION:${name} -->`, "").replace(`<!-- /SECTION:${name} -->`, "").replaceAll(`{{${name}}}`, content);
  });
}

// Убедимся, что целевая директория для страниц существует
fs.mkdirSync("src/technics", { recursive: true });

// Проверка на отсутствующие/дублирующиеся slug
const seenSlugs = new Set();
for (const item of data) {
  if (!item.slug) {
    throw new Error(`Отсутствует slug у элемента: "${item.subtitle || "без названия"}"`);
  }
  if (seenSlugs.has(item.slug)) {
    throw new Error(`Дублирующийся slug: "${item.slug}"`);
  }
  seenSlugs.add(item.slug);
}

for (const item of data) {
  let html = template;

  // {{TITLE}} встречается и вне условных секций (breadcrumbs, <h1>, <title>),
  // поэтому подставляем его отдельно, всегда
  html = html.replaceAll("{{TITLE}}", escapeHtml(item.subtitle));
  html = html.replaceAll("{{IMAGE}}", escapeHtml(item.image));
  // Условные секции: если данных нет — блок целиком убирается из HTML
  html = renderSection(html, "DESCRIPTION", escapeHtml(item.description));
  html = renderSection(html, "CATEGORY", escapeHtml(item.category));
  html = renderSection(html, "TIME", escapeHtml(item.time));
  html = renderSection(html, "WHY", item.why || "");
  html = renderSection(html, "HOWWORKS", item.howWorks || "");

  // алгоритм
  const steps = toArray(item.steps)
    .map((step) => {
      if (typeof step === "string") {
        return `<li>${step}</li>`;
      }

      return `
<li>
<p>${step.text || ""}</p>

${
  step.example
    ? `
<p>
<span class="example">Пример:</span>
${step.example}
</p>
`
    : ""
}

</li>
`;
    })
    .join("");

  html = renderSection(html, "STEPS", steps);

  // дополнительные упражнения
  const extra = toArray(item.extraExercises)
    .map((x) => `<li>${x}</li>`)
    .join("");
  html = renderSection(html, "EXTRA", extra);

  // литература
  const literature = toArray(item.literature)
    .map((x) => `<li>${x}</li>`)
    .join("");
  html = renderSection(html, "LITERATURE", literature);

  // чтение
  const reading = toArray(item.recommendedReading)
    .map((x) => `<li>${x}</li>`)
    .join("");
  html = renderSection(html, "READING", reading);

 // теги
  const tags = toArray(item.hashtags)
    .map((x) => {
      const clean = String(x).trim().toLowerCase().replaceAll(/\s+/g, "-");
      return `<a href="#" class="technics__tag">#${escapeHtml(clean)}</a>`;
    })
    .join("");
  html = renderSection(html, "TAGS", tags);

  const file = path.join("src/technics", `${item.slug}.html`);

  fs.writeFileSync(file, html, "utf8");
}

// ============================================================
// Облегчённый JSON для каталога техник (technics-page.js)
// ============================================================
const cardsData = data.map((item) => ({
  slug: item.slug,
  tag: item.tag || "",
  time: item.time || 0,
  image: item.image || "",
  subtitle: item.subtitle || "",
  description: item.description || "",
  category: item.category || "",
}));

fs.mkdirSync("public/data", { recursive: true });
fs.writeFileSync("public/data/technics-cards.json", JSON.stringify(cardsData), "utf8");

console.log(`Создано страниц: ${data.length}`);
console.log(`Создан облегчённый каталог: public/data/technics-cards.json`);
