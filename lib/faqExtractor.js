// lib/faqExtractor.js

export function extractFAQs(article) {
  const collected = [];
  const seen = new Set();

  // 1. Manual FAQs
  if (Array.isArray(article?.faqs)) {
    article.faqs.forEach((f) => {
      const question = f.question ?? f.q;
      const answer = f.answer ?? f.a;

      if (!question || !answer) return;

      const key = normalize(question);

      if (!seen.has(key)) {
        seen.add(key);

        collected.push({
          question,
          answer,
        });
      }
    });
  }

  // 2. Section-based FAQs
  article.sections?.forEach((section) => {
    if (!section?.heading) return;

    if (isQuestion(section.heading)) {
      const firstParagraph = getFirstParagraph(section);

      if (!firstParagraph) return;

      const key = normalize(section.heading);

      if (!seen.has(key)) {
        seen.add(key);

        collected.push({
          question: section.heading,
          answer: firstParagraph,
        });
      }
    }
  });

  // 3. Step-based FAQs
  article.sections?.forEach((section) => {
    section.steps?.forEach((step) => {
      if (!step?.title) return;

      const question = `What is ${step.title}?`;
      const key = normalize(question);

      if (!seen.has(key)) {
        seen.add(key);

        collected.push({
          question,
          answer: extractStepSummary(step),
        });
      }
    });
  });

  return collected.slice(0, 6);
}

// Helpers

function normalize(text = "") {
  return String(text).toLowerCase().trim();
}

function isQuestion(text = "") {
  const value = String(text).toLowerCase();
  return value.includes("?") || value.startsWith("what");
}

function getFirstParagraph(section) {
  const p = section.content?.find((c) => c.type === "p");
  return p?.text || null;
}

function extractStepSummary(step) {
  const p = step.content?.find((c) => c.type === "p");
  return p?.text || "This step is part of the process.";
}