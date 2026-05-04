// lib/faqExtractor.js

export function extractFAQs(article) {
  const collected = [];
  const seen = new Set();

  // 🔹 1. Manual FAQs (highest priority)
  if (article.faqs && article.faqs.length > 0) {
    article.faqs.forEach((f) => {
      const q = normalize(f.q);

      if (!seen.has(q)) {
        seen.add(q);
        collected.push({
          question: f.q,
          answer: f.a,
        });
      }
    });
  }

  // 🔹 2. Section-based extraction
  article.sections.forEach((section) => {
    if (isQuestion(section.heading)) {
      const firstParagraph = getFirstParagraph(section);

      if (firstParagraph) {
        const q = normalize(section.heading);

        if (!seen.has(q)) {
          seen.add(q);
          collected.push({
            question: section.heading,
            answer: firstParagraph,
          });
        }
      }
    }
  });

  // 🔹 3. Step-based extraction
  article.sections.forEach((section) => {
    if (section.steps) {
      section.steps.forEach((step) => {
        const question = `What is ${step.title}?`;
        const q = normalize(question);

        if (!seen.has(q)) {
          seen.add(q);
          collected.push({
            question,
            answer: extractStepSummary(step),
          });
        }
      });
    }
  });

  return collected.slice(0, 6);
}

//
// HELPERS
//

function normalize(text) {
  return text.toLowerCase().trim();
}

function isQuestion(text) {
  return text.includes("?") || text.toLowerCase().startsWith("what");
}

function getFirstParagraph(section) {
  const p = section.content?.find((c) => c.type === "p");
  return p?.text || null;
}

function extractStepSummary(step) {
  const p = step.content?.find((c) => c.type === "p");
  return p?.text || "This step is part of the process.";
}