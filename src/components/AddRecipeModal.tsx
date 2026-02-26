import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Box,
  Typography,
  Chip,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Rating,
  Alert,
  Snackbar,
  Avatar,
  Divider,
  Tooltip,
  useTheme,
  alpha,
  InputAdornment,
  Collapse,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import {
  AddPhotoAlternate,
  Delete,
  Add,
  DragIndicator,
  CloudUpload,
  Link as LinkIcon,
  Restaurant,
  AccessTime,
  People,
  LocalFireDepartment,
  CheckCircle,
  Close,
  Image as ImageIcon,
  PhotoCamera,
  Autorenew,
  Save,
  Preview,
  AddCircle,
  RemoveCircle,
  Timer,
  Scale,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Recipe } from "../types/Recipe";

interface AddRecipeModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (recipe: Omit<Recipe, "id" | "isFavorite">) => void;
}

// Step type for stepper
const steps = ['Basic Info', 'Ingredients', 'Instructions', 'Media & Tags'];

// Difficulty levels
const difficultyLevels = ['Easy', 'Medium', 'Hard'];

// Cuisine options with emojis
const cuisineOptions = [
  { value: 'Kenyan', emoji: '🇰🇪' },
  { value: 'Swahili', emoji: '🌊' },
  { value: 'Italian', emoji: '🇮🇹' },
  { value: 'Asian', emoji: '🥢' },
  { value: 'Mexican', emoji: '🌮' },
  { value: 'Indian', emoji: '🍛' },
  { value: 'Mediterranean', emoji: '🫒' },
  { value: 'American', emoji: '🍔' },
  { value: 'French', emoji: '🥖' },
  { value: 'Other', emoji: '🍽️' },
];

// Common tags suggestions
const commonTags = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Quick', 'Healthy',
  'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Appetizer', 'Soup',
  'Salad', 'Main Course', 'Side Dish', 'Snack', 'Baking', 'Grilling',
  'One-Pot', 'Meal Prep', 'Budget-Friendly', 'Kid-Friendly', 'Spicy',
  'Traditional', 'Fusion', 'Holiday', 'Party', 'Comfort Food'
];

// Ingredient interface for better management
interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  unit: string;
}

