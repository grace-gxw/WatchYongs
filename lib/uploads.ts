import "server-only";

import path from "node:path";

// Where uploaded photos and invoice PDFs live on disk.
//
// Locally this defaults to `public/uploads` (unchanged from before). In
// production set UPLOAD_DIR to a folder OUTSIDE the app's build directory:
// hosts like Hostinger replace the whole build folder on every deploy, and
// `next start` only serves `public/` files that existed when the server
// booted, so runtime uploads inside `public/` would 404 or be wiped.
//
// Files are always served at `/uploads/...` (see app/uploads/[...path]/route.ts),
// so the paths already stored in the database keep working wherever the
// folder lives.
export const UPLOAD_ROOT = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(process.cwd(), "public", "uploads");

export function uploadPath(...segments: string[]) {
  return path.join(UPLOAD_ROOT, ...segments);
}

// Resolves a `/uploads/...` URL's segments to a file inside UPLOAD_ROOT, or
// null if the segments try to escape it (e.g. `..`).
export function resolveUploadFile(segments: string[]) {
  const resolved = path.resolve(UPLOAD_ROOT, ...segments);
  if (!resolved.startsWith(UPLOAD_ROOT + path.sep)) return null;
  return resolved;
}
