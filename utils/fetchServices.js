// utils/fetchServices.js
export async function fetchServices() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/get-services`
  );

  const data = await res.json();
  const services = data.data;

  return services;
}
