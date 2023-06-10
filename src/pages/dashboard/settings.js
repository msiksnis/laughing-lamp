import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { fetchCategories } from "../../../utils/fetchCategories";
import Categories from "@/components/dashboard/Categories";

export default function SettingsPage({ categories }) {
  const { isExpanded } = useSidebarContext();

  return (
    <main
      className={`md:px-10 px-4 pb-20 transition-all duration-300 ${
        isExpanded ? "ml-[16.5rem]" : "md:ml-20"
      }`}
    >
      <div className="mt-8">
        <div className="ml-40">
          <Categories initialCategories={categories} />
        </div>
      </div>
    </main>
  );
}

SettingsPage.layout = DashboardLayout;

export async function getServerSideProps() {
  const { data: categories } = await fetchCategories();

  return {
    props: {
      categories,
    },
  };
}
