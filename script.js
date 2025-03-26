document.addEventListener("DOMContentLoaded", function () {
  console.log("Home page loaded successfully!");
});

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("overlay");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  const showLoginBtn = document.getElementById("show-login");
  const showSignupBtn = document.getElementById("show-signup");
  const switchToSignup = document.getElementById("switch-to-signup");
  const switchToLogin = document.getElementById("switch-to-login");
  const closeOverlayButtons = document.querySelectorAll(".closeOverlay");

  // Show Login Form
  showLoginBtn.addEventListener("click", () => {
    overlay.classList.remove("hidden");
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
  });

  // Show Signup Form
  showSignupBtn.addEventListener("click", () => {
    overlay.classList.remove("hidden");
    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
  });

  // Switch to Signup
  switchToSignup.addEventListener("click", () => {
    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
  });

  // Switch to Login
  switchToLogin.addEventListener("click", () => {
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
  });

  // Close the popup if clicked outside
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.add("hidden");
    }
  });

  // Close the popup if clicked Close Button
  closeOverlayButtons.forEach((button) => {
    button.addEventListener("click", () => {
      overlay.classList.add("hidden");
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const busPopup = document.getElementById("bus-popup");
  const closeBtn = document.querySelector(".close-btn");
  const detailsButtons = document.querySelectorAll(".details-btn");

  // Sample Data (Will be replaced with PostgreSQL data later)
  const busData = {
    bikash: {
      image: "bus1.jpg",
      title: "Bikash Paribahan",
      route: "Azimpur - Kamarpara",
      time: "Starting Time: 06:00 AM | Closing Time: 10:00 PM",
      service: "Seating Service: Semi-Seating Service",
      stations:
        "Sign Board > Motijheel > Farmgate > Banani > Airport > Kamarpara",
    },
    provati: {
      image: "bus2.jpg",
      title: "Provati Banasree",
      route: "Azimpur - House Building",
      time: "Starting Time: 06:00 AM | Closing Time: 10:00 PM",
      service: "Seating Service: Semi-Seating Service",
      stations: "Dhanmondi > Kalabagan > Mohakhali > Uttara > House Building",
    },
  };

  // Open Pop-up
  detailsButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const busKey = button.getAttribute("data-bus");
      const bus = busData[busKey];

      document.getElementById("bus-image").src = bus.image;
      document.getElementById("bus-title").innerText = bus.title;
      document.getElementById("bus-route").innerText = bus.route;
      document.getElementById("bus-time").innerText = bus.time;
      document.getElementById("bus-service").innerText = bus.service;
      document.getElementById("bus-stations").innerText = bus.stations;

      busPopup.classList.remove("hidden");
    });
  });

  // Close Pop-up
  closeBtn.addEventListener("click", () => {
    busPopup.classList.add("hidden");
  });

  // Close when clicking outside
  busPopup.addEventListener("click", (e) => {
    if (e.target === busPopup) {
      busPopup.classList.add("hidden");
    }
  });
});
