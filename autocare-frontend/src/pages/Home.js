import { Link } from "react-router-dom";
import heroCar from "../assets/hero-car.jpg";

function Hero() {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: `
          linear-gradient(
            90deg,
            rgba(3, 7, 18, 0.98) 0%,
            rgba(3, 7, 18, 0.88) 45%,
            rgba(3, 7, 18, 0.45) 100%
          ),
          url(${heroCar})
        `,
      }}
    >
      <div className="container">
        <div className="row align-items-center">

          <div className="col-lg-7">

            <div className="hero-badge">
              <span></span>
              Smart Vehicle Care Platform
            </div>

            <h1>
              Take Better
              <br />
              <strong>Care of Your Car.</strong>
            </h1>

            <p>
              Book trusted vehicle services, manage your vehicles,
              track maintenance history and find reliable service
              centers — all from one powerful platform.
            </p>

            <div className="hero-actions">

              <Link
                to="/book-service"
                className="btn btn-primary hero-primary-btn"
              >
                <i className="bi bi-calendar-check me-2"></i>
                Book a Service
              </Link>

              <Link
                to="/services"
                className="btn hero-secondary-btn"
              >
                Explore Services
                <i className="bi bi-arrow-right ms-2"></i>
              </Link>

            </div>

            <div className="hero-trust">

              <div className="trust-item">
                <i className="bi bi-shield-check"></i>

                <div>
                  <strong>Trusted</strong>
                  <small>Service Partners</small>
                </div>
              </div>

              <div className="trust-item">
                <i className="bi bi-clock"></i>

                <div>
                  <strong>Quick</strong>
                  <small>Easy Booking</small>
                </div>
              </div>

              <div className="trust-item">
                <i className="bi bi-stars"></i>

                <div>
                  <strong>Quality</strong>
                  <small>Vehicle Care</small>
                </div>
              </div>

            </div>

          </div>

          <div className="col-lg-5">

            <div className="hero-info-card">

              <div className="info-card-header">
                <span>YOUR VEHICLE</span>

                <i className="bi bi-three-dots"></i>
              </div>

              <div className="vehicle-icon">
                <i className="bi bi-car-front-fill"></i>
              </div>

              <h3>
                Keep Your Car
                <br />
                Running Perfectly.
              </h3>

              <p>
                Stay ahead of maintenance with AutoCare.
              </p>

              <div className="vehicle-status">

                <div>
                  <small>Next Service</small>
                  <strong>Oil Change</strong>
                </div>

                <div className="status-badge">
                  Due Soon
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;