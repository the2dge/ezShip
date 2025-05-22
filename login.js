const CLIENT_ID = "2007420785"; // LINE Channel ID
const REDIRECT_URI = "https://www.mrbean.tw/"; //網站 callback URL
function logout() {
  // Clear user info and cart
  sessionStorage.removeItem('lineUserName');
            sessionStorage.removeItem('lineUserEmail');
            sessionStorage.removeItem('lineUserId');
            localStorage.removeItem('currentOrderId');
  localStorage.removeItem('lineUser');
  localStorage.removeItem('cart');
  localStorage.removeItem('scrollPosition');

  // Refresh to reset UI
  location.reload();
}
async function handleLINELoginReturn() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');

  if (code) {
    const profile = await exchangeCodeForToken(code); // should return user info

    // Update UI
    document.getElementById('login-link').style.display = 'none';
    document.getElementById('user-name-link').style.display = 'inline-block';
    document.getElementById('user-name').textContent = profile.displayName || '會員';

    // Optional: save login info to localStorage/session
    localStorage.setItem('lineUser', JSON.stringify(profile));

    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}
function loginWithLINE_tmp() {
  // IMPORTANT: First, make sure we get the ACTUAL current cart from your global state
  // This ensures we're not using a stale reference
  // Assuming your cart is stored in a global variable or state management system
  let currentCart = window.cartItems || []; // Replace with however you actually track cart items
  
  // For debugging, inspect what's in the cart before we do anything
  console.log("ACTUAL cart before LINE login:", JSON.stringify(currentCart));
  
  // Store scroll position if needed
  localStorage.setItem("scrollPosition", window.scrollY);
  
  // Force localStorage to save the current cart state immediately
  // Using a unique key to avoid any potential caching issues
  const timestamp = new Date().getTime();
  localStorage.setItem("line_login_cart_" + timestamp, JSON.stringify(currentCart));
  localStorage.setItem("active_cart_key", "line_login_cart_" + timestamp);
  
  // Also keep the original cart key for compatibility
  localStorage.setItem("cart", JSON.stringify(currentCart));
  
  // Verify the cart was stored correctly
  const verifyCart = localStorage.getItem("line_login_cart_" + timestamp);
  console.log("Verified cart storage before redirect:", verifyCart);
  
  // Add "state" parameter with cart reference
  const loginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=profile%20openid%20email&state=content`;
  window.location.href = loginUrl;
}
function loginWithLINE() {
  // fallback: try to load cart from sessionStorage if not in memory
  //const storedCart = sessionStorage.getItem("cart");
  const storedCart = localStorage.getItem('cart');
  const currentCart = storedCart ? JSON.parse(storedCart) : [];
  // Store current scroll position
  sessionStorage.setItem("scrollPosition", window.scrollY);
  sessionStorage.setItem("cart", JSON.stringify(currentCart));  // 🔁 Important
  
   // Set a custom "state" to tell after login go to checkout
  const loginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=profile%20openid%20email&state=checkout`;

  //const loginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=profile%20openid%20email&state=12345`;
  
  // Redirect the browser to the LINE login page
  window.location.href = loginUrl;
}

function updateNavbarWithUserName(userName) {
  const loginBtn = document.getElementById('member-login-btn');
  if (loginBtn) {
    loginBtn.textContent = `👤 ${userName}`;
    loginBtn.disabled = true; // Optional: prevent re-clicking
  }
}

async function setupCreditPointValidation() {
  const lineUserId = sessionStorage.getItem('lineUserId');
  if (!lineUserId) return;

  try {
    const res = await fetch(' https://script.google.com/macros/s/AKfycbzZhiPYkL62ZHeRMi1-RCkVQUodJDe6IR7UvNouwM1bkHmepJAfECA4JF1_HHLn9Zu7Yw/exec?mode=getMemberInfo&lineUserId=${lineUserId}')
    const data = await res.json();

    if (data.status === 'success') {
      const creditBalance = parseFloat(data.creditBalance || '0');
      sessionStorage.setItem('creditBalance', creditBalance);
      console.log("For Checkout: creditBalance --", creditBalance);
      // Optionally show balance
      const note = document.createElement('p');
      note.textContent = `💰 可用點數餘額：$${creditBalance.toFixed(2)}`;
      document.getElementById('checkout-form').appendChild(note);

      const paymentSelect = document.getElementById('payment-method');
      const submitBtn = document.getElementById('submit-order-btn');
      const totalText = document.querySelector('.checkout-total')?.textContent || '';
      const totalAmount = parseFloat(totalText.replace(/[^0-9.]/g, ''));

      paymentSelect.addEventListener('change', () => {
        const selected = paymentSelect.value;
        if (selected === 'credit-point') {
          if (creditBalance >= totalAmount) {
            submitBtn.disabled = false;
          } else {
            submitBtn.disabled = true;
            alert('❌ 點數不足，無法使用點數付款');
          }
        } else {
          // Enable for other payment types if shipping method is valid
          const addressVal = document.getElementById('address').value;
          submitBtn.disabled = !(addressVal === '7-11 商店取貨' || addressVal === '來商店取貨');
        }
      });
    }

  } catch (err) {
    console.error('Failed to fetch credit balance:', err);
  }
}
function generateCustomOrderId() {
  const now = new Date();

  // AA logic → month count since Jan 2025
  const startDate = new Date(2025, 0, 1); // Jan 1, 2025
  const monthsPassed = (now.getFullYear() - 2025) * 12 + now.getMonth(); // 0-based
  const aaCode = String.fromCharCode(65 + Math.floor(monthsPassed / 26)) + String.fromCharCode(65 + (monthsPassed % 26)); // AA, AB, AC...

  const day = String(now.getDate()).padStart(2, '0');

  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const secondsSinceMidnight = Math.floor((now - midnight) / 1000);
  const yyy = String(secondsSinceMidnight).padStart(7, '0');

  return `${aaCode}${day}${yyy}`;
}

// Call this after login is confirmed
const storedUserName = sessionStorage.getItem('lineUserName');
if (storedUserName) updateNavbarWithUserName(storedUserName);
  
