'use strict';

/* Data Access Object (DAO) module for accessing films data */

const dayjs = require("dayjs");
const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('films.db', (err) => {
  if (err) throw err;
});

exports.FilmsList = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM films", (err, rows) => {
            if (err) {
                reject(err); // Se c'è un errore, rifiuta la Promise
            } else {
                resolve(rows); // Risolvi la Promise con i risultati
            }
        });
    });
}

exports.FilmsId = (id) => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM films WHERE id == ?", id, (err, rows) => {
            if (err) {
                reject(err); // Se c'è un errore, rifiuta la Promise
            } else {
                resolve(rows); // Risolvi la Promise con i risultati
            }
        });
    });
}

exports.NewFilm = (film) => {
    return new Promise((resolve, reject) => {
        console.log(film);
        console.log(film.watchDate);
        const query = "INSERT INTO films (title, favorite, watchDate, rating) VALUES (?, ?, ?, ?)";
        db.run(query, [film.title, film.favorite ? 1 : 0, dayjs(film.watchDate).format('YYYY-MM-DD'), film.rating], function (err) {
            if (err) {
                reject(err); // Se c'è un errore, rifiuta la Promise
            } else {
                resolve(this.lastID); // this.changes indica il numero di righe eliminate
            }
        });
    });
};

exports.DeleteFilm = (id) => {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM films WHERE id = ?", id, function (err) {
            if (err) {
                reject(err); // Se c'è un errore, rifiuta la Promise
            } else {
                resolve({ deletedRows: this.changes }); // this.changes indica il numero di righe eliminate
            }
        });
    });
};

exports.UpdateFavorite = (id, favorite) => {
    return new Promise((resolve, reject) => {
        // Imposta il valore: 1 per favorite, 0 altrimenti
        db.run("UPDATE films SET favorite = ? WHERE id = ?", [favorite ? 1 : 0, id], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({ updatedRows: this.changes });
            }
        });
    });
};

exports.UpdateRating = (id, deltaStr) => {
    return new Promise((resolve, reject) => {
        // Converte la stringa delta (es. "+1" o "-1") in un numero intero
        const delta = parseInt(deltaStr, 10);
        if (isNaN(delta)) {
            return reject(new Error("Valore delta non valido"));
        }
        const query = `
            UPDATE films 
            SET rating = rating + ?
            WHERE id = ? AND rating IS NOT NULL
        `;
        db.run(query, [delta, id], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({ updatedRows: this.changes });
            }
        });
    });
};


exports.GetFilteredFilms = (filter) => {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM films";
        let params = [];

        switch (filter) {
            case "favorite":
                query += " WHERE favorite = true";
                break;
            case "best":
                query += " WHERE rating = 5";
                break;
            case "lastmonth":
                const lastMonthDate = dayjs().subtract(30, 'day').format("YYYY-MM-DD");
                query += " WHERE watchdate >= ?";
                params.push(lastMonthDate);
                break;
            case "unseen":
                query += " WHERE watchdate IS NULL";
                break;
            default:
                break; // Se il filtro non è riconosciuto, restituisce tutti i film
        }

        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

exports.UpdateFilm = (id, newData) => {
    return new Promise((resolve, reject) => {
      // 1. Recupera il film esistente
      db.get("SELECT * FROM films WHERE id = ?", [id], (err, film) => {
        if (err) {
          return reject(err);
        }
        if (!film) {
          return reject(new Error("Film non trovato"));
        }
  
        // 2. Crea l'oggetto aggiornato: sovrascrive i campi solo se forniti in newData
        const updatedFilm = {
          title: newData.title !== undefined ? newData.title : film.title,
          // Se favorite arriva come booleano, lo trasformiamo in 0/1 (assumendo che il DB lo gestisca come intero)
          favorite: newData.favorite !== undefined ? (newData.favorite ? 1 : 0) : film.favorite,
          // Per la data, se non fornita, manteniamo quella esistente
          watchDate: newData.watchDate !== undefined ? newData.watchDate : film.watchDate,
          rating: newData.rating !== undefined ? newData.rating : film.rating
        };
  
        // 3. Esegui l'UPDATE nel database
        const query = `
          UPDATE films 
          SET title = ?, favorite = ?, watchDate = ?, rating = ?
          WHERE id = ?
        `;
        db.run(query, [updatedFilm.title, updatedFilm.favorite, updatedFilm.watchDate, updatedFilm.rating, id], function(err) {
          if (err) {
            return reject(err);
          }
          resolve({ updatedRows: this.changes });
        });
      });
    });
  };
  