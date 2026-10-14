const MOVIES_URL = "https://santosnr6.github.io/Data/moviecine.json";

export const fetchMovies = async () => {
    const response = await fetch(MOVIES_URL);

    if (!response.ok) {
        throw new Error("Kunde inte hämta filmerna.");
    }

    return await response.json();
};

export const fetchSearch = async (query) => {
    const API_KEY = import.meta.env.VITE_API_KEY;

    const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            query,
            search_depth: "basic",
            max_results: 3
        })
    });

    if (!response.ok) {
        throw new Error("Kunde inte genomföra webbsökningen.");
    }

    return await response.json();
}