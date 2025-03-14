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
    const films = [];

    this.addNewFilm = (f) => {
        films.push(f);
    }

    this.see = () => {
        for (let e of films) {
            let dateDisplay;
            if (e.date) {
                dateDisplay = e.date.format('MMMM DD, YYYY');
            } else {
                dateDisplay = "<not defined>"; // Se la data è undefined
            }

            let ratingDisplay;
            if (e.rating) {
                ratingDisplay = e.rating;
            } else {
                ratingDisplay = "<not assigned>"; // Se il rating non è assegnato
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

// Creiamo i film
let f1 = new Film(1, "Pulp Fiction", true, dayjs('2023-03-10'), 5);
let f2 = new Film(2, "21 Grams", true, dayjs('2023-03-17'), 4);
let f3 = new Film(3, "Star Wars", false);
let f4 = new Film(4, "Matrix", false);
let f5 = new Film(5, "Shrek", false, dayjs('2023-03-21'), 3);

// Crea una nuova libreria di film
let l1 = new FilmLibrary();
l1.addNewFilm(f1);
l1.addNewFilm(f2);
l1.addNewFilm(f3);
l1.addNewFilm(f4);
l1.addNewFilm(f5);

// Mostra i film nella libreria
l1.see();
