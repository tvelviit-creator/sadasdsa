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
  sellerPhone: string; // Телефон владельца услуги (Admin или Partner)
  partnerName?: string; // Имя партнера (если применимо)
  partnerAvatar?: string; // Аватарка партнера (если применимо)
}

const SERVICES_STORAGE_KEY = "services";

export function getServices(categoryId?: string): Service[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SERVICES_STORAGE_KEY);
    if (!raw || raw.trim() === "") return [];
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      const services = parsed as Service[];
      if (categoryId) {
        return services.filter(s => s.categoryId === categoryId);
      }
      return services;
    } catch {
      return [];
    }
  } catch {
    return [];
  }
}

export function getServiceById(serviceId: string): Service | undefined {
  if (typeof window === "undefined") return undefined;
  const services = getServices();
  return services.find(s => s.id === serviceId);
}

export function saveService(service: Service): void {
  if (typeof window === "undefined") return;
  try {
    const services = getServices();
    // Check if exists to update
    const index = services.findIndex(s => s.id === service.id);
    if (index !== -1) {
      services[index] = service;
    } else {
      services.push(service);
    }
    window.localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(services));
  } catch (e) {
    console.error("Failed to save service", e);
  }
}

export function deleteService(serviceId: string): void {
  if (typeof window === "undefined") return;
  try {
    const services = getServices();
    const filtered = services.filter(s => s.id !== serviceId);
    window.localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error("Failed to delete service", e);
  }
}

