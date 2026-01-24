// Third-party imports
import { Resend } from "resend";

// Internal imports
import type { Order, OrderItem, UserProfile, ShippingAddress } from "@/types";
import { formatNumberWithDecimal, formatDateTime } from "@/lib/utils";

const resend = new Resend(process.env.RESEND_API_KEY);

// Type for order with related data from webhook
type OrderWithDetails = Order & {
  user_profile: UserProfile;
  order_item: OrderItem[];
};

/**
 * Send order confirmation email to customer after successful payment
 * @param order Order with related user profile and order items
 */
export async function sendOrderConfirmation(
  order: OrderWithDetails
): Promise<void> {
  const { user_profile, order_item, ...orderData } = order;

  await resend.emails.send({
    from: process.env.EMAIL_FROM_ADDRESS || "orders@alshami.com",
    to: user_profile.email,
    subject: `Order Confirmation - #${orderData.id.slice(0, 8).toUpperCase()}`,
    html: generateOrderEmailHtml(orderData, order_item, user_profile),
  });
}

/**
 * Generate professional HTML email template for order confirmation
 */
function generateOrderEmailHtml(
  order: Order,
  items: OrderItem[],
  user: UserProfile
): string {
  const { dateTime } = formatDateTime(order.created_at);
  const orderIdShort = order.id.slice(0, 8).toUpperCase();
  const shippingAddress = order.shipping_address as ShippingAddress;

  // Generate items table rows
  const itemsRows = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${formatNumberWithDecimal(item.price)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">$${formatNumberWithDecimal(Number(item.price) * item.quantity)}</td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #2563eb; padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Thank you for your order!</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Greeting -->
              <p style="margin: 0 0 20px; font-size: 16px; color: #333;">Dear ${user.full_name},</p>
              <p style="margin: 0 0 30px; font-size: 16px; color: #666; line-height: 1.5;">
                Your order has been confirmed and will be shipped to the address below. 
                We'll notify you when your order has been dispatched.
              </p>
              
              <!-- Order Info Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0;">
                          <strong style="color: #333; font-size: 14px;">Order Number:</strong>
                          <span style="color: #666; font-size: 14px; margin-left: 8px;">#${orderIdShort}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <strong style="color: #333; font-size: 14px;">Order Date:</strong>
                          <span style="color: #666; font-size: 14px; margin-left: 8px;">${dateTime}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Order Items -->
              <h2 style="margin: 0 0 20px; font-size: 20px; color: #333; font-weight: bold;">Order Items</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #eee; border-radius: 6px; overflow: hidden; margin-bottom: 30px;">
                <thead>
                  <tr style="background-color: #f9fafb;">
                    <th style="padding: 12px; text-align: left; font-size: 14px; color: #666; font-weight: 600;">Product</th>
                    <th style="padding: 12px; text-align: center; font-size: 14px; color: #666; font-weight: 600;">Qty</th>
                    <th style="padding: 12px; text-align: right; font-size: 14px; color: #666; font-weight: 600;">Price</th>
                    <th style="padding: 12px; text-align: right; font-size: 14px; color: #666; font-weight: 600;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>
              
              <!-- Shipping Address -->
              <h2 style="margin: 0 0 20px; font-size: 20px; color: #333; font-weight: bold;">Shipping Address</h2>
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
                <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.6;">
                  ${shippingAddress.fullName}<br/>
                  ${shippingAddress.streetAddress}<br/>
                  ${shippingAddress.city}, ${shippingAddress.postalCode}<br/>
                  ${shippingAddress.country}
                </p>
              </div>
              
              <!-- Order Summary -->
              <h2 style="margin: 0 0 20px; font-size: 20px; color: #333; font-weight: bold;">Order Summary</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #666;">Subtotal:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #666; text-align: right;">$${formatNumberWithDecimal(order.items_price)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #666;">Shipping:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #666; text-align: right;">$${formatNumberWithDecimal(order.shipping_price)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #666;">Tax:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #666; text-align: right;">$${formatNumberWithDecimal(order.tax_price)}</td>
                </tr>
                <tr style="border-top: 2px solid #333;">
                  <td style="padding: 12px 0 0; font-size: 18px; color: #333; font-weight: bold;">Total:</td>
                  <td style="padding: 12px 0 0; font-size: 18px; color: #2563eb; font-weight: bold; text-align: right;">$${formatNumberWithDecimal(order.total_price)}</td>
                </tr>
              </table>
              
              <!-- Footer Message -->
              <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.5;">
                If you have any questions about your order, please don't hesitate to contact us.
              </p>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #666;">Thank you for shopping with us!</p>
              <p style="margin: 0; font-size: 12px; color: #999;">© ${new Date().getFullYear()} Alshami Store. All rights reserved.</p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
