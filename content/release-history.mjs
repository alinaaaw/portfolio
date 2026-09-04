function plainText(value) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_]/g, "")
    .trim();
}

export function parseReleaseHistory(source) {
  const headingPattern = /^## \[([^\]]+)\] - (\d{4}-\d{2}-\d{2})\s*$/gm;
  const headings = [...source.matchAll(headingPattern)].filter((match) => match[1] !== "Unreleased");

  return headings.map((heading, index) => {
    const nextHeading = headings[index + 1];
    const referencesStart = source.indexOf("\n[Unreleased]:", heading.index);
    const end = nextHeading?.index ?? (referencesStart >= 0 ? referencesStart : source.length);
    const body = source.slice((heading.index ?? 0) + heading[0].length, end).trim();
    const lines = body.split(/\r?\n/);
    const titleIndex = lines.findIndex((line) => /^\*\*.+\*\*$/.test(line.trim()));
    const details = {};
    let category = null;

    for (const line of lines) {
      const categoryMatch = line.match(/^###\s+(.+)$/);
      if (categoryMatch) {
        category = plainText(categoryMatch[1]);
        details[category] = [];
        continue;
      }
      const itemMatch = line.match(/^\s*-\s+(.+)$/);
      if (category && itemMatch) details[category].push(plainText(itemMatch[1]));
    }

    const highlights = Object.values(details).flat();
    const title = titleIndex >= 0 ? plainText(lines[titleIndex]) : `Version ${heading[1]}`;
    const summaryLine = lines.slice(Math.max(titleIndex + 1, 0)).find((line) => {
      const value = line.trim();
      return value && !value.startsWith("#") && !value.startsWith("-");
    });
    const summary = plainText(summaryLine?.replace(/^>\s*/, "") ?? "");
    return {
      version: heading[1],
      date: heading[2],
      title,
      summary,
      highlights,
      details,
    };
  });
}
