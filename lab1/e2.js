"use strict";

const dayjs = require('dayjs');

function Film(id, title, favorite = false, date, rating) {
    this.id = id;
    this.title = title;
    this.favorite = favorite; // Booleano: true o false
    this.date = date;
    this.rating = rating;
}

function FilmLibrary() {
    let films = [];

    this.addNewFilm = (f) => {
        films.push(f);
    }

    this.sortByDate = () => {
        let f1 = films.filter( film => film.date == undefined);
        let f2 = films.sort((a, b) => a.date - b.date).filter( a => a.date != undefined);
        let v3 = [...f2, ...f1];
        return v3;
    }

    this.deleteFilm = (id) => {
        // il vettore films, viene iterato n volte da filter e crea un nuovo vettore
        // i cui elementi rispettano la condizione di film.is != id
        // film è il parametro della funzione che deve eseguire, è come se fosse un istanza di films
        films = films.filter(film => film.id != id);
    }

    this.getRated = () => {
        let f1 = films.filter( f => f.rating != undefined).sort((a,b) => b.rating - a.rating);
        return f1;
    }

    this.resetWatchedFilms = () => {
        films = films.map(film => {
            film.date = undefined;
            return film;
        });
    }

    this.see = () => {
        for (let e of films) {
            let dateDisplay;
            if (e.date) {
                dateDisplay = e.date.format('MMMM DD, YYYY');
            } else {
                dateDisplay = "<not defined>";
            }
            let ratingDisplay;
            if (e.rating) {
                ratingDisplay = e.rating;
            } else {
                ratingDisplay = "<not assigned>";
            }
            let favoriteDisplay;
            if (e.favorite) {
                favoriteDisplay = "true";
            } else {
                favoriteDisplay = "false";
            }
            console.log(`Id: ${e.id}, Title: ${e.title}, Favorite: ${favoriteDisplay}, Watch date: ${dateDisplay}, Score: ${ratingDisplay}`);
        }
    }
}

let f1 = new Film(1, "Pulp Fiction", true, dayjs('2023-03-10'), 5);
let f2 = new Film(2, "21 Grams", true, dayjs('2023-03-17'), 4);
let f3 = new Film(3, "Star Wars", false);
let f4 = new Film(4, "Matrix", false);
let f5 = new Film(5, "Shrek", false, dayjs('2023-03-21'), 3);

let l1 = new FilmLibrary();
l1.addNewFilm(f1);
l1.addNewFilm(f2);
l1.addNewFilm(f3);
l1.addNewFilm(f4);
l1.addNewFilm(f5);

//l1.deleteFilm(2);

//l1.see();
l1.resetWatchedFilms();
l1.see();