// reteriving session details and thus the passed array from homepage 
var storageString = localStorage.getItem('MovieArray');
var myListArray = JSON.parse(storageString);

const TMDB_API_KEY = 'api_key=e6ce7474f5f05c04bdde01559cfc7c49';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';



myListArray.forEach(async id =>{
    let id_query = `/movie/${id}?language=en-US&`;
    let final_url = TMDB_BASE_URL+id_query+TMDB_API_KEY;
    await apiFunctionCall(final_url, id);
});


function apiFunctionCall(final_url, id){
    const xhr = new XMLHttpRequest();
    xhr.open('get', final_url)
    xhr.send();
    xhr.onload = function() {
        var resp = xhr.response;
        var jsonResp = JSON.parse(resp);
        renderListItems(jsonResp, id);
    }
}


function renderListItems(jsonResp, id){
    var eachListItem = document.createElement('div');
    eachListItem.classList.add('list-item');
    eachListItem.innerHTML = `
        <div class="movie-details">
            <div class="thumbnail">
                <img src=${TMDB_IMAGE_BASE_URL+jsonResp.poster_path} alt="Thumbnail">
            </div>
                <div class="title">
                    <a href="moviePage.html?id=${id}"> ${jsonResp.title} </a> 
                    <span> | <b><i class="fas fa-clock"></i></b> ${jsonResp.runtime} | Popularity: ${jsonResp.popularity}</span>
                </div>
                
        </div>
        <div class="remove-movie" id='${id}' onclick="deleteItemFromList(${id})">
            <i class="far fa-trash-alt"></i>
        </div>
    `; 
    document.getElementById('list-container').appendChild(eachListItem);
}


// clear localStorage
document.getElementById('clear-whole-list').addEventListener('click', function() {
    if (window.confirm('Clear Whole List?')) {
        localStorage.clear();
        window.location.reload();
    }
});



//delete a specific movie from list
async function deleteItemFromList(id) {
    if (window.confirm('Delete Movie from List?')) {
        console.log(id);
        var tempArr = await JSON.parse(localStorage.getItem('MovieArray'));
        var index = await tempArr.indexOf(id.toString());
        await tempArr.splice(index,1);
        await localStorage.setItem('MovieArray', JSON.stringify(tempArr));
        await window.location.reload();
    }
}