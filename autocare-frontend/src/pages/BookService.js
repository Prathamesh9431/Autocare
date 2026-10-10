import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import api from "../services/axiosConfig";
import { AuthContext } from "../context/AuthContext";

function BookService({
  vehicles,
  bookings,
  setBookings,
  setVehicles,
}) {
  const navigate = useNavigate();

  // ========================================
  // CURRENT LOGGED-IN USER
  // ========================================

  const { user } = useContext(AuthContext);

  // ========================================
  // FORM DATA
  // ========================================

  const [formData, setFormData] = useState({
    vehicleId: "",
    service: "",
    date: "",
    time: "",
    notes: "",
  });

  // ========================================
  // ALERT STATES
  // ========================================

  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ========================================
  // TODAY'S DATE
  // ========================================

  const today = new Date()
    .toISOString()
    .split("T")[0];

  // ========================================
  // LOAD CURRENT USER'S VEHICLES
  // ========================================

  useEffect(() => {
    const loadVehicles = async () => {
      if (!user?.id) {
        setVehicles([]);
        return;
      }

      try {
        const response = await api.get(
          `/api/vehicles/user/${user.id}`
        );

        setVehicles(response.data);
      } catch (error) {
        console.error(
          "Failed to load vehicles:",
          error
        );

        setErrorMessage(
          "Failed to load your vehicles."
        );
      }
    };

    loadVehicles();
  }, [user, setVehicles]);

  // ========================================
  // AUTO HIDE SUCCESS MESSAGE
  // ========================================

  useEffect(() => {
    if (!showSuccess) {
      return;
    }

    const timer = setTimeout(() => {
      setShowSuccess(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [showSuccess]);

  // ========================================
  // HANDLE INPUT CHANGES
  // ========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setErrorMessage("");

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (date) => {
    if (!date) {
      return "";
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
  // SUBMIT BOOKING
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setShowSuccess(false);

    // ========================================
    // CHECK LOGIN
    // ========================================

    if (!user?.id) {
      setErrorMessage(
        "Please login before booking a service."
      );

      return;
    }

    console.log("BOOKING USER:", user);
    console.log("BOOKING USER ID:", user.id);

    // ========================================
    // VALIDATE VEHICLE
    // ========================================

    const selectedVehicle = vehicles.find(
      (vehicle) =>
        String(vehicle.id) ===
        String(formData.vehicleId)
    );

    if (!selectedVehicle) {
      setErrorMessage(
        "Please select a valid vehicle."
      );

      return;
    }

    // ========================================
    // CHECK DUPLICATE BOOKING
    // ========================================

    const duplicateBooking = bookings.find(
      (booking) =>
        String(booking.vehicleId) ===
          String(selectedVehicle.id) &&
        (
          booking.serviceDate === formData.date ||
          booking.date === formData.date
        ) &&
        (
          booking.serviceTime === formData.time ||
          booking.time === formData.time
        ) &&
        booking.status !== "Cancelled" &&
        booking.status !== "Rejected"
    );

    if (duplicateBooking) {
      setErrorMessage(
        `This vehicle already has a service appointment on ${formatDate(
          formData.date
        )} at ${formData.time}. Please select another date or time.`
      );

      return;
    }

    // ========================================
    // CREATE BOOKING DATA
    // ========================================

    const bookingData = {
      // Logged-in user
      userId: user.id,

      // Vehicle
      vehicleId: selectedVehicle.id,

      vehicleName:
        `${selectedVehicle.brand} ${selectedVehicle.model}`,

      registration:
        selectedVehicle.registration,

      // Service
      serviceType:
        formData.service,

      serviceDate:
        formData.date,

      serviceTime:
        formData.time,

      // Notes
      notes:
        formData.notes.trim(),
    };

    console.log(
      "BOOKING DATA SENT TO BACKEND:",
      bookingData
    );

    // ========================================
    // SAVE BOOKING TO BACKEND
    // ========================================

    try {
      const response = await api.post(
        "/api/bookings",
        bookingData
      );

      console.log(
        "BOOKING SAVED BY BACKEND:",
        response.data
      );

      // ========================================
      // FORMAT SAVED BOOKING
      // ========================================

      const savedBooking = {
        id: response.data.id,

        bookingReference:
          response.data.bookingReference,

        userId:
          response.data.userId,

        vehicleId:
          response.data.vehicleId,

        vehicleName:
          response.data.vehicleName,

        registration:
          response.data.registration,

        service:
          response.data.serviceType,

        serviceType:
          response.data.serviceType,

        date:
          response.data.serviceDate,

        serviceDate:
          response.data.serviceDate,

        formattedDate:
          formatDate(
            response.data.serviceDate
          ),

        time:
          response.data.serviceTime,

        serviceTime:
          response.data.serviceTime,

        notes:
          response.data.notes || "",

        status:
          response.data.status || "Pending",

        createdAt:
          response.data.createdAt ||
          new Date().toISOString(),
      };

      // ========================================
      // ADD ONLY TO CURRENT USER'S BOOKINGS
      // ========================================

      setBookings((previousBookings) => [
        ...previousBookings,
        savedBooking,
      ]);

    } catch (error) {
      console.error(
        "Booking error:",
        error
      );

      console.error(
        "Backend response:",
        error.response?.data
      );

      setErrorMessage(
        error.response?.data?.message ||
        "Failed to book service."
      );

      return;
    }

    // ========================================
    // UPDATE VEHICLE SERVICE STATUS
    // ========================================

    setVehicles((previousVehicles) =>
      previousVehicles.map((vehicle) =>
        vehicle.id === selectedVehicle.id
          ? {
              ...vehicle,

              nextService:
                formData.service,

              serviceDue:
                `Scheduled for ${formatDate(
                  formData.date
                )}`,
            }
          : vehicle
      )
    );

    // ========================================
    // SHOW SUCCESS MESSAGE
    // ========================================

    setShowSuccess(true);


window.scrollTo({
  top: 0,
  behavior: "smooth",
});
    // ========================================
    // RESET FORM
    // ========================================

    setFormData({
      vehicleId: "",
      service: "",
      date: "",
      time: "",
      notes: "",
    });
  };

  // ========================================
  // RETURN UI
  // ========================================

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

        {/* PAGE HEADER */}

        <div className="vehicle-details-header mt-4">

          <div>

            <span className="dashboard-label">
              SERVICE BOOKING
            </span>

            <h1>
              Book a Service
            </h1>

            <p>
              Schedule professional maintenance
              for your vehicle.
            </p>

          </div>

          <div className="large-vehicle-icon">

            <i className="bi bi-calendar-check"></i>

          </div>

        </div>

        {/* SUCCESS MESSAGE */}

        {showSuccess && (

          <div className="booking-success-alert mt-4">

            <div className="success-icon">
              <i className="bi bi-check-circle-fill"></i>
            </div>

            <div>

              <strong>
                Service Booked Successfully!
              </strong>

              <p>
                Your service appointment has
                been added to My Bookings.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setShowSuccess(false)
              }
              aria-label="Close success message"
            >
              <i className="bi bi-x-lg"></i>
            </button>

          </div>

        )}

        {/* ERROR MESSAGE */}

        {errorMessage && (

          <div className="booking-error-alert mt-4">

            <div className="error-icon">

              <i className="bi bi-exclamation-triangle-fill"></i>

            </div>

            <div>

              <strong>
                Unable to Book Service
              </strong>

              <p>
                {errorMessage}
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setErrorMessage("")
              }
              aria-label="Close error message"
            >
              <i className="bi bi-x-lg"></i>
            </button>

          </div>

        )}

        {/* BOOKING FORM CARD */}

        <div className="vehicle-details-card book-service-card mt-4">

          {/* CARD HEADER */}

          <div className="details-card-header">

            <div>

              <span className="dashboard-label">
                APPOINTMENT DETAILS
              </span>

              <h3>
                Schedule Your Service
              </h3>

            </div>

            <i className="bi bi-tools"></i>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="mt-4"
          >

            <div className="row g-4">

              {/* SELECT VEHICLE */}

              <div className="col-md-6">

                <label htmlFor="vehicleId">
                  Select Vehicle
                </label>

                <select
                  id="vehicleId"
                  name="vehicleId"
                  value={formData.vehicleId}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Your Vehicle
                  </option>

                  {vehicles.map((vehicle) => (

                    <option
                      key={vehicle.id}
                      value={vehicle.id}
                    >

                      {vehicle.brand}{" "}
                      {vehicle.model} -{" "}
                      {vehicle.registration}

                    </option>

                  ))}

                </select>

              </div>

              {/* SELECT SERVICE */}

              <div className="col-md-6">

                <label htmlFor="service">
                  Select Service
                </label>

                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Service
                  </option>

                  <option value="Oil Change">
                    Oil Change
                  </option>

                  <option value="General Service">
                    General Service
                  </option>

                  <option value="Brake Service">
                    Brake Service
                  </option>

                  <option value="Battery Service">
                    Battery Service
                  </option>

                  <option value="AC Service">
                    AC Service
                  </option>

                  <option value="Full Car Inspection">
                    Full Car Inspection
                  </option>

                </select>

              </div>

              {/* DATE */}

              <div className="col-md-6">

                <label htmlFor="date">
                  Preferred Date
                </label>

                <input
                  id="date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={today}
                  required
                />

              </div>

              {/* TIME */}

              <div className="col-md-6">

                <label htmlFor="time">
                  Preferred Time
                </label>

                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Time
                  </option>

                  <option value="09:00 AM">
                    09:00 AM
                  </option>

                  <option value="10:00 AM">
                    10:00 AM
                  </option>

                  <option value="11:00 AM">
                    11:00 AM
                  </option>

                  <option value="12:00 PM">
                    12:00 PM
                  </option>

                  <option value="02:00 PM">
                    02:00 PM
                  </option>

                  <option value="03:00 PM">
                    03:00 PM
                  </option>

                  <option value="04:00 PM">
                    04:00 PM
                  </option>

                  <option value="05:00 PM">
                    05:00 PM
                  </option>

                </select>

              </div>

              {/* NOTES */}

              <div className="col-12">

                <label htmlFor="notes">
                  Additional Notes
                </label>

                <textarea
                  id="notes"
                  name="notes"
                  rows="5"
                  placeholder="Describe any issue or specific requirement..."
                  value={formData.notes}
                  onChange={handleChange}
                ></textarea>

              </div>

            </div>

            {/* FORM BUTTONS */}

            <div className="form-actions mt-4">

              <Link
                to="/vehicles"
                className="btn cancel-btn"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="btn save-vehicle-btn"
              >

                <i className="bi bi-calendar-check me-2"></i>

                Confirm Booking

              </button>

            </div>

          </form>

        </div>

        {/* VIEW BOOKINGS */}

        <div className="text-center mt-4">

          <button
            type="button"
            className="btn vehicle-view-btn"
            onClick={() =>
              navigate("/bookings")
            }
          >

            <i className="bi bi-calendar3 me-2"></i>

            View My Bookings

          </button>

        </div>

      </div>

    </div>
  );
}

export default BookService;