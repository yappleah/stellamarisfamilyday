/**
 * Create ticket sections for edit/admin modals (shared between view-info and event-details)
 * @param {Object} options - { prefix: string, showPricing: boolean }
 * @returns {string} HTML for ticket sections
 */
function createTicketSections({ prefix = "", showPricing = false } = {}) {
  // Use prefix to distinguish between edit/admin modals
  const adultSectionId = `${prefix}AdultFoodSelections`;
  const childSectionId = `${prefix}ChildFoodSelections`;
  const adultInputId = `${prefix}Adult`;
  const childInputId = `${prefix}Child`;
  const addAdultBtnId = `${prefix}AddAdultBtn`;
  const addChildBtnId = `${prefix}AddChildBtn`;
  const adultPriceId = `${prefix}AdultTicketPrice`;
  const childPriceId = `${prefix}ChildTicketPrice`;

  return `
  <div class="row">
  <div class="col-md-6">
    <div class="ticket-section adult-tickets mb-4">
      <div class="ticket-header">
        <div class="ticket-icon"><i class="bi bi-person-fill"></i></div>
        <div>
        <h5 class="ticket-title">Adult Tickets</h5>
        ${
          showPricing
            ? `<div class="ticket-price">$<span id="${adultPriceId}"></span> per person</div>`
            : ""
        }
        </div>
      </div>
      <div id="${adultSectionId}"></div>
      <button type="button" class="btn btn-primary btn-sm ms-auto" id="${addAdultBtnId}">Add</button>
      <input type="hidden" id="${adultInputId}" value="" />
    </div>
  </div>
  <div class="col-md-6">
    <div class="ticket-section child-tickets mb-4">
      <div class="ticket-header">
        <div class="ticket-icon"><i class="bi bi-person-fill"></i></div>
        <div>
        <h5 class="ticket-title">Child Tickets</h5>
        ${
          showPricing
            ? `<div class="ticket-price">$<span id="${childPriceId}"></span> per child (6 & under)</div>`
            : ""
        }
      </div>
      </div>
      <div id="${childSectionId}"></div>
      <button type="button" class="btn btn-primary btn-sm ms-auto" id="${addChildBtnId}">Add</button>
      <input type="hidden" id="${childInputId}" value="" />
    </div>
  </div>
  </div>
  `;
}
// ==================================================
// STELLA MARIS FAMILY DAY - COMMON FUNCTIONS
// ==================================================
// This file contains all shared functions used throughout the project
// to maintain consistency and reduce code duplication.

// ==================================================
// TICKET VISUAL DIFFERENTIATION HELPERS
// ==================================================
// Shared function to populate ticket dropdowns in edit modals
function populateEditExistingTickets(tickets) {
  // Use 'edit' prefix for both admin and user modals
  const adultContainer = document.getElementById("editAdultFoodSelections");
  const childContainer = document.getElementById("editChildFoodSelections");
  // Clear containers
  adultContainer.innerHTML = "";
  childContainer.innerHTML = "";
  let adultCount = 0;
  let childCount = 0;
  let adultDonatedCount = 0;
  let childDonatedCount = 0;
  tickets.forEach((t) => {
    // Fix: ensure correct ticketType for dropdown rendering
    let dropdownTicketType = t.ticket_type;
    if (t.ticket_type === "adult_donated") dropdownTicketType = "adult";
    if (t.ticket_type === "child_donated") dropdownTicketType = "child";
    const dropdownHTML = createFoodDropdown(
      t.id,
      t.food_option,
      t.attendance_type || "attending",
      t.pickup_time || "",
      dropdownTicketType
    );
    const wrapperHTML = `<div data-ticket-id="${t.id}">${dropdownHTML}</div>`;
    if (t.ticket_type === "adult") {
      adultContainer.insertAdjacentHTML("beforeend", wrapperHTML);
      adultCount++;
    } else if (t.ticket_type === "adult_donated") {
      adultContainer.insertAdjacentHTML("beforeend", wrapperHTML);
      adultDonatedCount++;
    } else if (t.ticket_type === "child") {
      childContainer.insertAdjacentHTML("beforeend", wrapperHTML);
      childCount++;
    } else if (t.ticket_type === "child_donated") {
      childContainer.insertAdjacentHTML("beforeend", wrapperHTML);
      childDonatedCount++;
    }
  });
  // Update hidden counters for regular and donated tickets
  document.getElementById("editAdult").value = adultCount;
  document.getElementById("editChild").value = childCount;
  if (document.getElementById("editAdultDonations")) {
    document.getElementById("editAdultDonations").value = adultDonatedCount;
  }
  if (document.getElementById("editChildDonations")) {
    document.getElementById("editChildDonations").value = childDonatedCount;
  }
}

/**
 * Get ticket number from ticket ID for visual differentiation
 * @param {string} ticketId - The ticket ID
 * @param {boolean} isAdult - Whether this is an adult ticket
 * @returns {number} The ticket number within its type
 */
