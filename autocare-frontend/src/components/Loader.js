import "../App.css";

function Loader() {
  return (
    <div className="loader-screen">

      <div className="loader-content">

        {/* LOGO / ICON */}

        <div className="loader-logo">
          <i className="bi bi-tools"></i>
        </div>


        {/* BRAND */}

        <h1>
          AUTO<span>CARE</span>
        </h1>

        <p>
          Your vehicle. Our care.
        </p>


        {/* LOADING ANIMATION */}

        <div className="loader-spinner">
          <div></div>
        </div>


        <span className="loader-text">
          Preparing your experience...
        </span>

      </div>

    </div>
  );
}

export default Loader;