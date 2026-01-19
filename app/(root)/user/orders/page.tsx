import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserOrders } from "@/lib/data-service";
import OrderHistoryList from "@/components/user/OrderHistoryList";

export const metadata = {
  title: "Order History",
};

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user?.profileId) {
    redirect("/sign-in");
  }

  const orders = await getUserOrders();

  return (
    <section className="wrapper my-8">
      <h1 className="h1-bold mb-6">Order History</h1>
      <OrderHistoryList orders={orders} />
    </section>
  );
}
