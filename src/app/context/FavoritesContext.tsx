import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';

interface FavoritesContextType {
  favorites: number[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('elite-flower-favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse favorites', e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('elite-flower-favorites', JSON.stringify(favorites));
    }
  }, [favorites, isInitialized]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const isFav = prev.includes(id);
      let newFavs;
      if (isFav) {
        newFavs = prev.filter(fid => fid !== id);
        toast.success('Бүтээгдэхүүнийг хүслийн жагсаалтаас хаслаа');
      } else {
        newFavs = [...prev, id];
        toast.success('Бүтээгдэхүүнийг хүслийн жагсаалтад нэмлээ');
      }
      return newFavs;
    });
  };

  const isFavorite = (id: number) => favorites.includes(id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, favoritesCount: favorites.length }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
