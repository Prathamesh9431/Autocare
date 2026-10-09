import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/axiosConfig";
import emailjs from "@emailjs/browser";
import { AuthContext } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
const { showNotification } = useNotification();

  // ================================
  // LOGIN DATA
  // ================================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // ================================
  // FORGOT PASSWORD
  // ================================

  const [showForgotPassword, setShowForgotPassword] =
    useState(false);

  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  

  const [forgotStep, setForgotStep] = useState(1);
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [loading, setLoading] = useState(false);

  // ================================
  // LOGIN INPUT
  // ================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
  };

  // ================================
  // LOGIN
  // ================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await api.post("/api/users/login", {
  email: formData.email,
  password: formData.password,
});

      login(response.data);

      // remove browser alert

showNotification({
  title: "Login successful",
  message: "Welcome back to AutoCare!",
  type: "success",
});

      if (response.data.user.role === "ADMIN") {
    navigate("/admin");
} else {
    navigate("/dashboard");
}
    } catch (error) {
      if (error.response) {
        setError(
          error.response.data.message ||
            "Invalid email or password."
        );
      } else {
        setError("Cannot connect to the server.");
      }
    }
  };

  // ================================
  // OPEN FORGOT PASSWORD
  // ================================

  const openForgotPassword = () => {
    setForgotEmail(formData.email);
    setForgotStep(1);
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setForgotMessage("");
    setForgotError("");
    
    
    setShowForgotPassword(true);
  };

  // ================================
  // CLOSE FORGOT PASSWORD
  // ================================

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotStep(1);
    setForgotMessage("");
    setForgotError("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    
  };

  // ================================
  // SEND OTP
  // ================================

  const handleSendOtp = async () => {
    setForgotError("");
    setForgotMessage("");

    if (!forgotEmail) {
      setForgotError("Please enter your email address.");
      return;
    }

    if (!forgotEmail.includes("@")) {
      setForgotError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/api/users/forgot-password", {
  email: forgotEmail,
});

      const generatedOtp = response.data;

      console.log("Generated OTP:", generatedOtp);

      // ================================
      // EMAILJS
      // ================================

      await emailjs.send(
        "service_twrqcdh",
        "template_kyfjm1t",
        {
          to_email: forgotEmail,
          email: forgotEmail,
          otp: generatedOtp,
        },
        "6lSbt61RG-h0-1nlQ"
      );

      setForgotMessage(
        "OTP has been sent to your email."
      );

      setForgotStep(2);
    } catch (error) {
      console.error("Forgot password error:", error);

      if (error.response) {
        setForgotError(
          error.response.data.message ||
            "Unable to send OTP."
        );
      } else {
        setForgotError(
          "Unable to send OTP. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // VERIFY OTP
  // ================================

  const handleVerifyOtp = async () => {
    setForgotError("");
    setForgotMessage("");

    if (!otp || otp.length !== 6) {
      setForgotError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/api/users/verify-otp", {
  email: forgotEmail,
  otp: otp,
});

      console.log("OTP verification:", response.data);

      setForgotMessage(
        "OTP verified successfully."
      );

      setForgotStep(3);
    } catch (error) {
      console.error(
        "OTP verification error:",
        error
      );

      setForgotError(
        error.response?.data?.message ||
          "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // RESET PASSWORD
  // ================================

  const handleResetPassword = async () => {
    setForgotError("");
    setForgotMessage("");

    if (!newPassword || !confirmPassword) {
      setForgotError(
        "Please enter your new password."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotError(
        "Passwords do not match."
      );
      return;
    }

    if (newPassword.length < 6) {
      setForgotError(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/users/reset-password", {
  email: forgotEmail,
  otp: otp,
  newPassword: newPassword,
});

      setForgotMessage(
        "Password reset successfully! You can now login."
      );

      setTimeout(() => {
        closeForgotPassword();

        setFormData({
          email: forgotEmail,
          password: "",
        });
      }, 2000);
    } catch (error) {
      console.error(
        "Password reset error:",
        error
      );

      setForgotError(
        error.response?.data?.message ||
          "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-container">

        {/* ================================
            LEFT SIDE
        ================================= */}

        <div className="login-info">

          <Link to="/" className="login-brand">

  <img
    src="/autocare-logo.png"
    alt="AutoCare Logo"
    className="login-logo-image"
  />

  <div>
    <h2>AutoCare</h2>
    <span>Vehicle Care, Simplified</span>
  </div>

</Link>

          <div className="login-info-content">

            <span className="dashboard-label">
              WELCOME BACK
            </span>

            <h1>
              Your vehicle's care,
              <br />
              <span>made simple.</span>
            </h1>

            <p>
              Manage your vehicles, schedule
              services, and keep track of your
              maintenance — all in one place.
            </p>

            <div className="login-feature">
              <i className="bi bi-check-circle-fill"></i>
              <span>
                Manage all your vehicles
              </span>
            </div>

            <div className="login-feature">
              <i className="bi bi-check-circle-fill"></i>
              <span>
                Book and manage service appointments
              </span>
            </div>

            <div className="login-feature">
              <i className="bi bi-check-circle-fill"></i>
              <span>
                Track your vehicle maintenance history
              </span>
            </div>

          </div>

        </div>

        {/* ================================
            RIGHT SIDE
        ================================= */}

        <div className="login-form-wrapper">

          <div className="login-form-card">

            <div className="login-form-header">

              <div className="mobile-login-icon">
                <i className="bi bi-car-front-fill"></i>
              </div>

              <h1>Welcome Back</h1>

              <p>
                Sign in to continue to your
                AutoCare account.
              </p>

            </div>

            {/* ERROR */}

            {error && (
              <div className="login-error">

                <i className="bi bi-exclamation-circle-fill"></i>

                <span>{error}</span>

              </div>
            )}

            {/* LOGIN FORM */}

            <form onSubmit={handleSubmit}>

              {/* EMAIL */}

              <div className="login-input-group">

                <label htmlFor="email">
                  Email Address
                </label>

                <div className="login-input-wrapper">

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

              {/* PASSWORD */}

              <div className="login-input-group">

                <div className="password-label-row">

                  <label htmlFor="password">
                    Password
                  </label>

                  <button
                    type="button"
                    className="forgot-password"
                    onClick={openForgotPassword}
                  >
                    Forgot Password?
                  </button>

                </div>

                <div className="login-input-wrapper">

                  <i className="bi bi-lock"></i>

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    tabIndex={-1}
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous
                      )
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

              {/* REMEMBER ME */}

              <div className="remember-me">

                <label>

                  <input type="checkbox" />

                  <span>
                    Remember me
                  </span>

                </label>

              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="btn login-submit-btn"
              >
                Sign In
                <i className="bi bi-arrow-right ms-2"></i>
              </button>

            </form>

            {/* REGISTER */}

            <div className="login-register">

              <span>
                Don't have an account?
              </span>

              <Link to="/register">
                Create Account
              </Link>

            </div>

            {/* BACK HOME */}

            <Link
              to="/"
              className="login-back-home"
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Home
            </Link>

          </div>

        </div>

      </div>

      {/* =====================================================
          FORGOT PASSWORD MODAL
      ===================================================== */}

      {showForgotPassword && (
  <div className="forgot-modal-overlay">

    <div className="forgot-modal">

      {/* CLOSE BUTTON */}
      <button
        type="button"
        className="forgot-modal-close"
        onClick={closeForgotPassword}
        tabIndex="-1"
      >
        <i className="bi bi-x-lg"></i>
      </button>

      {/* ICON */}
      <div className="forgot-modal-icon">
        <i className="bi bi-shield-lock-fill"></i>
      </div>

      {/* HEADER */}
      <div className="forgot-modal-header">

        <h2>Forgot Password?</h2>

        <p>
          Reset your AutoCare password securely.
        </p>

      </div>

      {/* SUCCESS MESSAGE */}
      {forgotMessage && (
        <div className="forgot-success">
          <i className="bi bi-check-circle-fill"></i>
          <span>{forgotMessage}</span>
        </div>
      )}

      {/* ERROR MESSAGE */}
      {forgotError && (
        <div className="forgot-error">
          <i className="bi bi-exclamation-circle-fill"></i>
          <span>{forgotError}</span>
        </div>
      )}

      {/* STEP 1 */}
      {forgotStep === 1 && (
        <div className="forgot-step">

          <label>
            Email Address
          </label>

          <div className="forgot-input-wrapper">

            <i className="bi bi-envelope"></i>

            <input
              type="email"
              placeholder="Enter your registered email"
              value={forgotEmail}
              onChange={(event) =>
                setForgotEmail(event.target.value)
              }
            />

          </div>

          <button
            type="button"
            className="forgot-submit-btn"
            onClick={handleSendOtp}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="forgot-spinner"></span>
                Sending OTP...
              </>
            ) : (
              <>
                Send OTP
                <i className="bi bi-arrow-right"></i>
              </>
            )}
          </button>

        </div>
      )}

      {/* STEP 2 */}
      {forgotStep === 2 && (
        <div className="forgot-step">

          <label>
            Enter OTP
          </label>

          <div className="forgot-input-wrapper">

            <i className="bi bi-shield-lock"></i>

            <input
              type="text"
              className="otp-input"
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              value={otp}
              onChange={(event) =>
                setOtp(
                  event.target.value.replace(/\D/g, "")
                )
              }
            />

          </div>

          <button
            type="button"
            className="forgot-submit-btn"
            onClick={handleVerifyOtp}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="forgot-spinner"></span>
                Verifying...
              </>
            ) : (
              <>
                Verify OTP
                <i className="bi bi-check2"></i>
              </>
            )}
          </button>

        </div>
      )}

      {/* STEP 3 */}
      {forgotStep === 3 && (
        <div className="forgot-step">

          <label>
            New Password
          </label>

          <div className="forgot-input-wrapper">

            <i className="bi bi-lock"></i>

            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(event.target.value)
              }
            />

          </div>

          <label className="forgot-confirm-label">
            Confirm Password
          </label>

          <div className="forgot-input-wrapper">

            <i className="bi bi-lock-fill"></i>

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
            />

          </div>

          <button
            type="button"
            className="forgot-submit-btn"
            onClick={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="forgot-spinner"></span>
                Resetting...
              </>
            ) : (
              <>
                Reset Password
                <i className="bi bi-arrow-right"></i>
              </>
            )}
          </button>

        </div>
      )}

    </div>
  </div>
)}

    </div>
  );
}

export default Login;