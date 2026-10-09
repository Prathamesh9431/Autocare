import { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

function Vehicles({ vehicles, setVehicles }) {
  const { user } = useContext(AuthContext);
  const { showNotification } = useNotification();

  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const formRef = useRef(null);

  // ========================================
  // FORM DATA
  // ========================================

  const [formData, setFormData] = useState({
    type: "",
    brand: "",
    model: "",
    year: "",
    fuel: "",
    registration: "",
    mileage: "",
  });

  // ========================================
  // FORMAT REGISTRATION
  // ========================================

  const formatRegistration = (value) => {
    return value.toUpperCase();
  };

  // ========================================
  // LOAD CURRENT USER'S VEHICLES
  // ========================================

  const loadVehicles = async () => {
    if (!user?.id) {
      setVehicles([]);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8081/api/vehicles/user/${user.id}`
      );

      setVehicles(response.data);
    } catch (error) {
      console.error("Failed to load vehicles:", error);

      setVehicles([]);

      showNotification({
        title: "Unable to load vehicles",
        message: "Could not load your vehicles.",
        type: "error",
      });
    }
  };

  // ========================================
  // LOAD WHEN USER CHANGES
  // ========================================

  useEffect(() => {
    loadVehicles();
  }, [user]);

  // ========================================
  // HANDLE INPUT CHANGE
  // ========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "registration") {
      setFormData((previousData) => ({
        ...previousData,
        registration: formatRegistration(value),
      }));

      return;
    }

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // ========================================
  // ADD / UPDATE VEHICLE
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user?.id) {
      showNotification({
        title: "Login required",
        message: "Please login first.",
        type: "warning",
      });

      return;
    }

    try {
      const vehicleData = {
        userId: user.id,
        type: formData.type,
        brand: formData.brand,
        model: formData.model,
        year: Number(formData.year),
        fuel: formData.fuel,
        registration: formData.registration,
        mileage: Number(formData.mileage),
      };

      // ====================================
      // UPDATE VEHICLE
      // ====================================

      if (isEditing) {
        await axios.put(
          `http://localhost:8081/api/vehicles/${editingVehicleId}?userId=${user.id}`,
          vehicleData
        );

        showNotification({
          title: "Vehicle updated",
          message: "Your vehicle was updated successfully.",
          type: "success",
        });
      }

      // ====================================
      // ADD VEHICLE
      // ====================================

      else {
        await axios.post(
          "http://localhost:8081/api/vehicles",
          vehicleData
        );

        showNotification({
          title: "Vehicle added",
          message: "Your vehicle was added successfully.",
          type: "success",
        });
      }

      // Reload vehicles
      await loadVehicles();

      // Reset form
      setEditingVehicleId(null);
      setIsEditing(false);

      setFormData({
        type: "",
        brand: "",
        model: "",
        year: "",
        fuel: "",
        registration: "",
        mileage: "",
      });

      setShowForm(false);
    } catch (error) {
      console.error("Vehicle save error:", error);

      showNotification({
        title: "Unable to save vehicle",
        message:
          error.response?.data?.message ||
          error.response?.data ||
          "Failed to save vehicle.",
        type: "error",
      });
    }
  };

  // ========================================
  // DELETE VEHICLE
  // ========================================

  const deleteVehicle = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );

    if (!confirmDelete) {
      return;
    }

    if (!user?.id) {
      showNotification({
        title: "Login required",
        message: "Please login first.",
        type: "warning",
      });

      return;
    }

    try {
      await axios.delete(
        `http://localhost:8081/api/vehicles/${id}?userId=${user.id}`
      );

      await loadVehicles();

      showNotification({
        title: "Vehicle deleted",
        message: "The vehicle was removed from your garage.",
        type: "success",
      });
    } catch (error) {
      console.error("Delete vehicle error:", error);

      showNotification({
        title: "Unable to delete vehicle",
        message:
          error.response?.data?.message ||
          "Failed to delete vehicle.",
        type: "error",
      });
    }
  };

  // ========================================
  // EDIT VEHICLE
  // ========================================

  const editVehicle = (vehicle) => {
    setFormData({
      type: vehicle.type,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      fuel: vehicle.fuel,
      registration: vehicle.registration,
      mileage: vehicle.mileage,
    });

    setEditingVehicleId(vehicle.id);
    setIsEditing(true);
    setShowForm(true);

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // ========================================
  // OPEN FORM
  // ========================================

  const openForm = () => {
    setIsEditing(false);
    setEditingVehicleId(null);

    setFormData({
      type: "",
      brand: "",
      model: "",
      year: "",
      fuel: "",
      registration: "",
      mileage: "",
    });

    setShowForm(true);

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // ========================================
  // CLOSE FORM
  // ========================================

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditingVehicleId(null);

    setFormData({
      type: "",
      brand: "",
      model: "",
      year: "",
      fuel: "",
      registration: "",
      mileage: "",
    });
  };

  // ========================================
  // PAGE
  // ========================================

  return (
    <div className="vehicles-page">
      <div className="container py-5">

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="vehicles-header">
          <div>
            <span className="dashboard-label">
              YOUR GARAGE
            </span>

            <h1>
              My Vehicles
            </h1>

            <p>
              Manage your vehicles and keep track
              of their maintenance.
            </p>
          </div>

          <button
            type="button"
            className="btn add-vehicle-btn"
            onClick={openForm}
          >
            <i className="bi bi-plus-lg me-2"></i>

            {isEditing
              ? "Update Vehicle"
              : "Add Vehicle"}
          </button>
        </div>

        {/* ========================================
            ADD / UPDATE FORM
        ======================================== */}

        {showForm && (
          <div
            ref={formRef}
            className="add-vehicle-form mt-4"
          >
            <div className="form-header">
              <div>
                <span className="dashboard-label">
                  {isEditing
                    ? "EDIT VEHICLE"
                    : "NEW VEHICLE"}
                </span>

                <h3>
                  {isEditing
                    ? "Update Vehicle"
                    : "Add Vehicle to Your Garage"}
                </h3>
              </div>

              <i className="bi bi-car-front-fill"></i>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">

                {/* VEHICLE TYPE */}

                <div className="col-md-6">
                  <label htmlFor="type">
                    Vehicle Type
                  </label>

                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Vehicle Type
                    </option>

                    <option value="Sedan">
                      Sedan
                    </option>

                    <option value="SUV">
                      SUV
                    </option>

                    <option value="Hatchback">
                      Hatchback
                    </option>

                    <option value="Bike">
                      Bike
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                {/* BRAND */}

                <div className="col-md-6">
                  <label htmlFor="brand">
                    Brand
                  </label>

                  <input
                    id="brand"
                    type="text"
                    name="brand"
                    placeholder="e.g. Honda"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* MODEL */}

                <div className="col-md-6">
                  <label htmlFor="model">
                    Model
                  </label>

                  <input
                    id="model"
                    type="text"
                    name="model"
                    placeholder="e.g. City"
                    value={formData.model}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* YEAR */}

                <div className="col-md-6">
                  <label htmlFor="year">
                    Manufacturing Year
                  </label>

                  <input
                    id="year"
                    type="number"
                    name="year"
                    placeholder="e.g. 2024"
                    value={formData.year}
                    onChange={handleChange}
                    min="1900"
                    max="2100"
                    required
                  />
                </div>

                {/* FUEL */}

                <div className="col-md-6">
                  <label htmlFor="fuel">
                    Fuel Type
                  </label>

                  <select
                    id="fuel"
                    name="fuel"
                    value={formData.fuel}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Fuel Type
                    </option>

                    <option value="Petrol">
                      Petrol
                    </option>

                    <option value="Diesel">
                      Diesel
                    </option>

                    <option value="Electric">
                      Electric
                    </option>

                    <option value="Hybrid">
                      Hybrid
                    </option>

                    <option value="CNG">
                      CNG
                    </option>
                  </select>
                </div>

                {/* REGISTRATION */}

                <div className="col-md-6">
                  <label htmlFor="registration">
                    Registration Number
                  </label>

                  <input
                    id="registration"
                    type="text"
                    name="registration"
                    placeholder="e.g. KA 22 EF 1234"
                    value={formData.registration}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* MILEAGE */}

                <div className="col-md-6">
                  <label htmlFor="mileage">
                    Current Mileage (km)
                  </label>

                  <input
                    id="mileage"
                    type="number"
                    name="mileage"
                    placeholder="e.g. 15000"
                    value={formData.mileage}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* FORM BUTTONS */}

              <div className="form-actions">
                <button
                  type="button"
                  className="btn cancel-btn"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn save-vehicle-btn"
                >
                  <i className="bi bi-check-lg me-2"></i>

                  {isEditing
                    ? "Update Vehicle"
                    : "Add Vehicle"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================
            VEHICLE CARDS
        ======================================== */}

        <div className="row g-4 mt-4">

          {vehicles.map((vehicle) => (
            <div
              className="col-lg-6"
              key={vehicle.id}
            >
              <div className="vehicle-card">

                {/* CARD TOP */}

                <div className="vehicle-card-top">
                  <div className="large-vehicle-icon">
                    <i
                      className={
                        vehicle.type === "Bike"
                          ? "bi bi-bicycle"
                          : "bi bi-car-front-fill"
                      }
                    ></i>
                  </div>

                  <button
                    type="button"
                    className="delete-vehicle-btn"
                    onClick={() =>
                      deleteVehicle(vehicle.id)
                    }
                    title="Delete Vehicle"
                  >
                    <i className="bi bi-trash3"></i>
                  </button>
                </div>

                {/* VEHICLE INFORMATION */}

                <div className="vehicle-card-info">
                  <span className="vehicle-type">
                    {vehicle.type}
                  </span>

                  <h2>
                    {vehicle.brand} {vehicle.model}
                  </h2>

                  <p>
                    {vehicle.year} • {vehicle.fuel}
                  </p>
                </div>

                {/* VEHICLE STATS */}

                <div className="vehicle-stats">

                  <div>
                    <span>
                      REGISTRATION
                    </span>

                    <strong>
                      {vehicle.registration}
                    </strong>
                  </div>

                  <div>
                    <span>
                      MILEAGE
                    </span>

                    <strong>
                      {Number(
                        vehicle.mileage
                      ).toLocaleString()}{" "}
                      km
                    </strong>
                  </div>

                </div>

                {/* SERVICE STATUS */}

                <div className="vehicle-service-status">

                  <div>
                    <span>
                      NEXT SERVICE
                    </span>

                    <strong>
                      {vehicle.nextService ||
                        "Not Scheduled"}
                    </strong>
                  </div>

                  <div className="service-due">
                    {vehicle.serviceDue ||
                      "Schedule Service"}
                  </div>

                </div>

                {/* ACTION BUTTONS */}

                <div className="vehicle-card-actions">

                  <button
                    type="button"
                    className="btn vehicle-edit-btn"
                    onClick={() =>
                      editVehicle(vehicle)
                    }
                  >
                    Edit
                  </button>

                  <Link
                    to="/book-service"
                    className="btn vehicle-book-btn"
                  >
                    Book Service
                  </Link>

                  <Link
                    to={`/vehicles/${vehicle.id}`}
                    className="btn vehicle-view-btn"
                  >
                    View Details
                  </Link>

                </div>

              </div>
            </div>
          ))}

          {/* ========================================
              ADD ANOTHER VEHICLE
          ======================================== */}

          <div className="col-lg-6">

            <div
              className="add-vehicle-card"
              onClick={openForm}
            >
              <div className="add-vehicle-icon">
                <i className="bi bi-plus-lg"></i>
              </div>

              <h3>
                Add Another Vehicle
              </h3>

              <p>
                Add your car, bike, or other vehicle
                to manage its maintenance.
              </p>

              <button
                type="button"
                className="btn add-vehicle-outline"
                onClick={(event) => {
                  event.stopPropagation();
                  openForm();
                }}
              >
                Add Vehicle
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Vehicles;