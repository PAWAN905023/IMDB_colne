const searchInputElement = document.getElementById("search-input");
const searchList = document.getElementById("search-list");
const moviesGrid = document.getElementById("result-grid");
const myfev = document.getElementById('my-favourite');
let likes = JSON.parse(localStorage.getItem('likes')) || [];

//function to fetch movies Title on search element
async function fetchMoviesTitles(searchInput){
    const res = await fetch(`https://omdbapi.com/?s=${searchInput}&page=1&apikey=14048653`);
    const resData = await res.json();
    if(resData.Response == "True"){
        showSearchList(resData.Search);
    }
}
//function to take input from search element and give it to fetchMoviesTitle()
function searchMovies(){
    let searchInput = (searchInputElement.value).trim();
    if(searchInput.length > 0){
        searchList.classList.remove('search-list-hide');
        fetchMoviesTitles(searchInput);
    }else{
        searchList.classList.add('search-list-hide');
    }
}
// function to show search results on search element
function showSearchList(results){
    moviesGrid.innerHTML = "";
    searchList.innerHTML = "";
    for(let i = 0 ; i < results.length; i++){
        let searchListItem = document.createElement('div');
        searchListItem.dataset.id = results[i].imdbID;
        // Movie Id in data-id
        searchListItem.classList.add('list-item');
        if(results[i].Poster != "N/A"){
            moviePoster = results[i].Poster;
        }else{
            moviePoster = "src/image-not-found.jpg";
            
        }
        searchListItem.innerHTML = `
            <div id="list-item" class = "list-item" >
                <div id="item-thumb">
                    <img src = "${moviePoster}">
                </div>
                <div class = "item-info">
                    <h3>${results[i].Title}</h3>
                    <p>${results[i].Year}</p>
                </div>
            </div>
            `;
        searchList.appendChild(searchListItem);
    }
    fetchMovieDetails();
}
// function to fetch single movie details and send it to displayMoviesDisplay()
function fetchMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async function  load() {
                searchList.classList.add('search-list-hide');
                searchInputElement.value = "";
                fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=94397865`)
                .then((response) => response.json())
                .then((data) => {
                displayMovieDetails(data);
                });
                
            });
        
    });

}
// function to display single movie on result grid 
function displayMovieDetails(details){

    moviesGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
        <div id ="like">
            <img class = "like-icon" id = "like-icon"  src="src/like.png" alt="">
        </div>
    </div>
    `;
    let like = document.getElementById('like-icon');
    console.log(like);
    like.addEventListener('click',function(){
        like.style.backgroundColor = "darkred";
        likes.push(details);
        saveList();
    })
}
// function to save Liked movies details in local storage of browser
function saveList(){
    localStorage.setItem('likes', JSON.stringify(likes));
}
// function to display Liked Movies on result grid from local storage
function displayLikes(){
    if(likes.length != 0){
        myfev.style.border = "2px solid black"
        moviesGrid.innerHTML = "";
        for(var i = 0 ; i<likes.length ; i++){
            const likeItem = document.createElement('div');

            likeItem.innerHTML = `
            <div class = "movie-poster">
                <img src = "${(likes[i].Poster != "N/A") ? likes[i].Poster : "image_not_found.png"}" alt = "movie poster">
            </div>
            <div class = "movie-info">
                <h3 class = "movie-title">${likes[i].Title}</h3>
                <ul class = "movie-misc-info">
                    <li class = "year">Year: ${likes[i].Year}</li>
                    <li class = "rated">Ratings: ${likes[i].Rated}</li>
                    <li class = "released">Released: ${likes[i].Released}</li>
                </ul>
                <p class = "genre"><b>Genre:</b> ${likes[i].Genre}</p>
                <p class = "writer"><b>Writer:</b> ${likes[i].Writer}</p>
                <p class = "actors"><b>Actors: </b>${likes[i].Actors}</p>
                <p class = "plot"><b>Plot:</b> ${likes[i].Plot}</p>
                <p class = "language"><b>Language:</b> ${likes[i].Language}</p>
                <p class = "awards"><b><i class = "fas fa-award"></i></b> ${likes[i].Awards}</p>
                <div id ="like">
                    <img class = "bin-icon" id = "bin-icon" data-id = "${likes[i].imdbID}" src="src/bin.png" alt="">
                </div>
            </div>
            `;
            likeItem.style.margin = "1rem 0rem";
            likeItem.style.border = "2px solid black";
            moviesGrid.appendChild(likeItem);
            let bin = document.getElementsByClassName('bin-icon');
            for(let j = 0 ; j<bin.length ; j++){
                bin[j].addEventListener('click',function(event){
                    deleteLike(event.target.getAttribute('data-id'));
                })
            }

        }
    }else{
        alert('My Favourite is empty');
        moviesGrid.innerHTML = "";
    }
}
// function to delete a liked movie from local storage and display the remainig list to result grid
function deleteLike(movieId){
    let newlikes = likes.filter(function(task) {
        return task.imdbID !== movieId;
    })
    likes = newlikes;
    saveList();
    displayLikes();
}
// event listenet for search element
window.addEventListener('click', (event) => {
    if(event.target.className != "search-input"){
        searchList.classList.add('search-list-hide');
    }else{
        myfev.style.border = "0px";
        document.getAnimations('search-element').border = "2px solid black"
    }
});
// event listener for my fev element
myfev.addEventListener('click',displayLikes)



