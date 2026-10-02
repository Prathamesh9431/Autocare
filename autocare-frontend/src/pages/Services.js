import { Link } from "react-router-dom";
import "../App.css";

function Services() {
  const services = [
    {
      icon: "bi-droplet-half",
      title: "Oil Change",
      description:
        "Keep your engine running smoothly with a professional engine oil and filter change.",
      price: "Starting from ₹1,499",
    },
    {
      icon: "bi-tools",
      title: "General Service",
      description:
        "Complete routine maintenance to keep your vehicle safe, reliable, and in excellent condition.",
      price: "Starting from ₹2,999",
    },
    {
      icon: "bi-stop-circle",
      title: "Brake Service",
      description:
        "Inspection and maintenance of brake pads, discs, and the complete braking system.",
      price: "Starting from ₹1,999",
    },
    {
      icon: "bi-battery-charging",
      title: "Battery Service",
      description:
        "Battery health inspection, charging, and replacement support for your vehicle.",
      price: "Starting from ₹999",
    },
    {
      icon: "bi-snow2",
      title: "AC Service",
      description:
        "Restore your vehicle's cooling performance with professional AC inspection and servicing.",
      price: "Starting from ₹1,499",
    },
    {
      icon: "bi-search",
      title: "Full Car Inspection",
      description:
        "A comprehensive inspection covering your vehicle's major mechanical and electrical systems.",
      price: "Starting from ₹1,999",
    },
  ];

  return (
    <div className="services-page">
      <div className="container py-5">

        {/* HEADER */}

        <div className="services-header">

          <span className="dashboard-label">
            OUR SERVICES
          </span>

          <h1>Professional Vehicle Care</h1>

          <p>
            From routine maintenance to complete inspections,
            we help keep your vehicle safe, reliable, and road-ready.
          </p>

        </div>


        {/* SERVICES GRID */}

        <div className="row g-4 mt-4">

          {services.map((service, index) => (

            <div
              className="col-lg-4 col-md-6"
              key={index}
            >

              <div className="service-card">

                {/* ICON */}

                <div className="service-icon">
                  <i className={`bi ${service.icon}`}></i>
                </div>


                {/* CONTENT */}

                <div className="service-card-content">

                  <h3>
                    {service.title}
                  </h3>

                  <p>
                    {service.description}
                  </p>

                  <strong className="service-price">
                    {service.price}
                  </strong>

                </div>


                {/* BUTTON */}

                <Link
                  to="/book-service"
                  className="btn service-book-btn"
                >
                  <i className="bi bi-calendar-check me-2"></i>
                  Book Service
                </Link>

              </div>

            </div>

          ))}

        </div>


        {/* BOTTOM CTA */}

        <div className="services-cta mt-5">

          <div>

            <span className="dashboard-label">
              NEED HELP?
            </span>

            <h2>
              Not sure what your vehicle needs?
            </h2>

            <p>
              Book a full vehicle inspection and let our
              professionals identify the right service for you.
            </p>

          </div>

          <Link
            to="/book-service"
            className="btn service-cta-btn"
          >
            Book an Inspection
            <i className="bi bi-arrow-right ms-2"></i>
          </Link>

        </div>

      </div>
    </div>
  );
}

export default Services;