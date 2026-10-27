export const initialFavourites = readSavedFavourites();

function readSavedFavourites() {
  try {
    const saved = localStorage.getItem("frame-favourites");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export default function favouritesReducer(state, action) {
  switch (action.type) {
    case "TOGGLE": {
      const exists = state.some((photo) => photo.id === action.photo.id);
      return exists
        ? state.filter((photo) => photo.id !== action.photo.id)
        : [...state, action.photo];
    }
    case "CLEAR":
      return [];
    default:
      return state;
  }
}