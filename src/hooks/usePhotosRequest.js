import { useEffect, useState } from "react";

const PHOTOS_URL = "https://picsum.photos/v2/list?limit=30";

export default function usePhotosRequest() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPhotos() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(PHOTOS_URL, { signal: controller.signal });
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
        const result = await response.json();
        if (!Array.isArray(result)) throw new Error("Unexpected response format");
        setPhotos(result);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Photos couldn't be loaded. Check your internet connection and try again.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadPhotos();
    return () => controller.abort();
  }, [attempt]);

  return { photos, loading, error, retry: () => setAttempt((n) => n + 1) };
}