//ai4g-vite\src\scripts\generate-technics.js

import fs from "fs";
import path from "path";

const data = JSON.parse(
  fs.readFileSync("./src/data/technics.json", "utf8")
);

const template = fs.readFileSync(
  "./src/templates/technic-template.html",
  "utf8"
);


const outputDir = "./src/technics";


if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}


data.forEach((technic) => {

  const html = template.replace(
    "<title>Техника</title>",
    `<title>${technic.subtitle}</title>`
  );


  fs.writeFileSync(
    `${outputDir}/${technic.slug}.html`,
    html
  );

});


console.log(
  `Создано страниц: ${data.length}`
);