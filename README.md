# 🍳 Recipe Book App

Welcome to your personal kitchen companion! This beautifully crafted Recipe Book App helps you discover, create, and share culinary masterpieces with ease.

![Recipe Book App](https://via.placeholder.com/1200x600/2196F3/FFFFFF?text=Recipe+Book+App)

## ✨ Live Demo

**[🚀 Try the App Now](https://recipe-book-app-lac.vercel.app/)**

## 📸 Screenshots

| Home Page | Recipe Details | Cooking Mode |
|-----------|----------------|--------------|
| ![Home](https://via.placeholder.com/300x200/2196F3/FFFFFF?text=Home) | ![Details](https://via.placeholder.com/300x200/FFC107/000000?text=Recipe+Details) | ![Cooking](https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Cooking+Mode) |

## ✨ Features

### 🎨 **Beautiful & Intuitive Interface**
- **Stunning Blue & Yellow Theme** - A modern, appetizing color scheme
- **Responsive Design** - Perfect on mobile, tablet, and desktop
- **Smooth Animations** - Delightful transitions and hover effects
- **Gradient Backgrounds** - Professional, magazine-quality visuals

### 📝 **Recipe Management**
- **Add New Recipes** - Rich form with image upload, ingredients, and step-by-step instructions
- **Edit Recipes** - Update your recipes anytime
- **Delete Recipes** - Remove recipes you no longer need
- **Favorites System** - Star your most-loved recipes

### 🔍 **Advanced Search & Discovery**
- **Full-Text Search** - Search by name, ingredients, or description
- **Voice Search** - Just speak what you're looking for
- **Tag Filtering** - Filter by categories like "Vegetarian", "Quick", "Dessert"
- **Sort Options** - Sort by name, date added, or rating
- **Recent Searches** - Quick access to your previous searches

### 🍳 **Cooking Experience**
- **Cooking Mode** - Full-screen, distraction-free cooking assistant
- **Step-by-Step Navigation** - Follow recipes easily
- **Built-in Timer** - Set timers for cooking steps
- **Checklist Ingredients** - Track what you've used

### 📱 **Social & Sharing**
- **Share Recipes** - Share via WhatsApp, email, or copy to clipboard
- **Print Recipes** - Print-friendly format
- **Download Recipes** - Save recipes as JSON files
- **Personal Notes** - Add your own notes to any recipe

### ⚡ **Advanced Features**
- **Offline Support** - Access your recipes without internet
- **PWA Ready** - Install as a native app on your phone
- **Image Upload** - Drag & drop or paste image URLs
- **Smart Import** - Import recipes from URLs (coming soon)
- **Meal Planner** - Plan your weekly meals (coming soon)
- **Shopping List** - Auto-generate grocery lists (coming soon)

## 🚀 Quick Start

### Live Demo
Just visit: **[https://recipe-book-app-lac.vercel.app/](https://recipe-book-app-lac.vercel.app/)**

### Run Locally

```bash
# Clone the repository
git clone https://github.com/Bd-Mutant7/recipe-book-app.git

# Navigate to project directory
cd recipe-book-app

# Install dependencies
npm install

# Start development server
npm run dev
```
## 🛠️ Built With

- **Frontend**: [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **UI Framework**: [Material-UI (MUI) v6](https://mui.com/)
- **Styling**: [Emotion](https://emotion.sh/) + Custom Theme
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Database**: [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) ([Dexie.js](https://dexie.org/))
- **PWA**: [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- **Icons**: [Material Icons](https://mui.com/material-ui/material-icons/)

## 📁 Project Structure
```markdown
recipe-book-app/
├── public/ # Static assets
├── src/
│ ├── components/ # Reusable components
│ │ ├── RecipeCard.tsx # Recipe card with hover effects
│ │ ├── RecipeDetails.tsx # Full recipe view with cooking mode
│ │ ├── AddRecipeModal.tsx # Multi-step recipe creation
│ │ └── AdvancedSearchDrawer.tsx # Filter drawer
│ ├── types/ # TypeScript type definitions
│ │ └── Recipe.ts # Recipe interface
│ ├── theme.ts # Custom MUI theme (blue & yellow)
│ ├── App.tsx # Main app component
│ └── main.tsx # Entry point
├── index.html # HTML template
├── vite.config.ts # Vite configuration
├── package.json # Dependencies
└── README.md # Documentation
```


## 🎯 Key Features in Detail

### 📸 **Recipe Cards**
- Beautiful gradient hover effects
- Quick favorite toggle
- Ingredient preview
- Cooking time and difficulty badges
- Rating display
- Share and save options

### 📖 **Recipe Details**
- Full-screen cooking mode
- Tabbed interface (Overview, Ingredients, Instructions, Notes)
- Step-by-step navigation
- Built-in timer
- Print and download options

### ➕ **Add Recipe Modal**
- 4-step guided form
- Image upload with drag & drop
- Structured ingredients (quantity, unit, name)
- Step-by-step instructions
- Tag suggestions
- Preview mode

### 🔍 **Advanced Search**
- Voice search capability
- Tag filtering
- Multiple sort options
- Recent searches
- Filter badges

## 🚀 Deployment

The app is deployed on **[Vercel](https://vercel.com/)** with automatic deployments from GitHub.

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```
### Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Bd-Mutant7/recipe-book-app)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).

## 👥 Contributors

- **[@Bd-Mutant7](https://github.com/Bd-Mutant7)** - Project Lead
- **[@JohnMwendwa](https://github.com/JohnMwendwa)** - Contributor

## 🙏 Acknowledgments

- [Material-UI](https://mui.com/) for the beautiful component library
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Vercel](https://vercel.com/) for hosting
- All our amazing users and contributors

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/Bd-Mutant7/recipe-book-app?style=social)
![GitHub forks](https://img.shields.io/github/forks/Bd-Mutant7/recipe-book-app?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/Bd-Mutant7/recipe-book-app?style=social)
![GitHub last commit](https://img.shields.io/github/last-commit/Bd-Mutant7/recipe-book-app)

## 📧 Contact

Have questions or suggestions? Feel free to reach out:

- **GitHub**: [@Bd-Mutant7](https://github.com/Bd-Mutant7)
- **Live App**: [https://recipe-book-app-lac.vercel.app/](https://recipe-book-app-lac.vercel.app/)
- **Repository**: [https://github.com/Bd-Mutant7/recipe-book-app](https://github.com/Bd-Mutant7/recipe-book-app)

---

**Made with ❤️ for food lovers everywhere** 🍽️

## 🚦 Current Status

✅ Core Features Complete<br>
✅ Beautiful UI/UX<br>
✅ PWA Ready<br>
✅ Voice Search<br>
✅ Cooking Mode<br>
✅ Offline Support<br>
🚧 Meal Planner (In Progress)<br>
🚧 Shopping List (In Progress)

---

<div align="center">
  <sub>⭐ If you find this project helpful, please consider giving it a star on GitHub!</sub>
  <br>
  <sub>🍴 Fork it, make it better, and share with the world!</sub>
</div>

## 📝 How to Use

1. **Copy everything above** (from the first `## 🛠️ Built With` to the end)
2. **Go to your GitHub repository**
3. **Click on `README.md`**
4. **Click the pencil icon** (Edit)
5. **Paste** the content where you want it
6. **Click "Commit changes"**

## 🎨 Pro Tip

If you want to add the **Deploy with Vercel** button image properly, make sure the URL is correct:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Bd-Mutant7/recipe-book-app)

