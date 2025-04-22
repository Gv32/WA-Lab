'use strict'

const express = require('express');
const morgan = require('morgan');
const nodemon = require('nodemon');
const {check, validationResult} = require('express-validator');
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

app.get('/api/films/:id', async (req, res) => {
    const film = await dao.FilmsId(req.params.id)
    if (film[0].error)
        return res.status(404).json(film);
    dao.FilmsId(req.params.id)
    .then(films => res.json(films))
    .catch(() => res.status(500).end());
})

app.post('/api/films', 
    check('rating').isInt({min: 1, max: 5}),
    check('watchDate').isDate({format: "YYYY-MM-DD",strictMode : true}),
    check('title').isString(),
    check('favorite').isInt({min: 0, max: 1}),
    (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json( errors.errors );
    }
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

app.delete('/api/films/:id', 
    check('id').isInt(),
    async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json( errors.errors );
    }
    const film = await dao.FilmsId(req.params.id)
    if (film[0].error)
        return res.status(404).json(film);
    dao.DeleteFilm(req.params.id)
    .then(films => res.json(films))
    .catch(() => res.status(500).end());
})

app.put('/api/films/:id/favorite', 
    check('id').isInt(),
    check('favorite').isInt({min:0,max:1}),
    async (req, res) => {  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json( errors.errors );
    } 
    const film = await dao.FilmsId(req.params.id)
    if (film[0].error)
        return res.status(404).json(film);
    dao.UpdateFavorite(req.params.id,req.body.favorite)
    .then(films => res.json(films))
    .catch(() => res.status(500).end());
});

app.post('/api/films/:id/score',
    check('id').isInt(),
    check('score').isInt({min:-5,max:5}),
    async (req, res) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json( errors.errors );
    }
    const film = await dao.FilmsId(req.params.id)
    if (film[0].error)
        return res.status(404).json(film);
    if (!film[0].rating)
        return res.status(422).json({error: `Modification of rating not allowed because rating is not set`});
    const score = req.body.score;
    console.log(film);
    if (film[0].rating + score > 5 || film[0].rating + score < 1){
        return res.status(422).json({error: `Modification of rating would yield a value out of valid range`});}
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

app.put('/api/films/:id', 
    check('id').isInt(),
    check('rating').isInt({min: 1, max: 5}).optional(),
    check('watchDate').isDate({format: "YYYY-MM-DD",strictMode : true}).optional(),
    check('title').isString(),
    check('favorite').isInt({min: 0, max: 1}),
    async (req, res) => {

    const filmId = req.params.id;
    const film = {
        title: req.body.title,
        favorite: req.body.favorite,
        watchDate: req.body.watchDate,
        rating: req.body.rating,
    };
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json( errors.errors );
    }
    const filmDB = await dao.FilmsId(req.params.id)
    if (film[0].error)
        return res.status(404).json(film);
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