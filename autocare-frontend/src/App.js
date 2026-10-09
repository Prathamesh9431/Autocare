import { useState, useEffect, useContext } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import api from "./services/axiosConfig";

import {
  NotificationProvider
} from "./context/NotificationContext";

import {
  AuthContext
} from "./context/AuthContext";

import AuthProvider from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Loader from "./components/Loader";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import VehicleDetails from "./pages/VehicleDetails";
import BookService from "./pages/BookService";
import Bookings from "./pages/Bookings";
import Services from "./pages/Services";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";

import "./App.css";


// =====================================================
// PROTECTED ROUTE
// =====================================================

function ProtectedRoute({ children }) {

  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


// =====================================================
// ADMIN ROUTE
// =====================================================

function AdminRoute({ children }) {

  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    String(user.role).toUpperCase() !== "ADMIN"
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}


// =====================================================
// MAIN APP CONTENT
// =====================================================

function AppContent() {

  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);

  const [vehicles, setVehicles] = useState([]);

  const [bookings, setBookings] = useState([]);


  // =====================================================
  // LOAD BOOKINGS FOR CURRENT USER
  // =====================================================

  useEffect(() => {

    const loadBookings = async () => {

      if (!user?.id) {
        setBookings([]);
        return;
      }

      try {

        console.log(
          "Loading bookings for user:",
          user.id
        );

        const response = await api.get(
          `/api/bookings/user/${user.id}`
        );

        console.log(
          "USER BOOKINGS:",
          response.data
        );

        const formattedBookings =
          response.data.map((booking) => ({

            id: booking.id,

            bookingReference:
              booking.bookingReference,

            userId:
              booking.userId,

            vehicleId:
              booking.vehicleId,

            vehicleName:
              booking.vehicleName,

            registration:
              booking.registration,

            service:
              booking.serviceType,

            serviceType:
              booking.serviceType,

            date:
              booking.serviceDate,

            serviceDate:
              booking.serviceDate,

            time:
              booking.serviceTime,

            serviceTime:
              booking.serviceTime,

            notes:
              booking.notes,

            status:
              booking.status

          }));

        setBookings(formattedBookings);

      } catch (error) {

        console.error(
          "FAILED TO LOAD BOOKINGS:",
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

        setBookings([]);

      }

    };

    loadBookings();

  }, [user]);


  // =====================================================
  // LOAD VEHICLES FOR CURRENT USER
  // =====================================================

  useEffect(() => {

    const loadUserVehicles = async () => {

      if (!user?.id) {
        setVehicles([]);
        return;
      }

      try {

        console.log(
          "Loading vehicles for user:",
          user.id
        );

        const response = await api.get(
          `/api/vehicles/user/${user.id}`
        );

        console.log(
          "USER VEHICLES:",
          response.data
        );

        setVehicles(response.data);

      } catch (error) {

        console.error(
          "FAILED TO LOAD USER VEHICLES:",
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

        setVehicles([]);

      }

    };

    loadUserVehicles();

  }, [user]);


  // =====================================================
  // SAVE VEHICLES TO LOCAL STORAGE
  // =====================================================

  useEffect(() => {

    localStorage.setItem(
      "autocareVehicles",
      JSON.stringify(vehicles)
    );

  }, [vehicles]);


  // =====================================================
  // LOADING SCREEN
  // =====================================================

  useEffect(() => {

    const timer = setTimeout(() => {

      setLoading(false);

    }, 1000);

    return () => clearTimeout(timer);

  }, []);


  // =====================================================
  // SHOW LOADER
  // =====================================================

  if (loading) {
    return <Loader />;
  }


  // =====================================================
  // APPLICATION
  // =====================================================

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* ================= HOME ================= */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* ================= SERVICES ================= */}

        <Route
          path="/services"
          element={<Services />}
        />


        {/* ================= LOGIN ================= */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* ================= REGISTER ================= */}

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ================= DASHBOARD ================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>

              <Dashboard
                vehicles={vehicles}
                bookings={bookings}
              />

            </ProtectedRoute>
          }
        />


        {/* ================= VEHICLES ================= */}

        <Route
          path="/vehicles"
          element={
            <ProtectedRoute>

              <Vehicles
                vehicles={vehicles}
                setVehicles={setVehicles}
              />

            </ProtectedRoute>
          }
        />


        {/* ================= VEHICLE DETAILS ================= */}

        <Route
          path="/vehicles/:id"
          element={
            <ProtectedRoute>

              <VehicleDetails
                vehicles={vehicles}
                bookings={bookings}
              />

            </ProtectedRoute>
          }
        />


        {/* ================= BOOKINGS ================= */}

        <Route
          path="/bookings"
          element={
            <ProtectedRoute>

              <Bookings
                bookings={bookings}
                setBookings={setBookings}
              />

            </ProtectedRoute>
          }
        />


        {/* ================= BOOK SERVICE ================= */}

        <Route
          path="/book-service"
          element={
            <ProtectedRoute>

              <BookService
                vehicles={vehicles}
                bookings={bookings}
                setBookings={setBookings}
                setVehicles={setVehicles}
              />

            </ProtectedRoute>
          }
        />


        {/* ================= ADMIN ================= */}

        <Route
          path="/admin"
          element={
            <AdminRoute>

              <Admin />

            </AdminRoute>
          }
        />


        {/* ================= UNKNOWN URL ================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>

  );
}


// =====================================================
// APP
// =====================================================

function App() {

  return (

    <AuthProvider>

      <NotificationProvider>

        <AppContent />

      </NotificationProvider>

    </AuthProvider>

  );
}


export default App;