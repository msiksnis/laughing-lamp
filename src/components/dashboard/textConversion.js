export function endpointForCategory(category) {
  const endpointMap = {
    "skin-care": "skinCare",
    // add other categories as needed
  };

  return endpointMap[category] || category;
}
