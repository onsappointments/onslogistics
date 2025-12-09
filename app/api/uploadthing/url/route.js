import { UTApi } from "uploadthing/server";

const utapi = new UTApi({
  apiKey: process.env.UPLOADTHING_SECRET,
  appId: process.env.UPLOADTHING_APP_ID,
});

export async function POST() {
  try {
    const urlData = await utapi.createUploadUrl();

    return Response.json({ url: urlData.url });
  } catch (err) {
    console.error("UploadThing URL error:", err);
    return Response.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}
