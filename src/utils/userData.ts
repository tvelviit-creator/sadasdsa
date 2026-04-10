// Утилита для работы с данными пользователя

export interface UserData {
  phone: string;
  name?: string;
  email?: string;
  avatar?: string; // base64 изображения
  isPartner?: boolean; // true если пользователь зарегистрировался как партнер (seller)
  isBlocked?: boolean; // заблокирован ли пользователь
  blockedUntil?: string; // дата разблокировки или "permanent"
}

// Сохранение текущего номера телефона пользователя
// Сохраняем и в localStorage (постоянно), и в sessionStorage (для текущей сессии)
export function setCurrentUserPhone(phone: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("currentUserPhone", phone);
    sessionStorage.setItem("currentUserPhone", phone);
    console.log("✅ Пользователь сохранен:", phone);
  } catch (error) {
    console.error("Ошибка при сохранении текущего номера пользователя:", error);
  }
}

// Получение текущего номера телефона пользователя
// Сначала проверяем sessionStorage (текущая сессия), потом localStorage (постоянное хранение)
export function getCurrentUserPhone(): string | null {
  if (typeof window === "undefined") return null;
  try {
    // Сначала проверяем sessionStorage (активная сессия)
    const sessionPhone = sessionStorage.getItem("currentUserPhone");
    if (sessionPhone) {
      return sessionPhone;
    }
    // Если нет в sessionStorage, проверяем localStorage
    const localPhone = localStorage.getItem("currentUserPhone");
    if (localPhone) {
      // Восстанавливаем сессию из localStorage
      sessionStorage.setItem("currentUserPhone", localPhone);
      return localPhone;
    }
    return null;
  } catch (error) {
    console.error("Ошибка при получении текущего номера пользователя:", error);
    return null;
  }
}

const API_URL = '/api/users';

// Сохранение данных пользователя в общую БД
export async function saveUserData(phone: string, data: Partial<UserData>): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const existingData = await getUserData(phone) || { phone };
    const updatedData: UserData = {
      ...existingData,
      ...data,
      phone,
    };
    
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });
  } catch (error) {
    console.error("Ошибка при сохранении данных пользователя:", error);
  }
}

// Получение данных пользователя по номеру телефона из общей БД
export async function getUserData(phone: string): Promise<UserData | null> {
  if (typeof window === "undefined") return null;
  try {
    const res = await fetch(`${API_URL}?phone=${encodeURIComponent(phone)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Ошибка при получении данных пользователя:", error);
    return null;
  }
}

// Получение текущего пользователя (из sessionStorage) - остается локальным (авторизация)
export function getCurrentUser(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem("currentUserPhone");
  } catch (error) {
    console.error("Ошибка при получении текущего пользователя:", error);
    return null;
  }
}

// Установка текущего пользователя
export function setCurrentUser(phone: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem("currentUserPhone", phone);
  } catch (error) {
    console.error("Ошибка при установке текущего пользователя:", error);
  }
}

// Сохранение номера телефона при регистрации
export async function registerPhone(phone: string): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    // Устанавливаем текущего пользователя локально
    setCurrentUserPhone(phone);
    setCurrentUser(phone);
    
    // Сохраняем в общую базу на сервере
    await saveUserData(phone, { phone });
    
    console.log("✅ Пользователь зарегистрирован в общей БД:", phone);
  } catch (error) {
    console.error("Ошибка при регистрации номера:", error);
  }
}

// Список зарегистрированных номеров (из общей БД)
export async function getRegisteredPhones(): Promise<string[]> {
  const users = await getAllUsers();
  return users.map(u => u.phone);
}

// Выход из профиля (очистка текущей сессии)
export function logout(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem("currentUserPhone");
    localStorage.removeItem("currentUserPhone");
    console.log("✅ Выход из профиля выполнен");
  } catch (error) {
    console.error("Ошибка при выходе из профиля:", error);
  }
}

// Получение всех пользователей из общей БД
export async function getAllUsers(): Promise<UserData[]> {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Ошибка при получении всех пользователей:", error);
    return [];
  }
}

// Удаление пользователя из общей БД
export async function deleteUser(phone: string): Promise<void> {
  try {
    await fetch(`${API_URL}?phone=${encodeURIComponent(phone)}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error("Ошибка при удалении пользователя:", error);
  }
}

// Управление активной ролью (client / seller) - остается локальным
export function setActiveRole(role: "client" | "seller"): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("activeRole", role);
    console.log("✅ Активная роль установлена:", role);
  } catch (error) {
    console.error("Ошибка при установке активной роли:", error);
  }
}

export function getActiveRole(): "client" | "seller" {
  if (typeof window === "undefined") return "client";
  try {
    const role = localStorage.getItem("activeRole");
    return (role === "seller" ? "seller" : "client");
  } catch (error) {
    console.error("Ошибка при получении активной роли:", error);
    return "client";
  }
}

export function formatPhone(phone: string): string {
  const cleaned = ('' + phone).replace(/\D/g, '');
  if (cleaned.length === 11) {
    const val = cleaned.startsWith('7') ? cleaned : '7' + cleaned.slice(1);
    return `+7 (${val.slice(1, 4)}) ${val.slice(4, 7)} ${val.slice(7, 9)}-${val.slice(9, 11)}`;
  }
  if (cleaned.length === 10) {
    return `+7 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)}-${cleaned.slice(8, 10)}`;
  }
  return phone.startsWith('+') ? phone : `+${phone}`;
}
