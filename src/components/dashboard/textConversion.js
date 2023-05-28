export function endpointForCategory(category) {
  const endpointMap = {
    "skin-care": "skinCare",
    // add other categories as needed
  };

  return endpointMap[category] || category;
}

export function convertCategoryTitle(str) {
  return str
    .replace(/-/g, " ")
    .replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
}
