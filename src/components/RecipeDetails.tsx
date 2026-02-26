import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  IconButton,
  Rating,
  Divider,
  Paper,
  Stack,
  Avatar,
  Tooltip,
  Zoom,
  Fade,
  Grow,
  Slide,
  useTheme,
  alpha,
  Tab,
  Tabs,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Close,
  Delete,
  Favorite,
  FavoriteBorder,
  Share,
  Print,
  Download,
  Edit,
  AccessTime,
  People,
  LocalFireDepartment,
  Restaurant,
  Kitchen,
  CheckCircle,
  PlayArrow,
  Pause,
  Timer,
  Bookmark,
  BookmarkBorder,
  WhatsApp,
  Email,
  ContentCopy,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Recipe } from "../types/Recipe";

interface RecipeDetailsProps {
  recipe: Recipe | null;
  onClose: () => void;
  onRemove: (recipe: Recipe) => void;
  onUpdate?: (recipe: Recipe) => void;
  onToggleFavorite?: (id: string) => void;
}

// Difficulty color mapping
const difficultyColors = {
  Easy: "success",
  Medium: "warning",
  Hard: "error",
} as const;

// Tab panel component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`recipe-tabpanel-${index}`}
      aria-labelledby={`recipe-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Cooking mode component
function CookingMode({ recipe, onExit }: { recipe: Recipe; onExit: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const steps = recipe.instructions.split('\n').filter(step => step.trim());

  // Timer logic
  useEffect(() => {
    if (timer && timeLeft > 0 && !isPaused) {
      const interval = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, timeLeft, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: "background.default",
        zIndex: 9999,
        overflow: "auto",
      }}
    >
      {/* Cooking Mode Header */}
      <Paper
        elevation={4}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          borderRadius: 0,
          bgcolor: alpha(theme.palette.primary.main, 0.95),
          color: "white",
          py: 2,
          px: 3,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <Kitchen />
            <Typography variant="h6">Cooking Mode: {recipe.name}</Typography>
          </Box>
          <Box display="flex" gap={1}>
            {timer && (
              <Button
                variant="contained"
                color="secondary"
                startIcon={isPaused ? <PlayArrow /> : <Pause />}
                onClick={() => setIsPaused(!isPaused)}
              >
                {formatTime(timeLeft)}
              </Button>
            )}
            <IconButton onClick={onExit} sx={{ color: "white" }}>
              <Close />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
        {/* Step Progress */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Step {currentStep + 1} of {steps.length}
          </Typography>
          <Box
            sx={{
              width: "100%",
              height: 8,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
              style={{
                height: "100%",
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              }}
            />
          </Box>
        </Box>

        {/* Current Step */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            mb: 3,
            minHeight: 200,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            {currentStep + 1}
          </Typography>
          <Typography variant="h6" sx={{ lineHeight: 1.8 }}>
            {steps[currentStep]}
          </Typography>
        </Paper>

        {/* Timer Buttons (if step mentions time) */}
        {steps[currentStep].match(/\d+\s*(min|minutes?|sec|seconds?)/i) && (
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<Timer />}
              onClick={() => {
                const match = steps[currentStep].match(/(\d+)\s*(min|minutes?)/i);
                if (match) {
                  const minutes = parseInt(match[1]);
                  setTimer(minutes * 60);
                  setTimeLeft(minutes * 60);
                }
              }}
            >
              Set Timer
            </Button>
          </Box>
        )}

        {/* Navigation */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button
            variant="outlined"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(prev => prev - 1)}
          >
            Previous
          </Button>
          <Typography variant="body2" color="text.secondary">
            {currentStep + 1} / {steps.length}
          </Typography>
          <Button
            variant="contained"
            disabled={currentStep === steps.length - 1}
            onClick={() => setCurrentStep(prev => prev + 1)}
            endIcon={<CheckCircle />}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default function RecipeDetails({
  recipe,
  onClose,
  onRemove,
  onUpdate,
  onToggleFavorite,
}: RecipeDetailsProps) {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(recipe?.isFavorite || false);
  const [isSaved, setIsSaved] = useState(false);
  const [isCookingMode, setIsCookingMode] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [notes, setNotes] = useState('');
  const [imageError, setImageError] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  if (!recipe) return null;

  const handleRemove = () => {
    onRemove(recipe);
    onClose();
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (onToggleFavorite) {
      onToggleFavorite(recipe.id);
    }
  };

  const handleShare = async (method: 'copy' | 'whatsapp' | 'email') => {
    const shareText = `Check out this recipe: ${recipe.name}\n\n${recipe.description}\n\nIngredients: ${recipe.ingredients.join(', ')}`;
    
    switch (method) {
      case 'copy':
        await navigator.clipboard.writeText(shareText);
        setSnackbar({
          open: true,
          message: 'Recipe copied to clipboard!',
          severity: 'success',
        });
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(recipe.name)}&body=${encodeURIComponent(shareText)}`, '_blank');
        break;
    }
    setShowShareMenu(false);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${recipe.name}</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
              img { max-width: 100%; height: auto; border-radius: 8px; }
              h1 { color: #333; }
              .ingredients { margin: 20px 0; }
              .instructions { line-height: 1.6; }
            </style>
          </head>
          <body>
            <h1>${recipe.name}</h1>
            <img src="${recipe.image}" alt="${recipe.name}" />
            <p>${recipe.description}</p>
            <h2>Ingredients</h2>
            <ul>
              ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
            <h2>Instructions</h2>
            <div class="instructions">
              ${recipe.instructions.replace(/\n/g, '<br/>')}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownload = () => {
    const recipeData = {
      name: recipe.name,
      description: recipe.description,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      cuisine: recipe.cuisine,
      tags: recipe.tags,
    };

    const blob = new Blob([JSON.stringify(recipeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recipe.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setSnackbar({
      open: true,
      message: 'Recipe downloaded!',
      severity: 'success',
    });
  };

  const fallbackImage = `https://source.unsplash.com/800x400/?${recipe.cuisine || 'food'},${recipe.name.split(' ')[0]}`;
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  // Split instructions into steps
  const instructionSteps = recipe.instructions.split('\n').filter(step => step.trim());

  if (isCookingMode) {
    return <CookingMode recipe={recipe} onExit={() => setIsCookingMode(false)} />;
  }

  return (
    <>
      <Dialog
        open={!!recipe}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        scroll="body"
        TransitionComponent={Slide}
        TransitionProps={{ direction: "up" } as any}
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            maxHeight: "90vh",
          },
        }}
        ref={dialogRef}
      >
        {/* Hero Image Section */}
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              height: 400,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <motion.img
              src={imageError ? fallbackImage : recipe.image}
              alt={recipe.name}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={() => setImageError(true)}
            />
            {/* Gradient Overlay */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(180deg, transparent 0%, ${alpha(theme.palette.common.black, 0.7)} 100%)`,
              }}
            />
          </Box>

          {/* Floating Header */}
          <DialogTitle
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "white",
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <IconButton onClick={onClose} sx={{ color: "white" }}>
                <Close />
              </IconButton>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {recipe.name}
              </Typography>
            </Box>
            <Box display="flex" gap={1}>
              <Tooltip title="Cooking Mode" arrow>
                <IconButton 
                  onClick={() => setIsCookingMode(true)}
                  sx={{ color: "white", bgcolor: alpha(theme.palette.common.black, 0.3) }}
                >
                  <Kitchen />
                </IconButton>
              </Tooltip>
              <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"} arrow>
                <IconButton
                  onClick={handleToggleFavorite}
                  sx={{ color: "white", bgcolor: alpha(theme.palette.common.black, 0.3) }}
                >
                  {isFavorite ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Share" arrow>
                <IconButton
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  sx={{ color: "white", bgcolor: alpha(theme.palette.common.black, 0.3) }}
                >
                  <Share />
                </IconButton>
              </Tooltip>
            </Box>
          </DialogTitle>

          {/* Share Menu */}
          <AnimatePresence>
            {showShareMenu && (
              <Slide direction="down" in={showShareMenu}>
                <Paper
                  sx={{
                    position: "absolute",
                    top: 80,
                    right: 24,
                    zIndex: 20,
                    p: 2,
                    borderRadius: 3,
                    boxShadow: 8,
                  }}
                >
                  <Stack spacing={1}>
                    <Button
                      startIcon={<ContentCopy />}
                      onClick={() => handleShare('copy')}
                      fullWidth
                    >
                      Copy to Clipboard
                    </Button>
                    <Button
                      startIcon={<WhatsApp />}
                      onClick={() => handleShare('whatsapp')}
                      fullWidth
                      color="success"
                    >
                      WhatsApp
                    </Button>
                    <Button
                      startIcon={<Email />}
                      onClick={() => handleShare('email')}
                      fullWidth
                    >
                      Email
                    </Button>
                  </Stack>
                </Paper>
              </Slide>
            )}
          </AnimatePresence>

          {/* Recipe Info Overlay */}
          <Box
            sx={{
              position: "absolute",
              bottom: 24,
              left: 24,
              right: 24,
              color: "white",
              zIndex: 5,
            }}
          >
            <Box display="flex" gap={2} mb={2} flexWrap="wrap">
              {recipe.cuisine && (
                <Chip
                  label={recipe.cuisine}
                  sx={{ bgcolor: alpha(theme.palette.common.white, 0.2), color: "white" }}
                />
              )}
              {recipe.difficulty && (
                <Chip
                  icon={<LocalFireDepartment />}
                  label={recipe.difficulty}
                  color={difficultyColors[recipe.difficulty as keyof typeof difficultyColors]}
                  sx={{ bgcolor: alpha(theme.palette.common.white, 0.2) }}
                />
              )}
              {totalTime > 0 && (
                <Chip
                  icon={<AccessTime />}
                  label={`${totalTime} min`}
                  sx={{ bgcolor: alpha(theme.palette.common.white, 0.2), color: "white" }}
                />
              )}
              {recipe.servings && (
                <Chip
                  icon={<People />}
                  label={`${recipe.servings} servings`}
                  sx={{ bgcolor: alpha(theme.palette.common.white, 0.2), color: "white" }}
                />
              )}
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Rating value={recipe.ratings || 0} readOnly sx={{ color: theme.palette.warning.main }} />
              <Typography variant="body2">
                ({recipe.totalRatings || 0} reviews)
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Tabs Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", px: 3 }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
            <Tab label="Overview" />
            <Tab label="Ingredients" />
            <Tab label="Instructions" />
            <Tab label="Notes" />
          </Tabs>
        </Box>

        <DialogContent sx={{ p: 3 }}>
          {/* Overview Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grow in={tabValue === 0}>
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Description
                </Typography>
                <Typography color="text.secondary" paragraph>
                  {recipe.description}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Quick Info
                </Typography>
                <Grid container spacing={2}>
                  {recipe.prepTime && (
                    <Grid item xs={6} sm={3}>
                      <Paper
                        variant="outlined"
                        sx={{ p: 2, textAlign: "center", borderRadius: 2 }}
                      >
                        <AccessTime color="primary" />
                        <Typography variant="body2" color="text.secondary">
                          Prep Time
                        </Typography>
                        <Typography variant="h6">{recipe.prepTime} min</Typography>
                      </Paper>
                    </Grid>
                  )}
                  {recipe.cookTime && (
                    <Grid item xs={6} sm={3}>
                      <Paper
                        variant="outlined"
                        sx={{ p: 2, textAlign: "center", borderRadius: 2 }}
                      >
                        <Timer color="primary" />
                        <Typography variant="body2" color="text.secondary">
                          Cook Time
                        </Typography>
                        <Typography variant="h6">{recipe.cookTime} min</Typography>
                      </Paper>
                    </Grid>
                  )}
                </Grid>

                {recipe.tags && recipe.tags.length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
                      Tags
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {recipe.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.dark,
                          }}
                        />
                      ))}
                    </Box>
                  </>
                )}
              </Box>
            </Grow>
          </TabPanel>

          {/* Ingredients Tab */}
          <TabPanel value={tabValue} index={1}>
            <Fade in={tabValue === 1}>
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Ingredients
                </Typography>
                <Grid container spacing={1}>
                  {recipe.ingredients.map((ingredient, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          borderRadius: 2,
                          transition: "all 0.2s",
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            borderColor: theme.palette.primary.main,
                          },
                        }}
                      >
                        <CheckCircle color="success" sx={{ fontSize: 20 }} />
                        <Typography>{ingredient}</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Fade>
          </TabPanel>

          {/* Instructions Tab */}
          <TabPanel value={tabValue} index={2}>
            <Zoom in={tabValue === 2}>
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Instructions
                </Typography>
                <Stack spacing={2}>
                  {instructionSteps.map((step, index) => (
                    <Paper
                      key={index}
                      elevation={1}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        display: "flex",
                        gap: 2,
                        borderLeft: `4px solid ${theme.palette.primary.main}`,
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
                      <Typography sx={{ lineHeight: 1.8 }}>{step}</Typography>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            </Zoom>
          </TabPanel>

          {/* Notes Tab */}
          <TabPanel value={tabValue} index={3}>
            <Fade in={tabValue === 3}>
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Personal Notes
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  placeholder="Add your own notes, modifications, or tips about this recipe..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>
            </Fade>
          </TabPanel>
        </DialogContent>

        {/* Action Buttons */}
        <DialogActions
          sx={{
            justifyContent: "space-between",
            p: 3,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          }}
        >
          <Box display="flex" gap={2}>
            <Tooltip title="Delete recipe" arrow>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={handleRemove}
              >
                Delete
              </Button>
            </Tooltip>
            <Tooltip title="Save to collection" arrow>
              <IconButton
                onClick={() => setIsSaved(!isSaved)}
                color={isSaved ? "primary" : "default"}
              >
                {isSaved ? <Bookmark /> : <BookmarkBorder />}
              </IconButton>
            </Tooltip>
          </Box>
          <Box display="flex" gap={2}>
            <Tooltip title="Download recipe" arrow>
              <IconButton onClick={handleDownload}>
                <Download />
              </IconButton>
            </Tooltip>
            <Tooltip title="Print recipe" arrow>
              <IconButton onClick={handlePrint}>
                <Print />
              </IconButton>
            </Tooltip>
            {onUpdate && (
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => {
                  // You can implement edit mode here
                }}
              >
                Edit
              </Button>
            )}
            <Button variant="outlined" onClick={onClose}>
              Close
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
