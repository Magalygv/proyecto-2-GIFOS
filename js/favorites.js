let removeFavFullScreen;
// Obtener el arreglo de localStorage


var arrFav = JSON.parse(localStorage.getItem("sendFavorites"));

function loadContentFav() {
    if(arrFav != null && arrFav != ""){
       
        for (var i = 0; i < arrFav.length; i++) {
            let img = document.createElement('img');
            img.setAttribute('id', `imgGIF${i}`);
            img.src = arrFav[i];

            let pUser = document.createElement('p');
            pUser.innerText = "User";
            pUser.setAttribute('class', 'pUser');
            let pTitle = document.createElement('p');
            /* pTitle.innerText = content.data[i].title; */
            pTitle.innerText = 'Titulo';
            pTitle.setAttribute('class', 'pTitle');


            let imgFavorite = document.createElement('img');
            imgFavorite.setAttribute('id', `imgFav${i}`);
            imgFavorite.src = "./img/icon-fav-active.svg";
            imgFavorite.setAttribute('onclick', 'removeFavorites(this)');
            imgFavorite.setAttribute('class', 'icon imgFavorite');

            let imgDownload = document.createElement('img');
            imgDownload.setAttribute('id', `imgDow${i}`);
            imgDownload.src = "./img/icon-download.svg";
            imgDownload.setAttribute('onclick', 'download(this)');
            imgDownload.setAttribute('class', 'icon imgDownload');

            let imgFullSize = document.createElement('img');
            imgFullSize.setAttribute('id', `imgFul${i}`);
            imgFullSize.src = "./img/icon-max.svg";
            imgFullSize.setAttribute('onclick', 'fullScreen(this)');
            imgFullSize.setAttribute('class', 'icon imgFullSize');

            /* Agregar imagenes al div */
            let div = document.createElement('div');
            div.setAttribute('class', 'containerImg imgHover');
            div.setAttribute('id', `divGif${i}`);

            div.appendChild(img); /* Agregar imagen buscada */
            div.appendChild(imgFavorite); /* Agregar icono Favorito <3*/
            div.appendChild(imgDownload); /* Agregar icono Descargar */
            div.appendChild(imgFullSize); /* Agregar icono Pantalla completa */
            div.appendChild(pUser); /* Agregar texto usuario */
            div.appendChild(pTitle); /* Agregar Titulo Gif */


            /* Agregar div a la seccion */
            let outImg = document.getElementById('outImgFav');
            outImg.appendChild(div);
            
        }   
        document.getElementById('outImgFav').classList.remove('outImgFav');
        document.getElementById('buttonGeneralFavorites').classList.remove('buttonGeneralHidden');

    } else {
        noHaveContent();
    }
}
function noHaveContent(){
   
    document.getElementById('saveFirstGifo').classList = 'saveFirstGifoVisible';
    document.getElementById('outImgFav').classList.toggle('outImgFav');
    document.getElementById('buttonGeneralFavorites').classList.toggle('buttonGeneralHidden');
}

function clearFavorites(){
    localStorage.clear();
    location.reload();
}

function removeFavorites(imageFavorites) {

    let idImgHtml = imageFavorites.id;
    let extractLastDigit = idImgHtml.slice(6, idImgHtml.length);
    console.log(`EL ULTIMO DATO ES ${extractLastDigit}`);

    arrFav.splice(extractLastDigit, 1);
    localStorage.removeItem('sendFavorites');
    localStorage.setItem('sendFavorites', JSON.stringify(arrFav));
    location.reload();

}

async function download(imageFavorites) {

    let idImgHtml = imageFavorites.id;
    let extractLastDigit = idImgHtml.slice(6, idImgHtml.length);
    let tagGIF = document.getElementById(`imgGIF${extractLastDigit}`).src;
   

    let a = document.createElement('a');
    let response = await fetch(tagGIF);
    let file = await response.blob();
    a.download = imageFavorites.id;
    a.href = window.URL.createObjectURL(file);
    a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
    a.click();
}

function fullScreen(iconFullScreen) {

    let idImgFullScreen = iconFullScreen.id;
    let extractLastDigit = idImgFullScreen.slice(6, idImgFullScreen.length);
    auxExtractLastDigitSearch = extractLastDigit;
    let imgFullScreenSrc = document.getElementById(`imgGIF${extractLastDigit}`).src;

    removeFavFullScreen = extractLastDigit ;

    let imgClose = document.createElement('img');
    imgClose.src = './img/close.svg';
    imgClose.classList.add('styleClose'); 
    imgClose.setAttribute('onclick', 'closeFullScreen()');


    /* CONTENEDOR CON IMAGEN Y FLECHAS - SIGUIENTE ANTERIOR *******/

   

    let imgFullScreen = document.createElement('img');
    imgFullScreen.src = imgFullScreenSrc;
    imgFullScreen.classList.add('styleImgFullScreen');
    imgFullScreen.setAttribute('id', `imgFullScreen`);


    let divImgDirection = document.createElement('div');
    divImgDirection.classList.add('styleImgDirection');

  
    divImgDirection.appendChild(imgFullScreen);
    
    /* CONTENEDOR CON TITULOS Y ICONOS *******/
    let pUser = document.createElement('p');
    pUser.innerText = "User";

    let getTitle = document.getElementById(`divGif${extractLastDigit}`);
    let sendTitle = getTitle.getElementsByClassName('pTitle')[0].innerText;

    let pTitle = document.createElement('p');
    pTitle.innerText = sendTitle;

    //div title - user
    let divText = document.createElement('div');
    divText.classList.add('styleDivText')

    divText.appendChild(pUser);
    divText.appendChild(pTitle);

    let imgFavorite = document.createElement('img');
    imgFavorite.src = "./img/icon-fav-active.svg";
    imgFavorite.setAttribute('onclick', 'removeFavoritesFullScreen(this)');
    imgFavorite.setAttribute('class', 'icon imgFavorite');

    let imgDownload = document.createElement('img');
    imgDownload.src = "./img/icon-download.svg";
    imgDownload.setAttribute('onclick', 'downloadFullScreen(this)');
    imgDownload.setAttribute('class', 'icon imgDownload');

    let divDescription = document.createElement('div');
    divDescription.classList.add('styleDivDescription');

    divDescription.appendChild(divText);
    divDescription.appendChild(imgFavorite);
    divDescription.appendChild(imgDownload);
   
    /* CONTENEDOR PRINCIPAL *******/
    let divFullScreen = document.getElementById('divFullScreen');
    divFullScreen.classList.add('styleFullScreen');
    divFullScreen.classList.remove('hidden');

    divFullScreen.appendChild(imgClose);
    divFullScreen.appendChild(divImgDirection);
    divFullScreen.appendChild(divDescription);
    document.querySelector('body').appendChild(divFullScreen);
}
function closeFullScreen() {
    document.getElementById('divFullScreen').innerHTML = "";
    document.getElementById('divFullScreen').classList.add('hidden');
    document.getElementById('divFullScreen').classList.remove('styleFullScreen');
}

function removeFavoritesFullScreen() {

    arrFav.splice(removeFavFullScreen, 1);
    localStorage.removeItem('sendFavorites');
    localStorage.setItem('sendFavorites', JSON.stringify(arrFav));
    location.reload();

}