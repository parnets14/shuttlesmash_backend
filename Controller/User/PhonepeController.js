const axios = require("axios");
const crypto = require('crypto');
const PhonepeModel = require("../../Model/User/PhonepeModel");

const MERCHANT_ID = "M23QC1WPAN5Z3";
const SECRET_KEY = "37e1984b-2ab0-43ed-b939-2ae4cc88a2af";  
const PHONEPE_API_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";
const CALLBACK_URL = "https://shuttlesmash.in";

const transactionModel = PhonepeModel;

const fallbackConfig = {
  frontend: {
    baseUrl: process.env.NODE_ENV === 'production' || !process.env.NODE_ENV 
      ? 'https://shuttlesmash.in' 
      : 'http://localhost:3000',
    paymentSuccess: '/Paymentsuccess',
    checkout: '/registration'
  }
};

const appConfig = fallbackConfig;

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("Frontend baseUrl:", appConfig.frontend.baseUrl); 

const {
  StandardCheckoutClient,
  Env,
  CreateSdkOrderRequest
} = require("pg-sdk-node");

const clientId = "SU2606301810596830314103";
const clientSecret = "dd464629-6111-454e-b53e-dc20ee5a7cc5";
const clientVersion = 1;
const env = Env.PRODUCTION;

let client;
try {
  client = StandardCheckoutClient.getInstance(
    clientId,
    clientSecret,
    clientVersion,
    env
  );
  console.log("PhonePe SDK client initialized successfully");
} catch (error) {
  console.error("Failed to initialize PhonePe SDK client:", error);
  client = null;
}