function getTicketNumber(ticketId, isAdult) {
  // Try different container naming patterns
  const possibleContainers = isAdult
    ? ["adult-dropdowns", "editAdultFoodSelections"]
    : ["child-dropdowns", "editChildFoodSelections"];

  let container = null;
  for (const containerId of possibleContainers) {
    container = document.getElementById(containerId);
    if (container) break;
  }

  if (!container) return 1;

  const existingTickets = container.querySelectorAll(".individual-ticket-card");
  return existingTickets.length + 1;
}

/**
 * Get color class for ticket based on number and type
 * @param {number} ticketNumber - The ticket number
 * @param {boolean} isAdult - Whether this is an adult ticket
 * @returns {string} CSS class for ticket styling
 */
function getTicketColorClass(isAdult) {
  return isAdult ? "adult-ticket-primary" : "child-ticket-primary";
}

// ==================================================
// LOADING SCREEN MANAGEMENT
// ==================================================

/**
 * Show the loading screen overlay
 */
function showLoadingScreen() {
  document.getElementById("loadingScreen").style.display = "flex";
}

/**
 * Hide the loading screen overlay
 */
function hideLoadingScreen() {
  document.getElementById("loadingScreen").style.display = "none";
}

// ==================================================
// PHONE NUMBER UTILITIES
// ==================================================

/**
 * Format phone number for display as (xxx) xxx-xxxx
 * Handles cursor position and allows natural deletion
 * @param {string} value - Current input value
 * @param {number} cursorPos - Current cursor position
 * @returns {object} Object with formatted value and new cursor position
 */
function formatPhoneNumberWithCursor(value, cursorPos) {
  // Remove all non-digits
  const cleaned = value.replace(/\D/g, "");

  let formatted = "";
  let newCursorPos = cursorPos;

  // Track cursor position through formatting
  let originalDigitIndex = 0;
  let formattedIndex = 0;

  // Count digits before cursor in original value
  let digitsBeforeCursor = 0;
  for (let i = 0; i < cursorPos && i < value.length; i++) {
    if (/\d/.test(value[i])) {
      digitsBeforeCursor++;
    }
  }

  // Apply formatting based on length
  if (cleaned.length >= 6) {
    formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(
      3,
      6
    )}-${cleaned.slice(6, 10)}`;
  } else if (cleaned.length >= 3) {
    formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  } else if (cleaned.length > 0) {
    formatted = `(${cleaned}`;
  }

  // Calculate new cursor position
  if (digitsBeforeCursor === 0) {
    newCursorPos = 0;
  } else {
    let digitCount = 0;
    for (let i = 0; i < formatted.length; i++) {
      if (/\d/.test(formatted[i])) {
        digitCount++;
        if (digitCount === digitsBeforeCursor) {
          newCursorPos = i + 1;
          break;
        }
      }
    }
  }

  return {
    value: formatted,
    cursorPos: Math.min(newCursorPos, formatted.length),
  };
}

/**
 * Simple format phone number for display as (xxx) xxx-xxxx
 * @param {string} phone - Raw phone number input
 * @returns {string} Formatted phone number
 */
function formatPhoneNumber(phone) {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, "");

  // Apply formatting based on length
  if (cleaned.length >= 6) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6,
      10
    )}`;
  } else if (cleaned.length >= 3) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  } else if (cleaned.length > 0) {
    return `(${cleaned}`;
  }
  return "";
}

/**
 * Clean phone number to digits only
 * @param {string} phone - Phone number with formatting
 * @returns {string} Clean digits only (max 10 digits)
 */
function cleanPhoneNumber(phone) {
  return phone.replace(/\D/g, "").slice(0, 10);
}

// ==================================================
// PRICING CALCULATIONS
// ==================================================

/**
 * Calculate total price for tickets
 * @param {number} adultCount - Number of adult tickets
 * @param {number} childCount - Number of child tickets
 * @returns {number} Total amount
 */
function calculateTotal(adultCount, childCount) {
  return (
    adultCount * CONFIG.PRICING.adult_ticket +
    childCount * CONFIG.PRICING.child_ticket
  );
}

/**
 * Calculate total amount paid from payment transactions
 * @param {Array} transactions - Array of payment transaction objects
 * @returns {number} Total paid amount
 */
function calculateTotalPaid(transactions) {
  return transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
}

/**
 * Calculate outstanding balance
 * @param {number} totalAmount - Total ticket amount
 * @param {Array} transactions - Payment transactions
 * @returns {number} Outstanding balance
 */
function calculateOutstanding(totalAmount, transactions) {
  return totalAmount - calculateTotalPaid(transactions);
}

// ==================================================
// DOM QUERY UTILITIES
// ==================================================

/**
 * Get selected attendance type value
 * @returns {string|null} Selected attendance type or null
 */
function getSelectedAttendanceType() {
  return (
    document.querySelector('input[name="attendanceType"]:checked')?.value ||
    null
  );
}

/**
 * Get selected pickup time value
 * @returns {string|null} Selected pickup time or null
 */
function getSelectedPickupTime() {
  return (
    document.querySelector('input[name="pickupTime"]:checked')?.value || null
  );
}

// ==================================================
// FOOD OPTIONS
// ==================================================

/**
 * Standard food options for the event
 */
const FOOD_OPTIONS = [
  { value: "station1", label: "Curry goat, rice & roti" },
  { value: "station2", label: "Jerk pork & chicken with festival" },
  { value: "station3", label: "Fish & vegetable pasta" },
  {
    value: "station4",
    label: "Chinese - vegetable lo mein, sweet & sour chicken",
  },
];

