import Dexie from 'dexie';
import { Recipe } from '../types/Recipe';

export class RecipeDatabase extends Dexie {
  recipes: Dexie.Table<Recipe, string>;

  constructor() {
    super('RecipeDatabase');
    this.version(1).stores({
      recipes: 'id, name, isFavorite, dateAdded, cuisine, difficulty, tags',
    });
  }
}

export const db = new RecipeDatabase();

// Helper functions
export async function saveRecipeToDB(recipe: Recipe) {
  await db.recipes.put(recipe);
}

export async function getAllRecipesFromDB(): Promise<Recipe[]> {
  return await db.recipes.toArray();
}

export async function deleteRecipeFromDB(id: string) {
  await db.recipes.delete(id);
}

export async function toggleFavoriteInDB(id: string, isFavorite: boolean) {
  await db.recipes.update(id, { isFavorite });
}