export default function AddRecipeModal({
  open,
  onClose,
  onAdd,
}: AddRecipeModalProps) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Form state with all new fields
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    ingredients: [] as Ingredient[],
    instructions: [""],
    image: "",
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: "Easy" as "Easy" | "Medium" | "Hard",
    cuisine: "",
    tags: [] as string[],
    source: "",
    notes: "",
  });

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageError, setImageError] = useState(false);

  // Tag input state
  const [tagInput, setTagInput] = useState("");

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Drag and drop for image
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormData({ ...formData, image: previewUrl });
      setImageError(false);
    }
  }, [formData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 5242880, // 5MB
  });

  // Ingredient management
  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [
        ...formData.ingredients,
        {
          id: Date.now().toString(),
          name: "",
          quantity: "",
          unit: "",
        },
      ],
    });
  };

  const removeIngredient = (id: string) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter(ing => ing.id !== id),
    });
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: string) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.map(ing =>
        ing.id === id ? { ...ing, [field]: value } : ing
      ),
    });
  };

  // Instructions management
  const addInstructionStep = () => {
    setFormData({
      ...formData,
      instructions: [...formData.instructions, ""],
    });
  };

  const removeInstructionStep = (index: number) => {
    if (formData.instructions.length > 1) {
      const newInstructions = [...formData.instructions];
      newInstructions.splice(index, 1);
      setFormData({ ...formData, instructions: newInstructions });
    }
  };

  const updateInstructionStep = (index: number, value: string) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData({ ...formData, instructions: newInstructions });
  };

  // Tag management
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag) && formData.tags.length < 10) {
      setFormData({
        ...formData,
        tags: [...formData.tags, trimmedTag],
      });
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Recipe name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.ingredients.length === 0) {
      newErrors.ingredients = "Add at least one ingredient";
    } else {
      const hasEmptyIngredient = formData.ingredients.some(ing => !ing.name.trim());
      if (hasEmptyIngredient) {
        newErrors.ingredients = "All ingredients must have a name";
      }
    }

    if (formData.instructions.length === 0 || formData.instructions[0] === "") {
      newErrors.instructions = "Add at least one instruction step";
    }

    if (!formData.image && !imagePreview) {
      newErrors.image = "Please add an image";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle step navigation
  const handleNext = () => {
    if (activeStep === 0) {
      if (!formData.name || !formData.description) {
        setSnackbar({
          open: true,
          message: "Please fill in all required fields",
          severity: 'error',
        });
        return;
      }
    } else if (activeStep === 1) {
      if (formData.ingredients.length === 0) {
        setSnackbar({
          open: true,
          message: "Add at least one ingredient",
          severity: 'error',
        });
        return;
      }
    } else if (activeStep === 2) {
      if (formData.instructions[0] === "") {
        setSnackbar({
          open: true,
          message: "Add at least one instruction step",
          severity: 'error',
        });
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: "Please fix the errors before submitting",
        severity: 'error',
      });
      return;
    }

    // Combine ingredients into strings for the recipe format
    const ingredientStrings = formData.ingredients.map(
      ing => `${ing.quantity} ${ing.unit} ${ing.name}`.trim()
    );

    // Combine instructions with line breaks
    const instructionsText = formData.instructions.join('\n');

    onAdd({
      name: formData.name,
      description: formData.description,
      ingredients: ingredientStrings,
      instructions: instructionsText,
      image: formData.image || imagePreview || "https://images.unsplash.com/photo-1495521821757-a1efb6729352",
      prepTime: formData.prepTime,
      cookTime: formData.cookTime,
      servings: formData.servings,
      difficulty: formData.difficulty,
      cuisine: formData.cuisine,
      tags: formData.tags,
      dateAdded: new Date(),
    });

    // Reset form
    setFormData({
      name: "",
      description: "",
      ingredients: [],
      instructions: [""],
      image: "",
      prepTime: 15,
      cookTime: 30,
      servings: 4,
      difficulty: "Easy",
      cuisine: "",
      tags: [],
      source: "",
      notes: "",
    });
    setImagePreview("");
    setImageFile(null);
    setActiveStep(0);
    
    setSnackbar({
      open: true,
      message: "Recipe added successfully!",
      severity: 'success',
    });

    setTimeout(() => {
      onClose();
    }, 1500);
  };

  // Render step content
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            {/* Recipe Name */}
            <TextField
              label="Recipe Name"
              fullWidth
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={!!errors.name}
              helperText={errors.name}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Restaurant color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            {/* Description */}
            <TextField
              label="Description"
              fullWidth
              required
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              error={!!errors.description}
              helperText={errors.description || "A brief description of your recipe"}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            {/* Basic Info Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
              <TextField
                label="Prep Time (minutes)"
                type="number"
                value={formData.prepTime}
                onChange={(e) =>
                  setFormData({ ...formData, prepTime: parseInt(e.target.value) || 0 })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Timer color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Cook Time (minutes)"
                type="number"
                value={formData.cookTime}
                onChange={(e) =>
                  setFormData({ ...formData, cookTime: parseInt(e.target.value) || 0 })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Timer color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Servings"
                type="number"
                value={formData.servings}
                onChange={(e) =>
                  setFormData({ ...formData, servings: parseInt(e.target.value) || 1 })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <People color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={formData.difficulty}
                  label="Difficulty"
                  onChange={(e) =>
                    setFormData({ ...formData, difficulty: e.target.value as "Easy" | "Medium" | "Hard" })
                  }
                >
                  {difficultyLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <LocalFireDepartment fontSize="small" color={
                          level === 'Easy' ? 'success' : level === 'Medium' ? 'warning' : 'error'
                        } />
                        {level}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Cuisine Selection */}
            <FormControl fullWidth>
              <InputLabel>Cuisine Type</InputLabel>
              <Select
                value={formData.cuisine}
                label="Cuisine Type"
                onChange={(e) =>
                  setFormData({ ...formData, cuisine: e.target.value })
                }
              >
                {cuisineOptions.map((cuisine) => (
                  <MenuItem key={cuisine.value} value={cuisine.value}>
                    {cuisine.emoji} {cuisine.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Ingredients
              </Typography>
              <Button
                startIcon={<AddCircle />}
                onClick={addIngredient}
                variant="outlined"
                size="small"
              >
                Add Ingredient
              </Button>
            </Box>

            <AnimatePresence>
              {formData.ingredients.map((ingredient, index) => (
                <motion.div
                  key={ingredient.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                      borderRadius: 2,
                      mb: 2,
                      position: 'relative',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={3}>
                        <TextField
                          label="Quantity"
                          value={ingredient.quantity}
                          onChange={(e) => updateIngredient(ingredient.id, 'quantity', e.target.value)}
                          size="small"
                          fullWidth
                          placeholder="e.g., 2"
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          label="Unit"
                          value={ingredient.unit}
                          onChange={(e) => updateIngredient(ingredient.id, 'unit', e.target.value)}
                          size="small"
                          fullWidth
                          placeholder="cups, tbsp, etc."
                        />
                      </Grid>
                      <Grid item xs={12} sm={5}>
                        <TextField
                          label="Ingredient"
                          value={ingredient.name}
                          onChange={(e) => updateIngredient(ingredient.id, 'name', e.target.value)}
                          size="small"
                          fullWidth
                          required
                          placeholder="e.g., flour"
                          error={!ingredient.name.trim()}
                        />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <IconButton
                          onClick={() => removeIngredient(ingredient.id)}
                          color="error"
                          size="small"
                        >
                          <RemoveCircle />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Paper>
                </motion.div>
              ))}
            </AnimatePresence>

            {formData.ingredients.length === 0 && (
              <Paper
                sx={{
                  p: 4,
                  textAlign: 'center',
                  border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.02),
                }}
              >
                <Scale sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2, opacity: 0.5 }} />
                <Typography color="text.secondary">
                  Click "Add Ingredient" to start building your recipe
                </Typography>
              </Paper>
            )}

            {errors.ingredients && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {errors.ingredients}
              </Alert>
            )}
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Instructions
              </Typography>
              <Button
                startIcon={<AddCircle />}
                onClick={addInstructionStep}
                variant="outlined"
                size="small"
              >
                Add Step
              </Button>
            </Box>

            <AnimatePresence>
              {formData.instructions.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                      borderRadius: 2,
                      mb: 2,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        width: 32,
                        height: 32,
                      }}
                    >
                      {index + 1}
                    </Avatar>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      value={step}
                      onChange={(e) => updateInstructionStep(index, e.target.value)}
                      placeholder={`Step ${index + 1}: Describe what to do...`}
                      variant="outlined"
                      size="small"
                    />
                    {formData.instructions.length > 1 && (
                      <IconButton
                        onClick={() => removeInstructionStep(index)}
                        color="error"
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </Paper>
                </motion.div>
              ))}
            </AnimatePresence>

            {errors.instructions && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {errors.instructions}
              </Alert>
            )}
          </Stack>
        );

      case 3:
        return (
          <Stack spacing={3}>
            {/* Image Upload */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Recipe Image
              </Typography>
              
              <Paper
                {...getRootProps()}
                sx={{
                  p: 3,
                  border: `2px dashed ${isDragActive ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.3)}`,
                  borderRadius: 2,
                  bgcolor: isDragActive ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                <input {...getInputProps()} />
                
                {imagePreview ? (
                  <Box position="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        width: '100%',
                        maxHeight: 200,
                        objectFit: 'cover',
                        borderRadius: 8,
                      }}
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(255,255,255,0.8)',
                        '&:hover': { bgcolor: 'white' },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagePreview("");
                        setImageFile(null);
                        setFormData({ ...formData, image: "" });
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                ) : (
                  <Box textAlign="center">
                    <CloudUpload sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2, opacity: 0.7 }} />
                    <Typography variant="h6" gutterBottom>
                      {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      or click to select a file (max 5MB)
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<PhotoCamera />}
                      sx={{ mt: 2 }}
                      component="span"
                    >
                      Browse Files
                    </Button>
                  </Box>
                )}
              </Paper>

              <Box mt={2}>
                <TextField
                  fullWidth
                  label="Or enter image URL"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkIcon />
                      </InputAdornment>
                    ),
                  }}
                  helperText="Provide a URL for your recipe image"
                  disabled={!!imagePreview}
                />
              </Box>

              {errors.image && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                  {errors.image}
                </Alert>
              )}
            </Box>

            <Divider />

            {/* Tags */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Tags
              </Typography>
              
              <TextField
                fullWidth
                label="Add tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    addTag(tagInput);
                  }
                }}
                helperText="Press Enter or comma to add tags (max 10)"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => addTag(tagInput)}>
                        <Add />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
                {formData.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => removeTag(tag)}
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.dark,
                      '& .MuiChip-deleteIcon': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                ))}
              </Box>

              {/* Suggested Tags */}
              <Collapse in={formData.tags.length < 10}>
                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Suggested tags:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {commonTags.slice(0, 10).map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        onClick={() => addTag(tag)}
                        variant="outlined"
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            borderColor: theme.palette.primary.main,
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Collapse>
            </Box>

            <Divider />

            {/* Source */}
            <TextField
              label="Recipe Source (optional)"
              fullWidth
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              placeholder="e.g., Family recipe, Cookbook name, Website URL"
              helperText="Where did you get this recipe from?"
            />

            {/* Personal Notes */}
            <TextField
              label="Personal Notes (optional)"
              fullWidth
              multiline
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any personal notes or tips..."
            />
          </Stack>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        scroll="body"
        PaperProps={{
          sx: {
            borderRadius: 4,
            minHeight: 600,
          },
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle
            sx={{
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                <Add />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {previewMode ? 'Preview Recipe' : 'Create New Recipe'}
              </Typography>
            </Box>
            <Box display="flex" gap={1}>
              <Tooltip title={previewMode ? 'Edit Mode' : 'Preview'}>
                <IconButton onClick={() => setPreviewMode(!previewMode)}>
                  {previewMode ? <Edit /> : <Preview />}
                </IconButton>
              </Tooltip>
              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ p: 3 }}>
            {previewMode ? (
              // Preview Mode
              <Box>
                <Typography variant="h4" gutterBottom>
                  {formData.name || "Recipe Name"}
                </Typography>
                <Typography color="text.secondary" paragraph>
                  {formData.description || "Description will appear here"}
                </Typography>
                
                {formData.image || imagePreview ? (
                  <Box
                    component="img"
                    src={imagePreview || formData.image}
                    alt="Preview"
                    sx={{
                      width: '100%',
                      height: 300,
                      objectFit: 'cover',
                      borderRadius: 2,
                      mb: 3,
                    }}
                  />
                ) : null}

                <Typography variant="h6" gutterBottom>
                  Ingredients
                </Typography>
                <Box component="ul" sx={{ mb: 3 }}>
                  {formData.ingredients.map((ing, index) => (
                    <Typography component="li" key={index}>
                      {ing.quantity} {ing.unit} {ing.name}
                    </Typography>
                  ))}
                </Box>

                <Typography variant="h6" gutterBottom>
                  Instructions
                </Typography>
                <Box component="ol" sx={{ mb: 3 }}>
                  {formData.instructions.map((step, index) => (
                    <Typography component="li" key={index}>
                      {step || `Step ${index + 1}`}
                    </Typography>
                  ))}
                </Box>
              </Box>
            ) : (
              // Edit Mode with Stepper
              <>
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                <Box sx={{ mt: 2 }}>
                  {getStepContent(activeStep)}
                </Box>
              </>
            )}
          </DialogContent>

          <DialogActions
            sx={{
              p: 3,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              justifyContent: 'space-between',
            }}
          >
            <Box>
              {!previewMode && activeStep > 0 && (
                <Button onClick={handleBack} variant="outlined">
                  Back
                </Button>
              )}
            </Box>
            <Box display="flex" gap={2}>
              <Button onClick={onClose} variant="outlined" color="inherit">
                Cancel
              </Button>
              {previewMode ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  startIcon={<Save />}
                >
                  Save Recipe
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={activeStep === steps.length - 1 ? undefined : handleNext}
                  type={activeStep === steps.length - 1 ? 'submit' : 'button'}
                  endIcon={activeStep === steps.length - 1 ? <Save /> : null}
                >
                  {activeStep === steps.length - 1 ? 'Review & Save' : 'Next'}
                </Button>
              )}
            </Box>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%", borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
