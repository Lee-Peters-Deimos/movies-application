/**
 * es6 modules and imports

 /**
 * require style imports
 */
import getMovies from './api.js';
import addMovie from './add.js';
let globalID = 0;
getMovies().then((movies) => {
  movies.forEach(({title, rating, id, image, genre, director, date, duration}) => {
    globalID++;
    $('.loader').css('visibility', 'hidden');
    $('.movieList').append('' +
        '<div class="card col-3 card-flip h-100">' +
        '<div class="card-front">' +
        '<img src="' + image + '" class="poster"></div>' +
        '<div class="card-back d-flex justify-content-center flex-column">' +
        '<div class="card-body">' +
        '<h5 class="card-title">' + title + '</h5>' +
        '<ul class="list-group list-group-flush">' +
        '<li class="list-group-item">Rating: ' + rating + '</li>' +
        '<li class="list-group-item">Genre: ' + genre + '</li>' +
        '<li class="list-group-item">Director: ' + director + '</li>' +
        '<li class="list-group-item">Release: ' + date + '</li>' +
        '<li class="list-group-item">Run Time: ' + duration + '</li></ul></div>' +
        '<div class="card-footer justify-content-around d-flex">' +
        '<button type="button" class="editButton btn btn-warning">Edit</button>' +
        '<div class="d-none">' + id + '</div>' +
        '<button type="button" class="deleteButton btn btn-danger">Delete</button></div></div></div>');
  });
}).catch((error) => {
  alert('Oh no! Something went wrong.\nCheck the console for details.');
  console.log(error);
});
$(".submitAdd").click(function() {
  $('.addModal').modal('hide');
  let addTitle = $('#addTitle').val();
  globalID++;
  $('#addTitle').val("");
  let movieId = 0;
  let poster = "";
  let addGenre = "";
  let addDirector = "";
  let addRuntime = 0;
  let addRelease = "";
  let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  addMovie(addTitle).then((movie) => {
    poster = movie.results[0].poster_path;
    movieId = movie.results[0].id;
        console.log(movie);
  }).then(function () {
    fetch('https://api.themoviedb.org/3/movie/' + movieId + '?api_key=fa451fae68a99b5a7395924b21e6394e')
        .then(response => response.json()).then((movie) => {
        addGenre = movie.genres[0].name;
        addRuntime = movie.runtime;
        let newRelease = movie.release;
        newRelease = newRelease.split("-");
        addRelease = month[newRelease[1]-1] + " " + newRelease[2] + ", " + newRelease[0];
    });
  }).then(function () {
    fetch('https://api.themoviedb.org/3/movie/' + movieId + '/credits?api_key=fa451fae68a99b5a7395924b21e6394e')
        .then(response => response.json()).then((movie) => {
      console.log(movie);
      for(let i = 0; i < movie.crew.length; i++){
        if(movie.crew.job ==="Director"){
          addDirector = crew.name;
          break;
        }
      }

    });
  });
  $('.movieList').append('' +
      '<div class="card col-3 card-flip h-100">' +
      '<div class="card-front">' +
      '<img src="https://image.tmdb.org/t/p/original/' + poster + '" class="poster"></div>' +
      '<div class="card-back d-flex justify-content-center flex-column">' +
      '<div class="card-body">' +
      '<h5 class="card-title">' + addTitle + '</h5>' +
      '<ul class="list-group list-group-flush">' +
      '<li class="list-group-item">Rating: ' + addRating + '</li>' +
      '<li class="list-group-item">Genre: ' + addGenre + '</li>' +
      '<li class="list-group-item">Director: ' + addDirector + '</li>' +
      '<li class="list-group-item">Release: ' + addRelease + '</li>' +
      '<li class="list-group-item">Run Time: ' + addRuntime + '</li></ul></div>' +
      '<div class="card-footer justify-content-around d-flex">' +
      '<button type="button" class="editButton btn btn-warning">Edit</button>' +
      '<div class="d-none">' + globalID + '</div>' +
      '<button type="button" class="deleteButton btn btn-danger">Delete</button></div></div></div>');
});





