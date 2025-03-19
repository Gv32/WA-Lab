'use strict'

const express = require('express');
const morgan = require('morgan');
// Creazione oggetto app
const app = express();
app.use(morgan('dev'));
app.use(express.json());
const dao = require('./dao.js');

// app.get('/api/films', (req, res) => {
//     dao.FilmsList()
//     .then(films => res.json(films))
//     .catch(() => res.status(500).end());
// })

app.get('/api/films/:id', (req, res) => {
    dao.FilmsId(req.params.id)
    .then(films => res.json(films))
    .catch(() => res.status(500).end());
})

app.post('/api/films', (req, res) => {
    const film = {
        title: req.body.title,
        favorite: req.body.favorite,
        watchDate: req.body.watchDate,
        rating: req.body.rating,
    };
    dao.NewFilm(film)
    .then(films => res.json(films))
    .catch(() => res.status(500).end());
})

app.delete('/api/films/:id', (req, res) => {
    dao.DeleteFilm(req.params.id)
    .then(films => res.json(films))
    .catch(() => res.status(500).end());
})

app.put('/api/films/:id/favorite', (req, res) => {    
    dao.UpdateFavorite(req.params.id,req.body.favorite)
    .then(films => res.json(films))
    .catch(() => res.status(500).end());
});

app.put('/api/films/:id/score', (req, res) => {    
    dao.UpdateRating(req.params.id,req.body.score)
    .then(films => res.json(films))
    .catch(() => res.status(500).end());
});

app.get('/api/films', (req, res) => {
    const filter = req.query.filter || "all"; // Se non specificato, mostra tutti i film
    dao.GetFilteredFilms(filter)
    .then(films => res.json(films))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.put('/api/films/:id', (req, res) => {
    const filmId = req.params.id;
    const film = {
        title: req.body.title,
        favorite: req.body.favorite,
        watchDate: req.body.watchDate,
        rating: req.body.rating,
    };
    dao.UpdateFilm(filmId, film)
      .then(result => {
          if (result.updatedRows > 0)
              res.json({ message: "Film aggiornato con successo" });
          else
              res.status(404).json({ message: "Film non trovato" });
      })
      .catch(err => res.status(500).json({ error: err.message }));
});



const PORT = 3001;
app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));