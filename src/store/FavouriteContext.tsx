import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { FavouriteContextValue, FavouriteState } from '../types/ContextValues';
import { Product } from '../types/Product';

type Action =
  | { type: 'addToFavourite'; payload: Product }
  | { type: 'removeFromFavourite'; payload: string };

function reducer(state: FavouriteState, action: Action): FavouriteState {
  switch (action.type) {
    case 'addToFavourite':
      const productId = action.payload.itemId || action.payload.id;
      const existingProduct = state.find(product => {
        const itemId = product.product.itemId || product.product.id;

        return String(itemId) === String(productId);
      });

      return !existingProduct
        ? [...state, { product: action.payload, quantity: 1 }]
        : [...state];

    case 'removeFromFavourite':
      return state.filter(item => {
        const itemId = item.product.itemId || item.product.id;

        return String(itemId) !== String(action.payload);
      });
    default:
      return state;
  }
}

const keyIsPresent = localStorage.getItem('favourite');
let initialValue = [];

if (keyIsPresent) {
  try {
    initialValue = JSON.parse(keyIsPresent);
  } catch (e) {
    throw new Error('Invalid JSON data in localStorage for "favourite"');
  }
}

const initialContextValue: FavouriteContextValue = {
  favourites: initialValue,
  favouritesCount: 0,
  addToFavourite: () => {},
  removeFromFavourite: () => {},
};

export const FavouriteContext =
  createContext<FavouriteContextValue>(initialContextValue);

type Props = {
  children: React.ReactNode;
};

export const FavouriteProvider: React.FC<Props> = ({ children }) => {
  const [favourites, dispatch] = useReducer(reducer, initialValue);

  const addToFavourite = useCallback((product: Product) => {
    dispatch({ type: 'addToFavourite', payload: product });
  }, []);

  const removeFromFavourite = useCallback((product: Product) => {
    const productId = product.itemId || product.id;

    dispatch({ type: 'removeFromFavourite', payload: String(productId) });
  }, []);

  const favouritesCount = favourites.length;

  useEffect(() => {
    localStorage.setItem('favourite', JSON.stringify(favourites));
  }, [favourites]);

  const favouriteValues = useMemo(
    () => ({
      favourites,
      favouritesCount,
      addToFavourite,
      removeFromFavourite,
    }),
    [favourites, favouritesCount, addToFavourite, removeFromFavourite],
  );

  return (
    <FavouriteContext.Provider value={favouriteValues}>
      {children}
    </FavouriteContext.Provider>
  );
};

export const useFavouriteValues = () => {
  const value = useContext(FavouriteContext);

  if (!value) {
    throw new Error('Something is wrong with provider FavouriteContext');
  }

  return value;
};
