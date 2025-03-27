document.addEventListener("DOMContentLoaded", () => {
  const swapBtn = document.getElementById("swap-stations");
  const startStation = document.getElementById("start-station");
  const endStation = document.getElementById("end-station");

  swapBtn.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent form submission

    // Get the currently selected index
    let startIndex = startStation.selectedIndex;
    let endIndex = endStation.selectedIndex;

    // Swap the selected indexes
    startStation.selectedIndex = endIndex;
    endStation.selectedIndex = startIndex;
  });
});
