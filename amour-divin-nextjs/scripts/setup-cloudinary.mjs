import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const folders = [
  "eglise-amour-divin",
  "eglise-amour-divin/profiles",
  "eglise-amour-divin/support",
];

for (const folder of folders) {
  try {
    await cloudinary.api.create_folder(folder);
    console.log(`Created or verified: ${folder}`);
  } catch (error) {
    const status = error?.http_code;
    const message = error?.error?.message || error?.message || "Unknown Cloudinary error";
    if (status === 400 && /already exists/i.test(message)) {
      console.log(`Already exists: ${folder}`);
    } else {
      throw new Error(`${folder}: ${message}`);
    }
  }
}

try {
  await cloudinary.api.create_upload_preset({
    name: "eglise_amour_divin_profiles_signed",
    unsigned: false,
    folder: "eglise-amour-divin/profiles",
    allowed_formats: "jpg,png,webp",
    unique_filename: true,
    overwrite: false,
    moderation: "manual",
  });
  console.log("Created upload preset: eglise_amour_divin_profiles_signed");
} catch (error) {
  const message = error?.error?.message || error?.message || "Unknown Cloudinary error";
  if (/already exists|name has already been taken/i.test(message)) {
    console.log("Already exists: eglise_amour_divin_profiles_signed");
  } else {
    throw new Error(`Upload preset: ${message}`);
  }
}
