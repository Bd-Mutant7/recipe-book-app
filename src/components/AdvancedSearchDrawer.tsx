import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Button,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  useTheme,
  alpha,
} from "@mui/material";
import { Close, Sort, FilterList, Clear } from "@mui/icons-material";

interface AdvancedSearchDrawerProps {
  open: boolean;
  onClose: () => void;
  tags: string[];
  selectedTags: string[];
  onTagSelect: (tags: string[]) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: () => void;
}

export default function AdvancedSearchDrawer({
  open,
  onClose,
  tags,
  selectedTags,
  onTagSelect,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
}: AdvancedSearchDrawerProps) {
  const theme = useTheme();

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagSelect(selectedTags.filter(t => t !== tag));
    } else {
      onTagSelect([...selectedTags, tag]);
    }
  };

  const clearAllFilters = () => {
    onTagSelect([]);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          borderTopLeftRadius: 20,
          borderBottomLeftRadius: 20,
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={1}>
            <FilterList color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filters & Sorting
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        {/* Sort Section */}
        <Box mb={4}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Sort By
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="date">Date Added</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="rating">Rating</MenuItem>
              <MenuItem value="prepTime">Prep Time</MenuItem>
              <MenuItem value="cookTime">Cook Time</MenuItem>
            </Select>
          </FormControl>
          
          <Box mt={2}>
            <RadioGroup
              row
              value={sortOrder}
              onChange={onSortOrderChange}
            >
              <FormControlLabel 
                value="desc" 
                control={<Radio size="small" />} 
                label="Descending" 
              />
              <FormControlLabel 
                value="asc" 
                control={<Radio size="small" />} 
                label="Ascending" 
              />
            </RadioGroup>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Tags Section */}
        <Box mb={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Filter by Tags
            </Typography>
            {selectedTags.length > 0 && (
              <Button
                size="small"
                startIcon={<Clear />}
                onClick={clearAllFilters}
                sx={{ color: theme.palette.text.secondary }}
              >
                Clear all
              </Button>
            )}
          </Box>

          <Box display="flex" flexWrap="wrap" gap={1}>
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => handleTagToggle(tag)}
                color={selectedTags.includes(tag) ? "primary" : "default"}
                variant={selectedTags.includes(tag) ? "filled" : "outlined"}
                sx={{
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Apply Button */}
        <Box sx={{ position: 'sticky', bottom: 0, pt: 3, bgcolor: 'background.paper' }}>
          <Button
            fullWidth
            variant="contained"
            onClick={onClose}
            sx={{ borderRadius: 3, py: 1.5 }}
          >
            Apply Filters
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
