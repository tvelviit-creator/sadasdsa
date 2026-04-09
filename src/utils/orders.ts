export interface Order {
  id: string;
  title: string;
  orderNumber: number;
  tariff: string;
  tariffPrice?: number;
  design?: string;
  designPrice?: number;
  price: number;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
  updatedAt?: string;
  clientPhone: string;
  clientEmail?: string;
  sellerPhone: string;
  description?: string;
  stage?: "processing" | "design" | "development" | "test" | "ready";
  features?: string[];
  partnerName?: string;
  clientName?: string;
  isDisputed?: boolean;
  disputeResolved?: boolean;
  serviceId?: string;
}

const API_URL = '/api/orders';

export async function saveOrder(order: Order): Promise<void> {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!res.ok) {
      console.error("Server returned error", await res.text());
    }
  } catch (error) {
    console.error("Ошибка при сохранении заказа:", error);
  }
}

export async function getAllOrders(): Promise<Order[]> {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) return [];

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    }
    return [];
  } catch (error) {
    console.error("Ошибка при получении заказов:", error);
    return [];
  }
}

export async function getClientOrders(clientPhone: string): Promise<Order[]> {
  try {
    const res = await fetch(`${API_URL}?clientPhone=${encodeURIComponent(clientPhone)}`);
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Ошибка при получении заказов клиента:", error);
    return [];
  }
}

export async function getSellerOrders(sellerPhone: string): Promise<Order[]> {
  try {
    const res = await fetch(`${API_URL}?sellerPhone=${encodeURIComponent(sellerPhone)}`);
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Ошибка при получении заказов продавца:", error);
    return [];
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const res = await fetch(`${API_URL}?id=${encodeURIComponent(orderId)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Ошибка при получении заказа:", error);
    return null;
  }
}

export async function deleteOrder(orderId: string): Promise<void> {
  try {
    await fetch(`${API_URL}?id=${encodeURIComponent(orderId)}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error("Ошибка при удалении заказа:", error);
  }
}
