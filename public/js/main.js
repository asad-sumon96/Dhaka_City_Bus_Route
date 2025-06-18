document.addEventListener("DOMContentLoaded", () => {
  // --- Mobile Menu Toggle ---
  const navLinks = document.querySelector(".nav-links");
  window.onToggleMenu = function (e) {
    const icon = e.querySelector("i");
    icon.classList.toggle("fa-bars");
    icon.classList.toggle("fa-xmark");
    navLinks.classList.toggle("top-[-100%]");
    // Adjust this value if the header height changes
    navLinks.classList.toggle("top-[70px]");
  };

  // --- Modal Elements ---
  const detailsModal = document.getElementById("details-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const loginModal = document.getElementById("login-modal");
  const showLoginBtn = document.getElementById("show-login");
  const closeLoginModalBtn = document.getElementById("close-login-modal-btn");
  const resultsSection = document.getElementById("results-section");

  // --- Modal Logic ---
  function openModal(modal) {
    if (modal) {
      modal.classList.remove("opacity-0", "pointer-events-none");
      modal.querySelector(".modal-content")?.classList.remove("scale-95");
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.add("opacity-0", "pointer-events-none");
      modal.querySelector(".modal-content")?.classList.add("scale-95");
    }
  }

  // --- Event Listeners for Modals ---
  if (closeModalBtn)
    closeModalBtn.addEventListener("click", () => closeModal(detailsModal));
  if (showLoginBtn)
    showLoginBtn.addEventListener("click", () => openModal(loginModal));
  if (closeLoginModalBtn)
    closeLoginModalBtn.addEventListener("click", () => closeModal(loginModal));

  window.addEventListener("click", (e) => {
    if (e.target === detailsModal) closeModal(detailsModal);
    if (e.target === loginModal) closeModal(loginModal);
  });

  // --- Details Button Logic ---
  if (resultsSection) {
    resultsSection.addEventListener("click", async (e) => {
      if (e.target.closest(".details-btn")) {
        const busId = e.target.closest(".details-btn").dataset.busId;
        try {
          const response = await fetch(`/api/bus/${busId}`);
          if (!response.ok) throw new Error("Network response was not ok.");

          const details = await response.json();

          document.getElementById("modal-bus-name").innerText =
            details.bus_name;
          const modalBody = document.getElementById("modal-body");

          let stopsHtml =
            '<ol class="list-decimal list-inside grid grid-cols-2 md:grid-cols-3 gap-2 text-gray-600">';
          details.stops.forEach((stop) => {
            stopsHtml += `<li>${stop.station_name}</li>`;
          });
          stopsHtml += "</ol>";

          modalBody.innerHTML = `
                        <img src="${
                          details.bus_image_url ||
                          "https://placehold.co/600x300?text=Image+Not+Found"
                        }" alt="${
            details.bus_name
          }" class="w-full h-48 object-cover rounded-lg mb-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div class="bg-gray-100 p-3 rounded-lg">
                                <p class="text-sm text-gray-500">Estimated Fare</p>
                                <p class="text-lg font-bold">৳${
                                  details.base_fare
                                }</p>
                            </div>
                            <div class="bg-gray-100 p-3 rounded-lg">
                                <p class="text-sm text-gray-500">Total Distance</p>
                                <p class="text-lg font-bold">${
                                  details.total_distance_km
                                } km</p>
                            </div>
                        </div>
                        <h4 class="font-semibold text-lg mb-2">Route Stops:</h4>
                        ${stopsHtml}
                    `;
          openModal(detailsModal);
        } catch (error) {
          console.error("Failed to fetch bus details:", error);
          alert("Could not load bus details. Please try again later.");
        }
      }
    });
  }
});
