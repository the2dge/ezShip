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
async function loadMemberInfo() {
  const memberName = sessionStorage.getItem('lineUserName') || '未登入會員';
  const lineUserId = sessionStorage.getItem('lineUserId');

  if (!lineUserId) {
    Swal.fire('請先登入', '您必須先登入才能查看帳號資訊', 'warning');
    return;
  }

  try {
    const res = await fetch(`https://script.google.com/macros/s/AKfycbzZhiPYkL62ZHeRMi1-RCkVQUodJDe6IR7UvNouwM1bkHmepJAfECA4JF1_HHLn9Zu7Yw/exec?mode=getMemberInfo&lineUserId=${lineUserId}`);
    const result = await res.json();

    if (result.status === 'success') {
      const html = `
        <div style="text-align: left;">
          <p><strong>👤 會員名稱：</strong> ${memberName}</p>
          <p><strong>🏅 會員等級：</strong> ${result.membershipLevel}</p>
          <p><strong>💰 儲值餘額：</strong> $${Number(result.creditBalance).toLocaleString()}</p>
          <p><strong>🧾 消費總額：</strong> $${Number(result.totalSpent).toLocaleString()}</p>
          <p><strong>🎁 獎勵點數：</strong> ${Number(result.rewardPoint).toLocaleString()}</p>
          <p>
            <strong>🎟️ 專屬折扣碼：</strong>
            <code id="member-discount-code">${result.discountCode}</code>
            <button onclick="copyDiscountCode()" style="margin-left: 8px; padding: 2px 6px; font-size: 0.9em;">📋 複製</button>
          </p>
        </div>
      `;

      Swal.fire({
        title: '會員帳號資訊',
        html: html,
        confirmButtonText: '關閉',
        width: 400
      });
    } else {
      Swal.fire('找不到資料', '請確認您是否為註冊會員', 'info');
    }

  } catch (err) {
    console.error('Error fetching member info:', err);
    Swal.fire('錯誤', '無法取得會員資料，請稍後再試', 'error');
  }
}
function copyDiscountCode() {
  const code = document.getElementById('member-discount-code')?.textContent;
  if (!code) return;

  navigator.clipboard.writeText(code).then(() => {
    Swal.fire('✅ 已複製', `折扣碼 ${code} 已複製到剪貼簿`, 'success');
  }).catch(err => {
    console.error('Copy failed:', err);
    Swal.fire('錯誤', '無法複製折扣碼', 'error');
  });
}
function getPaymentMethodInChinese(paymentMethod) {
  const paymentMethodMap = {
    'pay_at_store': '取貨時付款',
    'credit_point': '儲值金已付款',
    'credit_card_ecpay': '信用卡已付款'
  };
  
  return paymentMethodMap[paymentMethod] || paymentMethod;
}
async function checkOrders() {
  const lineUserId = sessionStorage.getItem('lineUserId');
  if (!lineUserId) {
    Swal.fire("請先登入以查看訂單");
    return;
  }

  try {
    const res = await fetch(`https://script.google.com/macros/s/AKfycbzZhiPYkL62ZHeRMi1-RCkVQUodJDe6IR7UvNouwM1bkHmepJAfECA4JF1_HHLn9Zu7Yw/exec?mode=getOrders`);
    const data = await res.json();

    if (data.status !== 'success' || !Array.isArray(data.orders)) {
      Swal.fire("查詢失敗", "無法獲取訂單資料", "error");
      return;
    }

    const userOrders = data.orders.filter(order => 
      order.lineUserId && order.lineUserId.toString().trim() === lineUserId.trim()
    );

    if (userOrders.length === 0) {
      Swal.fire("目前沒有您的訂單紀錄");
      return;
    }
    console.log("Orders are: ", userOrders);
    // Create a simple display
    let html = '<h3>我的訂單</h3><table border="1" style="width:100%; text-align:left;"><tr><th>訂單編號</th><th>付款方式</th><th>取貨門市</th></tr>';
    userOrders.forEach(order => {
      html += `<tr>
        <td>${order.Order_ID || ''}</td>
        <td>${getPaymentMethodInChinese(order.Payment_Method) || ''}</td>
        <td>${order.StoreAddress || ''}</td>
      </tr>`;
    });
    html += '</table>';

    Swal.fire({
      title: '您的訂單查詢',
      html: html,
      width: '90%',
      confirmButtonText: '關閉'
    });

  } catch (error) {
    console.error("Error fetching orders:", error);
    Swal.fire("錯誤", "查詢訂單時發生錯誤", "error");
  }
}