/**
 * Get food option label by value
 * @param {string|number|null|undefined} value - Food option value
 * @returns {string} Food option label or a fallback string
 */
function getFoodLabel(value) {
  // Handle null, undefined, or empty values
  if (value == null || value === "") {
    return "No food selection";
  }

  // Convert to string and normalize
  const normalizedValue = String(value).toLowerCase().trim();

  // Handle numeric values (1-4 maps to station1-station4)
  if (!isNaN(normalizedValue) && normalizedValue >= 1 && normalizedValue <= 4) {
    const stationValue = `station${normalizedValue}`;
    const option = FOOD_OPTIONS.find((opt) => opt.value === stationValue);
    return option ? option.label : `Station ${normalizedValue}`;
  }

  // Handle "station" prefixed values (case insensitive)
  if (normalizedValue.startsWith("station")) {
    const option = FOOD_OPTIONS.find(
      (opt) => opt.value.toLowerCase() === normalizedValue
    );
    return option ? option.label : value;
  }

  // Direct lookup by value (case insensitive)
  const option = FOOD_OPTIONS.find(
    (opt) => opt.value.toLowerCase() === normalizedValue
  );
  if (option) {
    return option.label;
  }

  // Fallback: return the original value if no match found
  return String(value);
}

// ==================================================
// DROPDOWN MANAGEMENT FUNCTIONS
// ==================================================

// Global counter for generating unique temporary IDs
let nextTempId = 0;

/**
 * Create a complete ticket editing interface with attendance type and conditional food options
 * @param {string} ticketId - Unique identifier for the ticket
 * @param {string} selectedFoodValue - Currently selected food option
 * @param {string} attendanceType - Current attendance type ('attending' or 'takeaway')
 * @param {string} pickupTime - Current pickup time if takeaway
 * @param {string} ticketType - Explicit ticket type ('adult' or 'child') - optional, will be inferred if not provided
 * @returns {string} HTML string for the complete ticket interface
 */
