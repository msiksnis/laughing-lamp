export async function fetchCategories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/get-categories`
    );

    if (!res.ok) {
      console.error(await res.text());
      throw new Error("Failed to fetch categories");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Fetch categories error:", error);
    return { success: false, data: [] };
  }
}
