import { useCallback, useMemo, useReducer, useState, useEffect } from "react";
import Icon from "./components/Icon.jsx";
import usePhotosRequest from "./hooks/usePhotosRequest.js";
import favouritesReducer, { initialFavourites } from "./reducers/favouritesReducer.js";
import PhotoCard from "./components/PhotoCard.jsx";
import PhotoSkeleton from "./components/PhotoSkeleton.jsx";

export default function App() {
  const { photos, loading, error, retry } = usePhotosRequest();
  const [favourites, dispatch] = useReducer(favouritesReducer, initialFavourites);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    try {
      localStorage.setItem("frame-favourites", JSON.stringify(favourites));
    } catch {
    }
  }, [favourites]);

  const toggleFavourite = useCallback((photo) => {
    dispatch({ type: "TOGGLE", photo });
  }, []);

  const favouriteIds = useMemo(
    () => new Set(favourites.map((photo) => photo.id)),
    [favourites]
  );

  const filteredPhotos = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const source = activeTab === "favourites" ? favourites : photos;
    if (!normalizedSearch) return source;
    return source.filter((photo) => (photo.author || "").toLowerCase().includes(normalizedSearch));
  }, [photos, favourites, search, activeTab]);

  const clearSearch = () => setSearch("");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <a href="#" className="flex items-center gap-3" aria-label="Frame home">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
              <Icon name="camera" size={23} />
            </span>
            <span>
              <span className="block text-xl font-extrabold tracking-tight">frame<span className="text-indigo-600">.</span></span>
              <span className="hidden text-xs text-slate-500 sm:block">A little inspiration gallery</span>
            </span>
          </a>
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-600">
            <Icon name="images" size={17} />
            <span>{photos.length || "—"} photos</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <section className="mb-9">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-indigo-600">Discover something beautiful</p>
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">Photos worth a second look.</h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-500">
                Browse a hand-picked mix of images, find a photographer, and save your favourites for later.
              </p>
            </div>
            <div className="flex gap-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
              <button onClick={() => setActiveTab("all")} className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${activeTab === "all" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"}`}>
                <Icon name="images" size={16} /> All photos
              </button>
              <button onClick={() => setActiveTab("favourites")} className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${activeTab === "favourites" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"}`}>
                <Icon name="heart" size={16} /> Saved <span className={`rounded-full px-2 py-0.5 text-xs ${activeTab === "favourites" ? "bg-white/20" : "bg-slate-100"}`}>{favourites.length}</span>
              </button>
            </div>
          </div>
        </section>

        <section className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block flex-1">
            <Icon name="search" size={19} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by photographer name..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-11 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            />
            {search && (
              <button onClick={clearSearch} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <Icon name="x" size={16} />
              </button>
            )}
          </label>
          <button onClick={retry} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60">
            <Icon name="refresh" size={16} className={loading ? "animate-spin" : ""} /> Refresh photos
          </button>
        </section>

        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {activeTab === "favourites" ? "Your saved collection" : "Explore the collection"}
            {!loading && !error && <span> · {filteredPhotos.length} {filteredPhotos.length === 1 ? "result" : "results"}</span>}
          </p>
          {activeTab === "favourites" && favourites.length > 0 && (
            <button onClick={() => dispatch({ type: "CLEAR" })} className="text-xs font-semibold text-slate-500 underline decoration-slate-300 underline-offset-4 hover:text-rose-600">Clear favourites</button>
          )}
        </div>

        {loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => <PhotoSkeleton key={index} />)}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-10 text-center">
            <p className="font-bold text-rose-800">Something went wrong</p>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-rose-700">{error}</p>
            <button onClick={retry} className="mt-5 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700">Try again</button>
          </div>
        )}

        {!loading && !error && filteredPhotos.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredPhotos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} isFavourite={favouriteIds.has(photo.id)} onToggleFavourite={toggleFavourite} />
            ))}
          </div>
        )}

        {!loading && !error && filteredPhotos.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-500">
              {activeTab === "favourites" ? <Heart size={24} /> : <Icon name="search" size={24} />}
            </span>
            <h2 className="mt-4 text-lg font-bold text-slate-800">{activeTab === "favourites" ? "No favourites yet" : "No photographers found"}</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              {activeTab === "favourites" ? "Tap the heart on any photo to save it here. Your collection will stay saved after refresh." : "Try another name or clear the search to see all photos."}
            </p>
            {search && <button onClick={clearSearch} className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800">Clear search</button>}
            {activeTab === "favourites" && <button onClick={() => setActiveTab("all")} className="mt-4 block w-full text-sm font-semibold text-indigo-600 hover:text-indigo-800">Browse all photos</button>}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} frame. Built with React and Tailwind CSS.</p>
          <p>Photos provided by the Lorem Picsum public API.</p>
        </div>
      </footer>
    </div>
  );
}