function createFoodDropdown(
  ticketId,
  selectedFoodValue = "",
  attendanceType = "attending",
  pickupTime = "",
  ticketType = null
) {
  const isTemp = ticketId.toString().startsWith("temp_");

  // Determine ticket type - use explicit parameter if provided, otherwise infer from ID
  let isAdult;
  if (ticketType) {
    isAdult = ticketType === "adult";
  } else {
    isAdult =
      ticketId.toString().includes("adult") ||
      ticketId.toString().includes("Adult");
  }

  const ticketNumber = getTicketNumber(ticketId, isAdult);
  const colorClass = getTicketColorClass(isAdult);
  const ticketLabel = isAdult ? "Adult" : "Child";

  // Attendance type section
  let attendanceHTML = `
    <div class="mb-2">
      <label class="form-label small">Attendance Type</label>
      <div class="mb-2">
        <div class="form-check">
          <input class="form-check-input" type="radio" 
                 name="attendance_${ticketId}" 
                 id="attending_${ticketId}" 
                 value="attending" 
                 data-ticket-id="${ticketId}"
                 ${attendanceType === "attending" ? "checked" : ""}>
          <label class="form-check-label" for="attending_${ticketId}">Attending Event</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" 
                 name="attendance_${ticketId}" 
                 id="takeaway_${ticketId}" 
                 value="takeaway" 
                 data-ticket-id="${ticketId}"
                 ${attendanceType === "takeaway" ? "checked" : ""}>
          <label class="form-check-label" for="takeaway_${ticketId}">Taking Away</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" 
                 name="attendance_${ticketId}" 
                 id="donate_${ticketId}" 
                 value="donate" 
                 data-ticket-id="${ticketId}"
                 ${attendanceType === "donate" ? "checked" : ""}>
          <label class="form-check-label" for="donate_${ticketId}">Donate Ticket</label>
        </div>
        <small class="text-muted">
          <span id="message_${ticketId}"></span>
        </small>
      </div>
    </div>
  `;

  // Food option section (conditional) - Now using checkboxes for multiple selections
  let foodHTML = "";
  // selectedFoodValue could be a string or array - handle both cases
  const selectedFoodArray = Array.isArray(selectedFoodValue)
    ? selectedFoodValue
    : selectedFoodValue
    ? [selectedFoodValue]
    : [];

  FOOD_OPTIONS.forEach((opt) => {
    const isChecked = selectedFoodArray.includes(opt.value);
    foodHTML += `
      <div class="form-check">
        <input class="form-check-input food-station-checkbox" 
               type="checkbox" 
               id="food_${opt.value}_${ticketId}" 
               value="${opt.value}"
               data-ticket-id="${ticketId}"
               ${isChecked ? "checked" : ""}>
        <label class="form-check-label" for="food_${opt.value}_${ticketId}">
          ${opt.label}
        </label>
      </div>`;
  });

  const foodSection = `
    <div class="food-option-section mb-2" id="food_${ticketId}" style="display: ${
    attendanceType === "takeaway" ? "block" : "none"
  }">
      <label class="form-label small">Food Stations <small class="text-muted">(Select all that apply)</small></label>
      <div class="food-checkboxes" data-ticket-id="${ticketId}">
        ${foodHTML}
      </div>
    </div>
  `;

  // Pickup time section (conditional)
  const pickupSection = `
    <div class="pickup-time-section" id="pickup_${ticketId}" style="display: ${
    attendanceType === "takeaway" ? "block" : "none"
  }">
      <label class="form-label small">Pickup Time</label>
      <div class="mb-2">
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" 
                 name="pickup_${ticketId}" 
                 id="time1_${ticketId}" 
                 value="12:30" 
                 data-ticket-id="${ticketId}"
                 ${pickupTime === "12:30" ? "checked" : ""}
                 ${attendanceType === "takeaway" ? "required" : ""}>
          <label class="form-check-label" for="time1_${ticketId}">12:30 PM</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" 
                 name="pickup_${ticketId}" 
                 id="time2_${ticketId}" 
                 value="2:00" 
                 data-ticket-id="${ticketId}"
                 ${pickupTime === "2:00" ? "checked" : ""}
                 ${attendanceType === "takeaway" ? "required" : ""}>
          <label class="form-check-label" for="time2_${ticketId}">2:00 PM</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" 
                 name="pickup_${ticketId}" 
                 id="time3_${ticketId}" 
                 value="3:30" 
                 data-ticket-id="${ticketId}"
                 ${pickupTime === "3:30" ? "checked" : ""}
                 ${attendanceType === "takeaway" ? "required" : ""}>
          <label class="form-check-label" for="time3_${ticketId}">3:30 PM</label>
        </div>
      </div>
    </div>
  `;

  const completeHTML = `
    <div class="individual-ticket-card ${colorClass}" data-ticket-id="${ticketId}">
      <div class="ticket-card-header">
        <div class="ticket-number-badge">
          <span>${ticketLabel} Ticket ${ticketNumber}</span>
        </div>
        <div class="ticket-type-indicator">
          ${
            isAdult
              ? `$${CONFIG.PRICING.adult_ticket.toLocaleString()}`
              : `$${CONFIG.PRICING.child_ticket.toLocaleString()}`
          }
        </div>
  <button type="button" class="btn btn-outline-danger btn-xs remove-ticket-btn" style="margin-left:8px; font-size:0.75rem; padding:2px 8px; background:#fff; color:#dc2626; border:1px solid #dc2626;" data-ticket-id="${ticketId}"><i class="fas fa-trash" style="color:#dc2626;"></i> <span style="color:#dc2626;">Remove</span></button>
      </div>
      <div class="ticket-card-content">
        ${attendanceHTML}
        ${attendanceType === "donate" ? "" : foodSection}
        ${attendanceType === "donate" ? "" : pickupSection}
      </div>
    </div>
  `;

  // Add event listeners after the HTML is inserted (this will be handled by the calling function)
  setTimeout(() => {
    const attendingRadio = document.getElementById(`attending_${ticketId}`);
    const takeawayRadio = document.getElementById(`takeaway_${ticketId}`);
    const donateRadio = document.getElementById(`donate_${ticketId}`);
    const foodDiv = document.getElementById(`food_${ticketId}`);
    const pickupDiv = document.getElementById(`pickup_${ticketId}`);
    const messageDiv = document.getElementById(`message_${ticketId}`);
    const foodCheckboxes = foodDiv?.querySelectorAll('input[type="checkbox"]');
    const pickupInputs = pickupDiv?.querySelectorAll('input[type="radio"]');

    const removeBtn = document.querySelector(
      `.remove-ticket-btn[data-ticket-id='${ticketId}']`
    );
    if (removeBtn) {
      removeBtn.addEventListener("click", function () {
        const currentBalanceEl = document.getElementById("outstandingBalance");
        let currentBalance = 0;

        if (currentBalanceEl) {
          currentBalance =
            parseFloat(currentBalanceEl.textContent.replace(/[^\d.-]/g, "")) ||
            0;
        }
        // Remove the ticket card from DOM
        let card = document.querySelector(
          `#editChildFoodSelections > div[data-ticket-id='${ticketId}']`
        );
        if (!card) {
          card = document.querySelector(
            `#editAdultFoodSelections > div[data-ticket-id='${ticketId}']`
          );
        }
        if (!card) {
          card =
            removeBtn.closest(".individual-ticket-card") ||
            removeBtn.closest(`div[data-ticket-id='${ticketId}']`);
        }
        if (card) card.remove();

        // Update ticket counters based on attendance type
        let attendanceType = "attending";
        const donateRadio = card.querySelector(
          `input[name="attendance_${ticketId}"][value="donate"]`
        );
        if (donateRadio && donateRadio.checked) {
          attendanceType = "donate";
        }
        let typeKey = ticketType || "";
        if (!typeKey) {
          const idStr = ticketId.toString().toLowerCase();
          if (idStr.includes("adult") && idStr.includes("donated"))
            typeKey = "adult_donated";
          else if (idStr.includes("child") && idStr.includes("donated"))
            typeKey = "child_donated";
          else if (idStr.includes("adult")) typeKey = "adult";
          else if (idStr.includes("child")) typeKey = "child";
        }
        let counterId = "";
        if (attendanceType === "donate") {
          if (typeKey === "adult" || typeKey === "adult_donated")
            counterId = "editAdultDonations";
          else if (typeKey === "child" || typeKey === "child_donated")
            counterId = "editChildDonations";
        } else {
          if (typeKey === "adult") counterId = "editAdult";
          else if (typeKey === "child") counterId = "editChild";
        }
        if (counterId) {
          const counterInput = document.getElementById(counterId);
          if (counterInput) {
            let currentVal = parseInt(counterInput.value || "0");
            if (currentVal > 0) {
              counterInput.value = currentVal - 1;
              counterInput.dispatchEvent(new Event("change"));
            }
          }
        }

        // Recalculate totals
        if (typeof window.updateEditTotals === "function")
          window.updateEditTotals();
        if (typeof window.updateRemoveButtonStates === "function")
          window.updateRemoveButtonStates();
        if (typeof window.addFormChangeListeners === "function")
          window.addFormChangeListeners();

        // Track tickets to delete
        if (!ticketId.toString().startsWith("temp_")) {
          window.ticketsToDelete = window.ticketsToDelete || [];
          if (!window.ticketsToDelete.includes(ticketId)) {
            window.ticketsToDelete.push(ticketId);
          }
        }
      });
    }

    if (
      attendingRadio &&
      takeawayRadio &&
      donateRadio &&
      foodDiv &&
      pickupDiv
    ) {
      attendingRadio.addEventListener("change", function () {
        if (this.checked) {
          foodDiv.style.display = "none";
          pickupDiv.style.display = "none";
          messageDiv.textContent = "";
          if (foodCheckboxes) {
            foodCheckboxes.forEach((checkbox) => {
              checkbox.checked = false;
            });
          }
          if (pickupInputs) {
            pickupInputs.forEach((input) => {
              input.required = false;
              input.checked = false;
            });
          }
        }
      });

      takeawayRadio.addEventListener("change", function () {
        if (this.checked) {
          foodDiv.style.display = "block";
          pickupDiv.style.display = "block";
          messageDiv.textContent = "";
          if (pickupInputs) {
            pickupInputs.forEach((input) => (input.required = true));
          }
        }
      });

      donateRadio.addEventListener("change", function () {
        if (this.checked) {
          foodDiv.style.display = "none";
          pickupDiv.style.display = "none";
          messageDiv.textContent =
            "The Men’s Executive Committee will identify a charity for the donation and we will advise in due course of our selection";
          if (foodCheckboxes) {
            foodCheckboxes.forEach((checkbox) => {
              checkbox.checked = false;
            });
          }
          if (pickupInputs) {
            pickupInputs.forEach((input) => {
              input.required = false;
              input.checked = false;
            });
          }
          // Dispatch custom event for donate selection
          const donateEvent = new CustomEvent("donateTicketSelected", {
            detail: {
              ticketId,
              ticketType,
            },
          });
          donateRadio.dispatchEvent(donateEvent);
        }
      });
    }
  }, 100);

  return completeHTML;
}

