// lib/toc.js

export function generateTOC(article) {
  const toc = [];

  if (!article?.sections || !Array.isArray(article.sections)) {
    return toc;
  }

  article.sections.forEach((section, sectionIndex) => {
    // Skip invalid sections
    if (!section?.heading) {
      console.warn(
        `[TOC] Missing section.heading in article "${article?.slug}" at section ${sectionIndex}`,
        section
      );
      return;
    }

    // H2
    toc.push({
      id: slugify(section.heading),
      text: section.heading,
      level: 2,
    });

    // H3 Steps
    if (Array.isArray(section.steps)) {
      section.steps.forEach((step, stepIndex) => {
        if (!step?.title) {
          console.warn(
            `[TOC] Missing step.title in article "${article?.slug}" at section ${sectionIndex}, step ${stepIndex}`,
            step
          );
          return;
        }

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

// Helper
function slugify(text = "") {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-");
}