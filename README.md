# Frame — React Photo Gallery

A responsive React + Vite photo gallery built for the frontend internship pre-screening assignment.

## Features
- Fetches 30 photos from `https://picsum.photos/v2/list?limit=30`
- Loading skeletons and an API error state with retry
- Responsive grid: 1 column on mobile, 2 on tablet, 4 on desktop
- Live search by photographer name without another API call
- Favourite toggle managed with `useReducer`
- Favourites persist across refreshes with `localStorage`
- `usePhotosRequest` custom hook owns the API/loading/error logic
- `useCallback` memoizes the favourite handler; `useMemo` derives IDs and filtered results
- Functional components only; no UI component library (icons are local SVGs)

## Requirements
- Node.js 20.19+ or 22.12+
- npm

## Run locally
1. Extract the ZIP.
2. Open a terminal inside this project folder.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open the local URL printed in the terminal (usually `http://localhost:5173`).

Create a production build:
```bash
npm run build
```

## Main files
- `src/App.jsx` — gallery UI, search, tabs, memoized filtering and persistence
- `src/hooks/usePhotosRequest.js` — custom API hook returning `photos`, `loading`, `error`, `retry`
- `src/reducers/favouritesReducer.js` — favourite actions handled by `useReducer`
- `src/components/PhotoCard.jsx` — one photo card and its favourite button
- `src/components/PhotoSkeleton.jsx` — loading placeholder

## Recording checklist (5 minutes)
1. Show the app loading and the responsive gallery.
2. Search for a photographer and demonstrate that results filter instantly.
3. Favourite a photo, refresh the browser, and show that the favourite remains saved.
4. Open `src/hooks/usePhotosRequest.js` and explain its return values and error handling.
5. Open `src/reducers/favouritesReducer.js` and explain `TOGGLE` and `CLEAR`.
6. Open `src/App.jsx` and explain the `useCallback` handler and `useMemo` filtered list.
7. Explain one challenge you faced and how you solved it.

## Notes
- The app requires an internet connection to fetch photos.
- If the Picsum API is temporarily unavailable, the error state and retry button are shown.
- Keep the repository public if the assignment reviewer needs to access it.
