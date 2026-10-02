import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard({ vehicles, bookings }) {
  console.log("DASHBOARD VEHICLES:", vehicles);

  // ========================================
  // DASHBOARD STATISTICS
  // ========================================
  const navigate = useNavigate();

  useEffect(() => {

  const user = localStorage.getItem("user");

  if (!user) {
    navigate("/login");
  }

}, [navigate]);
  const totalVehicles = vehicles.length;

  const upcomingBookings = bookings.filter(
    (booking) => booking.status === "Upcoming"
  );

  const completedBookings = bookings.filter(
    (booking) => booking.status === "Completed"
  );

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "Cancelled"
  );


  return (
    <div className="dashboard-page">

      <div className="container py-5">

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="dashboard-header">

          <div>

            <span className="dashboard-label">
              MY DASHBOARD
            </span>

            <h1>
              Welcome Back!
            </h1>

            <p>
              Manage your vehicles and keep track of all your
              service appointments in one place.
            </p>

          </div>

          <Link
            to="/book-service"
            className="btn dashboard-book-btn"
          >
            <i className="bi bi-calendar-check me-2"></i>
            Book a Service
          </Link>

        </div>


        {/* ========================================
            STATISTICS
        ======================================== */}

        <div className="row g-4 mt-4">

          {/* TOTAL VEHICLES */}

          <div className="col-lg-3 col-md-6">

            <div className="dashboard-stat-card">

              <div className="dashboard-stat-icon">
                <i className="bi bi-car-front-fill"></i>
              </div>

              <div>

                <span>
                  TOTAL VEHICLES
                </span>

                <h2>
                  {totalVehicles}
                </h2>

              </div>

            </div>

          </div>


          {/* UPCOMING SERVICES */}

          <div className="col-lg-3 col-md-6">

            <div className="dashboard-stat-card">

              <div className="dashboard-stat-icon">
                <i className="bi bi-calendar-event"></i>
              </div>

              <div>

                <span>
                  UPCOMING SERVICES
                </span>

                <h2>
                  {upcomingBookings.length}
                </h2>

              </div>

            </div>

          </div>


          {/* COMPLETED SERVICES */}

          <div className="col-lg-3 col-md-6">

            <div className="dashboard-stat-card">

              <div className="dashboard-stat-icon">
                <i className="bi bi-check-circle"></i>
              </div>

              <div>

                <span>
                  COMPLETED SERVICES
                </span>

                <h2>
                  {completedBookings.length}
                </h2>

              </div>

            </div>

          </div>


          {/* CANCELLED SERVICES */}

          <div className="col-lg-3 col-md-6">

            <div className="dashboard-stat-card">

              <div className="dashboard-stat-icon">
                <i className="bi bi-x-circle"></i>
              </div>

              <div>

                <span>
                  CANCELLED SERVICES
                </span>

                <h2>
                  {cancelledBookings.length}
                </h2>

              </div>

            </div>

          </div>

        </div>


        {/* ========================================
            MAIN CONTENT
        ======================================== */}

        <div className="row g-4 mt-2">


          {/* ========================================
              MY VEHICLES
          ======================================== */}

          <div className="col-lg-7">

            <div className="dashboard-card">

              <div className="dashboard-card-header">

                <div>

                  <span className="dashboard-label">
                    YOUR GARAGE
                  </span>

                  <h3>
                    My Vehicles
                  </h3>

                </div>

                <Link
                  to="/vehicles"
                  className="dashboard-view-link"
                >
                  View All
                  <i className="bi bi-arrow-right ms-2"></i>
                </Link>

              </div>


              {/* VEHICLE LIST */}

              {vehicles.length === 0 ? (

                <div className="dashboard-empty">

                  <i className="bi bi-car-front"></i>

                  <p>
                    You haven't added any vehicles yet.
                  </p>

                  <Link
                    to="/vehicles"
                    className="btn dashboard-small-btn"
                  >
                    Add Vehicle
                  </Link>

                </div>

              ) : (

                <div className="dashboard-vehicle-list">

                  {vehicles.slice(0, 4).map((vehicle) => (

                    <div
                      className="dashboard-vehicle-item"
                      key={vehicle.id}
                    >

                      <div className="dashboard-vehicle-icon">

                        <i
                          className={
                            vehicle.type === "Bike"
                              ? "bi bi-bicycle"
                              : "bi bi-car-front-fill"
                          }
                        ></i>

                      </div>


                      <div className="dashboard-vehicle-info">

                        <h4>
                          {vehicle.brand} {vehicle.model}
                        </h4>

                        <p>
                          {vehicle.registration}
                        </p>

                      </div>


                      <Link
                        to={`/vehicles/${vehicle.id}`}
                        className="dashboard-vehicle-view"
                      >
                        <i className="bi bi-arrow-right"></i>
                      </Link>

                    </div>

                  ))}

                </div>

              )}

            </div>

          </div>


          {/* ========================================
              RECENT BOOKINGS
          ======================================== */}

          <div className="col-lg-5">

            <div className="dashboard-card">

              <div className="dashboard-card-header">

                <div>

                  <span className="dashboard-label">
                    SERVICE ACTIVITY
                  </span>

                  <h3>
                    Recent Bookings
                  </h3>

                </div>

                <Link
                  to="/bookings"
                  className="dashboard-view-link"
                >
                  View All
                </Link>

              </div>


              {bookings.length === 0 ? (

                <div className="dashboard-empty">

                  <i className="bi bi-calendar-x"></i>

                  <p>
                    No service bookings yet.
                  </p>

                  <Link
                    to="/book-service"
                    className="btn dashboard-small-btn"
                  >
                    Book Service
                  </Link>

                </div>

              ) : (

                <div className="dashboard-booking-list">

                  {bookings
                    .slice()
                    .reverse()
                    .slice(0, 4)
                    .map((booking) => (

                      <div
                        className="dashboard-booking-item"
                        key={booking.id}
                      >

                        <div className="dashboard-booking-icon">

                          <i className="bi bi-calendar-check"></i>

                        </div>


                        <div className="dashboard-booking-info">

                          <h4>
                            {booking.service}
                          </h4>

                          <p>
                            {booking.date} • {booking.time}
                          </p>

                        </div>


                        <span
                          className={
                            booking.status === "Completed"
                              ? "dashboard-status completed"
                              : booking.status === "Cancelled"
                              ? "dashboard-status cancelled"
                              : "dashboard-status upcoming"
                          }
                        >
                          {booking.status}
                        </span>

                      </div>

                    ))}

                </div>

              )}

            </div>

          </div>

        </div>


        {/* ========================================
            QUICK ACTIONS
        ======================================== */}

        <div className="dashboard-card dashboard-quick-actions mt-4">

          <div className="dashboard-card-header">

            <div>

              <span className="dashboard-label">
                QUICK ACTIONS
              </span>

              <h3>
                Manage Your Vehicle
              </h3>

            </div>

          </div>


          <div className="row g-3">

            <div className="col-md-4">

              <Link
                to="/vehicles"
                className="dashboard-action-card"
              >

                <i className="bi bi-car-front-fill"></i>

                <div>

                  <h4>
                    My Vehicles
                  </h4>

                  <p>
                    Manage your garage
                  </p>

                </div>

                <i className="bi bi-arrow-right"></i>

              </Link>

            </div>


            <div className="col-md-4">

              <Link
                to="/book-service"
                className="dashboard-action-card"
              >

                <i className="bi bi-calendar-plus"></i>

                <div>

                  <h4>
                    Book Service
                  </h4>

                  <p>
                    Schedule maintenance
                  </p>

                </div>

                <i className="bi bi-arrow-right"></i>

              </Link>

            </div>


            <div className="col-md-4">

              <Link
                to="/bookings"
                className="dashboard-action-card"
              >

                <i className="bi bi-calendar-check"></i>

                <div>

                  <h4>
                    My Bookings
                  </h4>

                  <p>
                    View service appointments
                  </p>

                </div>

                <i className="bi bi-arrow-right"></i>

              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;