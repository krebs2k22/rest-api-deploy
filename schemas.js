const zod = require("zod");

const schemeMovie = zod.object({
    title: zod.string(),
    year: zod.number().int().min(1900).max(2024),
    director: zod.string(),
    duration: zod.number().int().positive(),
    poster: zod.string().url(),
    genre: zod.array(zod.enum(["Action", "Animation" ,"Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Thriller", "Sci-Fi"])),
    rate: zod.number().min(0).max(10)
});

function validateMovie(object) {
    return schemeMovie.safeParse(object);
}

function validatePartialMovie(object) {
    return schemeMovie.partial().safeParse(object);
}

module.exports = {
    validateMovie,
    validatePartialMovie
}