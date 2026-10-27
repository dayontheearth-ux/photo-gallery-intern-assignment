import Icon from "./Icon.jsx";

export default function PhotoCard({ photo, isFavourite, onToggleFavourite }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <a
        href={photo.url}
        target="_blank"
        rel="noreferrer"
        className="relative block aspect-[4/3] overflow-hidden bg-slate-100"
        aria-label={`Open photo by ${photo.author}`}
      >
        <img
          src={photo.download_url}
          alt={`Photograph by ${photo.author}`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-slate-600 shadow-sm backdrop-blur transition hover:bg-white">
          <Icon name="external" size={16} />
        </span>
      </a>
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">{photo.author || "Unknown photographer"}</p>
          <p className="mt-1 text-xs text-slate-500">Photo #{photo.id}</p>
        </div>
        <button
          type="button"
          onClick={() => onToggleFavourite(photo)}
          aria-label={isFavourite ? `Remove ${photo.author} from favourites` : `Add ${photo.author} to favourites`}
          aria-pressed={isFavourite}
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition ${
            isFavourite
              ? "border-rose-100 bg-rose-50 text-rose-600"
              : "border-slate-200 bg-white text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
          }`}
        >
          <Icon name="heart" size={18} fill={isFavourite ? "currentColor" : "none"} />
        </button>
      </div>
    </article>
  );
}