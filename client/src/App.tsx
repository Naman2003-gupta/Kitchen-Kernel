import { useState } from 'react';
import { InventoryProvider } from './context/InventoryContext';
import { ChatProvider } from './context/ChatContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import LandingPage from './components/layout/LandingPage';
import SavedRecipes from './components/recipe/SavedRecipes';
import ShoppingList from './components/shopping/ShoppingList';

function AppShell() {
  const [showSaved, setShowSaved] = useState(false);
  const [showShopping, setShowShopping] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar
        onSavedClick={() => setShowSaved(true)}
        onShoppingClick={() => setShowShopping(true)}
      />
      <div className="flex-1 overflow-hidden">
        <LandingPage />
      </div>
      {showSaved && <SavedRecipes onClose={() => setShowSaved(false)} />}
      {showShopping && <ShoppingList onClose={() => setShowShopping(false)} />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <InventoryProvider>
        <ChatProvider>
          <AppShell />
        </ChatProvider>
      </InventoryProvider>
    </ThemeProvider>
  );
}

export default App;