export interface Category {
  id: string;
  name: string;
  iconImage: string; // base64 или URL (маленькая иконка)
  coverImage?: string; // base64 или URL (обложка для карточки категории)
  createdAt: string;
  order: number;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch('/api/categories', { cache: 'no-store' });
    if (!res.ok) return [];
<<<<<<< HEAD
    const data: Category[] = await res.json();
    return data.sort((a, b) => (a.order || 0) - (b.order || 0));
=======
    return await res.json();
>>>>>>> f0ae42b902bf138f49fc2fb21aade7312fa498cf
  } catch (e) {
    console.error("Failed to fetch categories", e);
    return [];
  }
}

export async function saveCategory(category: Category): Promise<void> {
  try {
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
  } catch (e) {
    console.error("Failed to save category", e);
  }
}

export async function updateCategory(categoryId: string, updates: Partial<Category>): Promise<void> {
  try {
    await fetch('/api/categories', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: categoryId, ...updates }),
    });
  } catch (e) {
    console.error("Failed to update category", e);
  }
}

export async function deleteCategory(categoryId: string): Promise<void> {
  try {
    await fetch(`/api/categories?id=${categoryId}`, {
      method: 'DELETE',
    });
  } catch (e) {
    console.error("Failed to delete category", e);
  }
}

<<<<<<< HEAD
export async function reorderCategories(categoryIds: string[]): Promise<void> {
  try {
    await fetch('/api/categories', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: categoryIds }),
    });
  } catch (e) {
    console.error("Failed to reorder categories", e);
  }
}

export async function moveCategoryUp(categoryId: string): Promise<void> {
  const cats = await getCategories();
  const index = cats.findIndex(c => c.id === categoryId);
  if (index > 0) {
    const newOrder = [...cats];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    await reorderCategories(newOrder.map(c => c.id));
  }
}

export async function moveCategoryDown(categoryId: string): Promise<void> {
  const cats = await getCategories();
  const index = cats.findIndex(c => c.id === categoryId);
  if (index !== -1 && index < cats.length - 1) {
    const newOrder = [...cats];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    await reorderCategories(newOrder.map(c => c.id));
  }
=======
// These might be more complex to implement via API if they rely on local order,
// but for now let's just make placeholders or simple implementations.
export async function reorderCategories(categoryIds: string[]): Promise<void> {
  // Implementation omitted for brevity, could be a bulk update API
}

export async function moveCategoryUp(categoryId: string): Promise<void> {
  // Implementation omitted
}

export async function moveCategoryDown(categoryId: string): Promise<void> {
  // Implementation omitted
>>>>>>> f0ae42b902bf138f49fc2fb21aade7312fa498cf
}
