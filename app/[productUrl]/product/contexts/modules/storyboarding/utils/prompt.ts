function toTitleCase(str: string): string {
  return str
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .trim();
}

function processValue(value: any, level: number): string {
  if (typeof value === "object" && value !== null) {
    return objectToMarkdownPromptRecursive(value, level);
  }
  return String(value);
}

export function objectToMarkdownPromptRecursive(
  obj: Record<string, any>,
  level: number = 1,
): string {
  return Object.entries(obj)
    .map(([key, value]) => {
      const header = "#".repeat(level);
      const titleCaseKey = toTitleCase(key);
      const processedValue = processValue(value, level + 1);

      if (typeof value === "object" && value !== null) {
        return `${header} ${titleCaseKey}\n${processedValue}`;
      }

      return `${header} ${titleCaseKey}\n${processedValue}\n`;
    })
    .join("\n");
}

export function objectToMarkdownPrompt(obj: Record<string, any>): string {
  return objectToMarkdownPromptRecursive(obj);
}
