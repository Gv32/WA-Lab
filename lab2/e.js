"use strict";

const dayjs = require('dayjs');
const sqlite = require('sqlite3');

// Connessione al database
const database = new sqlite.Database('films.db', (err) => { 
    if (err) throw err; 
});

function Film(id, title, favorite = false, date, rating) {
    this.id = id;
    this.title = title;
    this.favorite = favorite;
    this.date = date;
    this.rating = rating;
}

function FilmLibrary() {
    let films = [];

    // Aggiungi film all'interno della libreria
    this.addNewFilm = (f) => {
        films.push(f);
    };

    // Ordina i film per data
    this.sortByDate = () => {
        let f1 = films.filter(film => film.date == undefined);
        let f2 = films.sort((a, b) => a.date - b.date).filter(a => a.date != undefined);
        let v3 = [...f2, ...f1];
        return v3;
    };

    // Elimina un film dato il suo ID
    this.deleteFilm = (id) => {
        films = films.filter(film => film.id != id);
    };

    // Ottieni i film con punteggio (rating) definito
    this.getRated = () => {
        let f1 = films.filter(f => f.rating != undefined).sort((a,b) => b.rating - a.rating);
        return f1;
    };

    // Resetta la data di visione (mette undefined)
    this.resetWatchedFilms = () => {
        films = films.map(film => {
            film.date = undefined;
            return film;
        });
    };

    // Mostra i film nella libreria
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
    };

    // Metodo asincrono per ottenere tutti i film dal database
    this.getApp = async () => {
        try {
            // Restituisci una Promise con la query SQL
            const rows = await new Promise((resolve, reject) => {
                database.all("SELECT * FROM films", (err, rows) => {
                    if (err) {
                        reject(err); // Se c'è un errore, rifiuta la Promise
                    } else {
                        resolve(rows); // Risolvi la Promise con i risultati
                    }
                });
            });
            // Mappa i risultati ottenuti dal database a oggetti Film
            films = rows.map(row => {
                return new Film(
                    row.id, 
                    row.title, 
                    row.favorite == 1, // Converti 1/0 in booleano
                    row.date ? dayjs(row.date) : undefined, // Se c'è una data, convertila in oggetto dayjs
                    row.rating
                );
            });
            return films;
        } catch (err) {
            console.error("Error fetching films from database:", err);
            throw err;
        }
    };

    this.getFavorite = async () => {
        try {
            // Restituisci una Promise con la query SQL
            const rows = await new Promise((resolve, reject) => {
                database.all("SELECT * FROM films where favorite == 1", (err, rows) => {
                    if (err) {
                        reject(err); // Se c'è un errore, rifiuta la Promise
                    } else {
                        resolve(rows); // Risolvi la Promise con i risultati
                    }
                });
            });
            // Mappa i risultati ottenuti dal database a oggetti Film
            films = rows.map(row => {
                return new Film(
                    row.id, 
                    row.title, 
                    row.favorite == 1, // Converti 1/0 in booleano
                    row.date ? dayjs(row.date) : undefined, // Se c'è una data, convertila in oggetto dayjs
                    row.rating
                );
            });
            return films;
        } catch (err) {
            console.error("Error fetching films from database:", err);
            throw err;
        }
    };

    this.getToday = async () => {
        try {
            // Ottieni la data di oggi nel formato YYYY-MM-DD
            let today = dayjs().format('YYYY-MM-DD');
            // Restituisci una Promise con la query SQL
            const rows = await new Promise((resolve, reject) => {
                // La query seleziona i film che sono stati visti oggi
                database.all("SELECT * FROM films WHERE DATE(watchdate) = ?", [today], (err, rows) => {
                    if (err) {
                        reject(err); // Se c'è un errore, rifiuta la Promise
                    } else {
                        resolve(rows); // Risolvi la Promise con i risultati
                    }
                });
            });
            // Mappa i risultati ottenuti dal database a oggetti Film
            films = rows.map(row => {
                return new Film(
                    row.id, 
                    row.title, 
                    row.favorite == 1, // Converti 1/0 in booleano
                    row.watchdate ? dayjs(row.watchdate) : undefined, // Se c'è una data, convertila in oggetto dayjs
                    row.rating
                );
            });
            return films; // Restituisci l'array dei film visti oggi
        } catch (err) {
            console.error("Error fetching films from database:", err);
            throw err;
        }
    };
    
    this.getBefore = async (dt) => {
        try {
            // Ottieni la data di oggi nel formato YYYY-MM-DD
            let today = dt
            // Restituisci una Promise con la query SQL
            const rows = await new Promise((resolve, reject) => {
                // La query seleziona i film che sono stati visti oggi
                database.all("SELECT * FROM films WHERE DATE(watchdate) < ?", [today], (err, rows) => {
                    if (err) {
                        reject(err); // Se c'è un errore, rifiuta la Promise
                    } else {
                        resolve(rows); // Risolvi la Promise con i risultati
                    }
                });
            });
            // Mappa i risultati ottenuti dal database a oggetti Film
            films = rows.map(row => {
                return new Film(
                    row.id, 
                    row.title, 
                    row.favorite == 1, // Converti 1/0 in booleano
                    row.watchdate ? dayjs(row.watchdate) : undefined, // Se c'è una data, convertila in oggetto dayjs
                    row.rating
                );
            });
            return films; // Restituisci l'array dei film visti oggi
        } catch (err) {
            console.error("Error fetching films from database:", err);
            throw err;
        }
    };

    this.getRating = async (dt) => {
        try {
            // Ottieni la data di oggi nel formato YYYY-MM-DD
            let today = dt
            // Restituisci una Promise con la query SQL
            const rows = await new Promise((resolve, reject) => {
                // La query seleziona i film che sono stati visti oggi
                database.all("SELECT * FROM films WHERE rating >= ?", [today], (err, rows) => {
                    if (err) {
                        reject(err); // Se c'è un errore, rifiuta la Promise
                    } else {
                        resolve(rows); // Risolvi la Promise con i risultati
                    }
                });
            });
            // Mappa i risultati ottenuti dal database a oggetti Film
            films = rows.map(row => {
                return new Film(
                    row.id, 
                    row.title, 
                    row.favorite == 1, // Converti 1/0 in booleano
                    row.watchdate ? dayjs(row.watchdate) : undefined, // Se c'è una data, convertila in oggetto dayjs
                    row.rating
                );
            });
            return films; // Restituisci l'array dei film visti oggi
        } catch (err) {
            console.error("Error fetching films from database:", err);
            throw err;
        }
    };

    this.getNaming = async (dt) => {
        try {
            // Ottieni la data di oggi nel formato YYYY-MM-DD
            let today = '%'+dt+'%'
            // Restituisci una Promise con la query SQL
            const rows = await new Promise((resolve, reject) => {
                // La query seleziona i film che sono stati visti oggi
                database.all("SELECT * FROM films WHERE title LIKE ?", [today], (err, rows) => {
                    if (err) {
                        reject(err); // Se c'è un errore, rifiuta la Promise
                    } else {
                        resolve(rows); // Risolvi la Promise con i risultati
                    }
                });
            });
            // Mappa i risultati ottenuti dal database a oggetti Film
            films = rows.map(row => {
                return new Film(
                    row.id, 
                    row.title, 
                    row.favorite == 1, // Converti 1/0 in booleano
                    row.watchdate ? dayjs(row.watchdate) : undefined, // Se c'è una data, convertila in oggetto dayjs
                    row.rating
                );
            });
            return films; // Restituisci l'array dei film visti oggi
        } catch (err) {
            console.error("Error fetching films from database:", err);
            throw err;
        }
    };

    this.Store = async (title, favorite, watchdate, rating) => {
        try {
            // Costruisci la query di inserimento per il nuovo film
            const query = "INSERT INTO films (title, favorite, watchdate, rating) VALUES (?, ?, ?, ?)";
    
            // Esegui la query per inserire il nuovo film nel database
            const result = await new Promise((resolve, reject) => {
                database.run(query, [title, favorite ? 1 : 0, watchdate ? watchdate.format('YYYY-MM-DD') : null, rating], function(err) {
                    if (err) {
                        reject(err); // Se c'è un errore, rifiuta la Promise
                    } else {
                        resolve(this.lastID); // Restituisci l'ID del film appena inserito
                    }
                });
            });
    
            // Verifica se l'inserimento è stato eseguito correttamente
            if (result) {
                console.log(`Film "${title}" inserito con successo con ID ${result}.`);
            } else {
                console.log("Errore durante l'inserimento del film.");
            }
        } catch (err) {
            console.error("Errore durante l'inserimento del film nel database:", err);
        }
    };

    this.Delete = async (id) => {
        try {
            // Costruisci la query di inserimento per il nuovo film
            const query = "DELETE FROM films WHERE id == ?;";
    
            // Esegui la query per inserire il nuovo film nel database
            const result = await new Promise((resolve, reject) => {
                database.run(query, [id], function(err) {
                    if (err) {
                        reject(err); // Se c'è un errore, rifiuta la Promise
                    } else {
                        resolve(this.lastID); // Restituisci l'ID del film appena inserito
                    }
                });
            });
    
            // Verifica se l'inserimento è stato eseguito correttamente
            if (result) {
                console.log(`Film "${id}" eliminato con successo con ID ${result}.`);
            } else {
                console.log("Errore durante la cancellazione del film.");
            }
        } catch (err) {
            console.error("Errore durante la cancellazione del film nel database:", err);
        }
    };

    this.Update = async () => {
        try {
            // Costruisci la query di inserimento per il nuovo film
            const query = "UPDATE films set watchdate = null";
    
            // Esegui la query per inserire il nuovo film nel database
            const result = await new Promise((resolve, reject) => {
                database.run(query, function(err) {
                    if (err) {
                        reject(err); // Se c'è un errore, rifiuta la Promise
                    } else {
                        resolve(this.lastID); // Restituisci l'ID del film appena inserito
                    }
                });
            });
    
            // Verifica se l'inserimento è stato eseguito correttamente
            if (result) {
                console.log(`Film "${id}" modificato con successo con ID ${result}.`);
            } else {
                console.log("Errore durante la modifica del film.");
            }
        } catch (err) {
            console.error("Errore durante la modifica del film nel database:", err);
        }
    };
    
}

