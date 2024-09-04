// Select all calendar elements
const currentMonths = document.querySelectorAll(".current-month");
const calendarDaysContainers = document.querySelectorAll(".calendar-days");
const startTimeInput = document.getElementById("startTime");
const endTimeInput = document.getElementById("endTime");

// Get the current date and reset time to ensure accurate comparison
const today = new Date();
today.setHours(0, 0, 0, 0);

let globalDate = new Date(); // Keep a global reference of the current date
let selectedStartDate = null; // Track the selected start date
let selectedEndDate = null; // Track the selected end date
let bookedDates = []; // Initialize the booked dates array

// Set the initial text for each current month
currentMonths.forEach((currentMonth) => {
  currentMonth.textContent = globalDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
});

// Function to render the calendar for a specific element
function renderCalendar(containerIndex) {
  const calendarDays = calendarDaysContainers[containerIndex];
  const currentCalendarDate = new Date(globalDate); // Clone the global date for local use
  const prevLastDay = new Date(
    currentCalendarDate.getFullYear(),
    currentCalendarDate.getMonth(),
    0
  ).getDate();
  const totalMonthDay = new Date(
    currentCalendarDate.getFullYear(),
    currentCalendarDate.getMonth() + 1,
    0
  ).getDate();
  const startWeekDay = new Date(
    currentCalendarDate.getFullYear(),
    currentCalendarDate.getMonth(),
    1
  ).getDay();

  calendarDays.innerHTML = "";

  // Display the previous month's days
  for (let i = 0; i < startWeekDay; i++) {
    calendarDays.innerHTML += `<div class="padding-day">${
      prevLastDay - startWeekDay + 1 + i
    }</div>`;
  }

  // Display the current month's days
  for (let i = 1; i <= totalMonthDay; i++) {
    const loopDate = new Date(
      currentCalendarDate.getFullYear(),
      currentCalendarDate.getMonth(),
      i
    );
    let dayClass = "month-day";
    let dayStyle = "";

    if (loopDate.getTime() === today.getTime()) {
      dayClass = "current-day"; // Highlight today's date
    } else if (
      selectedStartDate &&
      selectedEndDate &&
      loopDate >= selectedStartDate &&
      loopDate <= selectedEndDate
    ) {
      dayClass = "selected-date"; // Highlight the selected date range
    }

    // Check for booked dates and apply the 'booked' class and color
    const bookedEvent = getBookedEventForDate(loopDate);
    if (bookedEvent) {
      dayClass = "booked";
      dayStyle = `background-color: #${bookedEvent.color};`;
    }

    calendarDays.innerHTML += `<div class="${dayClass}" style="${dayStyle}">${i}</div>`;
  }

  // Fill in the next month's days to complete the grid
  const remainingDays = 42 - calendarDays.children.length; // 6 weeks x 7 days
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.innerHTML += `<div class="padding-day">${i}</div>`;
  }
}

// Function to check if a date is booked based on data from the database
function getBookedEventForDate(date) {
  return bookedDates.find((event) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    eventStart.setHours(0, 0, 0, 0); // Normalize the time for comparison
    eventEnd.setHours(0, 0, 0, 0); // Normalize the time for comparison
    return date >= eventStart && date <= eventEnd;
  });
}

// Fetch booked dates from the database
function fetchBookedDates() {
  fetch("fetch_events_room.php")
    .then((response) => response.json())
    .then((data) => {
      bookedDates = data.map((event) => ({
        start: event.formatted_start_time,
        end: event.formatted_end_time,
        color: event.color,
      }));

      // Render all calendars with updated booked dates
      calendarDaysContainers.forEach((_, index) => renderCalendar(index));
    })
    .catch((error) => console.error("Error fetching booked dates:", error));
}

// Function to render meeting names with color
function renderMeetingNames(event) {
  return `<span class="meeting-name" style="color: #${event.color};">${event.meeting_name}</span>`;
}

// Fetch events and render them in the table
function fetchEvents() {
  fetch("fetch_events_room.php")
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector("tbody.table-group-divider");
      tableBody.innerHTML = ""; // Clear table before displaying new data

      if (data.length === 0) {
        tableBody.innerHTML =
          '<tr><td colspan="5" class="text-center">No data available</td></tr>';
      } else {
        data.forEach((event) => {
          const startDate = new Date(event.formatted_start_time);
          const endDate = new Date(event.formatted_end_time);

          const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
          const startDateString = `${startDate.getDate()} ${
            monthNames[startDate.getMonth()]
          } ${startDate.getFullYear()}`;
          const startTimeString = `${("0" + startDate.getHours()).slice(-2)}.${(
            "0" + startDate.getMinutes()
          ).slice(-2)}`;
          const endDateString = `${endDate.getDate()} ${
            monthNames[endDate.getMonth()]
          } ${endDate.getFullYear()}`;
          const endTimeString = `${("0" + endDate.getHours()).slice(-2)}.${(
            "0" + endDate.getMinutes()
          ).slice(-2)}`;

          const row = `
            <tr>
              <td>${renderMeetingNames(event)}</td>
              <td>${startDateString}, ${startTimeString}</td>
              <td>${endDateString}, ${endTimeString}</td>
              <td>
                <button class="icon-btn" onclick="deleteEvent(${
                  event.id_activity
                })">
                  <i class="bi bi-trash3"></i>
                </button>
              </td>
            </tr>
          `;
          tableBody.innerHTML += row;
        });
      }
    })
    .catch((error) => console.error("Error fetching events:", error));
}

