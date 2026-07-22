//ai4g-vite\src\scripts\generate-technics.js
import fs from "node:fs";

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

for (const item of data) {
  let html = template;

  html = html
    .replaceAll("{{TITLE}}", item.subtitle || "")
    .replaceAll("{{DESCRIPTION}}", item.description || "")
    .replaceAll("{{IMAGE}}", item.image || "")
    .replaceAll("{{CATEGORY}}", item.category || "")
    .replaceAll("{{TIME}}", item.time || "")
    .replaceAll("{{WHY}}", item.why || "")
    .replaceAll("{{HOWWORKS}}", item.howWorks || "");

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

  html = html.replace("{{STEPS}}", steps);

  // дополнительные упражнения
  html = html.replace(
    "{{EXTRA}}",
    toArray(item.extraExercises)
      .map((x) => `<li>${x}</li>`)
      .join(""),
  );

  // литература
  html = html.replace(
    "{{LITERATURE}}",
    toArray(item.literature)
      .map((x) => `<li>${x}</li>`)
      .join(""),
  );

  // чтение
  html = html.replace(
    "{{READING}}",
    toArray(item.recommendedReading)
      .map((x) => `<li>${x}</li>`)
      .join(""),
  );

  // теги
  html = html.replace(
    "{{TAGS}}",
    toArray(item.hashtags)
      .map((x) => `<a href="">#${x}</a>`)
      .join(""),
  );

  const file = `src/technics/${item.slug}.html`;

  fs.writeFileSync(file, html, "utf8");
}

console.log(`Создано страниц: ${data.length}`);
