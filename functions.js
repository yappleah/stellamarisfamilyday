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
  const num = parseFloat(amount);
  if (isNaN(num)) return '0.00';
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ==================================================
// THERMOMETER ANIMATION FUNCTIONS
// ==================================================

/**
 * Animate number counting with easing
 * @param {string} elementId - ID of element to animate
 * @param {number} start - Starting value
 * @param {number} end - Ending value
 * @param {number} duration - Animation duration in ms
 * @param {boolean} isLarge - If true, adds "JMD $" prefix
 * @param {string} suffix - Suffix to add (e.g., "%")
 */
function animateThermometerValue(elementId, start, end, duration, isLarge = false, suffix = "") {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      current = end;
      clearInterval(timer);
    }
    
    if (isLarge) {
      const value = Math.floor(current);
      const formattedValue = value.toLocaleString('en-US');
      element.textContent = "JMD $" + formattedValue;
    } else if (suffix === "%") {
      // Show 1 decimal place for percentages, capped at 100.0%
      const cappedValue = Math.min(current, 100);
      element.textContent = cappedValue.toFixed(1) + suffix;
    } else if (suffix) {
      element.textContent = Math.floor(current) + suffix;
    } else {
      const value = Math.floor(current);
      const formattedValue = value.toLocaleString('en-US');
      element.textContent = formattedValue;
    }
  }, 16);
}

/**
 * Create falling coins animation
 * @param {string} containerId - ID of container element for coins
 * @param {number} duration - Total duration in milliseconds to keep coins falling
 */
function createCoinAnimation(containerId, duration = 2250) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const coinEmojis = ['🪙', '💰', '💵', '💴', '💶', '💷'];
  const coinInterval = 150; // Time between each coin
  const coinFallDuration = 1600; // How long each coin takes to fall
  
  let elapsed = 0;
  let coinCount = 0;
  
  const coinTimer = setInterval(() => {
    if (elapsed >= duration) {
      clearInterval(coinTimer);
      return;
    }
    
    const coin = document.createElement('div');
    coin.textContent = coinEmojis[Math.floor(Math.random() * coinEmojis.length)];
    coin.style.position = 'absolute';
    coin.style.fontSize = (20 + Math.random() * 20) + 'px';
    coin.style.left = Math.random() * 100 + '%';
    coin.style.top = '-50px';
    coin.style.opacity = '0.8';
    coin.style.transition = 'all 1.5s ease-in';
    coin.style.transform = 'rotate(0deg)';
    
    container.appendChild(coin);
    
    // Animate coin falling
    setTimeout(() => {
      coin.style.top = '100%';
      coin.style.transform = 'rotate(' + (360 + Math.random() * 360) + 'deg)';
      coin.style.opacity = '0';
    }, 50);
    
    // Remove coin after animation
    setTimeout(() => {
      coin.remove();
    }, coinFallDuration);
    
    elapsed += coinInterval;
    coinCount++;
  }, coinInterval);
}

/**
 * Load and animate donation progress thermometer
 * @param {object} supabaseClient - Supabase client instance
 * @param {object} elementIds - Object containing element IDs
 * @param {string} elementIds.coinContainer - Coin animation container ID
 * @param {string} elementIds.totalRaised - Total raised display ID
 * @param {string} elementIds.totalRaisedLarge - Large total raised display ID
 * @param {string} elementIds.goalPercentage - Percentage display ID
 * @param {string} elementIds.thermometerReceived - Received funds bar ID
 * @param {string} elementIds.thermometerPledged - Pledged funds bar ID
 * @param {string} elementIds.loadingStatus - Loading status label ID
 */
