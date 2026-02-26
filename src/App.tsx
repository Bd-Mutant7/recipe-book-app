import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  Fab,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  CssBaseline,
  ThemeProvider,
  Badge,
  IconButton,
  Paper,
  InputAdornment,
  Chip,
  Zoom,
  Fade,
  useMediaQuery,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Drawer,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "use-debounce";

// Icons
import {
  Add,
  Favorite,
  FavoriteBorder,
  Search,
  FilterList,
  RestaurantMenu,
  Sort,
  CloudUpload,
  Mic,
  Clear,
  MenuBook,
  EventNote,
  ShoppingCart,
  Close as CloseIcon,
} from "@mui/icons-material";

import { Recipe } from "./types/Recipe";
import RecipeCard from "./components/RecipeCard";
import AddRecipeModal from "./components/AddRecipeModal";
import RecipeDetails from "./components/RecipeDetails";
import AdvancedSearchDrawer from "./components/AdvancedSearchDrawer";
import QuickActions from "./components/QuickActions";
import { theme } from "./theme"; // We'll create this separately

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

// Mock data - In real app, this would come from a database/API
const initialRecipes: Recipe[] = [
  {
    id: "1",
    name: "Githeri",
    description:
      "A swahili dish made from maize and beans cooked together in water.",
    ingredients: [
      "Maize",
      "Beans",
      "Water",
      "Salt",
      "Onions",
      "Tomatoes",
      "Cooking oil",
    ],
    instructions:
      "Boil maize and beans in water until soft. Fry onions and tomatoes in oil, add to the boiled maize and beans, and cook for 10 minutes.",
    image: "/githeri.jpg",
    isFavorite: false,
    prepTime: 45,
    cookTime: 30,
    servings: 4,
    difficulty: "Easy",
    cuisine: "Kenyan",
    tags: ["Main Dish", "Traditional", "Vegetarian"],
    dateAdded: new Date("2024-01-15"),
    ratings: 4.5,
    totalRatings: 12,
  },
  {
    id: "2",
    name: "Pilau",
    description: "A flavorful rice dish cooked with spices and meat.",
    ingredients: [
      "Rice",
      "Beef",
      "Pilau masala",
      "Onions",
      "Tomatoes",
      "Garlic",
      "Ginger",
    ],
    instructions:
      "Fry onions, garlic, and ginger. Add beef and cook until browned. Add tomatoes and pilau masala, then cook for 10 minutes. Add rice and water, then cook until done.",
    image: "/pilau.jpg",
    isFavorite: true,
    prepTime: 20,
    cookTime: 40,
    servings: 6,
    difficulty: "Medium",
    cuisine: "Swahili",
    tags: ["Rice", "Meat", "Festive"],
    dateAdded: new Date("2024-01-10"),
    ratings: 5,
    totalRatings: 8,
  },
  {
    id: "3",
    name: "Ugali Samaki",
    description: "A Kenyan dish of ugali served with fish in tomato sauce.",
    ingredients: [
      "Maize flour",
      "Water",
      "Fish",
      "Tomatoes",
      "Onions",
      "Cooking oil",
    ],
    instructions:
      "Boil water, add maize flour, and cook until thick. Fry fish, onions, and tomatoes in oil, then add water and cook for 10 minutes.",
    image: "/ugali.webp",
    isFavorite: true,
    prepTime: 15,
    cookTime: 25,
    servings: 3,
    difficulty: "Easy",
    cuisine: "Kenyan",
    tags: ["Fish", "Staple", "Quick"],
    dateAdded: new Date("2024-01-05"),
    ratings: 4.8,
    totalRatings: 15,
  },
];

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [filter, setFilter] = useState("all");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "date" | "rating">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Get all unique tags from recipes
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    recipes.forEach(recipe => recipe.tags?.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, [recipes]);

  // Voice search
  const startVoiceSearch = useCallback(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        addToRecentSearches(transcript);
      };
      
      recognition.start();
    } else {
      alert("Voice search is not supported in your browser");
    }
  }, []);

  const addToRecentSearches = (query: string) => {
    if (!query.trim()) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s !== query);
      return [query, ...filtered].slice(0, 5);
    });
  };

  const handleAddRecipe = useCallback((newRecipe: Omit<Recipe, "id" | "isFavorite">) => {
    const recipeWithMeta: Recipe = {
      ...newRecipe,
      id: Date.now().toString(),
      isFavorite: false,
      dateAdded: new Date(),
      ratings: 0,
      totalRatings: 0,
      tags: newRecipe.tags || [],
      prepTime: newRecipe.prepTime || 0,
      cookTime: newRecipe.cookTime || 0,
      servings: newRecipe.servings || 1,
      difficulty: newRecipe.difficulty || "Easy",
    };
    
    setRecipes(prev => [recipeWithMeta, ...prev]);
  }, []);

  const handleToggleFavorite = useCallback((id: string) => {
    setRecipes(prev =>
      prev.map((recipe) =>
        recipe.id === id
          ? { ...recipe, isFavorite: !recipe.isFavorite }
          : recipe
      )
    );
  }, []);

  const handleRemoveRecipe = useCallback((recipe: Recipe) => {
    setRecipes(prev => prev.filter((r) => r.id !== recipe.id));
  }, []);

  const handleUpdateRecipe = useCallback((updatedRecipe: Recipe) => {
    setRecipes(prev =>
      prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r))
    );
  }, []);

  // Filter and sort recipes
  const filteredAndSortedRecipes = useMemo(() => {
    let filtered = recipes.filter((recipe) => {
      // Search filter
      const matchesSearch = debouncedSearchQuery === "" ||
        recipe.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        recipe.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        ) ||
        recipe.description?.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

      // Favorite filter
      const matchesFavorite = filter === "all" || (filter === "favorites" && recipe.isFavorite);

      // Tag filter
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.every(tag => recipe.tags?.includes(tag));

      return matchesSearch && matchesFavorite && matchesTags;
    });

    // Sort recipes
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "date":
          comparison = (b.dateAdded?.getTime() || 0) - (a.dateAdded?.getTime() || 0);
          break;
        case "rating":
          comparison = (b.ratings || 0) - (a.ratings || 0);
          break;
      }
      return sortOrder === "asc" ? -comparison : comparison;
    });

    return filtered;
  }, [recipes, debouncedSearchQuery, filter, selectedTags, sortBy, sortOrder]);

  // Save recent search when search is performed
  useEffect(() => {
    if (debouncedSearchQuery) {
      addToRecentSearches(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        bgcolor: "background.default", 
        minHeight: "100vh",
        position: "relative",
      }}>
        {/* Background Pattern */}
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            backgroundImage: `radial-gradient(circle at 1px 1px, ${theme.palette.primary.main} 1px, transparent 0)`,
            backgroundSize: "40px 40px",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, py: 4 }}>
          {/* Header with Animation */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 4,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                color: "white",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Decorative Elements */}
              <Box
                sx={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: -40,
                  left: -40,
                  width: 300,
                  height: 300,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                }}
              />

              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Typography 
                  variant="h3" 
                  component="h1" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 800,
                    textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <RestaurantMenu sx={{ fontSize: 48 }} />
                  Recipe Book
                  <Chip
                    label={`${filteredAndSortedRecipes.length} recipes`}
                    sx={{
                      ml: 2,
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600 }}>
                  Discover, create, and share your culinary masterpieces
                </Typography>
              </Box>
            </Paper>
          </motion.div>

          {/* Search and Filter Bar */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Paper
              elevation={isSearchFocused ? 8 : 1}
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 4,
                transition: "all 0.3s ease",
                border: isSearchFocused ? `2px solid ${theme.palette.primary.main}` : "none",
              }}
            >
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search recipes by name, ingredients, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  sx={{ flex: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color={isSearchFocused ? "primary" : "action"} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        {searchQuery && (
                          <IconButton size="small" onClick={() => setSearchQuery("")}>
                            <Clear />
                          </IconButton>
                        )}
                        <IconButton 
                          size="small" 
                          onClick={startVoiceSearch}
                          color={isListening ? "secondary" : "default"}
                          sx={{ ml: 1 }}
                        >
                          <Mic />
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 3,
                      '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.primary.main,
                        }
                      }
                    }
                  }}
                />

                {!isMobile && (
                  <>
                    <ToggleButtonGroup
                      value={filter}
                      exclusive
                      onChange={(_, value) => value && setFilter(value)}
                      aria-label="recipe filter"
                      size={isTablet ? "small" : "medium"}
                    >
                      <ToggleButton value="all" sx={{ borderRadius: 3 }}>
                        All
                      </ToggleButton>
                      <ToggleButton value="favorites" sx={{ borderRadius: 3 }}>
                        {filter === "favorites" ? (
                          <Favorite sx={{ mr: 1 }} color="error" />
                        ) : (
                          <FavoriteBorder sx={{ mr: 1 }} />
                        )}
                        Favorites
                      </ToggleButton>
                    </ToggleButtonGroup>

                    <Button
                      variant="outlined"
                      startIcon={<FilterList />}
                      onClick={() => setIsAdvancedSearchOpen(true)}
                      sx={{ borderRadius: 3 }}
                    >
                      Filters
                      {selectedTags.length > 0 && (
                        <Badge
                          badgeContent={selectedTags.length}
                          color="primary"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<Sort />}
                      onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                      sx={{ borderRadius: 3 }}
                    >
                      Sort {sortOrder === "asc" ? "↑" : "↓"}
                    </Button>
                  </>
                )}
              </Box>

              {/* Recent Searches */}
              {recentSearches.length > 0 && isSearchFocused && (
                <Fade in={isSearchFocused}>
                  <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Typography variant="caption" color="text.secondary" sx={{ width: "100%" }}>
                      Recent searches:
                    </Typography>
                    {recentSearches.map((search, index) => (
                      <Chip
                        key={index}
                        label={search}
                        size="small"
                        onClick={() => setSearchQuery(search)}
                        onDelete={() => {
                          setRecentSearches(prev => prev.filter((_, i) => i !== index));
                        }}
                        sx={{ borderRadius: 2 }}
                      />
                    ))}
                  </Box>
                </Fade>
              )}
            </Paper>
          </motion.div>

          {/* Recipe Grid */}
          {filteredAndSortedRecipes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Paper
                sx={{
                  p: 6,
                  textAlign: "center",
                  borderRadius: 4,
                  background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
                }}
              >
                <RestaurantMenu sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
                <Typography variant="h5" gutterBottom color="text.secondary">
                  No recipes found
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Try adjusting your search or add a new recipe
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setIsAddModalOpen(true)}
                  sx={{ borderRadius: 3 }}
                >
                  Add Your First Recipe
                </Button>
              </Paper>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Grid container spacing={3}>
                <AnimatePresence>
                  {filteredAndSortedRecipes.map((recipe) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={recipe.id}>
                      <motion.div
                        variants={itemVariants}
                        layout
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <RecipeCard
                          recipe={recipe}
                          onSelect={setSelectedRecipe}
                          onToggleFavorite={handleToggleFavorite}
                        />
                      </motion.div>
                    </Grid>
                  ))}
                </AnimatePresence>
              </Grid>
            </motion.div>
          )}

          {/* Quick Actions Speed Dial */}
          <SpeedDial
            ariaLabel="Quick actions"
            sx={{ position: "fixed", bottom: 24, right: 24 }}
            icon={<SpeedDialIcon />}
            FabProps={{
              sx: {
                bgcolor: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                }
              }
            }}
          >
            <SpeedDialAction
              icon={<Add />}
              tooltipTitle="Add Recipe"
              tooltipOpen
              onClick={() => setIsAddModalOpen(true)}
            />
            <SpeedDialAction
              icon={<EventNote />}
              tooltipTitle="Meal Planner"
              tooltipOpen
              onClick={() => {/* Open meal planner */}}
            />
            <SpeedDialAction
              icon={<ShoppingCart />}
              tooltipTitle="Shopping List"
              tooltipOpen
              onClick={() => {/* Open shopping list */}}
            />
            <SpeedDialAction
              icon={<CloudUpload />}
              tooltipTitle="Import Recipe"
              tooltipOpen
              onClick={() => {/* Open import dialog */}}
            />
          </SpeedDial>
        </Container>

        {/* Modals and Drawers */}
        <AddRecipeModal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddRecipe}
        />

        <RecipeDetails
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onRemove={handleRemoveRecipe}
          onUpdate={handleUpdateRecipe}
        />

        <AdvancedSearchDrawer
          open={isAdvancedSearchOpen}
          onClose={() => setIsAdvancedSearchOpen(false)}
          tags={allTags}
          selectedTags={selectedTags}
          onTagSelect={setSelectedTags}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
        />
      </Box>
    </ThemeProvider>
  );
}
