import { useEffect, useState } from "react";
import axios from "axios";
import { sendBookingEmail } from "../services/emailService";

function Admin() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================================
  // LOAD BOOKINGS
  // ================================

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/bookings"
      );

      setBookings(response.data);
      setLoading(false);

    } catch (error) {
      console.error("Failed to load bookings:", error);

      setError("Unable to load bookings.");
      setLoading(false);
    }
  };

  // ================================
  // UPDATE STATUS
  // ================================

  const updateStatus = async (id, status) => {
    try {
      const response = await axios.put(
        `http://localhost:8081/api/bookings/${id}/status`,
        null,
        {
          params: {
            status: status,
          },
        }
      );

      const updatedBooking = response.data;

      console.log("================================");
      console.log("BOOKING STATUS UPDATED");
      console.log("BOOKING:", updatedBooking);
      console.log("STATUS:", status);
      console.log("USER ID:", updatedBooking.userId);
      console.log("================================");

      // Update booking on admin page
      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking.id === id
            ? updatedBooking
            : booking
        )
      );

      setError("");

      // ========================================
      // SEND EMAIL WHEN BOOKING IS CONFIRMED
      // ========================================

      if (status === "Confirmed") {

        console.log("CONFIRMED BOOKING - GETTING CUSTOMER");

        try {

          const customerResponse = await axios.get(
            `http://localhost:8081/api/users/${updatedBooking.userId}`
          );

          const customer = customerResponse.data;

          console.log("CUSTOMER DETAILS:", customer);
          console.log("CUSTOMER EMAIL:", customer.email);

          // ========================================
          // SEND EMAIL USING EMAILJS
          // ========================================

          console.log("SENDING EMAIL...");

          await sendBookingEmail(
            updatedBooking,
            customer
          );

          console.log(
            "================================"
          );

          console.log(
            "EMAIL SENT SUCCESSFULLY"
          );

          console.log(
            "================================"
          );

        } catch (emailError) {

          console.error(
            "================================"
          );

          console.error(
            "EMAIL SENDING FAILED"
          );

          console.error(
            emailError
          );

          console.error(
            "================================"
          );

          // Booking remains confirmed
        }
      }

    } catch (error) {

      console.error(
        "Failed to update booking status:",
        error
      );

      setError(
        "Unable to update booking status."
      );
    }
  };

  // ================================
  // BOOKING COUNTS
  // ================================

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) =>
      booking.status === "Pending"
  ).length;

  const confirmedBookings = bookings.filter(
    (booking) =>
      booking.status === "Confirmed"
  ).length;

  const completedBookings = bookings.filter(
    (booking) =>
      booking.status === "Completed"
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) =>
      booking.status === "Cancelled"
  ).length;

  const rejectedBookings = bookings.filter(
    (booking) =>
      booking.status === "Rejected"
  ).length;

  return (
    <div className="container py-5">

      {/* ================================
          HEADER
      ================================= */}

      <div className="mb-5">

        <span className="dashboard-label">
          ADMINISTRATION
        </span>

        <h1>
          Admin Dashboard
        </h1>

        <p>
          Manage customer service requests.
        </p>

      </div>

      {/* ================================
          ERROR
      ================================= */}

      {error && (
        <div
          style={{
            color: "red",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {/* ================================
          SUMMARY CARDS
      ================================= */}

      <div className="row g-4 mb-5">

        <div className="col-md-6 col-lg-3">

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              <i className="bi bi-calendar-check"></i>
            </div>

            <div>
              <span>
                TOTAL REQUESTS
              </span>

              <h2>
                {totalBookings}
              </h2>
            </div>

          </div>

        </div>

        <div className="col-md-6 col-lg-3">

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              <i className="bi bi-hourglass-split"></i>
            </div>

            <div>
              <span>
                PENDING
              </span>

              <h2>
                {pendingBookings}
              </h2>
            </div>

          </div>

        </div>

        <div className="col-md-6 col-lg-3">

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              <i className="bi bi-check-circle"></i>
            </div>

            <div>
              <span>
                CONFIRMED
              </span>

              <h2>
                {confirmedBookings}
              </h2>
            </div>

          </div>

        </div>

        <div className="col-md-6 col-lg-3">

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              <i className="bi bi-check2-all"></i>
            </div>

            <div>
              <span>
                COMPLETED
              </span>

              <h2>
                {completedBookings}
              </h2>
            </div>

          </div>

        </div>

      </div>

      {/* ================================
          OTHER COUNTS
      ================================= */}

      <div className="row g-4 mb-5">

        <div className="col-md-6">

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              <i className="bi bi-x-circle"></i>
            </div>

            <div>
              <span>
                CANCELLED
              </span>

              <h2>
                {cancelledBookings}
              </h2>
            </div>

          </div>

        </div>

        <div className="col-md-6">

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              <i className="bi bi-slash-circle"></i>
            </div>

            <div>
              <span>
                REJECTED
              </span>

              <h2>
                {rejectedBookings}
              </h2>
            </div>

          </div>

        </div>

      </div>

      {/* ================================
          SERVICE REQUESTS
      ================================= */}

      <h2 className="mb-4">
        Service Requests
      </h2>

      {loading && (
        <p>
          Loading requests...
        </p>
      )}

      {!loading &&
        !error &&
        bookings.length === 0 && (
          <p>
            No service requests found.
          </p>
        )}

      {!loading &&
        bookings.length > 0 && (

          <div className="mt-4">

            {bookings
  .slice()
  .reverse()
  .map((booking) => (

              <div
                key={booking.id}
                className="admin-booking-card"
              >

                <h3>
                  {booking.serviceType}
                </h3>

                <p>
                  <strong>
                    Booking Reference:
                  </strong>{" "}
                  {booking.bookingReference}
                </p>

                <p>
                  <strong>
                    Vehicle:
                  </strong>{" "}
                  {booking.vehicleName ||
                    "Not available"}
                </p>

                <p>
                  <strong>
                    Registration:
                  </strong>{" "}
                  {booking.registration ||
                    "Not available"}
                </p>

                <p>
                  <strong>
                    Date:
                  </strong>{" "}
                  {booking.serviceDate}
                </p>

                <p>
                  <strong>
                    Time:
                  </strong>{" "}
                  {booking.serviceTime}
                </p>

                <p>
                  <strong>
                    Status:
                  </strong>{" "}
                  {booking.status}
                </p>

                {booking.notes && (
                  <p>
                    <strong>
                      Notes:
                    </strong>{" "}
                    {booking.notes}
                  </p>
                )}

                {/* PENDING */}

                {booking.status === "Pending" && (

                  <div className="mt-3">

                    <button
                      type="button"
                      className="btn btn-success me-2"
                      onClick={() =>
                        updateStatus(
                          booking.id,
                          "Confirmed"
                        )
                      }
                    >
                      <i className="bi bi-check-circle me-1"></i>
                      Accept
                    </button>

                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() =>
                        updateStatus(
                          booking.id,
                          "Rejected"
                        )
                      }
                    >
                      <i className="bi bi-x-circle me-1"></i>
                      Reject
                    </button>

                  </div>

                )}

                {/* CONFIRMED */}

                {booking.status === "Confirmed" && (

                  <div className="mt-3">

                    <span className="badge bg-success">
                      <i className="bi bi-check-circle me-1"></i>
                      Service Confirmed
                    </span>

                  </div>

                )}

                {/* COMPLETED */}

                {booking.status === "Completed" && (

                  <div className="mt-3">

                    <span className="badge bg-primary">
                      <i className="bi bi-check2-all me-1"></i>
                      Service Completed
                    </span>

                  </div>

                )}

                {/* REJECTED */}

                {booking.status === "Rejected" && (

                  <div className="mt-3">

                    <span className="badge bg-danger">
                      <i className="bi bi-x-circle me-1"></i>
                      Request Rejected
                    </span>

                  </div>

                )}

                {/* CANCELLED */}

                {booking.status === "Cancelled" && (

                  <div className="mt-3">

                    <span className="badge bg-secondary">
                      <i className="bi bi-x-circle me-1"></i>
                      Booking Cancelled
                    </span>

                  </div>

                )}

              </div>

            ))}

          </div>

        )}

    </div>
  );
}

export default Admin;