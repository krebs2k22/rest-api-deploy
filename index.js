const express = require("express");
const movies = require("./movies.json");
const crypto = require("node:crypto");
const { validateMovie, validatePartialMovie } = require("./schemas");


const server = express();

server.disable("x-powered-by");

server.use(express.json());
 
const DOMINIOS_PERMITIDOS = [
    "http://localhost:3000",
    "http://localhost:123123",
    "http://localhost:8080",
    "http://192.168.1.98:8080"
];

server.use((req, res, next) => { 
    const origin = req.header("origin");
    
    if (DOMINIOS_PERMITIDOS.includes(origin) || !origin) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Access-Control-Allow-Methods", "GET, POST, POST, PATCH, DELETE, OPTIONS");
        console.log("origen: ", req.header("origin"));
        console.log("metodo: ", req.method); 
        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }
    }
    next();
});

server.get("/", (req, res) => {
    res.json({ "message": "pagina principal"});
});

server.get("/movies", (req, res) => {
    const { genre } = req.query;

    if (genre) {
        const moviesFilter = movies.filter(movie => movie.genre.some(genreMovie => genreMovie === genre));
        return res.status(200).json(moviesFilter);
    }

    res.json(movies);
});

server.get("/movies/:id", (req, res) => {
    const { id } = req.params;
    
    const movieIndex = movies.findIndex(movie => movie.id === id);

    if (movieIndex === -1) {
        return res.status(404).json({ "message": "Pelicula no encontrada."})
    }

    res.json(movies[movieIndex]);
});

server.post("/movies", (req, res) => {
    const result = validateMovie(req.body);

    if (result.error) {
        return res.status(400).json({ "error": JSON.parse(result.error.message) });
    }

    const movie = {
        id: crypto.randomUUID(),
        ...result.data
    };

    movies.push(movie);
    res.status(201).json(movie);
});

server.patch("/movies/:id", (req, res) => {
    const result = validatePartialMovie(req.body);

    if (result.error) {
        return res.status(400).json({ "message": JSON.parse(result.error.message)});
    }

    const { id } = req.params;

    const movieIndex = movies.findIndex(movie => movie.id === id);

    if (movieIndex === -1) {
        return res.status(404).json({ "message": "Pelicula no encontrada"});
    }

    const movie = {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex] = movie;

    res.status(200).json(movie);
});

server.delete("/movies/:id", (req, res) => {
    const { id } = req.params;

    const movieIndex = movies.findIndex(movie => movie.id === id);

    if (movieIndex === -1) {
        return res.status(404).json({ "message": "Pelicula no encontrada." });
    }

    movies.splice(movieIndex, 1);

    res.status(200).json({ "message": `Pelicula eliminada ID: ${id}`});
});

server.use((req, res) => {
    res.status(404).json({ "messaje": "404 página no encontrada"});
});

server.listen(3000, () => {
    console.log("server escuchando en el puerto: http://localhost:3000");
});