async function updateEditTotals() {
  // Count tickets by attendance type
  let adultTickets = 0;
  let childTickets = 0;
  let adultDonations = 0;
  let childDonations = 0;

  // Adult tickets
  const adultCards = document.querySelectorAll(
    "#editAdultFoodSelections > div"
  );
  adultCards.forEach((card) => {
    const ticketId = card.getAttribute("data-ticket-id");
    const donateRadio = card.querySelector(
      `input[name="attendance_${ticketId}"][value="donate"]`
    );
    if (donateRadio && donateRadio.checked) {
      adultDonations++;
    } else {
      adultTickets++;
    }
  });

  // Child tickets
  const childCards = document.querySelectorAll(
    "#editChildFoodSelections > div"
  );
  console.log("Child Cards:", childCards);
  childCards.forEach((card) => {
    const ticketId = card.getAttribute("data-ticket-id");
    const donateRadio = card.querySelector(
      `input[name="attendance_${ticketId}"][value="donate"]`
    );
    if (donateRadio && donateRadio.checked) {
      childDonations++;
    } else {
      childTickets++;
    }
  });

  // Update hidden fields
  document.getElementById("editAdult").value = adultTickets;
  document.getElementById("editChild").value = childTickets;
  document.getElementById("editAdultDonations").value = adultDonations;
  document.getElementById("editChildDonations").value = childDonations;

  // Calculate total including tickets and donations
  let total = calculateTotal(
    adultTickets + adultDonations,
    childTickets + childDonations
  );
  console.log(
    "Updated totals - Adult:",
    adultTickets,
    "Child:",
    childTickets,
    "Adult Donations:",
    adultDonations,
    "Child Donations:",
    childDonations,
    "Total:",
    total
  );
  document.getElementById("editTotal").textContent = formatCurrency(total);

  const ticketId = document.getElementById("editTicketId").value;
  const { data: transactions } = await supabaseClient
    .from("payment_transactions")
    .select("amount")
    .eq("ticket_id", ticketId);

  const totalPaid = calculateTotalPaid(transactions || []);
  const outstanding = total - totalPaid;
  const outstandingElem = document.getElementById("editOutstanding");
  if (outstandingElem) {
    outstandingElem.textContent = formatCurrency(outstanding);
  }
}

