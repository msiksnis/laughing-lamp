import { useEffect, useState } from "react";

function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/get-services");
      const data = await res.json();
      setServices(data.data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-xl m-10">Our Services</h1>
      {services.map((service) => (
        <div className="ml-10 mb-4" key={service._id}>
          <h2>{service.title}</h2>
          <p>{service.description}</p>
          <p>Price: {service.price}</p>
        </div>
      ))}
    </div>
  );
}

export default Services;
