'use strict'

const FILMS = [
    // Data Strucutre: id, title, favorite, watchDate, rating
    [1, "Pulp Fiction", true, "2024-03-10", 5],
    [2, "21 Grams", true, "2024-03-17", 4],
    [3, "Star Wars", false],
    [4, "Matrix", true],
    [5, "Shrek", false, "2024-03-21", 3]
  ];

let FilmList = FILMS.map(e => new Film(...e));



function Film(id, title, isFavorite = false, watchDate, rating = 0) {
    this.id = id;
    this.title = title;
    this.favorite = isFavorite;
    this.rating = rating;
    // saved as dayjs object only if watchDate is truthy
    this.watchDate = watchDate && dayjs(watchDate);

    this.isFavorite =   () => { return this.favorite; }
    this.isBestRated =  () => { return this.rating === 5; }

    this.isSeenLastMonth = () => {
        if(!this.watchDate) return false;         // no watchDate
        const diff = this.watchDate.diff(dayjs(),'month')
        const ret = diff <= 0 && diff > -1 ;      // last month
        return ret;
    }

    this.isUnseen = () => {
        if(!this.watchDate) return true;     // no watchdate
        else return false;
    }
    
    this.toString = () => {
        return `Id: ${this.id}, ` +
        `Title: ${this.title}, Favorite: ${this.favorite}, ` +
        `Watch date: ${this.formatWatchDate('YYYY-MM-DD')}, ` +
        `Score: ${this.formatRating()}`;
    }
  
    this.formatWatchDate = (format) => {
        return this.watchDate ? this.watchDate.format(format) : '<not defined>';
    }
  
    this.formatRating = () => {
        return this.rating ? this.rating : '<not assigned>';
    }
}

function vote(id) {
  // Modify the score corresponding to the id
  FilmList.forEach(e => { if (e.id==id) e.rating+=1 } );
  //alternative:
  //answerList = answerList.map(e => e.id==id? Object.assign({}, e, {score: e.score+1}) : e );

  // Delete the full list
  clearFilm();

  // Recreate the full list starting from the data structure
  createFilmList(FilmList);
}

function clearFilm() {
  const tableBody = document.getElementById('film-lib');
  tableBody.innerHTML = "";  // Be careful using innerHTML for XSS, however with constant strings this is safe
}

function createFilmNode(film) {
  // Create row and store film id
  const newTr = document.createElement('tr');
  newTr.dataset.id = film.id;
  newTr.className = 'align-middle';

  // 2) Title cell
  const titleTd = document.createElement('td');
  titleTd.textContent = film.title;
  newTr.appendChild(titleTd);

  // 3) Favorite cell (star icon)
  const favTd = document.createElement('td');
  const starIcon = document.createElement('i');
  starIcon.className = film.favorite ? 'bi bi-star-fill text-warning' : 'bi bi-star';
  favTd.appendChild(starIcon);
  newTr.appendChild(favTd);

  // 4) Watch date cell
  const dateTd = document.createElement('td');
  dateTd.textContent = film.watchDate ? film.watchDate.format('YYYY-MM-DD') : '';
  newTr.appendChild(dateTd);

  // 5) Rating cell (badge)
  const ratingTd = document.createElement('td');
  if (film.rating > 0) {
    ratingTd.innerHTML = `<span class="badge bg-primary">${film.rating}</span>`;
  }
  newTr.appendChild(ratingTd);

  
  const newButton = document.createElement("button");
  newButton.className = "btn btn-primary";
  newButton.id = film.id;
  newButton.textContent = "Vote";
  newTr.appendChild(newButton);

  newButton.addEventListener('click', event =>  {
      console.log('button pressed, id '+film.id);
      //console.log(event.target);

      //newTd4.innerText = parseInt(newTd4.innerText)+1;
      vote(event.target.id);
  });

  const newButton2 = document.createElement("button");
  newButton2.className = "btn btn-primary";
  newButton2.id = film.id;
  newButton2.textContent = "Delete";
  newTr.appendChild(newButton2);

  newButton2.addEventListener('click', event =>  {
    FilmList = FilmList.filter(f => f.id !== film.id);

    // 2) Svuota e ricrea la tabella
    clearFilm();
    createFilmList(FilmList);
  });


  return newTr;
}

/**
 * Ritorna l’array filtrato in base alla chiave
 */
function applyFilter(filterKey) {
  let filtered;
  switch (filterKey) {
    case 'favorite':
      filtered = FilmList.filter(f => f.isFavorite());
      break;
    case 'best-rated':
      filtered = FilmList.filter(f => f.isBestRated());
      break;
    case 'seen-last-month':
      filtered = FilmList.filter(f => f.isSeenLastMonth());
      break;
    case 'unseen':
      filtered = FilmList.filter(f => f.isUnseen());
      break;
    case 'all':
    default:
      filtered = FilmList;
      break;
  }
  // svuota e ricrea tabella
  clearFilm();
  document.getElementById('active-filter-name').textContent = 
    document.querySelector(`[data-filter="${filterKey}"]`).textContent;
  createFilmList(filtered);
}


function createFilmList(FilmList) {
  //const tableBody = document.querySelector('tbody');
  const tableBody = document.getElementById('film-lib');
  const tr = document.createElement('tr');
  tr.innerHTML = "<th>Title</th> <th>Favorite</th> <th>Date</th> <th>Rating</th> <th>Vote</th><th>Delete</th>"
  tableBody.appendChild(tr);
  for (let film of FilmList) {
      const newRow = createFilmNode(film);
      tableBody.appendChild(newRow);
  }

}

FilmList.forEach(e => console.log(e));
createFilmList(FilmList);

document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('#left-sidebar .list-group-item');
  items.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      // evidenzia active
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      // applica filtro
      applyFilter(item.dataset.filter);
    });
  });
});
