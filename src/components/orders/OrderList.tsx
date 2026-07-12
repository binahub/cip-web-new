"use client";

import { useOrders } from "@/services/orders/orders.queries";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";

export default function OrderList() {
  const { data: orders, isPending, error } = useOrders();

  if (isPending) return <Spinner className="py-12" />;
  if (error) return <p className="py-12 text-center text-danger">Failed to load orders.</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {orders?.map((order) => (
        <Card key={order.id}>
          <h3 className="text-lg font-semibold">{order.product}</h3>
          <p className="text-sm text-text-muted">${order.amount.toFixed(2)}</p>
          <span className="mt-2 inline-block rounded-full bg-surface-dim px-2 py-0.5 text-xs font-medium text-text">
            {order.status}
          </span>
        </Card>
      ))}
    </div>
  );
}