function processTicketContainers(containers, count, ticketType) {
  const tickets = [];
  let adultDonations = 0;
  let childDonations = 0;

  Array.from(containers)
    .slice(0, count)
    .forEach((container) => {
      const ticketId = container.dataset.ticketId || container.dataset.tempId;
      if (!ticketId) return;

      const attendanceRadios = container.querySelectorAll(
        `input[name="attendance_${ticketId}"]`
      );
      const selectedAttendance = Array.from(attendanceRadios).find(
        (radio) => radio.checked
      );
      const attendanceType = selectedAttendance
        ? selectedAttendance.value
        : "attending";

      let foodOptions = [];
      let pickupTime = null;

      if (attendanceType === "takeaway") {
        const foodCheckboxes = container.querySelectorAll(
          `input.food-station-checkbox[data-ticket-id="${ticketId}"]:checked`
        );
        foodOptions = Array.from(foodCheckboxes).map((cb) => cb.value);

        const pickupRadios = container.querySelectorAll(
          `input[name="pickup_${ticketId}"]`
        );
        const selectedPickup = Array.from(pickupRadios).find(
          (radio) => radio.checked
        );
        pickupTime = selectedPickup ? selectedPickup.value : null;
      }

      let finalTicketType = ticketType;
      if (attendanceType === "donate" && ticketType === "adult") {
        adultDonations++;
        finalTicketType = "adult_donated";
      } else if (attendanceType === "donate" && ticketType === "child") {
        childDonations++;
        finalTicketType = "child_donated";
      }

      tickets.push({
        ticketType: finalTicketType,
        attendanceType,
        foodOptions,
        pickupTime,
      });
    });

  return {
    tickets,
    adultDonations,
    childDonations,
  };
}

/**
 * Add a new ticket interface to a container
 * @param {string} containerId - ID of the container element
 * @param {string} ticketType - Type of ticket ('adult' or 'child')
 * @param {string} selectedValue - Pre-selected food value (optional)
 */
function addDropdown(containerId, ticketType, selectedValue = "") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const tempId = `temp_${ticketType}_${nextTempId++}`; // include ticket type in ID

  // Pass ticket type explicitly to ensure correct styling
  const dropdownHTML = createFoodDropdown(
    tempId,
    selectedValue,
    "attending",
    "",
    ticketType
  );

  // Wrap in container div with data-ticket-id for form submission logic
  const wrapperHTML = `<div data-ticket-id="${tempId}">${dropdownHTML}</div>`;

  container.insertAdjacentHTML("beforeend", wrapperHTML);
}

/**
 * Add a ticket and update counters
 * @param {string} containerId - ID of the dropdown container
 * @param {string} counterId - ID of the hidden counter input
 * @param {string} ticketType - Type of ticket ('adult' or 'child')
 * @param {Function} updateTotalsCallback - Optional callback to update totals
 */
function addTicket(
  containerId,
  counterId,
  ticketType,
  updateTotalsCallback = null
) {
  addDropdown(containerId, ticketType);
  const counterInput = document.getElementById(counterId);
  counterInput.value = parseInt(counterInput.value || "0") + 1;
  counterInput.dispatchEvent(new Event("change")); // trigger update totals

  if (updateTotalsCallback) {
    updateTotalsCallback();
  }

  // Update button states after addition
  updateRemoveButtonStates();
}
/**
 * Update the state of remove buttons based on current ticket counts
 */
function updateRemoveButtonStates() {
  // Check for adult tickets
  const adultCounter = document.getElementById("adultTickets");
  const adultRemoveBtn = document.getElementById("removeAdultBtn");
  console.log("here", adultRemoveBtn);
  if (adultCounter && adultRemoveBtn) {
    const adultCount = parseInt(adultCounter.value || "0");
    adultRemoveBtn.style.display = adultCount === 0 ? "none" : "inline-block";
  }

  // Check for child tickets
  const childCounter = document.getElementById("childTickets");
  const childRemoveBtn = document.getElementById("removeChildBtn");
  if (childCounter && childRemoveBtn) {
    const childCount = parseInt(childCounter.value || "0");
    childRemoveBtn.style.display = childCount === 0 ? "none" : "inline-block";
  }
}

/**
 * Remove the last dropdown from a container
 * @param {string} containerId - ID of the container element
 */
function removeLastDropdown(containerId) {
  const container = document.getElementById(containerId);
  if (container && container.lastElementChild) {
    container.removeChild(container.lastElementChild);
  }
}

// ==================================================
// ORDER NUMBER GENERATION
// ==================================================

/**
 * Generate a random order number
 * @param {number} length - Length of the order number (default: 6)
 * @returns {string} Generated order number
 */
function generateOrderNumber(length = 6) {
  let number = "";
  for (let i = 0; i < length; i++) {
    number += Math.floor(Math.random() * 10);
  }
  return number;
}

/**
 * Generate a unique order number by checking against existing orders
 * @param {Object} supabaseClient - Supabase client instance
 * @returns {Promise<string>} Unique order number
 */
