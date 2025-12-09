import { getFile, deleteFile } from "@/lib/db";
import fs from "fs";
import path from "path";

// GET -> Download file
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;   // ✅ FIX
  const fileId = Number(id);

  const file = getFile(fileId);
  if (!file) return new Response("Not found", { status: 404 });

  const filePath = path.join(process.cwd(), "uploads", file.filename);

  if (!fs.existsSync(filePath)) {
    return new Response("File missing", { status: 404 });
  }

  const pdf = fs.readFileSync(filePath);
  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${file.original_name}"`
    }
  });
}

// DELETE -> Delete file
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;   // ✅ FIX
  const fileId = Number(id);

  const file = getFile(fileId);
  if (!file) return Response.json({ error: "Not found" }, { status: 404 });

  const filePath = path.join(process.cwd(), "uploads", file.filename);

  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  deleteFile(fileId);

  return Response.json({ success: true });
}