class Transaction {
  async addPaymentPhone(req, res) {
    try {
      const { userId, username, Mobile, orderId, amount, config, successUrl, failedUrl } = req.body;

      if (!userId || !username || !Mobile || !amount) {
        return res.status(400).json({ 
          error: "Missing required fields",
          details: "userId, username, Mobile, and amount are required"
        });
      }

      console.log("Creating transaction for user:", userId, "amount:", amount);

      // Sanitize failedUrl — if it contains a full ?item= blob it will cause a 414
      // Extract the event id from the failedUrl and rebuild it as a short ?id= URL
      let safeFailedUrl = failedUrl;
      if (failedUrl && failedUrl.includes("?item=")) {
        try {
          const urlObj = new URL(failedUrl);
          const itemStr = urlObj.searchParams.get("item");
          if (itemStr) {
            const itemObj = JSON.parse(decodeURIComponent(itemStr));
            const eventId = itemObj?._id;
            if (eventId) {
              safeFailedUrl = `${urlObj.origin}/registration?id=${eventId}`;
            }
          }
        } catch (e) {
          // If parsing fails, fall back to just the events page
          safeFailedUrl = `${appConfig.frontend.baseUrl}/events`;
        }
      }

      const data = await transactionModel.create({
        userId,
        username,
        Mobile,
        orderId,
        amount,
        config,
        successUrl,
        failedUrl: safeFailedUrl
      });

      if (!data) {
        console.error("Failed to create transaction record");
        return res.status(400).json({ error: "Failed to create transaction record" });
      }

      console.log("Transaction created with ID:", data._id);
      const merchantOrderId = data._id.toString();
      const redirectUrl = `${appConfig.frontend.baseUrl}${appConfig.frontend.paymentSuccess}?transactionId=${data._id}&userID=${userId}`;

      console.log("Building payment request for merchantOrderId:", merchantOrderId);
      console.log("Redirect URL:", redirectUrl);

      console.log("Using direct PhonePe API...");
      console.log('🏪 Merchant Details:');
      console.log('Merchant ID:', MERCHANT_ID);
      console.log('Secret Key (first 10 chars):', SECRET_KEY.substring(0, 10) + '...');
      console.log('API URL:', PHONEPE_API_URL);
      
      const callbackUrl = `${appConfig.frontend.baseUrl.includes('localhost') ? 'https://shuttlesmash.in' : appConfig.frontend.baseUrl}/api/phonepe/checkPayment/${merchantOrderId}/${userId}`;
      console.log('Callback URL:', callbackUrl);

      const paymentPayload = {
        merchantId: MERCHANT_ID,
        merchantTransactionId: merchantOrderId,
        merchantUserId: userId,
        amount: amount * 100,
        redirectUrl: redirectUrl,
        redirectMode: "POST",
        callbackUrl: callbackUrl,
        mobileNumber: Mobile,
        paymentInstrument: { type: "PAY_PAGE" }
      };

      console.log('💳 Payment Payload:', JSON.stringify(paymentPayload, null, 2));

      const payload = JSON.stringify(paymentPayload);
      const base64Payload = Buffer.from(payload).toString('base64');
      const stringToHash = base64Payload + '/pg/v1/pay' + SECRET_KEY;
      const sha256Hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
      const signature = sha256Hash + '###' + 1;

      console.log('🔐 Signature Generation:');
      console.log('String to hash:', stringToHash.substring(0, 100) + '...');
      console.log('SHA256 Hash:', sha256Hash.substring(0, 20) + '...');
      console.log('Final Signature:', signature.substring(0, 30) + '...');

      try {
        console.log('📡 Making PhonePe API request...');
        console.log('URL:', PHONEPE_API_URL);
        console.log('Payload (base64):', base64Payload.substring(0, 100) + '...');
        console.log('Signature:', signature.substring(0, 50) + '...');
        console.log('Headers:', {
          "X-VERIFY": signature.substring(0, 20) + '...',
          "Content-Type": "application/json"
        });
        
        const directResponse = await axios.post(
          PHONEPE_API_URL,
          { request: base64Payload },
          { 
            headers: { 
              "X-VERIFY": signature, 
              "Content-Type": "application/json"
            },
            timeout: 10000 // 10 second timeout
          }
        );

        console.log('✅ PhonePe API Response Status:', directResponse.status);
        console.log('✅ PhonePe API Response Data:', directResponse.data);

        // Try different response structures for compatibility
        let checkoutUrl = directResponse.data?.data?.instrumentResponse?.redirectInfo?.url;
        
        // Fallback response structures
        if (!checkoutUrl) {
          checkoutUrl = directResponse.data?.redirectUrl;
        }
        if (!checkoutUrl) {
          checkoutUrl = directResponse.data?.data?.redirectUrl;
        }
        if (!checkoutUrl) {
          checkoutUrl = directResponse.data?.url;
        }

        if (checkoutUrl) {
          console.log('✅ Payment URL generated:', checkoutUrl);
          return res.status(200).json({
            orderId: merchantOrderId,
            merchantID: merchantOrderId,
            url: checkoutUrl,
          });
        } else {
          console.error('❌ No checkout URL in response:', directResponse.data);
          return res.status(500).json({ 
            error: "PhonePe payment initialization failed",
            details: "No payment URL received from PhonePe",
            response: directResponse.data
          });
        }
      } catch (directApiError) {
        console.error("❌ PhonePe API Error Details:");
        console.error("Status:", directApiError.response?.status);
        console.error("Status Text:", directApiError.response?.statusText);
        console.error("Response Data:", directApiError.response?.data);
        console.error("Request URL:", directApiError.config?.url);
        console.error("Request Method:", directApiError.config?.method);
        console.error("Request Headers:", directApiError.config?.headers);
        console.error("Full Error:", directApiError.message);
        
        // Try SDK approach as fallback for any API error
        if (client) {
          console.log("🔄 Trying SDK approach as fallback...");
          
          try {
            const paymentRequest = CreateSdkOrderRequest.StandardCheckoutBuilder()
              .merchantOrderId(merchantOrderId)
              .amount(amount * 100)
              .redirectUrl(redirectUrl)
              .build();

            console.log("📱 Sending payment request via SDK...");
            const sdkResponse = await client.pay(paymentRequest);
            console.log("✅ PhonePe SDK response:", sdkResponse);
            
            const checkoutUrl = sdkResponse.redirectUrl;
            if (checkoutUrl) {
              console.log("✅ Payment URL generated via SDK:", checkoutUrl);
              return res.status(200).json({
                orderId: sdkResponse.orderId || merchantOrderId,
                merchantID: merchantOrderId,
                url: checkoutUrl,
                method: 'SDK'
              });
            }
          } catch (sdkError) {
            console.error("❌ SDK also failed:", sdkError.message);
          }
        }
        
        return res.status(500).json({ 
          error: "PhonePe payment initialization failed",
          details: directApiError.message,
          status: directApiError.response?.status,
          statusText: directApiError.response?.statusText,
          responseData: directApiError.response?.data,
          troubleshooting: {
            merchantId: MERCHANT_ID,
            apiUrl: PHONEPE_API_URL,
            payloadSize: base64Payload.length,
            signatureLength: signature.length,
            suggestion: "The v2 API requires proper merchant authorization. Consider using SDK approach or contact PhonePe support for v2 API access."
          }
        });
      }
    } catch (error) {
      console.error("Payment Error:", error);
      return res.status(500).json({ 
        error: "Payment processing failed",
        details: error.message
      });
    }
  }

