export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  // 👇 IMPORTANT: use YOUR actual preset name
  formData.append("upload_preset", "wanderlog_unsigned");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dpae4tamg/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const data = await res.json();
  return data.secure_url;
};
