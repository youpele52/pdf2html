import { existsSync, unlinkSync, writeFileSync, readFileSync } from "node:fs";
import pdfParse from "pdf-parse";

/**
 * Converts a PDF file to HTML using pdf-parse library
 * @param inputPath - Path to the input PDF file
 * @param outputPath - Path where the HTML output will be saved
 * @returns The path to the generated HTML file
 */
export async function convertPdfToHtml(
  inputPath: string,
  outputPath: string
): Promise<string> {
  // Validate input file exists
  if (!existsSync(inputPath)) {
    throw new Error(`Input PDF file not found: ${inputPath}`);
  }

  const htmlFile = `${outputPath}.html`;

  try {
    // Read PDF file
    const pdfBuffer = readFileSync(inputPath);

    // Parse PDF
    const data = await pdfParse(pdfBuffer);

    // Generate HTML
    let htmlContent = `
<html>
  <head>
    <meta charset="utf-8">
    <title>PDF Document</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; }
      .page { margin: 20px 0; border: 1px solid #ccc; padding: 15px; }
      .page-number { color: #666; font-size: 12px; margin-bottom: 10px; }
      pre { white-space: pre-wrap; word-wrap: break-word; }
    </style>
  </head>
  <body>
    <h1>PDF Document</h1>
    <p>Pages: ${data.numpages}</p>
`;

    // Add text content from each page
    if (data.text) {
      const pages = data.text.split("\f"); // Form feed character separates pages
      pages.forEach((pageText, index) => {
        if (pageText.trim()) {
          htmlContent += `
    <div class="page">
      <div class="page-number">Page ${index + 1}</div>
      <pre>${pageText}</pre>
    </div>
`;
        }
      });
    }

    htmlContent += `
  </body>
</html>
`;

    // Write HTML file
    writeFileSync(htmlFile, htmlContent, "utf-8");

    return htmlFile;
  } catch (error) {
    // Clean up any partial output
    if (existsSync(htmlFile)) {
      unlinkSync(htmlFile);
    }

    throw new Error(
      `PDF conversion failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Converts a PDF file to HTML with custom options
 * @param inputPath - Path to the input PDF file
 * @param outputPath - Path where the HTML output will be saved
 * @param options - Additional conversion options (include_metadata, etc.)
 * @returns The path to the generated HTML file
 */
export async function convertPdfToHtmlWithOptions(
  inputPath: string,
  outputPath: string,
  options: Record<string, string | number | boolean> = {}
): Promise<string> {
  if (!existsSync(inputPath)) {
    throw new Error(`Input PDF file not found: ${inputPath}`);
  }

  const htmlFile = `${outputPath}.html`;
  const includeMetadata = options.include_metadata === true;

  try {
    // Read PDF file
    const pdfBuffer = readFileSync(inputPath);

    // Parse PDF
    const data = await pdfParse(pdfBuffer);

    // Generate HTML with options
    let htmlContent = `
<html>
  <head>
    <meta charset="utf-8">
    <title>PDF Document</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; }
      .metadata { background: #f5f5f5; padding: 10px; margin-bottom: 20px; border-radius: 5px; }
      .page { margin: 20px 0; border: 1px solid #ccc; padding: 15px; }
      .page-number { color: #666; font-size: 12px; margin-bottom: 10px; }
      pre { white-space: pre-wrap; word-wrap: break-word; }
    </style>
  </head>
  <body>
    <h1>PDF Document</h1>
`;

    // Add metadata if requested
    if (includeMetadata && data.info) {
      htmlContent += `
    <div class="metadata">
      <h2>Document Info</h2>
      <p><strong>Pages:</strong> ${data.numpages}</p>
      <p><strong>Title:</strong> ${data.info.Title || "N/A"}</p>
      <p><strong>Author:</strong> ${data.info.Author || "N/A"}</p>
      <p><strong>Subject:</strong> ${data.info.Subject || "N/A"}</p>
    </div>
`;
    } else {
      htmlContent += `<p>Pages: ${data.numpages}</p>`;
    }

    // Add text content from each page
    if (data.text) {
      const pages = data.text.split("\f"); // Form feed character separates pages
      pages.forEach((pageText: string, index: number) => {
        if (pageText.trim()) {
          htmlContent += `
    <div class="page">
      <div class="page-number">Page ${index + 1}</div>
      <pre>${pageText}</pre>
    </div>
`;
        }
      });
    }

    htmlContent += `
  </body>
</html>
`;

    // Write HTML file
    writeFileSync(htmlFile, htmlContent, "utf-8");

    return htmlFile;
  } catch (error) {
    if (existsSync(htmlFile)) {
      unlinkSync(htmlFile);
    }

    throw new Error(
      `PDF conversion failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
