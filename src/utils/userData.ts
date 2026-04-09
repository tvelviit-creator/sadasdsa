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

// Сохранение данных пользователя в localStorage
export function saveUserData(phone: string, data: Partial<UserData>): void {
  if (typeof window === "undefined") return;
  try {
    const existingData = getUserData(phone) || {};
    const updatedData: UserData = {
      phone,
      ...existingData,
      ...data,
    };
    localStorage.setItem(`user_${phone}`, JSON.stringify(updatedData));
  } catch (error) {
    console.error("Ошибка при сохранении данных пользователя:", error);
  }
}

// Получение данных пользователя по номеру телефона
export function getUserData(phone: string): UserData | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(`user_${phone}`);
    if (data) {
      return JSON.parse(data) as UserData;
    }
    return null;
  } catch (error) {
    console.error("Ошибка при получении данных пользователя:", error);
    return null;
  }
}

// Получение текущего пользователя (из sessionStorage)
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
export function registerPhone(phone: string): void {
  if (typeof window === "undefined") return;
  try {
    // Сохраняем номер в список зарегистрированных
    const registeredPhones = getRegisteredPhones();
    if (!registeredPhones.includes(phone)) {
      registeredPhones.push(phone);
      localStorage.setItem("registeredPhones", JSON.stringify(registeredPhones));
    }

    // Создаем запись пользователя, если её еще нет
    if (!getUserData(phone)) {
      saveUserData(phone, { phone });
    }

    // Устанавливаем текущего пользователя (и в localStorage, и в sessionStorage)
    setCurrentUserPhone(phone);
    setCurrentUser(phone);
    console.log("✅ Пользователь зарегистрирован и установлен как текущий:", phone);
  } catch (error) {
    console.error("Ошибка при регистрации номера:", error);
  }
}

// Получение списка зарегистрированных номеров
export function getRegisteredPhones(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const phones = localStorage.getItem("registeredPhones");
    if (phones) {
      return JSON.parse(phones) as string[];
    }
    return [];
  } catch (error) {
    console.error("Ошибка при получении списка номеров:", error);
    return [];
  }
}

// Выход из профиля (очистка текущей сессии)
export function logout(): void {
  if (typeof window === "undefined") return;
  try {
    // Очищаем текущую сессию
    sessionStorage.removeItem("currentUserPhone");
    // Очищаем постоянное хранение текущего пользователя
    localStorage.removeItem("currentUserPhone");
    console.log("✅ Выход из профиля выполнен");
  } catch (error) {
    console.error("Ошибка при выходе из профиля:", error);
  }
}

// Получение всех пользователей из localStorage
export function getAllUsers(): UserData[] {
  if (typeof window === "undefined") return [];
  try {
    const users: UserData[] = [];
    const registeredPhones = getRegisteredPhones();

    for (const phone of registeredPhones) {
      const userData = getUserData(phone);
      if (userData) {
        users.push(userData);
      }
    }

    return users;
  } catch (error) {
    console.error("Ошибка при получении всех пользователей:", error);
    return [];
  }
}

// Удаление пользователя
export function deleteUser(phone: string): void {
  if (typeof window === "undefined") return;
  try {
    // Удаляем данные пользователя
    localStorage.removeItem(`user_${phone}`);

    // Удаляем телефон из списка зарегистрированных
    const registeredPhones = getRegisteredPhones();
    const updatedPhones = registeredPhones.filter((p) => p !== phone);
    localStorage.setItem("registeredPhones", JSON.stringify(updatedPhones));
  } catch (error) {
    console.error("Ошибка при удалении пользователя:", error);
  }
}

// Управление активной ролью (client / seller)
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
