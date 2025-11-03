# PDF to HTML Conversion Guide

This application uses **pdf2htmlEX** CLI to convert PDF files to HTML format.

## Installation

The Docker containers automatically install `pdf2htmlex` during the build process. No additional setup is required.

## API Endpoints

### 1. Basic PDF Conversion

**Endpoint:** `POST /pdf/convert`

Convert a PDF file to HTML with default options.

**Request:**
```bash
curl -X POST http://localhost:50001/pdf/convert \
  -F "file=@path/to/your/file.pdf"
```

**Response:**
```json
{
  "success": true,
  "message": "PDF converted successfully",
  "htmlPath": "/app/output/1699000000000-output.html",
  "htmlContent": "<html>...</html>"
}
```

### 2. PDF Conversion with Custom Options

**Endpoint:** `POST /pdf/convert-with-options`

Convert a PDF with custom pdf2htmlEX options.

**Request:**
```bash
curl -X POST http://localhost:50001/pdf/convert-with-options \
  -F "file=@path/to/your/file.pdf" \
  -F 'options={"zoom": "1.5", "fit-width": true}'
```

**Response:**
```json
{
  "success": true,
  "message": "PDF converted successfully",
  "htmlPath": "/app/output/1699000000000-output.html",
  "htmlContent": "<html>...</html>"
}
```

## Available pdf2htmlEX Options

Common options you can use:

- `zoom` (float): Zoom level (default: 1.0)
  - Example: `"zoom": "1.5"`

- `fit-width` (boolean): Fit page width to container
  - Example: `"fit-width": true`

- `fit-height` (boolean): Fit page height to container
  - Example: `"fit-height": true`

- `split-pages` (boolean): Split each page into a separate HTML file
  - Example: `"split-pages": true`

- `page-numbers` (string): Specify which pages to convert
  - Example: `"page-numbers": "1,3,5-10"`

- `embed-image` (boolean): Embed images in the HTML
  - Example: `"embed-image": true`

- `embed-font` (boolean): Embed fonts in the HTML
  - Example: `"embed-font": true`

- `embed-css` (boolean): Embed CSS in the HTML
  - Example: `"embed-css": true`

## Usage Examples

### Example 1: Basic Conversion

```bash
curl -X POST http://localhost:50001/pdf/convert \
  -F "file=@document.pdf"
```

### Example 2: High Zoom Conversion

```bash
curl -X POST http://localhost:50001/pdf/convert-with-options \
  -F "file=@document.pdf" \
  -F 'options={"zoom": "2.0"}'
```

### Example 3: Fit Width with Embedded Resources

```bash
curl -X POST http://localhost:50001/pdf/convert-with-options \
  -F "file=@document.pdf" \
  -F 'options={"fit-width": true, "embed-image": true, "embed-font": true}'
```

### Example 4: Specific Pages Only

```bash
curl -X POST http://localhost:50001/pdf/convert-with-options \
  -F "file=@document.pdf" \
  -F 'options={"page-numbers": "1-5"}'
```

## File Locations

- **Uploads:** `/app/uploads/` - Temporary storage for uploaded PDFs
- **Output:** `/app/output/` - Generated HTML files

## Docker Compose

### Development (with hot reload)

```bash
docker-compose -f docker-compose-dev.yml up
```

### Production

```bash
docker-compose -f docker-compose-prod.yml up
```

## Health Check

The application provides a health check endpoint:

```bash
curl http://localhost:50001/is-alive
```

Response:
```json
{
  "status": "alive and kicking",
  "timestamp": "2024-11-03T12:00:00.000Z"
}
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200 OK` - Conversion successful
- `400 Bad Request` - Missing or invalid file
- `500 Internal Server Error` - Conversion failed

Error response example:
```json
{
  "error": "Conversion failed",
  "details": "Input PDF file not found: /app/uploads/file.pdf"
}
```

## Troubleshooting

### Issue: "pdf2htmlEX command not found"

**Solution:** Ensure the Docker image is rebuilt:
```bash
docker-compose -f docker-compose-dev.yml up --build
```

### Issue: "Permission denied" errors

**Solution:** Check file permissions in the `/app/uploads` and `/app/output` directories.

### Issue: Conversion takes too long

**Solution:** Try reducing the zoom level or limiting the page range:
```bash
-F 'options={"zoom": "0.8", "page-numbers": "1-10"}'
```

## Service Architecture

```
Request → Router (/pdf) → Controller → Service → pdf2htmlEX CLI
                                           ↓
                                      execSync
                                           ↓
                                      HTML Output
```

- **Router:** Handles HTTP routing
- **Controller:** Manages request/response and file handling
- **Service:** Executes pdf2htmlEX CLI with options
- **CLI:** Performs actual PDF to HTML conversion
