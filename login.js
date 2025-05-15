const CLIENT_ID = "2006943877"; // LINE Channel ID
const REDIRECT_URI = "https://the2dge.github.io/bean0428"; //網站 callback URL
function loginWithLINE() {
  // fallback: try to load cart from sessionStorage if not in memory
  const storedCart = sessionStorage.getItem("cart");
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

function submitPayment(customerName,customerPhone, orderId, amount, orderItems, payType, pickupOption, storeCode) {
  const merchantID = '2000933';  // ECPay Testing Merchant ID
  const hashKey = 'XBERn1YOvpM9nfZc';        // ECPay Testing Hash Key
  const hashIV = 'h1ONHk4P4yqbl5LK';          // ECPay Testing Hash IV
  //var merchantID = '3428230';  // MR.BEAN Merchant ID
  //var hashKey = '1LB3xdWvpCfBUcvm';        // MR.BEAN Hash Key
  //var hashIV = 'nLw4YqFOCAD9dfiP';          // MR.BEAN Hash IV
  const now = new Date();
  const merchantTradeDate = Utilities.formatDate(now, "GMT+8", "yyyy/MM/dd HH:mm:ss");

  try {
    // Append the order details to Google Sheets(toDo:1)
    sheet2.appendRow([
      now,           // Timestamp
      customerName,  // Customer Name
      customerPhone, //
      orderId,       // Order ID
      amount,        // Amount
      orderItems, // Ordered Items
      payType,       // Payment Type
      pickupOption,   // Pickup Option
      storeCode
    ]);
    Logger.log("Order saved successfully to Google Sheets(lineSales).");
    // Prepare a notification message
    const message = `🛒 新訂單通知\n\n姓名: ${customerName}\n電話: ${customerPhone}\n訂單編號: ${orderId}\n商品項目: ${orderItems}\n金額: ${amount} 元\n取貨方式: ${pickupOption}\n取貨店代碼: ${storeCode}`;

    // Send a notification to the LINE Official Account chat(toDo:2)
    sendLineNotificationToOfficial(message);
    // Combine order items and pickup option into a single string
  const combinedItemName = `${orderItems} | 取貨方式: ${pickupOption}`;
  Logger.log("combinedItemName is: " + combinedItemName);


// Prepare the form data for ECPay
    const formData = {
      'MerchantID': merchantID,
      'MerchantTradeNo': orderId,
      'MerchantTradeDate': merchantTradeDate,
      'PaymentType': 'aio',
      'TotalAmount': amount,
      'TradeDesc': customerName,
      'ItemName': combinedItemName,
      'ReturnURL': 'https://asia-east1-ecpay-rtnmessage.cloudfunctions.net/handleECPayPost',
      'ClientBackURL': 'https://www.mrbean.tw',
      'ChoosePayment': payType,
      'CustomField1' : pickupOption,
      'CustomField2' : storeCode,
      'CustomField3' : customerName,
      'CustomField4' : customerPhone,
      'EncryptType': '1'  // ECPay requirement
    };
 // Generate the CheckMacValue
    formData.CheckMacValue = createCheckMacValue(formData, hashKey, hashIV);
    // Log the data being sent
    Logger.log("Form data prepared for ECPay: " + JSON.stringify(formData));

    return formData; // Return the formData object for further processing
  } catch (error) {
    Logger.log("Error processing payment: " + error.message);
    throw new Error("Failed to process payment. Please try again later.");
  }
}
// Call this after login is confirmed
const storedUserName = sessionStorage.getItem('lineUserName');
if (storedUserName) updateNavbarWithUserName(storedUserName);
  