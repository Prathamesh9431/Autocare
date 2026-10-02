import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function Bookings({ bookings, setBookings }) {

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // ========================================
  // FILTER STATE
  // ========================================

  const [activeFilter, setActiveFilter] = useState("All");

  // ========================================
  // SELECTED BOOKING
  // ========================================

  const [selectedBooking, setSelectedBooking] = useState(null);

  // ========================================
  // LOAD USER BOOKINGS
  // ========================================

  useEffect(() => {

    // If user is not logged in,
    // don't show any bookings.
    if (!user?.id) {
      setBookings([]);
      return;
    }

    loadBookings();

  }, [user]);

  const loadBookings = async () => {

    if (!user?.id) {
      setBookings([]);
      return;
    }

    try {

      const response = await axios.get(
        `http://localhost:8081/api/bookings/user/${user.id}`
      );

      setBookings(response.data);

    } catch (error) {

      console.error(
        "Failed to load user bookings:",
        error
      );

      setBookings([]);
    }
  };

  // ========================================
  // FILTER BOOKINGS
  // ========================================

  const filteredBookings =
    activeFilter === "All"
      ? bookings
      : bookings.filter(
          (booking) =>
            booking.status === activeFilter
        );

  // ========================================
  // COUNT BOOKINGS
  // ========================================

  const getBookingCount = (status) => {

    if (status === "All") {
      return bookings.length;
    }

    return bookings.filter(
      (booking) =>
        booking.status === status
    ).length;
  };

  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (date) => {

    if (!date) {
      return "Not Available";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // ========================================
  // GET SERVICE NAME
  // ========================================

  const getServiceName = (booking) => {

    return (
      booking.serviceType ||
      booking.service ||
      "Service"
    );
  };

  // ========================================
  // GET STATUS MESSAGE
  // ========================================

  const getStatusMessage = (status) => {

    switch (status) {

      case "Pending":
        return "Waiting for service center approval";

      case "Confirmed":
        return "Service confirmed by service center";

      case "Completed":
        return "Service completed successfully";

      case "Cancelled":
        return "Booking cancelled";

      case "Rejected":
        return "Service request rejected by service center";

      default:
        return "Booking status unavailable";
    }
  };

  // ========================================
  // STATUS CLASS
  // ========================================

  const getStatusClass = (status) => {

    switch (status) {

      case "Pending":
        return "booking-status upcoming";

      case "Confirmed":
        return "booking-status confirmed";

      case "Completed":
        return "booking-status completed";

      case "Cancelled":
        return "booking-status cancelled";

      case "Rejected":
        return "booking-status cancelled";

      default:
        return "booking-status upcoming";
    }
  };

  // ========================================
  // CANCEL BOOKING
  // ========================================

  const cancelBooking = async (id) => {

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) {
      return;
    }

    try {

      const response = await axios.put(
        `http://localhost:8081/api/bookings/${id}/cancel`
      );

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking.id === id
            ? {
                ...booking,
                ...response.data,
                status: "Cancelled",
              }
            : booking
        )
      );

      setSelectedBooking(null);

    } catch (error) {

      console.error(
        "Failed to cancel booking:",
        error
      );

      alert(
        "Failed to cancel booking. Please try again."
      );
    }
  };

  // ========================================
  // COMPLETE BOOKING
  // ========================================

  const completeBooking = async (id) => {

    const confirmComplete = window.confirm(
      "Mark this service as completed?"
    );

    if (!confirmComplete) {
      return;
    }

    try {

      const response = await axios.put(
        `http://localhost:8081/api/bookings/${id}/complete`
      );

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking.id === id
            ? {
                ...booking,
                ...response.data,
                status: "Completed",
              }
            : booking
        )
      );

      setSelectedBooking(null);

    } catch (error) {

      console.error(
        "Failed to complete booking:",
        error
      );

      alert(
        "Failed to mark booking as completed. Please try again."
      );
    }
  };

  // ========================================
  // NOT LOGGED IN
  // ========================================

  if (!user) {

    return (
      <div className="bookings-page">

        <div className="container py-5">

          <div className="empty-bookings-card">

            <div className="empty-bookings-icon">
              <i className="bi bi-person-lock"></i>
            </div>

            <h2>
              Please Login
            </h2>

            <p>
              Please login to view your service bookings.
            </p>

            <button
              type="button"
              className="btn booking-new-btn"
              onClick={() => navigate("/login")}
            >
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Login
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ========================================
  // PAGE
  // ========================================

  return (

    <div className="bookings-page">

      <div className="container py-5">

        {/* HEADER */}

        <div className="bookings-header">

          <div>

            <span className="dashboard-label">
              SERVICE BOOKINGS
            </span>

            <h1>
              My Bookings
            </h1>

            <p>
              View and manage all your vehicle
              service appointments.
            </p>

          </div>

          <Link
            to="/book-service"
            className="btn booking-new-btn"
          >
            <i className="bi bi-plus-lg me-2"></i>
            Book New Service
          </Link>

        </div>


        {/* FILTER BUTTONS */}

        {bookings.length > 0 && (

          <div className="booking-filters mt-4">

            {[
              "All",
              "Pending",
              "Confirmed",
              "Completed",
              "Cancelled",
              "Rejected",
            ].map((filter) => (

              <button
                key={filter}
                type="button"
                className={
                  activeFilter === filter
                    ? "booking-filter active"
                    : "booking-filter"
                }
                onClick={() =>
                  setActiveFilter(filter)
                }
              >

                {filter}

                <span>
                  {getBookingCount(filter)}
                </span>

              </button>

            ))}

          </div>

        )}


        {/* NO BOOKINGS */}

        {bookings.length === 0 ? (

          <div className="empty-bookings-card">

            <div className="empty-bookings-icon">

              <i className="bi bi-calendar-x"></i>

            </div>

            <h2>
              No Bookings Yet
            </h2>

            <p>
              You don't have any service appointments
              yet. Book your first service to keep
              your vehicle in top condition.
            </p>

            <Link
              to="/book-service"
              className="btn booking-new-btn"
            >

              <i className="bi bi-calendar-check me-2"></i>

              Book a Service

            </Link>

          </div>

        ) : filteredBookings.length === 0 ? (

          <div className="empty-bookings-card">

            <div className="empty-bookings-icon">

              <i className="bi bi-calendar-x"></i>

            </div>

            <h2>
              No {activeFilter} Bookings
            </h2>

            <p>
              There are no bookings with this status.
            </p>

            <button
              type="button"
              className="btn booking-new-btn"
              onClick={() =>
                setActiveFilter("All")
              }
            >
              View All Bookings
            </button>

          </div>

        ) : (

          /* BOOKING LIST */

          <div className="bookings-list">

            {filteredBookings
  .slice()
  .reverse()
  .map((booking) => (

              <div
                className="booking-card"
                key={booking.id}
              >

                {/* TOP */}

                <div className="booking-card-top">

                  <div className="booking-icon">

                    <i className="bi bi-calendar-check"></i>

                  </div>

                  <span
                    className={getStatusClass(
                      booking.status
                    )}
                  >
                    {booking.status || "Pending"}
                  </span>

                </div>


                {/* BOOKING INFORMATION */}

                <div className="booking-info">

                  <span className="dashboard-label">
                    SERVICE APPOINTMENT
                  </span>

                  <h2>
                    {getServiceName(booking)}
                  </h2>

                  <p>
                    {booking.vehicleName ||
                      "Vehicle"}
                  </p>

                </div>


                {/* STATUS MESSAGE */}

                <div className={`booking-status-message ${booking.status?.toLowerCase()}`}>
  <strong>
    {getStatusMessage(booking.status)}
  </strong>
</div>


                {/* BOOKING REFERENCE */}

                <div className="booking-reference">

                  <span>
                    BOOKING REFERENCE
                  </span>

                  <strong>
                    {booking.bookingReference ||
                      `AC-${booking.id}`}
                  </strong>

                </div>


                {/* BOOKING DETAILS */}

                <div className="booking-details">

                  {/* VEHICLE */}

                  <div className="booking-detail-item">

                    <i className="bi bi-car-front"></i>

                    <div>

                      <span>
                        VEHICLE
                      </span>

                      <strong>
                        {booking.vehicleName ||
                          "Not Available"}
                      </strong>

                    </div>

                  </div>


                  {/* REGISTRATION */}

                  <div className="booking-detail-item">

                    <i className="bi bi-card-text"></i>

                    <div>

                      <span>
                        REGISTRATION
                      </span>

                      <strong>
                        {booking.registration ||
                          "Not Available"}
                      </strong>

                    </div>

                  </div>


                  {/* DATE */}

                  <div className="booking-detail-item">

                    <i className="bi bi-calendar3"></i>

                    <div>

                      <span>
                        DATE
                      </span>

                      <strong>
                        {formatDate(
                          booking.serviceDate ||
                          booking.date
                        )}
                      </strong>

                    </div>

                  </div>


                  {/* TIME */}

                  <div className="booking-detail-item">

                    <i className="bi bi-clock"></i>

                    <div>

                      <span>
                        TIME
                      </span>

                      <strong>
                        {booking.serviceTime ||
                          booking.time ||
                          "Not Available"}
                      </strong>

                    </div>

                  </div>

                </div>


                {/* NOTES */}

                {booking.notes && (

                  <div className="booking-notes">

                    <span>

                      <i className="bi bi-chat-left-text me-2"></i>

                      ADDITIONAL NOTES

                    </span>

                    <p>
                      {booking.notes}
                    </p>

                  </div>

                )}


                {/* ACTION BUTTONS */}

                <div className="booking-card-actions">

                  <button
                    type="button"
                    className="btn booking-view-btn"
                    onClick={() =>
                      setSelectedBooking(booking)
                    }
                  >

                    <i className="bi bi-eye me-2"></i>

                    View Details

                  </button>


                  <Link
                    to={`/vehicles/${booking.vehicleId}`}
                    className="btn booking-view-btn"
                  >

                    <i className="bi bi-car-front me-2"></i>

                    View Vehicle

                  </Link>


                  {booking.status === "Confirmed" && (

                    <button
                      type="button"
                      className="btn booking-complete-btn"
                      onClick={() =>
                        completeBooking(
                          booking.id
                        )
                      }
                    >

                      <i className="bi bi-check-circle me-2"></i>

                      Mark Completed

                    </button>

                  )}


                  {(booking.status === "Pending" ||
                    booking.status === "Confirmed") && (

                    <button
                      type="button"
                      className="btn booking-cancel-btn"
                      onClick={() =>
                        cancelBooking(
                          booking.id
                        )
                      }
                    >

                      <i className="bi bi-x-lg me-2"></i>

                      Cancel Booking

                    </button>

                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* BOOKING DETAILS MODAL */}

      {selectedBooking && (

        <div
          className="booking-modal-overlay"
          onClick={() =>
            setSelectedBooking(null)
          }
        >

          <div
            className="booking-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="booking-modal-header">

              <div>

                <span className="dashboard-label">
                  BOOKING DETAILS
                </span>

                <h2>
                  {getServiceName(
                    selectedBooking
                  )}
                </h2>

              </div>

              <button
                type="button"
                className="booking-modal-close"
                onClick={() =>
                  setSelectedBooking(null)
                }
              >

                <i className="bi bi-x-lg"></i>

              </button>

            </div>


            <div className="booking-modal-status">

              <span
                className={getStatusClass(
                  selectedBooking.status
                )}
              >
                {selectedBooking.status ||
                  "Pending"}
              </span>

              <p className="mt-2">

                {getStatusMessage(
                  selectedBooking.status
                )}

              </p>

            </div>


            <div className="booking-modal-details">

              <div className="modal-detail">

                <i className="bi bi-hash"></i>

                <div>

                  <span>
                    BOOKING REFERENCE
                  </span>

                  <strong>
                    {selectedBooking.bookingReference ||
                      `AC-${selectedBooking.id}`}
                  </strong>

                </div>

              </div>


              <div className="modal-detail">

                <i className="bi bi-car-front"></i>

                <div>

                  <span>
                    VEHICLE
                  </span>

                  <strong>
                    {selectedBooking.vehicleName ||
                      "Not Available"}
                  </strong>

                </div>

              </div>


              <div className="modal-detail">

                <i className="bi bi-card-text"></i>

                <div>

                  <span>
                    REGISTRATION
                  </span>

                  <strong>
                    {selectedBooking.registration ||
                      "Not Available"}
                  </strong>

                </div>

              </div>


              <div className="modal-detail">

                <i className="bi bi-tools"></i>

                <div>

                  <span>
                    SERVICE
                  </span>

                  <strong>
                    {getServiceName(
                      selectedBooking
                    )}
                  </strong>

                </div>

              </div>


              <div className="modal-detail">

                <i className="bi bi-calendar3"></i>

                <div>

                  <span>
                    DATE
                  </span>

                  <strong>
                    {formatDate(
                      selectedBooking.serviceDate ||
                      selectedBooking.date
                    )}
                  </strong>

                </div>

              </div>


              <div className="modal-detail">

                <i className="bi bi-clock"></i>

                <div>

                  <span>
                    TIME
                  </span>

                  <strong>
                    {selectedBooking.serviceTime ||
                      selectedBooking.time ||
                      "Not Available"}
                  </strong>

                </div>

              </div>

            </div>


            {selectedBooking.notes && (

              <div className="modal-notes">

                <span>

                  <i className="bi bi-chat-left-text me-2"></i>

                  ADDITIONAL NOTES

                </span>

                <p>
                  {selectedBooking.notes}
                </p>

              </div>

            )}


            <div className="booking-modal-actions">

              {selectedBooking.status === "Confirmed" && (

                <button
                  type="button"
                  className="btn booking-complete-btn"
                  onClick={() =>
                    completeBooking(
                      selectedBooking.id
                    )
                  }
                >

                  <i className="bi bi-check-circle me-2"></i>

                  Mark Completed

                </button>

              )}


              {(selectedBooking.status === "Pending" ||
                selectedBooking.status === "Confirmed") && (

                <button
                  type="button"
                  className="btn booking-cancel-btn"
                  onClick={() =>
                    cancelBooking(
                      selectedBooking.id
                    )
                  }
                >

                  <i className="bi bi-x-lg me-2"></i>

                  Cancel Booking

                </button>

              )}


              <button
                type="button"
                className="btn cancel-btn"
                onClick={() =>
                  setSelectedBooking(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Bookings;