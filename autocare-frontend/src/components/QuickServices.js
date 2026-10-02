import { Link } from "react-router-dom";

function QuickServices() {

  const services = [
    {
      icon: "bi-droplet-half",
      name: "Oil Change",
      description: "Engine oil & filter"
    },
    {
      icon: "bi-tools",
      name: "General Service",
      description: "Complete inspection"
    },
    {
      icon: "bi-disc",
      name: "Brake Service",
      description: "Brake inspection"
    },
    {
      icon: "bi-wind",
      name: "AC Service",
      description: "Cooling system"
    },
    {
      icon: "bi-battery-charging",
      name: "Battery",
      description: "Battery replacement"
    },
    {
      icon: "bi-stars",
      name: "Car Wash",
      description: "Exterior cleaning"
    }
  ];

  return (
    <section className="quick-services">

      <div className="container">

        <div className="section-header">

          <div>
            <span>
              QUICK SERVICES
            </span>

            <h2>
              What does your car need?
            </h2>
          </div>

          <Link
            to="/services"
            className="view-all"
          >
            View All Services
            <i className="bi bi-arrow-right"></i>
          </Link>

        </div>


        <div className="row g-3">

          {services.map((service) => (

            <div
              className="col-6 col-md-4 col-lg-2"
              key={service.name}
            >

              <Link
                to="/book-service"
                className="quick-service-card"
              >

                <div className="quick-icon">
                  <i className={`bi ${service.icon}`}></i>
                </div>

                <h6>
                  {service.name}
                </h6>

                <small>
                  {service.description}
                </small>

              </Link>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default QuickServices;