function handleTopup(amount) {
  if (!amount || isNaN(amount)) {
    Swal.fire('錯誤', '無效的儲值金額', 'error');
    return;
  }

  const loginName = sessionStorage.getItem('lineUserName') || 'Unknown';
  const lineUserId = sessionStorage.getItem('lineUserId') || ' Unkown';
  const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14); // e.g., 20240521123045
  const orderId = `TU${timestamp}`;
  console.log("User Name is: ", loginName);
  const ecpayData = {
    name: loginName,
    orderId: orderId,
    totalAmount: amount,
    itemName: "儲值金額", 
    tradeDesc: "Top Up",
    customField1: "Top Up",
    customField2: lineUserId,
    customField3: "Top Up",
    customField4: "Top Up",
    returnUrl: 'https://asia-east1-ecpay-rtnmessage.cloudfunctions.net/handleECPayPost', 
    clientBackUrl: 'https://www.mrbean.tw/' 
  };

  console.log("Sending topup data:", ecpayData);

  fetch('https://mrbean-creditpayment-production-545199463340.asia-east1.run.app', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ecpayData)
  })
  .then(response => {
    if (!response.ok) {
      return response.text().then(text => {
        throw new Error(`Server responded with ${response.status}: ${text}`);
      });
    }
    return response.text();
  })
  .then(html => {
    document.open();
    document.write(html);
    document.close();
  })
  .catch(error => {
    console.error('Error initiating payment:', error);
    Swal.fire('Failed 未能付款。請重試。 Error: ' + error.message);
  });
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

async function updateNavbarWithUserName(userName) {
  let isMember = false;
  const loginBtn = document.getElementById('member-login-button');
  const memberService = document.getElementById('member-service-container');
  const storedUserId = sessionStorage.getItem('lineUserId');

  if (!storedUserId) return;

  try {
   const res = await fetch(`https://script.google.com/macros/s/AKfycbzZhiPYkL62ZHeRMi1-RCkVQUodJDe6IR7UvNouwM1bkHmepJAfECA4JF1_HHLn9Zu7Yw/exec?mode=getMemberInfo&lineUserId=${storedUserId}`);
   const data = await res.json();

    if (data.status === 'success') {
      isMember = true;
    }

    if (loginBtn) {
      loginBtn.textContent = `👤 ${userName}`;
      loginBtn.disabled = true;
    }

    if (isMember) {
      memberService.style.display = "block";
    } else {
      // Ask to complete registration
      const { value: phoneNumber } = await Swal.fire({
        title: '歡迎加入會員 🎉',
        text: '是否願意提供電話號碼以完成會員註冊？',
        input: 'tel',
        inputLabel: '手機號碼',
        inputPlaceholder: '請輸入您的手機號碼',
        inputAttributes: {
          maxlength: 12,
          autocapitalize: 'off',
          autocorrect: 'off'
        },
        confirmButtonText: '提交',
        showCancelButton: true,
        cancelButtonText: '稍後再說'
      });

      if (phoneNumber) {
        // Send registration request
        await fetch('https://script.google.com/macros/s/AKfycbzZhiPYkL62ZHeRMi1-RCkVQUodJDe6IR7UvNouwM1bkHmepJAfECA4JF1_HHLn9Zu7Yw/exec', {
          method: 'POST',
          mode: "no-cors",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            mode: 'registerMember',
            lineUserId: storedUserId,
            lineUserName: userName,
            telephone: phoneNumber
          })
        });

        Swal.fire('完成註冊', '感謝您提供資料！已成功註冊會員。', 'success');
        memberService.style.display = "block";
      }
    }

    console.log("LineId is:", storedUserId, "IsMember:", isMember);

  } catch (err) {
    console.error('Error checking membership:', err);
  }
}
/*
async function updateNavbarWithUserName(userName) {
  let isMember = false;
  const loginBtn = document.getElementById('member-login-button');
  const memberService = document.getElementById('member-service-container');
  const storedUserId = sessionStorage.getItem('lineUserId');
  if (storedUserId) {
  const res = await fetch(`https://script.google.com/macros/s/AKfycbzZhiPYkL62ZHeRMi1-RCkVQUodJDe6IR7UvNouwM1bkHmepJAfECA4JF1_HHLn9Zu7Yw/exec?mode=getMemberInfo&lineUserId=${storedUserId}`);
      const data = await res.json();
      if (data.status === 'success') {
        isMember = true;
      }
  }
  console.log("LineId is: ", storedUserId, isMember);
  if (loginBtn && isMember) {
    loginBtn.textContent = `👤 ${userName}`;
    loginBtn.disabled = true; // Optional: prevent re-clicking
    memberService.style.display ="block";
  }
}
*/
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
  
