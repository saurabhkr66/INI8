import { getAllFiles } from "@/lib/db";

export async function GET() {
  return Response.json(getAllFiles());
}