async function getUniqueOrderNumber(supabaseClient) {
  let orderNumber;
  let exists = true;

  while (exists) {
    orderNumber = generateOrderNumber();
    const { data } = await supabaseClient
      .from("orders")
      .select("order_number")
      .eq("order_number", orderNumber)
      .maybeSingle();

    exists = !!data;
  }
  return orderNumber;
}

// ==================================================
// DATE AND TIME UTILITIES
// ==================================================

/**
 * Initialize common page elements like year and date
 */
function initializePageElements() {
  const yearElement = document.getElementById("year");
  const dateElement = document.getElementById("dateAndTime");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  if (dateElement && typeof CONFIG !== "undefined" && CONFIG.EVENT) {
    dateElement.textContent = CONFIG.EVENT.date;
  }
}

// ==================================================
// FORM VALIDATION UTILITIES
// ==================================================

/**
 * Validate phone number (must be 10 digits)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
function validatePhoneNumber(phone) {
  const cleaned = cleanPhoneNumber(phone);
  return cleaned.length === 10;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ==================================================
// CURRENCY FORMATTING
// ==================================================

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
  return amount.toLocaleString();
}

// ==================================================
// TICKET HTML GENERATION
// ==================================================

/**
 * Build HTML representation of tickets for email templates and confirmations
 * @param {Array} tickets - Array of ticket objects with ticket_type and food_option
 * @returns {string} HTML string representing the tickets
 */
function buildTicketHTML(tickets) {
  // Sort all tickets by ID first, then separate by type to maintain creation order
  const sortedTickets = tickets.sort((a, b) => a.id - b.id);
  const adults = sortedTickets.filter((t) => t.ticket_type === "adult");
  const children = sortedTickets.filter((t) => t.ticket_type === "child");
  const donatedAdults = sortedTickets.filter(
    (t) => t.ticket_type === "adult_donated"
  );
  const donatedChildren = sortedTickets.filter(
    (t) => t.ticket_type === "child_donated"
  );

  let html = "";

  if (adults.length) {
    html += `<p><strong>Adult Tickets (${adults.length}):</strong></p><ul>`;
    adults.forEach((t, i) => {
      let ticketInfo = `Adult #${i + 1}`;
      if (t.attendance_type === "takeaway") {
        const foodLabels = parseFoodOptions(t.food_option);
        ticketInfo += ` — ${
          foodLabels || "No food selections"
        } | Taking Away - Pickup: ${t.pickup_time} PM`;
      } else {
        ticketInfo += ` | Attending Event`;
      }
      html += `<li>${ticketInfo}</li>`;
    });
    html += "</ul>";
  }

  if (children.length) {
    html += `<p><strong>Child Tickets (${children.length}):</strong></p><ul>`;
    children.forEach((t, i) => {
      let ticketInfo = `Child #${i + 1}`;
      if (t.attendance_type === "takeaway") {
        const foodLabels = parseFoodOptions(t.food_option);
        ticketInfo += ` — ${
          foodLabels || "No food selections"
        } | Taking Away - Pickup: ${t.pickup_time} PM`;
      } else {
        ticketInfo += ` | Attending Event`;
      }
      html += `<li>${ticketInfo}</li>`;
    });
    html += "</ul>";
  }

  if (donatedAdults.length) {
    html += `<p><strong>Donated Adult Tickets (${donatedAdults.length})</strong></p>`;
  }

  if (donatedChildren.length) {
    html += `<p><strong>Donated Child Tickets (${donatedChildren.length})</strong></p>`;
  }

  return html;
}

/**
 * Parse food options from various stored formats and return formatted labels
 * @param {string|array|number|object} foodOption - Raw food option data
 * @returns {string} Formatted food labels joined with semicolons
 */
