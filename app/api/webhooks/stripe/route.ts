// 1. Next.js imports
import { NextRequest, NextResponse } from "next/server";

// 2. Third-party imports
import Stripe from "stripe";

// 3. Internal imports
import { supabaseAdmin } from "@/lib/supabase";
import { sendOrderConfirmation } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  // 1. Get raw body for signature verification
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    console.error("Webhook signature missing");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  // 2. Verify webhook signature BEFORE any processing
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // 3. Handle payment_intent.succeeded event
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata.orderId;

    if (orderId) {
      // 4. Update order status and retrieve complete order data using admin client (bypasses RLS)
      const { data: order, error } = await supabaseAdmin
        .from("order")
        .update({
          isPaid: true,
          paidAt: new Date().toISOString(),
        })
        .eq("id", orderId)
        .select("*, user_profile(*), order_item(*)")
        .single();

      if (error) {
        console.error("Failed to update order:", error);
        return NextResponse.json(
          { error: "Database error" },
          { status: 500 }
        );
      }

      // 5. Send order confirmation email (non-blocking - failures won't break webhook)
      if (order) {
        console.log("=== WEBHOOK: ORDER DATA FOR EMAIL ===");
        console.log("Order ID:", order.id);
        console.log("User profile present:", !!order.user_profile);
        console.log("User email:", order.user_profile?.email);
        console.log("Order items count:", order.order_item?.length ?? 0);

        try {
          await sendOrderConfirmation(order);
          console.log("=== WEBHOOK: EMAIL SENT SUCCESSFULLY ===");
        } catch (emailError) {
          // Log email error but continue - order is already marked paid
          console.error("=== WEBHOOK: EMAIL SEND FAILED ===");
          console.error("Error details:", emailError);
          // Don't return error - webhook must return 200 to prevent Stripe retries
        }
      } else {
        console.error("=== WEBHOOK: ORDER DATA IS NULL ===");
        console.error("Could not retrieve order after update");
      }
    }
  }

  // 5. Return 200 for all successfully received events (including unhandled types)
  return NextResponse.json({ received: true });
}
