//ai4g-vite\src\scripts\generate-technics.js
import fs from "node:fs";
import path from "node:path";

const data = JSON.parse(fs.readFileSync("src/data/technics.json", "utf8"));

const template = fs.readFileSync("src/templates/technic-template.html", "utf8");

function toArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

for (const item of data) {
  let html = template;

  html = html
    .replaceAll("{{TITLE}}", item.subtitle)
    .replaceAll("{{DESCRIPTION}}", item.description)
    .replaceAll("{{IMAGE}}", item.image)
    .replaceAll("{{CATEGORY}}", item.category)
    .replaceAll("{{TIME}}", item.time)
    .replaceAll("{{WHY}}", item.why)
    .replaceAll("{{HOWWORKS}}", item.howWorks);

  const steps = toArray(item.steps)
  .map((step) => {
      return `
<li>

<p>
${step.text}
</p>

${
  step.example
    ? `
<div class="example">
<strong>Пример:</strong>
<p>${step.example}</p>
</div>
`
    : ""
}

</li>
`;
    })
    .join("");

  html = html.replace("{{STEPS}}", steps);

  html = html.replace(
    "{{EXTRA}}",
    toArray(item.extraExercises)
      .map((x) => `<li>${x}</li>`)
      .join(""),
  );

  html = html.replace(
    "{{LITERATURE}}",
    toArray(item.literature)
      .map((x) => `<li>${x}</li>`)
      .join(""),
  );

  html = html.replace(
    "{{READING}}",
    toArray(item.recommendedReading)
      .map((x) => `<li>${x}</li>`)
      .join(""),
  );

  html = html.replace(
    "{{TAGS}}",
    toArray(item.hashtags)
      .map((x) => `#${x}`)
      .join(" "),
  );

  const file = `src/technics/${item.slug}.html`;

  fs.writeFileSync(file, html);
}

console.log(`Создано страниц: ${data.length}`);
