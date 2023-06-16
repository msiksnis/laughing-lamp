export async function fetchGiftCards() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/get-giftCard`
  );

  if (!res.ok) {
    console.error(await res.text());
    throw new Error("Failed to fetch gift cards");
  }

  const data = await res.json();

  return data;
}
