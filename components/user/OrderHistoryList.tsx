import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, formatId, formatNumberWithDecimal } from "@/lib/utils";
import { OrderSummary } from "@/types";

interface OrderHistoryListProps {
  orders: OrderSummary[];
}

export default function OrderHistoryList({ orders }: OrderHistoryListProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          You haven&apos;t placed any orders yet.
        </p>
        <Link href="/products" className="text-primary hover:underline">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead>Order ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Items</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => {
          const { dateOnly } = formatDateTime(order.created_at);
          return (
            <TableRow key={order.id}>
              <TableCell>
                <Link
                  href={`/order/${order.id}`}
                  className="text-primary hover:underline"
                >
                  {formatId(order.id)}
                </Link>
              </TableCell>
              <TableCell>{dateOnly}</TableCell>
              <TableCell>
                {order.isPaid ? (
                  <Badge className="bg-green-600 text-white hover:bg-green-600">
                    Paid
                  </Badge>
                ) : (
                  <Badge className="bg-amber-500 text-white hover:bg-amber-500">
                    Unpaid
                  </Badge>
                )}
              </TableCell>
              <TableCell>{order.itemCount}</TableCell>
              <TableCell className="text-right">
                ${formatNumberWithDecimal(order.total_price)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
