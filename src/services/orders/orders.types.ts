export interface Order {
  id: number;
  userId: number;
  product: string;
  amount: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  createdAt: string;
}

export interface CreateOrderPayload {
  userId: number;
  product: string;
  amount: number;
}
