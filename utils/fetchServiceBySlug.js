export async function fetchServiceBySlug(slug) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/get-service-by-slug?slug=${slug}`
  );

  if (!res.ok) {
    console.error(await res.text());
    throw new Error("Failed to fetch the service");
  }

  const data = await res.json();

  return data;
}
