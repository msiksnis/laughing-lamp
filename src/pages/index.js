import { fetchCategories } from "../../utils/fetchCategories";

export default function HomePage({ categories }) {
  return (
    <main className="">
      <h1 className="text-xl m-10">All Categories</h1>
      {categories.map((category) => (
        <div key={category._id} className="ml-10 mb-2">
          <h2>{category.categoryName}</h2>
        </div>
      ))}
    </main>
  );
}

export async function getStaticProps() {
  const { data: categories } = await fetchCategories();

  return {
    props: {
      categories,
    },
    revalidate: 10,
  };
}
