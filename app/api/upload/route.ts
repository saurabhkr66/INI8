import { insertFile } from "@/lib/db";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) return Response.json({ error: "No file uploaded" }, { status: 400 });
  if (file.type !== "application/pdf")
    return Response.json({ error: "Only PDF files allowed" }, { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

  const uniqueName = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;

  fs.writeFileSync(path.join(uploadsDir, uniqueName), buffer);

  const id = insertFile(uniqueName, file.name, buffer.length);

  return Response.json({ id, filename: uniqueName });
}
