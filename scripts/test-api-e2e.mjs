async function runApiE2ETests() {
  console.log('=== STARTING AVRONCE LIVE HTTP E2E TEST SUITE ===\n');
  const baseUrl = 'http://localhost:3000';
  let passCount = 0;
  let failCount = 0;

  function assert(condition, name, details = '') {
    if (condition) {
      console.log(`[PASS] ${name}${details ? ` -> ${details}` : ''}`);
      passCount++;
    } else {
      console.error(`[FAIL] ${name}${details ? ` -> ${details}` : ''}`);
      failCount++;
    }
  }

  try {
    // 1. Verify Catalog Products
    const prodRes = await fetch(`${baseUrl}/api/admin/products`);
    const prodData = await prodRes.json();
    assert(prodRes.ok && prodData.success, 'Catalog API GET /api/admin/products');
    assert(prodData.products?.length >= 40, `Products loaded: ${prodData.products?.length} items`);
    const sampleProduct = prodData.products[0];
    console.log(`Sample product selected: ${sampleProduct.title} (₹${sampleProduct.price})`);

    // 2. Admin Authentication
    const loginRes = await fetch(`${baseUrl}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'admin' }),
    });
    const loginData = await loginRes.json();
    assert(loginRes.ok && loginData.success, 'Admin Login Authentication /api/admin/auth/login');
    const adminToken = loginData.token;
    assert(!!adminToken, 'Admin Session Token received');
    const adminHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
    };

    // 3. Test Unauthorized Access Blocked
    const unauthRes = await fetch(`${baseUrl}/api/admin/orders`);
    assert(unauthRes.status === 401, 'Unauthorized access to /api/admin/orders blocked (HTTP 401)');

    // 4. Test COD Order Placement via /api/checkout
    const codRes = await fetch(`${baseUrl}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentMethod: 'cod',
        customer: {
          name: 'Aditi Sharma',
          email: 'aditi.sharma@example.com',
          phone: '9876543210',
        },
        shippingAddress: {
          fullName: 'Aditi Sharma',
          email: 'aditi.sharma@example.com',
          phone: '9876543210',
          addressLine1: 'B-302, Green Glen Layout, Bellandur',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560103',
          country: 'India',
        },
        items: [
          {
            productId: sampleProduct.id,
            name: sampleProduct.title,
            slug: sampleProduct.slug,
            size: '38 (UK 5)',
            price: sampleProduct.price,
            quantity: 1,
            image: sampleProduct.images?.[0] || '/images/collections/cat_boots.webp',
          },
        ],
      }),
    });
    const codData = await codRes.json();
    assert(codRes.ok && codData.success, 'COD Checkout /api/checkout', `Order No: ${codData.orderNumber}`);
    assert(codData.isCod === true, 'COD flag confirmed');
    const codOrderNum = codData.orderNumber;

    // 5. Test Prepaid Checkout via /api/checkout
    const prepaidRes = await fetch(`${baseUrl}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentMethod: 'online',
        customer: {
          name: 'Vikram Seth',
          email: 'vikram.seth@example.com',
          phone: '9811223344',
        },
        shippingAddress: {
          fullName: 'Vikram Seth',
          email: 'vikram.seth@example.com',
          phone: '9811223344',
          addressLine1: 'Penthouse 18, Worli Heights',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400018',
          country: 'India',
        },
        items: [
          {
            productId: sampleProduct.id,
            name: sampleProduct.title,
            slug: sampleProduct.slug,
            size: '39 (UK 6)',
            price: sampleProduct.price,
            quantity: 1,
            image: sampleProduct.images?.[0] || '/images/collections/cat_boots.webp',
          },
        ],
        couponCode: 'NEW10',
      }),
    });
    const prepaidData = await prepaidRes.json();
    assert(prepaidRes.ok && prepaidData.success, 'Prepaid Checkout /api/checkout', `Order No: ${prepaidData.orderNumber}`);
    assert(!!prepaidData.razorpayOrderId, 'Razorpay order ID generated', prepaidData.razorpayOrderId);
    assert(prepaidData.amount > 0, `Amount in paise: ${prepaidData.amount}`);
    const prepaidOrderNum = prepaidData.orderNumber;

    // 6. Test Payment Verification via /api/razorpay/verify-payment
    const verifyRes = await fetch(`${baseUrl}/api/razorpay/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderNumber: prepaidOrderNum,
        orderId: prepaidData.orderId,
        razorpay_order_id: prepaidData.razorpayOrderId,
        razorpay_payment_id: `pay_sim_${Date.now()}`,
        razorpay_signature: 'simulated_signature_avronce',
      }),
    });
    const verifyData = await verifyRes.json();
    assert(verifyRes.ok && verifyData.success, 'Payment Verification /api/razorpay/verify-payment');

    // 7. Test Admin Orders Query with Auth
    const adminOrdersRes = await fetch(`${baseUrl}/api/admin/orders`, {
      headers: adminHeaders,
    });
    const adminOrdersData = await adminOrdersRes.json();
    assert(adminOrdersRes.ok && adminOrdersData.success, 'Authorized Admin Orders API /api/admin/orders');
    assert(adminOrdersData.orders?.length > 0, `Total Admin Orders: ${adminOrdersData.orders?.length}`);

    const foundCod = adminOrdersData.orders.find((o) => o.order_number === codOrderNum);
    assert(!!foundCod, `COD Order ${codOrderNum} visible in Admin Dashboard`);
    assert(foundCod?.customer?.name === 'Aditi Sharma', `Customer name accurate: ${foundCod?.customer?.name}`);
    assert(foundCod?.payment_status === 'pending', `COD payment_status is pending: ${foundCod?.payment_status}`);

    const foundPrepaid = adminOrdersData.orders.find((o) => o.order_number === prepaidOrderNum);
    assert(!!foundPrepaid, `Prepaid Order ${prepaidOrderNum} visible in Admin Dashboard`);
    assert(foundPrepaid?.payment_status === 'paid', `Prepaid payment_status is paid: ${foundPrepaid?.payment_status}`);
    assert(foundPrepaid?.status === 'processing', `Prepaid status transitioned to processing: ${foundPrepaid?.status}`);

    // 8. Test Status & Courier Update in Admin
    const updateRes = await fetch(`${baseUrl}/api/admin/orders`, {
      method: 'PUT',
      headers: adminHeaders,
      body: JSON.stringify({
        id: foundCod.id,
        status: 'shipped',
        courier: 'BlueDart Express',
        tracking_id: 'BD-99887766',
      }),
    });
    const updateData = await updateRes.json();
    assert(updateRes.ok && updateData.success, 'Admin Update Order Status to shipped');
    assert(updateData.order?.tracking_id === 'BD-99887766', 'Tracking ID BD-99887766 saved');

    // 9. Test Customer Tracking Lookup (/api/orders?order_number=...)
    const trackRes = await fetch(`${baseUrl}/api/orders?order_number=${encodeURIComponent(codOrderNum)}`);
    const trackData = await trackRes.json();
    assert(trackRes.ok && trackData.success, 'Customer Tracking Query /api/orders');
    assert(trackData.order?.status === 'shipped', `Customer sees updated status: ${trackData.order?.status}`);
    assert(trackData.order?.tracking_id === 'BD-99887766', `Customer sees tracking ID: ${trackData.order?.tracking_id}`);
    assert(trackData.order?.courier === 'BlueDart Express', `Customer sees courier: ${trackData.order?.courier}`);

    // 10. Test Admin Stats Endpoint
    const statsRes = await fetch(`${baseUrl}/api/admin/stats`);
    const statsData = await statsRes.json();
    assert(statsRes.ok && statsData.success, 'Admin Stats API /api/admin/stats');
    assert(statsData.stats?.totalOrders >= 2, `Total Orders tracked: ${statsData.stats?.totalOrders}`);
    assert(statsData.stats?.totalRevenue > 0, `Total Revenue calculated: ₹${statsData.stats?.totalRevenue}`);
    assert(statsData.stats?.ordersByStatus?.shipped >= 1, `Shipped status count: ${statsData.stats?.ordersByStatus?.shipped}`);

    // 11. Test Payment Failure Reporting
    const failRes = await fetch(`${baseUrl}/api/razorpay/payment-failed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderNumber: codOrderNum,
        errorCode: 'BAD_REQUEST_ERROR',
        errorDescription: 'Card expired or declined',
      }),
    });
    const failData = await failRes.json();
    assert(failRes.ok && failData.success, 'Payment Failure Reporting /api/razorpay/payment-failed');

    // 12. Edge Case: Customer Tracking Privacy & Verification Protection
    const privCorrectRes = await fetch(`${baseUrl}/api/orders?order_number=${encodeURIComponent(codOrderNum)}&verify=9876543210`);
    assert(privCorrectRes.status === 200, 'Customer query with matching phone returns HTTP 200');

    const privWrongRes = await fetch(`${baseUrl}/api/orders?order_number=${encodeURIComponent(codOrderNum)}&verify=9999999999`);
    assert(privWrongRes.status === 403, 'Customer query with mismatching contact blocked (HTTP 403)');

    const privEnumRes = await fetch(`${baseUrl}/api/orders`);
    assert(privEnumRes.status === 400, 'Public enumeration of all orders blocked (HTTP 400)');

    // 13. Edge Case: Invalid Signature Rejection on Verify Payment
    const badSigRes = await fetch(`${baseUrl}/api/razorpay/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderNumber: prepaidOrderNum,
        orderId: prepaidData.orderId,
        razorpay_order_id: prepaidData.razorpayOrderId,
        razorpay_payment_id: 'pay_tampered_12345',
        razorpay_signature: 'invalid_forged_signature_hex_code',
      }),
    });
    const badSigData = await badSigRes.json();
    assert(!badSigRes.ok && badSigRes.status === 400, 'Invalid signature rejected with HTTP 400', badSigData.error);

    console.log(`\n=== LIVE E2E SUITE FINISHED: ${passCount} PASSED, ${failCount} FAILED ===`);
    if (failCount > 0) process.exit(1);
  } catch (err) {
    console.error('Fatal live E2E error:', err);
    process.exit(1);
  }
}

runApiE2ETests();
