const TMDB_API_KEY = 'api_key=e6ce7474f5f05c04bdde01559cfc7c49';

const TMDB_HOME_URL = `https://api.themoviedb.org/3/discover/movie?${TMDB_API_KEY}&include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const TMDB_KIDS_URL = 'https://api.themoviedb.org/3/discover/movie?api_key=e6ce7474f5f05c04bdde01559cfc7c49&certification_country=US&certification.lte=G&with_genres=16&include_adult=false&sort_by=popularity.desc';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';


let movieContainer = document.getElementById('movie-container');
let kidsMoviesBtn = document.getElementById('top-kids-rated');
let webLogo = document.getElementById('logo');
let dropDownMenu = document.getElementById('best-of-year');
let pageHeading = document.getElementById('page-heading');
let myListBtn = document.getElementById('my-list');

let searchInput = document.getElementById('searchMovie');


let prevBtn = document.getElementById('prev-page');
let nextBtn = document.getElementById('next-page');
let pageNo= 1;




// calling function to populate homepage 
apiRequestCall(TMDB_HOME_URL);

//Api request function
function apiRequestCall(url){
    const xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.send();
    xhr.onload = function() {
        // clearing movie-container before populating the div
        movieContainer.innerHTML = "";
        let res = xhr.response;
        //converting response to json
        let conJson = JSON.parse(res);
        //this array will contain 20 movie objects
        let moviesObjArray = conJson.results;
        //function to create and populate our home page
        moviesObjArray.forEach(movie => createMovieElement(movie));
        addMovieToListButtonArray = document.getElementsByClassName('.add-movie-to-list');
  
    }
}


// function to create and populate our home page
function createMovieElement(movie){
    let movieElement = document.createElement('div');
    movieElement.classList.add('movie-element');
    movieElement.innerHTML = `
        <div class="movie-poster">
           <a href="description.html?id=${movie.id}"> <img src= ${TMDB_IMAGE_BASE_URL+movie.poster_path}> </a>
        </div>
        <div class="movie-title">${movie.title}</div>
        <div class="movie-element-tags">
            <div class="movie-rating">
                ${movie.vote_average} <i class="fas fa-star"></i>
            </div>
            <div class="add-movie-to-list"  id="${movie.id}" onclick="addingMovieToList(${movie.id})">
                <i class="fas fa-heart"></i>
            </div>
        </div>
    `;
   
    movieContainer.appendChild(movieElement);
}


webLogo.addEventListener('click',()=>{
    pageHeading.innerHTML = 'Best Popular Movies';
    apiRequestCall(TMDB_HOME_URL);
})


kidsMoviesBtn.addEventListener('click',()=>{
    pageHeading.innerHTML = 'Popular In Kids';
    apiRequestCall(TMDB_KIDS_URL)
})


// array containing id's of all movies which are added to My List
// we will use this array to display content of My List Page
var myMovieList = [];
var oldArray = [];

// adding functionality to Add Movie to list button
function addingMovieToList(buttonID){
    document.getElementById(buttonID).innerHTML = '<i class="fas fa-check"></i>';
    // to add the movie only once into list
    if (!myMovieList.includes(buttonID.toString())) {
        myMovieList.push(buttonID.toString());
    }
    console.log(myMovieList);
    console.log('-------------------------------');
    
    // display toast to confirm user that movie has been added to list
    displayToast();


    //first we need to check if local storafe is empty, if yes then push data directly; if not, then first reterive that data, modify it and then append modified data to localstorage;
    oldArray = JSON.parse(localStorage.getItem('MovieArray'));
    if (oldArray == null) {
        localStorage.setItem('MovieArray', JSON.stringify(myMovieList));
    }
    else{
        // appending only new entries in old array
        myMovieList.forEach(item =>{
            if (!oldArray.includes(item)) {
                oldArray.push(item);
            }
        })
        localStorage.setItem('MovieArray', JSON.stringify(oldArray));
    }
    console.log(oldArray);
}


// toast will be displayed for 2sec
function displayToast(){
    document.getElementById('toasts').style.display = "block";   
    setTimeout(() => {
        document.getElementById('toasts').style.display = "none";
    }, 2000);
}


for (let year = 2023; year>=1999; year--) {
    let menu = document.createElement('option');
    menu.text = year;
    dropDownMenu.add(menu);
}

dropDownMenu.onchange=(()=>{
    let selectedYear = dropDownMenu[dropDownMenu.selectedIndex].text;
    let BEST_MOVIES_OF_YEAR = `/discover/movie?primary_release_year=${selectedYear}&sort_by=popularity.desc&`;
    apiRequestCall(TMDB_BASE_URL+BEST_MOVIES_OF_YEAR+TMDB_API_KEY);

    pageHeading.innerHTML = `Best Movies of ${selectedYear}`;
})

searchInput.addEventListener('keyup', ()=>{
    let searchedIn= searchInput.value;
    console.log(searchedIn);
    let temp_URL= `https://api.themoviedb.org/3/search/movie?${TMDB_API_KEY}&query=${searchedIn}`;
    console.log(temp_URL);
    if(searchedIn.length!=0){
        apiRequestCall(temp_URL);
    }
    else{
        apiRequestCall(TMDB_HOME_URL);
    }
})




prevBtn.disabled = true;
function disablePrvBtn() {
    if (pageNo == 1) {
        prevBtn.disabled = true;
    }
    else{
        prevBtn.disabled = false;
    }
}


nextBtn.addEventListener('click', ()=>{
    pageNo++;
    let temp_URL = `https://api.themoviedb.org/3/discover/movie?${TMDB_API_KEY}&include_adult=false&include_video=false&language=en-US&page=${pageNo}&sort_by=popularity.desc`;
    console.log(temp_URL)
    apiRequestCall(temp_URL);
    disablePrvBtn();
});

prevBtn.addEventListener('click', ()=>{
    if(pageNo == 1){
        return;
    }
    pageNo--;
    let temp_URL=`https://api.themoviedb.org/3/discover/movie?${TMDB_API_KEY}&include_adult=false&include_video=false&language=en-US&page=${pageNo}&sort_by=popularity.desc`;
    apiRequestCall(temp_URL);
    disablePrvBtn();
})