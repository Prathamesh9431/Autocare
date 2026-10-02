import { NavLink, Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg autocare-navbar">
      <div className="container">

        {/* ================================
            BRAND / LOGO
        ================================= */}

        <Link
          className="navbar-brand d-flex align-items-center"
          to="/"
        >
          <div className="brand-icon">
            <img
              src="/autocare-logo.png"
              alt="AutoCare"
              className="autocare-logo"
            />
          </div>

          <div className="brand-text ms-2">

            <div className="brand-name">
              AutoCare
            </div>

            <small className="brand-tagline">
              Vehicle Care, Simplified
            </small>

            {user && (
              <div className="navbar-username">
                {user.name}
              </div>
            )}

          </div>
        </Link>


        {/* ================================
            MOBILE MENU BUTTON
        ================================= */}

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>


        {/* ================================
            NAVIGATION
        ================================= */}

        <div
          className="collapse navbar-collapse"
          id="mainNavbar"
        >

          <ul className="navbar-nav mx-auto">

            {/* HOME */}

            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Home
              </NavLink>
            </li>


            {/* SERVICES */}

            <li className="nav-item">
              <NavLink
                to="/services"
                className={({ isActive }) =>
                  isActive
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Services
              </NavLink>
            </li>


            {/* DASHBOARD */}

            <li className="nav-item">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Dashboard
              </NavLink>
            </li>


            {/* MY VEHICLES */}

            <li className="nav-item">
              <NavLink
                to="/vehicles"
                className={({ isActive }) =>
                  isActive
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                My Vehicles
              </NavLink>
            </li>


            {/* MY BOOKINGS */}

            <li className="nav-item">
              <NavLink
                to="/bookings"
                className={({ isActive }) =>
                  isActive
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                My Bookings
              </NavLink>
            </li>

          </ul>


          {/* ================================
              RIGHT SIDE BUTTONS
          ================================= */}

          <div className="navbar-right-buttons">

            {user ? (
              <>

                {/* BOOK SERVICE */}

                <NavLink
                  to="/book-service"
                  className="btn btn-book"
                >
                  Book Service
                  <i className="bi bi-arrow-right ms-2"></i>
                </NavLink>


                {/* LOGOUT */}

                <button
                  type="button"
                  className="btn btn-login"
                  onClick={handleLogout}
                >
                  Logout
                </button>

              </>
            ) : (
              <>

                {/* LOGIN */}

                <NavLink
                  to="/login"
                  className="btn btn-login"
                >
                  Login
                </NavLink>


                {/* REGISTER */}

                <NavLink
                  to="/register"
                  className="btn btn-book"
                >
                  Register
                </NavLink>

              </>
            )}

          </div>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;