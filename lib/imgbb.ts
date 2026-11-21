// Uploads an image file to ImgBB and returns the image url
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
    { method: "POST", body: formData },
  );
  const data = await res.json();

  if (!data.success) throw new Error("Image upload failed");
  return data.data.url as string;
}