function parseFoodOptions(foodOption) {
  let foodOptions = [];

  try {
    const raw = foodOption ?? "[]";

    if (Array.isArray(raw)) {
      foodOptions = raw;
    } else if (typeof raw === "string") {
      try {
        // Try parsing as JSON first
        const parsed = JSON.parse(raw);
        foodOptions = Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        // Not JSON - treat as comma-separated or single string
        foodOptions = raw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    } else {
      // Number, object, or other type
      foodOptions = [raw];
    }
  } catch (e) {
    foodOptions = [];
  }

  // Use the robust getFoodLabel function for all options
  const foodLabels = foodOptions
    .map((opt) => getFoodLabel(opt))
    .filter((label) => label && label !== "No food selection")
    .join("; ");

  return foodLabels || "No food selections";
}

// ==================================================
// TICKET PROCESSING UTILITIES
// ==================================================

/**
 * Iterate through all tickets in orders with validation and optional filtering
 * @param {Array} orders - Array of order objects
 * @param {Function} callback - Function to call for each ticket (order, ticket)
 * @param {Function} filter - Optional filter function (order, ticket) => boolean
 */
function forEachTicket(orders, callback, filter = null) {
  orders.forEach((order) => {
    if (order.tickets && Array.isArray(order.tickets)) {
      order.tickets.forEach((ticket) => {
        if (!filter || filter(order, ticket)) {
          callback(order, ticket);
        }
      });
    }
  });
}

/**
 * Format customer name consistently from order data
 * @param {Object} order - Order object with first_name and last_name
 * @returns {string} Formatted customer name
 */
function getCustomerName(order) {
  return `${order.first_name || ""} ${order.last_name || ""}`.trim();
}

/**
 * Format ticket number with proper padding
 * @param {Object} ticket - Ticket object with ticket_number and ticket_type
 * @returns {string} Formatted ticket number with padding
 */
function formatTicketNumber(ticket) {
  let pad = 3;
  if (
    ticket.ticket_type === "adult" ||
    ticket.ticket_type === "adult_donated"
  ) {
    pad = 4;
  }
  // child and child_donated default to 3
  return String(ticket.ticket_number).padStart(pad, "0");
}

// ==================================================
// REUSABLE FORM COMPONENTS
// ==================================================

/**
 * Create professional customer information form fields
 * @param {Object} options - Configuration options
 * @param {string} options.prefix - ID prefix (e.g., 'admin', 'edit')
 * @param {boolean} options.includeOrderNumber - Whether to include order number field
 * @param {Object} options.values - Default values to populate
 * @returns {string} HTML string for customer form fields
 */
function createCustomerFormFields(options = {}) {
  const { prefix = "", includeOrderNumber = false, values = {} } = options;
  const idPrefix = prefix ? `${prefix}` : "";

  return `
    ${
      includeOrderNumber
        ? `
    <div class="mb-3">
      <label for="${idPrefix}OrderNumber" class="form-label">Order Number</label>
      <input type="text" id="${idPrefix}OrderNumber" class="form-control" value="${
            values.orderNumber || ""
          }" disabled/>
    </div>
    `
        : ""
    }
    <div class="mb-3">
      <input
        class="form-control"
        placeholder="Email"
        name="${prefix ? prefix.toLowerCase() + "Email" : "email"}"
        id="${idPrefix}Email"
        type="email"
        value="${values.email || ""}"
        required
      />
      <div class="invalid-feedback">
        Please enter a valid email address (e.g., name@example.com).
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-md-6">
        <input
          class="form-control"
          placeholder="First Name"
          name="${prefix ? prefix.toLowerCase() + "FirstName" : "firstName"}"
          id="${idPrefix}FirstName"
          value="${values.firstName || ""}"
          required
        />
      </div>
      <div class="col-md-6">
        <input
          class="form-control"
          placeholder="Last Name"
          name="${prefix ? prefix.toLowerCase() + "LastName" : "lastName"}"
          id="${idPrefix}LastName"
          value="${values.lastName || ""}"
          required
        />
      </div>
    </div>
    <input
      class="form-control mb-3"
      placeholder="Phone Number"
      id="${idPrefix}PhoneNumber"
      name="${prefix ? prefix.toLowerCase() + "Phone" : "phone"}"
      value="${values.phoneNumber || ""}"
      required
    />
  `;
}

// Universal toast function with blur background
function showToastWithBlur(message, options = {}) {
  const {
    type = options.type || "success", // success, error, warning, info
    icon = options.icon || "fas fa-check-circle",
    delay = options.delay || 2000,
    autoHide = typeof options.autoHide === "undefined"
      ? true
      : options.autoHide,
    onHidden = options.onHidden || null,
  } = options;

  // Create blur overlay
  const blurOverlayId = `blurOverlay_${Date.now()}`;
  const blurOverlayHtml = `
          <div id="${blurOverlayId}" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; backdrop-filter: blur(5px); background-color: rgba(0, 0, 0, 0.3); z-index: 9998; transition: opacity 0.3s ease;"></div>
        `;
  document.body.insertAdjacentHTML("beforeend", blurOverlayHtml);

  // Determine colors based on type
  const typeStyles = {
    success: { bg: "bg-white", text: "text-dark", iconColor: "text-success" },
    error: { bg: "bg-white", text: "dark", iconColor: "text-danger" },
    warning: { bg: "bg-white", text: "dark", iconColor: "text-warning" },
    info: { bg: "bg-white", text: "dark", iconColor: "text-info" },
  };
  const style = typeStyles[type] || typeStyles.success;

  // Create toast
  const toastId = `toast_${Date.now()}`;
  const toastHtml = `
          <div id="${toastId}" class="toast align-items-center ${style.bg} ${style.text} border position-fixed" role="alert" aria-live="assertive" aria-atomic="true" style="z-index:9999; top: 50%; left: 50%; transform: translate(-50%, -50%); min-width: 350px; box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);">
            <div class="d-flex">
              <div class="toast-body fs-5 py-3">
                <i class="${icon} ${style.iconColor} me-2"></i>
                ${message}
              </div>
              <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
          </div>
        `;

  document.body.insertAdjacentHTML("beforeend", toastHtml);
  const toastEl = document.getElementById(toastId);
  const blurOverlayEl = document.getElementById(blurOverlayId);
  const bsToast = new bootstrap.Toast(toastEl, { delay, autohide: autoHide });

  // Remove blur overlay when toast is hidden
  toastEl.addEventListener("hidden.bs.toast", () => {
    if (blurOverlayEl) {
      blurOverlayEl.remove();
    }
    if (onHidden) {
      onHidden();
    }
  });

  bsToast.show();
  return { toastEl, bsToast, blurOverlayEl };
}
// ==================================================

// Auto-initialize common elements when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializePageElements();
});