async function loadDonationProgress(supabaseClient, elementIds) {
  try {
    const { data: donations, error } = await supabaseClient
      .from("donations")
      .select("pledge_amount, amount_paid, paid")
      .eq('event_id', '4');
    
    if (error) {
      console.error("Error loading donations:", error);
      return;
    }

    // Calculate received funds (amount_paid)
    const receivedFunds = donations ? donations.reduce((sum, d) => sum + (d.amount_paid || 0), 0) : 0;
    
    // Calculate total pledged amount
    const totalPledged = donations ? donations.reduce((sum, d) => sum + (d.pledge_amount || 0), 0) : 0;
    
    // Calculate pledged but not yet paid (total pledged - total received)
    const pledgedFunds = totalPledged - receivedFunds;
    
    const totalDonations = receivedFunds + pledgedFunds;
    const goal = 5000000; // $5 million
    const receivedPercentage = Math.min((receivedFunds / goal) * 100, 100);
    const pledgedPercentage = Math.min((pledgedFunds / goal) * 100, 100);
    const totalPercentage = Math.min((totalDonations / goal) * 100, 100);

    // Calculate proportional animation durations
    const totalAnimationTime = 4000;
    const receivedDuration = totalDonations > 0 ? Math.max(1500, (receivedFunds / totalDonations) * totalAnimationTime) : 2000;
    const pledgedDuration = totalDonations > 0 ? Math.max(1500, (pledgedFunds / totalDonations) * totalAnimationTime) : 2000;

    // Start coin animation if container exists - coins fall for entire animation duration
    if (elementIds.coinContainer) {
      const totalAnimationDuration = receivedDuration + pledgedDuration + 200;
      createCoinAnimation(elementIds.coinContainer, totalAnimationDuration);
    }
    
    const statusLabel = document.getElementById(elementIds.loadingStatus);
    
    // If no received funds, skip straight to pledged animation
    if (receivedFunds === 0) {
      // Show "Pledged Funds" label
      if (statusLabel) {
        statusLabel.style.opacity = "1";
        statusLabel.textContent = "Adding Pledged Funds...";
      }
      
      // Animate pledged funds from 0 to total
      animateThermometerValue(elementIds.totalRaised, 0, totalDonations, pledgedDuration, false, "");
      if (elementIds.totalRaisedLarge) {
        animateThermometerValue(elementIds.totalRaisedLarge, 0, totalDonations, pledgedDuration, true);
      }
      animateThermometerValue(elementIds.goalPercentage, 0, totalPercentage, pledgedDuration, false, "%");
      
      // Pledged layer fills from bottom
      setTimeout(() => {
        const pledgedBar = document.getElementById(elementIds.thermometerPledged);
        if (pledgedBar) {
          pledgedBar.style.bottom = "0%";
          pledgedBar.style.height = totalPercentage + "%";
        }
      }, 100);
      
      // Hide the label after animation completes
      setTimeout(() => {
        if (statusLabel) {
          statusLabel.style.opacity = "0";
          setTimeout(() => {
            statusLabel.textContent = "\u00A0";
          }, 300);
        }
      }, pledgedDuration + 500);
      
      return;
    }
    
    // Show "Funds Received" label and animate first layer
    if (statusLabel) {
      statusLabel.style.opacity = "1";
      statusLabel.textContent = "Adding Funds Received...";
    }
    
    // First stage: animate received funds only
    animateThermometerValue(elementIds.totalRaised, 0, receivedFunds, receivedDuration, false, "");
    if (elementIds.totalRaisedLarge) {
      animateThermometerValue(elementIds.totalRaisedLarge, 0, receivedFunds, receivedDuration, true);
    }
    animateThermometerValue(elementIds.goalPercentage, 0, receivedPercentage, receivedDuration, false, "%");
    
    setTimeout(() => {
      const receivedBar = document.getElementById(elementIds.thermometerReceived);
      if (receivedBar) {
        receivedBar.style.height = receivedPercentage + "%";
      }
    }, 100);
    
    // After first layer animates, show "Pledged Funds" label and animate second layer
    setTimeout(() => {
      if (statusLabel) {
        statusLabel.textContent = "Adding Pledged Funds...";
      }
      
      // Second stage: animate from received to total
      animateThermometerValue(elementIds.totalRaised, receivedFunds, totalDonations, pledgedDuration, false, "");
      if (elementIds.totalRaisedLarge) {
        animateThermometerValue(elementIds.totalRaisedLarge, receivedFunds, totalDonations, pledgedDuration, true);
      }
      animateThermometerValue(elementIds.goalPercentage, receivedPercentage, totalPercentage, pledgedDuration, false, "%");
      
      // Pledged layer starts where received ends and fills the remaining height
      const pledgedBar = document.getElementById(elementIds.thermometerPledged);
      if (pledgedBar) {
        pledgedBar.style.bottom = receivedPercentage + "%";
        pledgedBar.style.height = pledgedPercentage + "%";
      }
    }, receivedDuration + 200);
    
    // Hide the label after both animations complete
    setTimeout(() => {
      if (statusLabel) {
        statusLabel.style.opacity = "0";
        setTimeout(() => {
          statusLabel.textContent = "\u00A0";
        }, 300);
      }
    }, receivedDuration + pledgedDuration + 500);
  } catch (err) {
    console.error("Error in loadDonationProgress:", err);
  }
}

// ==================================================
// TOAST NOTIFICATIONS
// ==================================================
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