  async addPaymentMobile(req, res) {
    let transaction;
    try {
      const { userId, username, Mobile, orderId, amount, platform } = req.body;

      if (!userId || !username || !Mobile || !amount) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      transaction = await transactionModel.create({
        userId,
        username,
        Mobile,
        orderId: orderId || `ORD_${Date.now()}`,
        amount,
        status: 'INITIATED',
        platform: platform || 'mobile'
      });

      const merchantTransactionId = transaction._id.toString();
      
      // Use web URL that will redirect to app deep link
      // This is required because PhonePe doesn't support custom URL schemes directly
      const redirectUrl = `https://madhusewingmachines.com/api/phonepe/mobile-redirect?transactionId=${merchantTransactionId}&userId=${userId}`;
      const callbackUrl = `https://madhusewingmachines.com/api/phonepe/payment-callback`;

      console.log("Mobile payment redirect URL:", redirectUrl);

      // Try SDK approach first
      if (client) {
        try {
          const paymentRequest = CreateSdkOrderRequest.StandardCheckoutBuilder()
            .merchantOrderId(merchantTransactionId)
            .amount(amount * 100)
            .redirectUrl(redirectUrl)
            .build();

          const response = await client.pay(paymentRequest);
          console.log("PhonePe SDK response for mobile:", response);
          
          if (response.redirectUrl) {
            return res.status(200).json({
              success: true,
              url: response.redirectUrl,
              transactionId: merchantTransactionId,
              orderId: response.orderId,
            });
          }
        } catch (sdkError) {
          console.error("PhonePe SDK failed for mobile:", sdkError.message);
        }
      }

      // Fallback to direct API
      const paymentPayload = {
        merchantId: MERCHANT_ID,
        merchantTransactionId: merchantTransactionId,
        merchantUserId: userId,
        amount: amount * 100,
        redirectUrl: redirectUrl,
        redirectMode: "POST",
        callbackUrl: callbackUrl,
        mobileNumber: Mobile,
        paymentInstrument: { type: "PAY_PAGE" }
      };

      const base64Payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');
      const stringToHash = base64Payload + '/pg/v1/pay' + SECRET_KEY;
      const sha256Hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
      const signature = sha256Hash + '###' + 1;

      try {
        const directResponse = await axios.post(
          PHONEPE_API_URL,
          { request: base64Payload },
          { 
            headers: { 
              "X-VERIFY": signature, 
              "Content-Type": "application/json"
            } 
          }
        );

        const checkoutUrl = directResponse.data?.data?.instrumentResponse?.redirectInfo?.url;
        if (checkoutUrl) {
          return res.status(200).json({
            success: true,
            url: checkoutUrl,
            transactionId: merchantTransactionId,
          });
        }
      } catch (directApiError) {
        console.error("Direct API error:", directApiError.message);
      }

      // Final fallback - return transaction data for client-side handling
      res.status(200).json({
        success: true,
        data: {
          transactionBody: base64Payload,
          checksum: sha256Hash,
          transactionId: transaction._id,
        },
      });
    } catch (error) {
      console.error("Payment Error:", error.message);
      if (transaction) {
        await transactionModel.findByIdAndUpdate(transaction._id, {
          status: 'FAILED',
          error: error.message
        });
      }
      return res.status(500).json({
        error: "Payment processing error",
        details: error.message
      });
    }
  }

