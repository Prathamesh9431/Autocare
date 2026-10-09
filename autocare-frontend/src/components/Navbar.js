import { NavLink, Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);

  const [menuOpen, setMenuOpen] = useState(false);

  // ========================================
  // CLOSE MOBILE MENU
  // ========================================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    closeMenu();
    logout();
    navigate("/login");
  };

  // ========================================
  // CHECK ADMIN
  // ========================================

  const isAdmin =
    user &&
    String(user.role).toUpperCase() === "ADMIN";

  return (
    <nav className="navbar navbar-expand-lg autocare-navbar">
      <div className="container">

        {/* ================================
            BRAND / LOGO
        ================================= */}

        <Link
          className="navbar-brand d-flex align-items-center"
          to="/"
          onClick={closeMenu}
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
          onClick={() => setMenuOpen((previous) => !previous)}
          aria-controls="mainNavbar"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <i
            className={
              menuOpen
                ? "bi bi-x-lg"
                : "bi bi-list"
            }
          ></i>
        </button>


        {/* ================================
            NAVIGATION
        ================================= */}

        <div
          className={`collapse navbar-collapse ${
            menuOpen ? "show" : ""
          }`}
          id="mainNavbar"
        >

          <ul className="navbar-nav mx-auto">

            {/* HOME */}

            <li className="nav-item">
              <NavLink
                to="/"
                end
                onClick={closeMenu}
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
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Services
              </NavLink>
            </li>


            {/* =================================
                CUSTOMER NAVIGATION
            ================================= */}

            {user && !isAdmin && (
              <>

                {/* DASHBOARD */}

                <li className="nav-item">
                  <NavLink
                    to="/dashboard"
                    onClick={closeMenu}
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
                    onClick={closeMenu}
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
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      isActive
                        ? "nav-link active"
                        : "nav-link"
                    }
                  >
                    My Bookings
                  </NavLink>
                </li>

              </>
            )}


            {/* =================================
                ADMIN NAVIGATION
            ================================= */}

            {isAdmin && (

              <li className="nav-item">

                <NavLink
                  to="/admin"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    isActive
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  Admin Dashboard
                </NavLink>

              </li>

            )}

          </ul>


          {/* ================================
              RIGHT SIDE BUTTONS
          ================================= */}

          <div className="navbar-right-buttons">

            {user ? (

              <>

                {/* CUSTOMER → BOOK SERVICE */}

                {!isAdmin && (

                  <NavLink
                    to="/book-service"
                    onClick={closeMenu}
                    className="btn btn-book"
                  >
                    Book Service

                    <i className="bi bi-arrow-right ms-2"></i>

                  </NavLink>

                )}


                {/* ADMIN → ADMIN DASHBOARD */}

                {isAdmin && (

                  <NavLink
                    to="/admin"
                    onClick={closeMenu}
                    className="btn btn-book"
                  >
                    Admin Dashboard

                    <i className="bi bi-speedometer2 ms-2"></i>

                  </NavLink>

                )}


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
                  onClick={closeMenu}
                  className="btn btn-login"
                >
                  Login
                </NavLink>


                {/* REGISTER */}

                <NavLink
                  to="/register"
                  onClick={closeMenu}
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