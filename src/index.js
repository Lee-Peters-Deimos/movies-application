/**
 * es6 modules and imports

 /**
 * require style imports
 */
import getMovies from './api.js';
import addMovie from './add.js';

let globalID = 0;
let allMovies = [];
getMovies().then((movies) => {
    movies.forEach(({title, rating, id, image, genre, director, date, duration}) => {
        globalID++;
        let movieCards = ('<div class="card col-3 card-flip h-100">' +
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
            '<button type="button" class="editButton btn btn-warning" id="' + id + '" data-toggle="modal" data-target=".editModal">Edit</button>' +
            '<button type="button" class="deleteButton btn btn-danger" id="' + id + '" data-toggle="modal" data-target=".deleteModal">Delete</button></div></div></div>');
        $('.loader').css('visibility', 'hidden');
        allMovies.push(movieCards);
        $('.movieList').append(movieCards);
    });
}).catch((error) => {
    alert('Oh no! Something went wrong.\nCheck the console for details.');
    console.log(error);
});
$(".submitAdd").click(function () {
    $('.addModal').modal('hide');
    let addTitle = $('#addTitle').val();
    globalID++;
    $('#addTitle').val("");
    let movieId = 0;
    let poster = "";
    let addGenre = "";
    let addDirector = "";
    let addRating = 0;
    let addRuntime = 0;
    let addRelease = "";
    let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    addRating = $("input[name='radio-rating']:checked").val();
    addMovie(addTitle).then((movie) => {
        poster = movie.results[0].poster_path;
        movieId = movie.results[0].id;
    }).then(function () {
      fetch('https://api.themoviedb.org/3/movie/' + movieId + '?api_key=fa451fae68a99b5a7395924b21e6394e')
            .then(response => response.json()).then((movie) => {
            addGenre = movie.genres[0].name;
            addRuntime = movie.runtime;
            let newRelease = movie.release_date;
            newRelease = newRelease.split("-");
            addRelease = month[newRelease[1] - 1] + " " + newRelease[2] + ", " + newRelease[0];

        }).then(function () {
            fetch('https://api.themoviedb.org/3/movie/' + movieId + '/credits?api_key=fa451fae68a99b5a7395924b21e6394e')
                .then(response => response.json()).then((movie) => {
                for (let i = 0; i < movie.crew.length; i++) {
                    if (movie.crew[i].job === "Director") {
                        addDirector = movie.crew[i].name;
                        break;
                    }
                }


            })
                .then(() => {
                    const movie = {
                        title: addTitle,
                        rating: addRating,
                        id: globalID,
                        image: "https://image.tmdb.org/t/p/original" + poster,
                        genre: addGenre,
                        director: addDirector,
                        date: addRelease,
                        duration: addRuntime + " minutes"
                    };
                    const url = '/api/movies';
                    const options = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(movie),
                    };
                    fetch(url, options)
                        .then(() => {
                            $('.movieList').empty();
                            $('.loader').css('visibility', 'visible');
                            getMovies().then((movies) => {
                                movies.forEach(({title, rating, id, image, genre, director, date, duration}) => {
                                    let movieCards = ('<div class="card col-3 card-flip h-100">' +
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
                                        '<button type="button" class="editButton btn btn-warning" id="' + id + '" data-toggle="modal" data-target=".editModal">Edit</button>' +
                                        '<button type="button" class="deleteButton btn btn-danger" id="' + id + '" data-toggle="modal" data-target=".deleteModal">Delete</button></div></div></div>');
                                    $('.loader').css('visibility', 'hidden');
                                    $('.movieList').append(movieCards);
                                });
                            });
                        });
                });
        });
    });
});
$(document).on("click", '.editButton', function () {
    let id = $(this).attr('id');
    return fetch('/api/movies/' + id)
        .then(response => response.json()).then((movie) => {
            $('#editTitle').val(movie.title);
            $('#editRating').val(movie.rating);
            $('#editGenre').val(movie.genre);
            $('#editRelease').val(movie.date);
            $('#editDirector').val(movie.director);
            $('#editRuntime').val(movie.duration);
            $('.editId').text(movie.id);
            $('.editImage').text(movie.image);
        });
});

$('.submitEdit').click(function () {
    $('.editModal').modal('hide');
    let movie = {};
    if ($('.editId').text() > 12) {
        movie = {
            title: $('#editTitle').val(),
            rating: $('#editRating').val(),
            id: $('.editId').text(),
            image: $('.editImage').text(),
            genre: $('#editGenre').val(),
            director: $('#editDirector').val(),
            date: $('#editRelease').val(),
            duration: $('#editRuntime').val()
        };
    } else {
        movie = {
            title: $('#editTitle').val(),
            rating: $('#editRating').val(),
            id: $('.editId').text(),
            image: $('.editImage').text(),
            genre: $('#editGenre').val(),
            director: $('#editDirector').val(),
            date: $('#editRelease').val(),
            duration: $('#editRuntime').val()
        };
    }
    const url = '/api/movies/' + $('.editId').text();
    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movie),
    };
    fetch(url, options)
        .then(() => {
            $('.movieList').empty();
            $('.loader').css('visibility', 'visible');
            getMovies().then((movies) => {
                movies.forEach(({title, rating, id, image, genre, director, date, duration}) => {
                    let movieCards = ('<div class="card col-3 card-flip h-100">' +
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
                        '<button type="button" class="editButton btn btn-warning" id="' + id + '" data-toggle="modal" data-target=".editModal">Edit</button>' +
                        '<button type="button" class="deleteButton btn btn-danger" id="' + id + '" data-toggle="modal" data-target=".deleteModal">Delete</button></div></div></div>');
                    $('.loader').css('visibility', 'hidden');
                    $('.movieList').append(movieCards);
                });
            });
        });
});

$(document).on("click", '.deleteButton', function () {
    let id = $(this).attr('id');
    $('.deleteId').text(id);
});


$('.submitDelete').click(function () {
    $('.deleteModal').modal('hide');
    let id = $('.deleteId').text();
    console.log(id);
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    fetch('api/movies/' + id, options)
        .then(() => {
            $('.movieList').empty();
            $('.loader').css('visibility', 'visible');
            getMovies().then((movies) => {
                movies.forEach(({title, rating, id, image, genre, director, date, duration}) => {
                    let movieCards = ('<div class="card col-3 card-flip h-100">' +
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
                        '<button type="button" class="editButton btn btn-warning" id="' + id + '" data-toggle="modal" data-target=".editModal">Edit</button>' +
                        '<button type="button" class="deleteButton btn btn-danger" id="' + id + '" data-toggle="modal" data-target=".deleteModal">Delete</button></div></div></div>');
                    $('.loader').css('visibility', 'hidden');
                    $('.movieList').append(movieCards);
                });
            });
        });
});




