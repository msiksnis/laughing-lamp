export async function fetchServices() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/get-services`
  );

  if (!res.ok) {
    console.error(await res.text());
    throw new Error("Failed to fetch services");
  }

  const data = await res.json();

  console.log("Fetched services:", data);

  return data;
}
