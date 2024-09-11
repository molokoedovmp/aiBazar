import { generateReactHelpers } from "@uploadthing/react/hooks";

import type { OurFileRouter } from "@/uploadthing/core";
import { generateUploadButton } from "@uploadthing/react";

export const { uploadFiles } = generateReactHelpers<OurFileRouter>();
export const UploadButton = generateUploadButton<OurFileRouter>();