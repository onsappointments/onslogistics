import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  logisticsDocuments: f({
    pdf: { maxFileSize: "32MB" },
    image: { maxFileSize: "32MB" },
  }),
};

export const fileUploader = f({ any: {} });
