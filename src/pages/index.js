import { fetchServices } from "../../utils/fetchServices";

export default function HomePage({ services }) {
  return (
    <main className="">
      <h1 className="text-xl m-10">Our Services</h1>
      {services.map((service) => (
        <div key={service._id} className="ml-10 mb-2">
          <h2>{service.title}</h2>
        </div>
      ))}
    </main>
  );
}

export async function getStaticProps() {
  const { data: services } = await fetchServices();
  console.log("Services from getStaticProps:", services);

  return {
    props: {
      services,
    },
    revalidate: 10,
  };
}