// Creazione di film
let f1 = new Film(1, "Pulp Fiction", true, dayjs('2023-03-10'), 5);
let f2 = new Film(2, "21 Grams", true, dayjs('2023-03-17'), 4);
let f3 = new Film(3, "Star Wars", false);
let f4 = new Film(4, "Matrix", false);
let f5 = new Film(5, "Shrek", false, dayjs('2023-03-21'), 3);

// Creazione di FilmLibrary
let l1 = new FilmLibrary();
l1.addNewFilm(f1);
l1.addNewFilm(f2);
l1.addNewFilm(f3);
l1.addNewFilm(f4);
l1.addNewFilm(f5);

// Esegui la funzione asincrona per ottenere i film dal DB
async function loadFilms() {
    await l1.getApp();
    l1.see(); // Visualizza i film caricati dal DB
}

async function loadFavorite() {
    await l1.getFavorite();
    l1.see(); // Visualizza i film caricati dal DB
}

async function loadToday() {
    await l1.getToday();
    l1.see();
}

async function loadBefore(){
    await l1.getBefore("2023-03-18");
    l1.see();
}

async function loadRating(){
    await l1.getRating(5);
    l1.see();
}

async function loadTitle(){
    await l1.getNaming("ram");
    l1.see();
}

async function StoreFilm(){
    await l1.Store("akuna Matata", true);
    await l1.getApp();
    l1.see();
}

async function DeleteFm(){
    await l1.Delete(21);
    await l1.getApp();
    l1.see();
}

async function UpdateFM(){
    await l1.Update();
    await l1.getApp();
    l1.see();
}
// loadFilms();
// loadFavorite();
// loadToday();
// loadBefore();
UpdateFM();