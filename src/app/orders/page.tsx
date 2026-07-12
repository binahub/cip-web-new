import OrderList from "@/components/orders/OrderList";

export const metadata = {
  title: "Orders",
};

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Orders</h1>
      <OrderList />
    </div>
  );
}
