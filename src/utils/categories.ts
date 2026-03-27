export interface Category {
  id: string;
  name: string;
  iconImage: string; // base64 или URL (маленькая иконка)
  coverImage?: string; // base64 или URL (обложка для карточки категории)
  createdAt: string;
}

const STORAGE_KEY = "categories";

export function getCategories(): Category[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw || raw.trim() === "") return [];
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed as Category[];
    } catch {
      return [];
    }
  } catch {
    return [];
  }
}

export function saveCategory(category: Category): void {
  if (typeof window === "undefined") return;
  try {
    const list = getCategories();
    list.push({
      id: category.id,
      name: category.name,
      iconImage: category.iconImage,
      coverImage: category.coverImage,
      createdAt: category.createdAt,
    });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Failed to save categories to localStorage", e);
  }
}

export function updateCategory(categoryId: string, updates: Partial<Category>): void {
  if (typeof window === "undefined") return;
  try {
    const list = getCategories();
    const index = list.findIndex((cat) => cat.id === categoryId);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  } catch (e) {
    console.error("Failed to update category in localStorage", e);
  }
}

export function deleteCategory(categoryId: string): void {
  if (typeof window === "undefined") return;
  try {
    const list = getCategories();
    const filtered = list.filter((cat) => cat.id !== categoryId);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error("Failed to delete category from localStorage", e);
  }
}

export function reorderCategories(categoryIds: string[]): void {
  if (typeof window === "undefined") return;
  try {
    const list = getCategories();
    const reordered = categoryIds
      .map((id) => list.find((cat) => cat.id === id))
      .filter((cat): cat is Category => cat !== undefined);
    // Добавляем категории, которых нет в новом порядке (на случай ошибок)
    const existingIds = new Set(categoryIds);
    list.forEach((cat) => {
      if (!existingIds.has(cat.id)) {
        reordered.push(cat);
      }
    });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reordered));
  } catch (e) {
    console.error("Failed to reorder categories in localStorage", e);
  }
}

export function moveCategoryUp(categoryId: string): void {
  if (typeof window === "undefined") return;
  try {
    const list = getCategories();
    const index = list.findIndex((cat) => cat.id === categoryId);
    if (index > 0) {
      [list[index - 1], list[index]] = [list[index], list[index - 1]];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  } catch (e) {
    console.error("Failed to move category up in localStorage", e);
  }
}

export function moveCategoryDown(categoryId: string): void {
  if (typeof window === "undefined") return;
  try {
    const list = getCategories();
    const index = list.findIndex((cat) => cat.id === categoryId);
    if (index >= 0 && index < list.length - 1) {
      [list[index], list[index + 1]] = [list[index + 1], list[index]];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  } catch (e) {
    console.error("Failed to move category down in localStorage", e);
  }
}


