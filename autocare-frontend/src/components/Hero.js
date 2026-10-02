import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">

      <div className="container">

        <div className="row align-items-center">

          {/* Left Content */}

          <div className="col-lg-6">

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
              Book services, manage your vehicles,
              track maintenance history and find
              trusted service centers — all in one place.
            </p>

            <div className="hero-actions">

              <Link
                to="/book-service"
                className="btn btn-primary hero-primary-btn"
              >
                Book a Service
                <i className="bi bi-arrow-up-right ms-2"></i>
              </Link>

              <Link
                to="/services"
                className="btn hero-secondary-btn"
              >
                Explore Services
              </Link>

            </div>

            {/* Trust */}

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


          {/* Right Visual */}

          <div className="col-lg-6">

            <div className="hero-visual">

              <div className="car-placeholder">

                <i className="bi bi-car-front-fill"></i>

                <span>
                  Your Car
                </span>

              </div>


              {/* Floating Card */}

              <div className="floating-card service-status">

                <div className="status-icon">
                  <i className="bi bi-check-lg"></i>
                </div>

                <div>
                  <small>
                    Next Service
                  </small>

                  <strong>
                    Oil Change
                  </strong>
                </div>

              </div>


              {/* Floating Card */}

              <div className="floating-card service-date">

                <i className="bi bi-calendar3"></i>

                <div>
                  <small>
                    Service Due
                  </small>

                  <strong>
                    25 July 2026
                  </strong>
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