// Function to reload the calendar
function reloadCalendar() {
  selectedStartDate = null;
  selectedEndDate = null;
  calendarDaysContainers.forEach((_, index) => renderCalendar(index)); // Re-render the calendar
}

// Function to show success or error messages
function showFlasher(type, message) {
  const flasher = document.createElement("div");
  flasher.className = `alert alert-${type} alert-dismissible text-start fade show align-items-center container`;
  flasher.role = "alert";
  flasher.innerHTML = `
    <i class="fa fa-circle-check fa-xl me-2"></i> ${message}
    <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
  `;
  const wrapper = document.querySelector(".wrapper");
  wrapper.parentNode.insertBefore(flasher, wrapper); // Insert flasher above the wrapper
  setTimeout(() => flasher.remove(), 3000);
}

// Event listener for adding a new event
document.getElementById("addMeet").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);

  fetch("add_events_room.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      const errorMessageElement = document.querySelector(".text-danger");
      if (data.status === "error") {
        errorMessageElement.textContent = data.message; // Display error message
        showFlasher("danger", data.message); // Show flasher for error
      } else {
        showFlasher("success", data.message); // Show flasher for success
        fetchEvents(); // Refresh data in the table
        fetchBookedDates(); // Refresh calendar to update booked dates
        const addModal = bootstrap.Modal.getInstance(
          document.getElementById("addMeetModal")
        );
        addModal.hide(); // Close modal
        errorMessageElement.textContent = ""; // Clear any previous error message
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showFlasher("danger", "An unexpected error occurred. Please try again."); // Show flasher for unexpected errors
    });
});

// Event listeners for date input focus to clear error messages
[startTimeInput, endTimeInput].forEach((input) => {
  input.addEventListener("focus", function () {
    document.querySelector(".text-danger").textContent = ""; // Clear error message
  });
});

// Event listeners for "Today" buttons to reset the calendar to the current date
document.querySelectorAll(".btn").forEach((element) => {
  element.addEventListener("click", function () {
    if (element.classList.contains("today")) globalDate = new Date();

    // Update all calendar headers
    currentMonths.forEach((currentMonth) => {
      currentMonth.textContent = globalDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    });

    // Render all calendars
    calendarDaysContainers.forEach((_, index) => renderCalendar(index));
  });
});

// Event listeners for month navigation buttons
document.querySelectorAll(".month-btn").forEach((element) => {
  element.addEventListener("click", function () {
    const isPrev = element.classList.contains("prev");
    globalDate.setMonth(globalDate.getMonth() + (isPrev ? -1 : 1));

    // Update all calendar headers
    currentMonths.forEach((currentMonth) => {
      currentMonth.textContent = globalDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    });

    // Render all calendars
    calendarDaysContainers.forEach((_, index) => renderCalendar(index));
  });
});

// Event listeners to handle date input changes and re-render calendars
[startTimeInput, endTimeInput].forEach((input) => {
  input.addEventListener("change", function () {
    const startDate = new Date(startTimeInput.value);
    const endDate = new Date(endTimeInput.value);

    // Check if both dates are selected and valid
    if (startDate && endDate && startDate <= endDate) {
      selectedStartDate = new Date(startDate.setHours(0, 0, 0, 0));
      selectedEndDate = new Date(endDate.setHours(0, 0, 0, 0));
    } else {
      selectedStartDate = null;
      selectedEndDate = null;
    }

    // Re-render all calendars to highlight the selected range
    calendarDaysContainers.forEach((_, index) => renderCalendar(index));
  });
});

// Function to delete an event after user confirmation
function deleteEvent(id_activity) {
  if (confirm("Are you sure you want to delete this event?")) {
    fetch("delete_events_room.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `id_activity=${id_activity}`,
    })
      .then((response) => response.text())
      .then((message) => {
        showFlasher("warning", message); // Show flasher for delete success
        fetchEvents(); // Refresh data in the table
        fetchBookedDates(); // Refresh calendar to update booked dates
      })
      .catch((error) => {
        console.error("Error:", error);
        showFlasher(
          "danger",
          "An error occurred while deleting. Please try again."
        ); // Show flasher for delete errors
      });
  }
}

// Initialize the calendar and events data on page load
document.addEventListener("DOMContentLoaded", function () {
  fetchBookedDates();
  fetchEvents();
});
