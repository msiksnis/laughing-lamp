export async function fetchLashes() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/get-lashes`
    );

    if (!res.ok) {
      console.error(await res.text());
      throw new Error("Failed to fetch services");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Fetch services error:", error);
    return { success: false, data: [] };
  }
}
