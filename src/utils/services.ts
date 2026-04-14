export interface Feature {
  id: string;
  text: string;
}

export interface Tariff {
  id: string;
  name: string;
  price: string;
  description: string;
  features: Feature[];
}

export interface Design {
  id: string;
  name: string;
  price: string;
  description: string;
}

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  price: string;
  coverImage?: string;
  tariffs: Tariff[];
  designs: Design[];
  createdAt: string;
  sellerPhone: string;
  partnerName?: string;
  partnerAvatar?: string;
}

export async function getServices(categoryId?: string): Promise<Service[]> {
  try {
    const url = categoryId ? `/api/services?categoryId=${categoryId}` : '/api/services';
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error("Failed to fetch services", e);
    return [];
  }
}

export async function getServiceById(serviceId: string): Promise<Service | undefined> {
  const services = await getServices();
  return services.find(s => s.id === serviceId);
}

export async function saveService(service: Service): Promise<void> {
  try {
    await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service),
    });
  } catch (e) {
    console.error("Failed to save service", e);
  }
}

export async function deleteService(serviceId: string): Promise<void> {
  try {
    await fetch(`/api/services?id=${serviceId}`, {
      method: 'DELETE',
    });
  } catch (e) {
    console.error("Failed to delete service", e);
  }
}