  // New endpoint to handle mobile app redirect after payment
  async mobileRedirect(req, res) {
    try {
      const { transactionId, userId } = req.query;
      
      console.log(`Mobile redirect for transaction: ${transactionId}, user: ${userId}`);

      // Check payment status
      let status = 'PENDING';
      if (client && transactionId) {
        try {
          const response = await client.getOrderStatus(transactionId);
          status = response.state || 'PENDING';
          
          // Update transaction status in DB
          await transactionModel.findByIdAndUpdate(transactionId, {
            status: status,
            transactionStatus: status
          });
        } catch (err) {
          console.error("Error checking payment status:", err.message);
        }
      }

      // Direct redirect to app using deep link
      const deeplink = `madhuapp://payment-result?txnId=${transactionId}&status=${status}`;
      console.log(`Redirecting to deep link: ${deeplink}`);
      
      return res.redirect(deeplink);
    } catch (error) {
      console.error("Mobile redirect error:", error);
      // Fallback redirect with error status
      const deeplink = `madhuapp://payment-result?txnId=${req.query.transactionId || ''}&status=ERROR`;
      return res.redirect(deeplink);
    }
  }

  async updateStatuspayment(req, res) {
    try {
      const id = req.params.id;
      const data = await transactionModel.findById(id);
      if (!data) return res.status(400).json({ error: "Data not found" });
      data.status = "Completed";
      await data.save();
      return res.status(200).json({ success: "Successfully Completed" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }

  async checkPayment(req, res) {
    try {
      const id = req.params.id;
      const userId = req.params.userId;

      console.log(`Checking payment for ID: ${id}, User: ${userId}`);

      let data = await transactionModel.findById(id);
      if (!data) {
        return res.status(400).json({ error: "Payment Id not found!" });
      }

      if (!client) {
        return res.status(500).json({ 
          error: "Payment service unavailable",
          details: "PhonePe SDK client not initialized"
        });
      }

      try {
        const response = await client.getOrderStatus(id);
        const state = response.state;

        data.status = state;
        data.transactionStatus = state;
        data = await data.save();

        // Update order payment status if payment is completed
        if (state === 'COMPLETED' || state === 'SUCCESS') {
          try {
            const Order = require("../models/Order");
            const User = require("../models/User");
            const { sendEmail, getOrderConfirmationEmailTemplate, getAdminOrderNotificationTemplate } = require('../utils/email-optimized');
            
            // Find order by orderId from transaction data
            if (data.orderId) {
              const updatedOrder = await Order.findByIdAndUpdate(data.orderId, {
                paymentStatus: 'Paid',
                transactionId: id
              }, { new: true });
              
              console.log(`Updated order ${data.orderId} payment status to Paid`);
              
              // Send emails after successful payment verification
              if (updatedOrder) {
                console.log('💳 Payment verified successfully - sending confirmation emails');
                
                // Get user details for email
                const user = await User.findById(userId);
                
                // Send emails in background (non-blocking)
                setImmediate(async () => {
                  // Send order confirmation email to customer
                  try {
                    console.log('\n🔔 PAYMENT VERIFIED - CUSTOMER EMAIL NOTIFICATION');
                    console.log('=====================================');
                    console.log('Sending order confirmation email after payment verification...');
                    
                    if (user && user.email) {
                      console.log('✅ Customer email found:', user.email);
                      
                      const emailHtml = getOrderConfirmationEmailTemplate(
                        updatedOrder.orderNumber,
                        user.name || updatedOrder.fullName,
                        {
                          cartItems: updatedOrder.cartItems,
                          subtotal: updatedOrder.subtotal,
                          total: updatedOrder.total,
                          fullName: updatedOrder.fullName,
                          phone: updatedOrder.phone,
                          street: updatedOrder.street,
                          city: updatedOrder.city,
                          state: updatedOrder.state,
                          zip: updatedOrder.zip
                        }
                      );

                      await sendEmail({
                        email: user.email,
                        subject: `Order Confirmation - Payment Received #${updatedOrder.orderNumber}`,
                        html: emailHtml
                      });

                      console.log(`✅ Order confirmation email sent to customer: ${user.email}`);
                    } else {
                      console.log('⚠️ No customer email found, skipping confirmation email');
                    }
                    console.log('=====================================\n');
                  } catch (emailError) {
                    console.error('❌ Error sending customer confirmation email:', emailError.message);
                  }

                  // Send order notification email to admin
                  try {
                    console.log('\n🔔 PAYMENT VERIFIED - ADMIN EMAIL NOTIFICATION');
                    console.log('=====================================');
                    console.log('Sending admin notification email after payment verification...');
                    
                    const adminEmail = process.env.ADMIN_EMAIL;
                    
                    if (adminEmail) {
                      console.log('✅ Admin email found:', adminEmail);
                      
                      const adminEmailHtml = getAdminOrderNotificationTemplate(
                        updatedOrder.orderNumber,
                        {
                          name: user?.name || updatedOrder.fullName,
                          email: user?.email
                        },
                        {
                          cartItems: updatedOrder.cartItems,
                          subtotal: updatedOrder.subtotal,
                          total: updatedOrder.total,
                          fullName: updatedOrder.fullName,
                          phone: updatedOrder.phone,
                          street: updatedOrder.street,
                          city: updatedOrder.city,
                          state: updatedOrder.state,
                          zip: updatedOrder.zip,
                          email: user?.email
                        }
                      );

                      await sendEmail({
                        email: adminEmail,
                        subject: `💳 Payment Received - Order #${updatedOrder.orderNumber}`,
                        html: adminEmailHtml
                      });

                      console.log(`✅ Admin notification email sent: ${adminEmail}`);
                    } else {
                      console.log('⚠️ No admin email configured');
                    }
                    console.log('=====================================\n');
                  } catch (emailError) {
                    console.error('❌ Error sending admin notification email:', emailError.message);
                  }
                  
                  // Send embroidery design emails if order contains designs
                  try {
                    console.log('\n🎨 CHECKING FOR EMBROIDERY DESIGNS');
                    console.log('=====================================');
                    
                    const embroideryItems = updatedOrder.cartItems.filter(item => item.type === 'embroidery-design');
                    
                    if (embroideryItems.length > 0 && user && user.email) {
                      console.log(`Processing ${embroideryItems.length} embroidery design(s) for paid order #${updatedOrder.orderNumber}`);
                      
                      const EmbroideryDesign = require("../models/EmbroideryDesign");
                      const { getEmbroideryDesignPurchaseEmailTemplate } = require('../utils/email-optimized');
                      
                      // Send email for each embroidery design
                      for (const item of embroideryItems) {
                        try {
                          const design = await EmbroideryDesign.findById(item.productId);
                          
                          if (design && design.designFile && design.designFile.path) {
                            const path = require('path');
                            const fs = require('fs').promises;
                            const filePath = path.join(__dirname, '..', design.designFile.path);
                            
                            // Check if file exists (async)
                            try {
                              await fs.access(filePath);
                              
                              // Calculate total price for this design
                              const machinePrice = item.selectedMachines ? 
                                item.selectedMachines.reduce((sum, m) => sum + (m.price || 0), 0) : 0;
                              const total = machinePrice * (item.quantity || 1);
                              
                              // Prepare email with attachment
                              const emailHtml = getEmbroideryDesignPurchaseEmailTemplate(
                                updatedOrder.orderNumber,
                                updatedOrder.fullName,
                                {
                                  designName: design.name,
                                  designCode: design.designCode,
                                  machines: item.selectedMachines || [],
                                  total: total
                                }
                              );
                              
                              await sendEmail({
                                email: user.email,
                                subject: `Your Embroidery Design - ${design.name} (Paid Order #${updatedOrder.orderNumber})`,
                                html: emailHtml,
                                attachments: [
                                  {
                                    filename: design.designFile.originalName,
                                    path: filePath
                                  }
                                ]
                              });
                              
                              console.log(`✅ Embroidery design email sent for ${design.name} to ${user.email}`);
                            } catch (fileError) {
                              console.error(`❌ Design file not found: ${filePath}`);
                            }
                          }
                        } catch (designError) {
                          console.error(`Error processing embroidery design ${item.productId}:`, designError);
                        }
                      }
                    } else {
                      console.log('No embroidery designs in order or no user email');
                    }
                    console.log('=====================================\n');
                  } catch (embroideryError) {
                    console.error('❌ Error processing embroidery designs:', embroideryError.message);
                  }
                  
                  // Clear user's cart after successful payment
                  try {
                    console.log('\n🛒 CLEARING USER CART AFTER PAYMENT');
                    console.log('=====================================');
                    
                    const Cart = require("../models/Cart");
                    
                    const cart = await Cart.findOne({ userId: userId });
                    if (cart && cart.items.length > 0) {
                      cart.items = [];
                      await cart.save();
                      console.log(`✅ Cart cleared for user ${userId} after successful payment`);
                    } else {
                      console.log('Cart was already empty or not found');
                    }
                    console.log('=====================================\n');
                  } catch (cartError) {
                    console.error('❌ Error clearing cart after payment:', cartError.message);
                  }
                });
              }
            }
          } catch (orderUpdateError) {
            console.error("Error updating order payment status:", orderUpdateError);
          }
        }

        return res.status(200).json({ 
          success: {
            ...data.toObject(),
            status: state,
            successUrl: data.successUrl,
            failedUrl: data.failedUrl,
            clearCart: state === 'COMPLETED' || state === 'SUCCESS', // Indicate cart should be cleared
            cartCleared: state === 'COMPLETED' || state === 'SUCCESS',
            shouldClearCart: state === 'COMPLETED' || state === 'SUCCESS',
            paymentVerified: state === 'COMPLETED' || state === 'SUCCESS'
          }
        });
      } catch (phonepeError) {
        console.error("PhonePe API error:", phonepeError);
        return res.status(200).json({ 
          success: {
            ...data.toObject(),
            status: data.status || "PENDING",
            successUrl: data.successUrl,
            failedUrl: data.failedUrl
          }
        });
      }
    } catch (error) {
      console.error("CheckPayment error:", error);
      return res.status(400).json({ error: error.message });
    }
  }

  async paymentcallback(req, res) {
    try {
      const { response } = req.body;
      const decodedStr = Buffer.from(response, 'base64').toString('utf-8');
      const responseJson = JSON.parse(decodedStr);
      const { merchantTransactionId, state } = responseJson?.data;

      console.log(`Callback received: Transaction ${merchantTransactionId}, Status: ${state}`);

      const data = await transactionModel.findById(merchantTransactionId);
      if (data) {
        data.status = state;
        await data.save();
      }

      res.status(200).send('Callback processed');
    } catch (error) {
      console.error("Callback error:", error);
      res.status(500).send('Callback processing failed');
    }
  }

  async getallpayment(req, res) {
    try {
      const data = await transactionModel.find({}).sort({ _id: -1 });
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }

  async makepayment(req, res) {
    const { amount, merchantTransactionId, merchantUserId, callbackUrl, mobileNumber } = req.body;

    const paymentDetails = {
      merchantId: MERCHANT_ID,
      merchantTransactionId,
      merchantUserId,
      amount,
      redirectUrl: CALLBACK_URL,
      redirectMode: "POST",
      callbackUrl,
      mobileNumber,
      paymentInstrument: { type: "PAY_PAGE" }
    };

    const payload = JSON.stringify(paymentDetails);
    const base64Payload = Buffer.from(payload).toString("base64");
    const stringToHash = base64Payload + "/pg/v1/pay" + SECRET_KEY;
    const sha256Hash = crypto.createHash("sha256").update(stringToHash).digest("hex");
    const signature = sha256Hash + "###" + 1;

    try {
      const response = await axios.post(
        PHONEPE_API_URL,
        { request: base64Payload },
        { 
          headers: { 
            "X-VERIFY": signature,
            "Content-Type": "application/json"
          } 
        }
      );

      return res.status(200).json({
        url: response.data?.data?.instrumentResponse?.redirectInfo,
      });
    } catch (error) {
      console.error("Payment Error:", error);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new Transaction();