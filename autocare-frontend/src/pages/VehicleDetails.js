import { Link, useParams } from "react-router-dom";

function VehicleDetails({ vehicles, bookings }) {
  const { id } = useParams();

  const vehicle = vehicles.find(
    (item) => item.id.toString() === id
  );

  if (!vehicle) {
    return (
      <div className="page-placeholder">
        <div className="text-center">
          <h1>Vehicle Not Found</h1>

          <p className="text-secondary mt-3">
            The vehicle you are looking for does not exist.
          </p>

          <Link
            to="/vehicles"
            className="btn vehicle-book-btn mt-3"
          >
            Back to My Vehicles
          </Link>
        </div>
      </div>
    );
  }

  // Active bookings for this vehicle
  const vehicleBookings = bookings.filter(
    (booking) =>
      booking.vehicleId === vehicle.id &&
      booking.status === "Upcoming"
  );

  // Completed bookings for service history
  const completedBookings = bookings.filter(
    (booking) =>
      booking.vehicleId === vehicle.id &&
      booking.status === "Completed"
  );

  // Latest upcoming booking
  const upcomingBooking =
    vehicleBookings.length > 0
      ? vehicleBookings[vehicleBookings.length - 1]
      : null;

  return (
    <div className="vehicles-page">
      <div className="container py-5">

        {/* BACK BUTTON */}

        <Link
          to="/vehicles"
          className="vehicle-back-btn"
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to My Vehicles
        </Link>


        {/* HEADER */}

        <div className="vehicle-details-header mt-4">

          <div>
            <span className="dashboard-label">
              VEHICLE DETAILS
            </span>

            <h1>
              {vehicle.brand} {vehicle.model}
            </h1>

            <p>
              Complete information and maintenance details
              for your vehicle.
            </p>
          </div>

          <div className="large-vehicle-icon">
            <i
              className={
                vehicle.type === "Bike"
                  ? "bi bi-bicycle"
                  : "bi bi-car-front-fill"
              }
            ></i>
          </div>

        </div>


        {/* VEHICLE INFORMATION */}

        <div className="row g-4 mt-4">

          {/* BASIC INFORMATION */}

          <div className="col-lg-8">

            <div className="vehicle-details-card">

              <div className="details-card-header">

                <div>
                  <span className="dashboard-label">
                    BASIC INFORMATION
                  </span>

                  <h3>
                    Vehicle Information
                  </h3>
                </div>

                <i className="bi bi-car-front-fill"></i>

              </div>


              <div className="row g-4 mt-2">

                <div className="col-md-6">
                  <div className="detail-item">
                    <span>VEHICLE TYPE</span>
                    <strong>{vehicle.type}</strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="detail-item">
                    <span>BRAND</span>
                    <strong>{vehicle.brand}</strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="detail-item">
                    <span>MODEL</span>
                    <strong>{vehicle.model}</strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="detail-item">
                    <span>MANUFACTURING YEAR</span>
                    <strong>{vehicle.year}</strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="detail-item">
                    <span>FUEL TYPE</span>
                    <strong>{vehicle.fuel}</strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="detail-item">
                    <span>REGISTRATION NUMBER</span>
                    <strong>{vehicle.registration}</strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="detail-item">
                    <span>CURRENT MILEAGE</span>
                    <strong>
                      {Number(vehicle.mileage).toLocaleString()} km
                    </strong>
                  </div>
                </div>

              </div>

            </div>

          </div>


          {/* SERVICE STATUS */}

          <div className="col-lg-4">

            <div className="vehicle-details-card service-details-card">

              <span className="dashboard-label">
                SERVICE STATUS
              </span>

              <div className="service-status-icon">
                <i className="bi bi-tools"></i>
              </div>

              <h3>
                {vehicle.nextService}
              </h3>

              <p>
                Your next scheduled maintenance service.
              </p>


              <div className="service-status-box">

                <span>STATUS</span>

                <strong>
                  {vehicle.serviceDue}
                </strong>

              </div>


              {/* UPCOMING APPOINTMENT */}

              {upcomingBooking && (

                <div className="upcoming-service-box">

                  <span>
                    UPCOMING APPOINTMENT
                  </span>

                  <strong>
                    {upcomingBooking.service}
                  </strong>

                  <p>
                    <i className="bi bi-calendar3 me-2"></i>
                    {upcomingBooking.date}
                  </p>

                  <p>
                    <i className="bi bi-clock me-2"></i>
                    {upcomingBooking.time}
                  </p>

                </div>

              )}


              <Link
                to="/book-service"
                className="btn vehicle-book-btn w-100"
              >
                <i className="bi bi-calendar-check me-2"></i>
                Book Service
              </Link>

            </div>

          </div>

        </div>


        {/* SERVICE HISTORY */}

        <div className="vehicle-details-card mt-4">

          <div className="details-card-header">

            <div>
              <span className="dashboard-label">
                MAINTENANCE
              </span>

              <h3>
                Service History
              </h3>
            </div>

            <Link
              to="/book-service"
              className="vehicle-view-btn"
            >
              Book New Service
            </Link>

          </div>


          {/* COMPLETED SERVICES */}

          {completedBookings.length > 0 ? (

            <div className="service-history-list">

              {completedBookings.map((booking) => (

                <div
                  className="service-history-item"
                  key={booking.id}
                >

                  <div className="service-history-icon">
                    <i className="bi bi-check-circle-fill"></i>
                  </div>


                  <div className="service-history-info">

                    <h4>
                      {booking.service}
                    </h4>

                    <p>
                      <i className="bi bi-calendar3 me-2"></i>
                      {booking.date}
                    </p>

                    <p>
                      <i className="bi bi-clock me-2"></i>
                      {booking.time}
                    </p>

                    {booking.notes && (
                      <p>
                        <i className="bi bi-chat-left-text me-2"></i>
                        {booking.notes}
                      </p>
                    )}

                  </div>


                  <span className="service-completed-badge">
                    Completed
                  </span>

                </div>

              ))}

            </div>

          ) : (

            <div className="empty-service-history">

              <div className="service-history-icon">
                <i className="bi bi-clipboard-check"></i>
              </div>

              <h4>
                No Service History Yet
              </h4>

              <p>
                Once you complete a service, your maintenance
                history will appear here.
              </p>

            </div>

          )}

        </div>

      </div>
    </div>
  );
}

export default VehicleDetails;