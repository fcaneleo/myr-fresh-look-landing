import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/pages/Index";
import { formatPrice } from "@/lib/formatPrice";

interface SearchResult extends Product {
  highlight?: string;
}

const SearchInput = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Search products
  const searchProducts = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('productos')
        .select(`
          *,
          familias (
            nombre
          )
        `)
        .eq('vigencia', true)
        .or(`Descripcion.ilike.%${searchQuery}%)
        .limit(20);

      if (error) throw error;

      const transformedResults: SearchResult[] = data?.map(item => ({
        id: item.id,
        name: item.Descripcion,
        price: parseFloat(item.Precio.toString()),
        image: item.image_url || '/placeholder.svg',
        category: item.familias?.nombre || '',
        description: item.descripcion_larga || '',
        highlight: highlightMatch(item.Descripcion, searchQuery)
      })) || [];

      setResults(transformedResults);
    } catch (error) {
      console.error('Error searching products:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Highlight matching text
  const highlightMatch = (text: string, query: string): string => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-primary/20 text-primary">$1</mark>');
  };

  // Handle input change
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      searchProducts(query);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [query]);

  // Handle clicks outside and touch events
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    // Prevent body scroll when dropdown is open on mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (isOpen && searchRef.current && !searchRef.current.contains(e.target as Node)) {
        e.preventDefault();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchmove', handleTouchMove);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleProductSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleProductSelect = (product: SearchResult) => {
    navigate(`/producto/${product.id}`);
    setQuery("");
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  // Get category display name
  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'aseo':
        return 'Aseo';
      case 'perfumeria':
        return 'Perfumería';
      case 'paqueteria':
        return 'Paquetería';
      default:
        return category;
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <div className="flex items-center bg-muted rounded-full px-4 py-2">
          <Search className="h-4 w-4 text-muted-foreground mr-2" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => {
              if (query.trim()) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Buscar productos..."
            className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground text-base sm:text-sm"
            style={{ fontSize: '16px' }}
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
                setIsOpen(false);
                setSelectedIndex(-1);
              }}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.trim() && (
        <div 
          className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto touch-pan-y"
          onTouchStart={() => {
            // Hide keyboard on mobile when touching the dropdown
            if (inputRef.current) {
              inputRef.current.blur();
            }
          }}
        >
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">
              Buscando...
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((product, index) => (
                <button
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  className={`w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors ${
                    index === selectedIndex ? 'bg-accent' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-md bg-muted"
                    />
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-medium text-foreground text-sm truncate"
                        dangerouslySetInnerHTML={{ __html: product.highlight || product.name }}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {getCategoryDisplayName(product.category)}
                        </span>
                        <span className="text-sm font-bold text-primary">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center">
              <div className="text-muted-foreground text-sm mb-2">
                No se encontraron productos
              </div>
              <div className="text-xs text-muted-foreground">
                Intenta con otra búsqueda
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;