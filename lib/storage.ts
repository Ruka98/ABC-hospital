export function getReportFileUrl(image_filename: string | null | undefined): string | null {
  if (!image_filename) return null

  const bucket = process.env.NEXT_PUBLIC_SUPABASE_REPORTS_BUCKET || process.env.SUPABASE_REPORTS_BUCKET
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL

  // If Supabase storage is configured, reports are stored as object keys (e.g. patient_1/1700_xray.png)
  if (bucket && url && image_filename.includes("/")) {
    return `${url}/storage/v1/object/public/${bucket}/${image_filename}`
  }

  // Fallback: local dev uploads folder
  return `/uploads/${image_filename}`
}
