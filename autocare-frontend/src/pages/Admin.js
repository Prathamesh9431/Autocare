import { useCallback, useEffect, useState } from "react";
import api from "../services/axiosConfig";
import { sendBookingEmail } from "../services/emailService";
import { useNotification } from "../context/NotificationContext";

function Admin() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { showNotification } = useNotification();

  // ================================
  // LOAD BOOKINGS
  // ================================


    // ================================
  // LOAD BOOKINGS
  // ================================

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/bookings");

      setBookings(response.data);
    } catch (error) {
      console.error("ADMIN LOAD BOOKINGS ERROR:", error);

      setError("Unable to load bookings.");

      showNotification({
        title: "Loading Failed",
        message: "Unable to load service requests.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  // ================================
  // UPDATE STATUS
  // ================================

  const updateStatus = async (id, status) => {
    try {
      setError("");

      const response = await api.put(
        `/api/bookings/${id}/status`,
        null,
        {
          params: {
            status: status,
          },
        }
      );

      const updatedBooking = response.data;

      // Update booking immediately on screen
      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking.id === id
            ? updatedBooking
            : booking
        )
      );

      // ================================
      // CONFIRMED BOOKING EMAIL
      // ================================

      if (status === "Confirmed") {
        try {
          const customerResponse = await api.get(
            `/api/users/${updatedBooking.userId}`
          );

          const customer = customerResponse.data;

          await sendBookingEmail(
            updatedBooking,
            customer
          );

          showNotification({
            title: "Booking Confirmed",
            message:
              "Booking confirmed and confirmation email sent.",
            type: "success",
          });

        } catch (emailError) {
          console.error(
            "EMAIL SENDING FAILED:",
            emailError
          );

          // Booking was successfully confirmed,
          // only email failed.
          showNotification({
            title: "Booking Confirmed",
            message:
              "Booking confirmed, but the confirmation email could not be sent.",
            type: "warning",
          });
        }

        return;
      }

      // ================================
      // REJECTED
      // ================================

      if (status === "Rejected") {
        showNotification({
          title: "Booking Rejected",
          message:
            "The service request has been rejected.",
          type: "warning",
        });

        return;
      }

      // ================================
      // OTHER STATUS
      // ================================

      showNotification({
        title: "Status Updated",
        message:
          `Booking status changed to ${status}.`,
        type: "success",
      });

    } catch (error) {
      console.error(
        "FAILED TO UPDATE BOOKING STATUS:",
        error
      );

      console.error(
        "STATUS:",
        error.response?.status
      );

      console.error(
        "RESPONSE:",
        error.response?.data
      );

      setError(
        "Unable to update booking status."
      );

      showNotification({
        title: "Update Failed",
        message:
          "Unable to update the booking status. Please try again.",
        type: "error",
      });
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

  // ================================
  // PAGE
  // ================================

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
          className="alert alert-danger"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* ================================
          SUMMARY CARDS
      ================================= */}

      <div className="row g-4 mb-5">

        {/* TOTAL */}

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

        {/* PENDING */}

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

        {/* CONFIRMED */}

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

        {/* COMPLETED */}

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
          CANCELLED + REJECTED
      ================================= */}

      <div className="row g-4 mb-5">

        {/* CANCELLED */}

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

        {/* REJECTED */}

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

      {/* LOADING */}

      {loading && (
        <p>
          Loading requests...
        </p>
      )}

      {/* NO BOOKINGS */}

      {!loading &&
        !error &&
        bookings.length === 0 && (

          <p>
            No service requests found.
          </p>

        )}

      {/* BOOKINGS */}

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

                  {/* SERVICE */}

                  <h3>
                    {booking.serviceType}
                  </h3>

                  {/* REFERENCE */}

                  <p>
                    <strong>
                      Booking Reference:
                    </strong>{" "}
                    {booking.bookingReference}
                  </p>

                  {/* VEHICLE */}

                  <p>
                    <strong>
                      Vehicle:
                    </strong>{" "}
                    {booking.vehicleName ||
                      "Not available"}
                  </p>

                  {/* REGISTRATION */}

                  <p>
                    <strong>
                      Registration:
                    </strong>{" "}
                    {booking.registration ||
                      "Not available"}
                  </p>

                  {/* DATE */}

                  <p>
                    <strong>
                      Date:
                    </strong>{" "}
                    {booking.serviceDate}
                  </p>

                  {/* TIME */}

                  <p>
                    <strong>
                      Time:
                    </strong>{" "}
                    {booking.serviceTime}
                  </p>

                  {/* STATUS */}

                  <p>
                    <strong>
                      Status:
                    </strong>{" "}
                    {booking.status}
                  </p>

                  {/* NOTES */}

                  {booking.notes && (
                    <p>
                      <strong>
                        Notes:
                      </strong>{" "}
                      {booking.notes}
                    </p>
                  )}

                  {/* ================================
                      PENDING
                  ================================= */}

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

                  {/* ================================
                      CONFIRMED
                  ================================= */}

                  {booking.status === "Confirmed" && (

                    <div className="mt-3">

                      <span className="badge bg-success">

                        <i className="bi bi-check-circle me-1"></i>

                        Service Confirmed

                      </span>

                    </div>

                  )}

                  {/* ================================
                      COMPLETED
                  ================================= */}

                  {booking.status === "Completed" && (

                    <div className="mt-3">

                      <span className="badge bg-primary">

                        <i className="bi bi-check2-all me-1"></i>

                        Service Completed

                      </span>

                    </div>

                  )}

                  {/* ================================
                      REJECTED
                  ================================= */}

                  {booking.status === "Rejected" && (

                    <div className="mt-3">

                      <span className="badge bg-danger">

                        <i className="bi bi-x-circle me-1"></i>

                        Request Rejected

                      </span>

                    </div>

                  )}

                  {/* ================================
                      CANCELLED
                  ================================= */}

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