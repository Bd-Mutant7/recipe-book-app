export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[]; // For backward compatibility
  structuredIngredients?: {  // For new format
    id: string;
    quantity: string;
    unit: string;
    name: string;
  }[];
  instructions: string;
  instructionSteps?: string[]; // For step-by-step display
  image: string;
  isFavorite: boolean;
  
  // New fields we added
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  cuisine?: string;
  tags?: string[];
  dateAdded?: Date;
  ratings?: number;
  totalRatings?: number;
  source?: string;
  notes?: string;
}
