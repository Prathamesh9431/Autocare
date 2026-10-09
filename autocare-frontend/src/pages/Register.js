import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/axiosConfig";
import { useNotification } from "../context/NotificationContext";

function Register() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to the Terms and Conditions.");
      return;
    }

    try {
      const response = await api.post(
  "/api/users/register",
  {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    password: formData.password,
  }
);

      console.log(response.data);

      showNotification({
  title: "Account Created",
  message: "Your AutoCare account has been created successfully.",
  type: "success",
});

      navigate("/login");
    } catch (error) {
      if (error.response) {
        setError(
          error.response.data.message || "Registration failed."
        );
      } else {
        setError("Cannot connect to the server.");
      }
    }
  };

  return (
    <div className="register-page">

      <div className="register-container">

        {/* ================================
            LEFT SIDE
        ================================= */}

        <div className="register-info">

          <Link
            to="/"
            className="register-brand"
          >

            {/* NEW AUTOCARE LOGO */}
            <div className="register-logo">
              <img
                src="/autocare-logo.png"
                alt="AutoCare Logo"
              />
            </div>

            <div>
              <h2>AutoCare</h2>

              <span>
                Vehicle Care, Simplified
              </span>
            </div>

          </Link>

          <div className="register-info-content">

            <span className="dashboard-label">
              JOIN AUTOCARE
            </span>

            <h1>
              Take better care
              <br />
              <span>of your vehicle.</span>
            </h1>

            <p>
              Create your AutoCare account and manage
              your vehicles, services, and maintenance
              history from one simple dashboard.
            </p>

            <div className="register-feature">

              <i className="bi bi-check-circle-fill"></i>

              <span>
                Keep all your vehicles in one place
              </span>

            </div>

            <div className="register-feature">

              <i className="bi bi-check-circle-fill"></i>

              <span>
                Schedule services with ease
              </span>

            </div>

            <div className="register-feature">

              <i className="bi bi-check-circle-fill"></i>

              <span>
                Track your complete service history
              </span>

            </div>

          </div>

        </div>


        {/* ================================
            RIGHT SIDE
        ================================= */}

        <div className="register-form-wrapper">

          <div className="register-form-card">

            {/* HEADER */}

            <div className="register-form-header">

              <div className="mobile-register-icon">
                <i className="bi bi-person-plus-fill"></i>
              </div>

              <h1>
                Create Account
              </h1>

              <p>
                Create your AutoCare account to get started.
              </p>

            </div>


            {/* ERROR */}

            {error && (
              <div className="register-error">

                <i className="bi bi-exclamation-circle-fill"></i>

                <span>
                  {error}
                </span>

              </div>
            )}


            {/* FORM */}

            <form
              className="register-form"
              onSubmit={handleSubmit}
            >

              {/* FULL NAME */}

              <div className="register-input-group">

                <label htmlFor="name">
                  Full Name
                </label>

                <div className="register-input-wrapper">

                  <i className="bi bi-person"></i>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              {/* EMAIL */}

              <div className="register-input-group">

                <label htmlFor="email">
                  Email Address
                </label>

                <div className="register-input-wrapper">

                  <i className="bi bi-envelope"></i>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              {/* PHONE */}

              <div className="register-input-group">

                <label htmlFor="phone">
                  Phone Number
                </label>

                <div className="register-input-wrapper">

                  <i className="bi bi-telephone"></i>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div className="register-input-group">

                <label htmlFor="password">
                  Password
                </label>

                <div className="register-input-wrapper">

                  <i className="bi bi-lock"></i>

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <button
  type="button"
  className="register-password-toggle"
  tabIndex={-1}
  onClick={() =>
    setShowPassword((previous) => !previous)
  }
>
                    <i
                      className={
                        showPassword
                          ? "bi bi-eye-slash"
                          : "bi bi-eye"
                      }
                    ></i>
                  </button>

                </div>

              </div>


              {/* CONFIRM PASSWORD */}

              <div className="register-input-group">

                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <div className="register-input-wrapper">

                  <i className="bi bi-lock-fill"></i>

                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) => !previous
                      )
                    }
                  >
                    <i
                      className={
                        showConfirmPassword
                          ? "bi bi-eye-slash"
                          : "bi bi-eye"
                      }
                    ></i>
                  </button>

                </div>

              </div>


              {/* TERMS */}

              <div className="register-terms">

                <label>

                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(event) =>
                      setAgreeTerms(
                        event.target.checked
                      )
                    }
                  />

                  <span>
                    I agree to the Terms and Conditions
                  </span>

                </label>

              </div>


              {/* REGISTER BUTTON */}

              <button
                type="submit"
                className="btn register-submit-btn"
              >

                Create Account

                <i className="bi bi-arrow-right ms-2"></i>

              </button>

            </form>


            {/* LOGIN LINK */}

            <div className="register-login">

              <span>
                Already have an account?
              </span>

              <Link to="/login">
                Sign In
              </Link>

            </div>


            {/* BACK HOME */}

            <Link
              to="/"
              className="register-back-home"
            >

              <i className="bi bi-arrow-left me-2"></i>

              Back to Home

            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;