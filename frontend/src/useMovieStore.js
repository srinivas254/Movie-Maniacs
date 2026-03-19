import { create } from "zustand";

export const useMovieStore = create((set) => ({
  movie: {
    name: "",
    year: "",
    duration: "",
    directedBy: "",
    country: "",
    language: "",
    ageRating: "",
    posterSmallUrl: "",
    posterWideUrl: "",
    overview: "",
    watchLink: "",
  },

    movies: [],

  setMovieField: (field, value) =>
    set((state) => ({
      movie: {
        ...state.movie,
        [field]: value,
      },
    })),

    addMovie: (newMovie) =>
    set((state) => ({
      movies: [...state.movies, newMovie],
    })),

    deleteMovie: (id) =>
    set((state) => ({
      movies: state.movies.filter((m) => m.id !== id),
    })),

  updateMovie: (updatedMovie) =>
    set((state) => ({
      movies: state.movies.map((m) =>
        m.id === updatedMovie.id ? updatedMovie : m
      ),
    })),

  clearMovie: () =>
    set({
      movie: {
        name: "",
        year: "",
        duration: "",
        directedBy: "",
        country: "",
        language: "",
        ageRating: "",
        posterSmallUrl: "",
        posterWideUrl: "",
        overview: "",
        watchLink: "",
      },
    }),
}));