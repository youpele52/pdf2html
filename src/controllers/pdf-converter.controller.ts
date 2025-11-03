import type { Context } from "hono";
import { convertPdfToHtml, convertPdfToHtmlWithOptions } from "../services/pdf-converter.service";
import path from "node:path";
import { unlinkSync } from "node:fs";

/**
 * Handles PDF to HTML conversion requests
 * Expects a multipart form with a 'file' field containing the PDF
 * Returns the HTML file as a downloadable attachment
 */
export async function convertPdfController(c: Context) {
  try {
    const body = await c.req.formData();
    const file = body.get("file");

    if (!file || !(file instanceof File)) {
      return c.json({ error: "No PDF file provided" }, 400);
    }

    // Save uploaded file temporarily
    const uploadDir = "/app/uploads";
    const timestamp = Date.now();
    const inputPath = path.join(uploadDir, `${timestamp}-${file.name}`);
    const outputPath = path.join("/app/output", `${timestamp}-output`);

    // Write file to disk
    const buffer = await file.arrayBuffer();
    await Bun.write(inputPath, buffer);

    // Convert PDF to HTML
    const htmlPath: string = await convertPdfToHtml(inputPath, outputPath);

    // Read the generated HTML
    const htmlContent = await Bun.file(htmlPath).text();

    // Generate filename for download
    const originalName = file.name.replace(/\.pdf$/i, "");
    const downloadFilename = `${originalName}.html`;

    // Clean up temporary files
    try {
      unlinkSync(inputPath);
      unlinkSync(htmlPath);
    } catch {
      // Ignore cleanup errors
    }

    // Return HTML as downloadable file
    return c.html(htmlContent, {
      headers: {
        "Content-Disposition": `attachment; filename="${downloadFilename}"`,
      },
    });
  } catch (error) {
    return c.json(
      {
        error: "Conversion failed",
        details: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
}

/**
 * Handles PDF to HTML conversion with custom options
 * Expects a multipart form with 'file' and optional 'options' JSON field
 * Returns the HTML file as a downloadable attachment
 */
export async function convertPdfWithOptionsController(c: Context) {
  try {
    const body = await c.req.formData();
    const file = body.get("file");
    const optionsStr = body.get("options");

    if (!file || !(file instanceof File)) {
      return c.json({ error: "No PDF file provided" }, 400);
    }

    // Parse options if provided
    let options: Record<string, string | number | boolean> = {};
    if (optionsStr && typeof optionsStr === "string") {
      try {
        options = JSON.parse(optionsStr);
      } catch {
        return c.json({ error: "Invalid options JSON" }, 400);
      }
    }

    // Save uploaded file temporarily
    const uploadDir = "/app/uploads";
    const timestamp = Date.now();
    const inputPath = path.join(uploadDir, `${timestamp}-${file.name}`);
    const outputPath = path.join("/app/output", `${timestamp}-output`);

    // Write file to disk
    const buffer = await file.arrayBuffer();
    await Bun.write(inputPath, buffer);

    // Convert PDF to HTML with options
    const htmlPath: string = await convertPdfToHtmlWithOptions(inputPath, outputPath, options);

    // Read the generated HTML
    const htmlContent = await Bun.file(htmlPath).text();

    // Generate filename for download
    const originalName = file.name.replace(/\.pdf$/i, "");
    const downloadFilename = `${originalName}.html`;

    // Clean up temporary files
    try {
      unlinkSync(inputPath);
      unlinkSync(htmlPath);
    } catch {
      // Ignore cleanup errors
    }

    // Return HTML as downloadable file
    return c.html(htmlContent, {
      headers: {
        "Content-Disposition": `attachment; filename="${downloadFilename}"`,
      },
    });
  } catch (error) {
    return c.json(
      {
        error: "Conversion failed",
        details: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
}
