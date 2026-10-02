import { useState, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

import { AuthContext } from "./context/AuthContext";
import AuthProvider from "./context/AuthContext";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
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
// MAIN APP CONTENT
// =====================================================

function AppContent() {

  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);

  // =====================================================
  // VEHICLES
  // =====================================================

  const [vehicles, setVehicles] = useState([]);

  // =====================================================
  // BOOKINGS
  // =====================================================

  const [bookings, setBookings] = useState([]);


  // =====================================================
  // LOAD BOOKINGS FOR CURRENT USER
  // =====================================================

  useEffect(() => {

    const loadBookings = async () => {

      if (!user?.id) {

        console.log("NO LOGGED IN USER");

        setBookings([]);

        return;
      }

      console.log("=================================");
      console.log("LOGGED IN USER:", user);
      console.log("USER ID:", user.id);
      console.log(
        "BOOKING URL:",
        `http://localhost:8081/api/bookings/user/${user.id}`
      );
      console.log("=================================");


      try {

        const response = await axios.get(
          `http://localhost:8081/api/bookings/user/${user.id}`
        );

        console.log(
          "BOOKINGS FROM BACKEND:",
          response.data
        );


        const formattedBookings = response.data.map(
          (booking) => ({

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
              booking.status,

          })
        );


        setBookings(formattedBookings);

      } catch (error) {

        console.error(
          "FAILED TO LOAD BOOKINGS:",
          error
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

        const response = await axios.get(
          `http://localhost:8081/api/vehicles/user/${user.id}`
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

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            <Dashboard
              vehicles={vehicles}
              bookings={bookings}
            />
          }
        />


        {/* SERVICES */}

        <Route
          path="/services"
          element={<Services />}
        />


        {/* VEHICLES */}

        <Route
          path="/vehicles"
          element={
            <Vehicles
              vehicles={vehicles}
              setVehicles={setVehicles}
            />
          }
        />


        {/* VEHICLE DETAILS */}

        <Route
          path="/vehicles/:id"
          element={
            <VehicleDetails
              vehicles={vehicles}
              bookings={bookings}
            />
          }
        />


        {/* BOOKINGS */}

        <Route
          path="/bookings"
          element={
            <Bookings
              bookings={bookings}
              setBookings={setBookings}
            />
          }
        />


        {/* BOOK SERVICE */}

        <Route
          path="/book-service"
          element={
            <BookService
              vehicles={vehicles}
              bookings={bookings}
              setBookings={setBookings}
              setVehicles={setVehicles}
            />
          }
        />


        {/* LOGIN */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* REGISTER */}

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ADMIN */}

        <Route
  path="/admin"
  element={
    <ProtectedAdminRoute>
      <Admin />
    </ProtectedAdminRoute>
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

      <AppContent />

    </AuthProvider>

  );

}

export default App;