import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Box,
  Rating,
  Avatar,
  Tooltip,
  Zoom,
  Fade,
  Paper,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  AccessTime,
  People,
  LocalFireDepartment,
  Restaurant,
  Share,
  BookmarkBorder,
  Bookmark,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useState } from "react";

import { Recipe } from "../types/Recipe";

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  onToggleFavorite: (id: string) => void;
}

// Difficulty color mapping
const difficultyColors = {
  Easy: "success",
  Medium: "warning",
  Hard: "error",
} as const;

// Cuisine emoji mapping for fun
const cuisineEmojis: Record<string, string> = {
  Kenyan: "🇰🇪",
  Swahili: "🌊",
  Italian: "🇮🇹",
  Asian: "🥢",
  Mexican: "🌮",
  Indian: "🍛",
  Traditional: "📜",
};

export default function RecipeCard({
  recipe,
  onSelect,
  onToggleFavorite,
}: RecipeCardProps) {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Fallback image if recipe image fails to load
  const fallbackImage = `https://source.unsplash.com/400x300/?${recipe.cuisine || 'food'},${recipe.name.split(' ')[0]}`;

  // Calculate total time
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card
        sx={{
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          cursor: "pointer",
          borderRadius: 4,
          overflow: "hidden",
          position: "relative",
          backgroundColor: theme.palette.background.paper,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: isHovered 
            ? `0 20px 40px ${alpha(theme.palette.primary.main, 0.2)}`
            : "0 8px 20px rgba(0,0,0,0.05)",
          "&:hover": {
            boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.25)}`,
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            zIndex: 2,
          },
        }}
        onClick={() => onSelect(recipe)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container with Overlay */}
        <Box sx={{ position: "relative", overflow: "hidden" }}>
          <motion.div
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.4 }}
          >
            <CardMedia
              component="img"
              height="220"
              image={imageError ? fallbackImage : recipe.image}
              alt={recipe.name}
              onError={() => setImageError(true)}
              sx={{
                objectFit: "cover",
                transition: "transform 0.3s ease",
              }}
            />
          </motion.div>

          {/* Gradient Overlay */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(180deg, transparent 0%, ${alpha(theme.palette.common.black, 0.3)} 100%)`,
              zIndex: 1,
            }}
          />

          {/* Cuisine Badge */}
          <Tooltip title={`${recipe.cuisine || 'International'} Cuisine`} arrow>
            <Chip
              label={`${cuisineEmojis[recipe.cuisine || ''] || '🍽️'} ${recipe.cuisine || 'Various'}`}
              size="small"
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                zIndex: 3,
                backgroundColor: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: "blur(4px)",
                fontWeight: 500,
                borderRadius: 2,
              }}
            />
          </Tooltip>

          {/* Favorite Button with Animation */}
          <Tooltip title={recipe.isFavorite ? "Remove from favorites" : "Add to favorites"} arrow>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(recipe.id);
              }}
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                zIndex: 3,
                backgroundColor: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: "blur(4px)",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.background.paper, 1),
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <motion.div
                key={recipe.isFavorite ? "favorite" : "not-favorite"}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {recipe.isFavorite ? (
                  <Favorite sx={{ color: theme.palette.error.main }} />
                ) : (
                  <FavoriteBorder />
                )}
              </motion.div>
            </IconButton>
          </Tooltip>

          {/* Quick Info Badges */}
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              left: 16,
              right: 16,
              zIndex: 3,
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            {recipe.difficulty && (
              <Chip
                icon={<LocalFireDepartment />}
                label={recipe.difficulty}
                size="small"
                color={difficultyColors[recipe.difficulty as keyof typeof difficultyColors] || "default"}
                sx={{
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                  backdropFilter: "blur(4px)",
                  fontWeight: 500,
                }}
              />
            )}
            
            {totalTime > 0 && (
              <Chip
                icon={<AccessTime />}
                label={`${totalTime} min`}
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                  backdropFilter: "blur(4px)",
                  fontWeight: 500,
                }}
              />
            )}

            {recipe.servings && (
              <Chip
                icon={<People />}
                label={`${recipe.servings} servings`}
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                  backdropFilter: "blur(4px)",
                  fontWeight: 500,
                }}
              />
            )}
          </Box>
        </Box>

        <CardContent sx={{ flex: 1, p: 3 }}>
          {/* Title Row with Rating */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                lineHeight: 1.2,
                color: theme.palette.text.primary,
                "&:hover": {
                  color: theme.palette.primary.main,
                },
                transition: "color 0.2s ease",
              }}
            >
              {recipe.name}
            </Typography>
            
            {recipe.ratings ? (
              <Box display="flex" alignItems="center" gap={0.5}>
                <Rating 
                  value={recipe.ratings} 
                  readOnly 
                  size="small" 
                  precision={0.5}
                  sx={{ color: theme.palette.warning.main }}
                />
                <Typography variant="caption" color="text.secondary">
                  ({recipe.totalRatings})
                </Typography>
              </Box>
            ) : (
              <Chip 
                label="New" 
                size="small" 
                color="secondary"
                sx={{ borderRadius: 2 }}
              />
            )}
          </Box>

          {/* Description with Gradient Text */}
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 2,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.6,
            }}
          >
            {recipe.description}
          </Typography>

          {/* Ingredients Preview */}
          <Box mb={2}>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
              Key ingredients:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={0.8}>
              {recipe.ingredients.slice(0, 4).map((ingredient, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Chip
                    label={ingredient}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderRadius: 1.5,
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                      "&:hover": {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      },
                      transition: "all 0.2s ease",
                    }}
                  />
                </motion.div>
              ))}
              {recipe.ingredients.length > 4 && (
                <Tooltip title={`${recipe.ingredients.slice(4).join(", ")}`} arrow>
                  <Chip
                    label={`+${recipe.ingredients.length - 4} more`}
                    size="small"
                    sx={{
                      borderRadius: 1.5,
                      backgroundColor: alpha(theme.palette.grey[500], 0.1),
                      cursor: "help",
                    }}
                  />
                </Tooltip>
              )}
            </Box>
          </Box>

          {/* Tags Section */}
          {recipe.tags && recipe.tags.length > 0 && (
            <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
              {recipe.tags.slice(0, 3).map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  sx={{
                    backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                    color: theme.palette.secondary.dark,
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    borderRadius: 1,
                  }}
                />
              ))}
            </Box>
          )}

          {/* Footer with Additional Info */}
          <Box 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center"
            sx={{
              mt: "auto",
              pt: 1,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                {recipe.name.charAt(0)}
              </Avatar>
              <Typography variant="caption" color="text.secondary">
                Added {new Date(recipe.dateAdded || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Typography>
            </Box>

            <Box display="flex" gap={1}>
              <Tooltip title="Save to collection" arrow>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSaved(!isSaved);
                  }}
                  sx={{
                    color: isSaved ? theme.palette.primary.main : theme.palette.action.active,
                  }}
                >
                  {isSaved ? <Bookmark fontSize="small" /> : <BookmarkBorder fontSize="small" />}
                </IconButton>
              </Tooltip>

              <Tooltip title="Share recipe" arrow>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Implement share functionality
                    if (navigator.share) {
                      navigator.share({
                        title: recipe.name,
                        text: recipe.description,
                        url: window.location.href,
                      });
                    }
                  }}
                >
                  <Share fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </CardContent>

        {/* Hover Effect Overlay */}
        <Fade in={isHovered}>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        </Fade>

        {/* "View Recipe" Button on Hover */}
        <Zoom in={isHovered}>
          <Paper
            elevation={4}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              px: 2,
              py: 1,
              borderRadius: 3,
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              gap: 1,
              zIndex: 4,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: theme.palette.background.paper,
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(recipe);
            }}
          >
            <Restaurant fontSize="small" color="primary" />
            <Typography variant="button" color="primary" sx={{ fontWeight: 600 }}>
              View Recipe
            </Typography>
          </Paper>
        </Zoom>
      </Card>
    </motion.div>
  );
}
