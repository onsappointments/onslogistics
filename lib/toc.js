// lib/toc.js

export function generateTOC(article) {
  const toc = [];

  article.sections.forEach((section) => {
    // H2
    toc.push({
      id: slugify(section.heading),
      text: section.heading,
      level: 2,
    });

    // Steps → H3
    if (section.steps) {
      section.steps.forEach((step) => {
        toc.push({
          id: slugify(step.title),
          text: step.title,
          level: 3,
        });
      });
    }
  });

  return toc;
}

// helper
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-");
}