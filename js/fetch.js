//Variables
let countSeeMore = 12;
let countID = 0;
let auxExtractLastDigitSearch = 0;



/* Even Listener     */
document.getElementById("btnSearch").addEventListener("click", init);

document.getElementById("btnSeeMore").addEventListener("click", seeMore);

document.getElementById("search").addEventListener('keyup', onKeyUp);

document.getElementById('btnClose').addEventListener('click', clearSuggest);

document.getElementById('search').addEventListener('keyup', suggestSearch);


/* ____________________________________________ */
/*                                    FUNCIONES DE BUSQUEDA DE GIF - BTN_LUPA BTN_VER_MAS                                               */

/* funcion de busqueda inicial*/
function init() {


    document.getElementById('noFound').classList.remove('styleNoFound');
    document.getElementById('noFound').classList.add('hidden');

    let url = `https://api.giphy.com/v1/gifs/search?api_key=${APIKEY}&limit=12&offset=0&q=`;
    let str = document.getElementById("search").value;
    url = url.concat(str);
    
    fetch(url).then(response => response.json()).then(content => {
            
            if (content.data != "") {
                try {
                    document.getElementById('sectionSearch').classList.remove('hidden');
                    document.getElementById('searchIndex').innerText = "";
                    document.getElementById('h2SectionSearch').innerText = document.getElementById("search").value;

                    createImgSearch(content, countID);

                    document.getElementById("btnSearch").disabled = true;
                } catch (error) {
                    console.log(error);
                }
            } else {
                console.log('No hay GIF para la palabra buscada: ' + document.getElementById('search').value);
                showMessageNoFound();
            }

        })
        .catch(err => {
            console.error(err);
        });
}

/* Event Listener boton ver más*/
function seeMore() {

    document.getElementById('noFound').classList.remove('styleNoFound');
    document.getElementById('noFound').classList.add('hidden');


    let url = `https://api.giphy.com/v1/gifs/search?api_key=${APIKEY}&limit=12&offset=${countSeeMore}&q=`;
    let str = document.getElementById("search").value;
    url = url.concat(str);


    countSeeMore += 12;


    fetch(url).then(response => response.json()).then(content => {
            if (content.data != "") {
                try {
                    document.getElementById('sectionSearch').style.display = 'block';
                    document.getElementById('h2SectionSearch').innerText = document.getElementById("search").value;

                    countID += 12;

                    createImgSearch(content, countID);

                } catch (error) {
                    console.log('No hay más imagenes');
                    console.log(error);
                }
            } else {
                console.log('No hay GIF para la palabra buscada: ' + document.getElementById('search').value);
                showMessageNoFound();
            }
        })
        .catch(err => {
            console.error(err);
        });

}


function createImgSearch(content, countID) {
    for (var i = 0; i < 12; i++) {
        let img = document.createElement('img');
        img.setAttribute('id', `imgGIF${countID}`);
        img.src = content.data[i].images.original.url;
        img.alt = content.data[i].title;

        let pUser = document.createElement('p');
        pUser.innerText = "User";
        pUser.setAttribute('class', 'pUser');
        let pTitle = document.createElement('p');
        pTitle.innerText = content.data[i].title;
        pTitle.setAttribute('class', 'pTitle');


        /* Crear iconos Favoritos, Descarga y Maximizar */
        let imgFavorite = document.createElement('img');
        imgFavorite.setAttribute('id', `imgFav${countID}`);
        imgFavorite.src = "./img/icon-fav-hover.svg";
        imgFavorite.setAttribute('onclick', 'addFavorites(this)');
        imgFavorite.setAttribute('class', 'icon imgFavorite');

        let imgDownload = document.createElement('img');
        imgDownload.setAttribute('id', `imgDow${countID}`);
        imgDownload.src = "./img/icon-download.svg";
        imgDownload.setAttribute('onclick', 'download(this)');
        imgDownload.setAttribute('class', 'icon imgDownload');

        let imgFullSize = document.createElement('img');
        imgFullSize.setAttribute('id', `imgFul${countID}`);
        imgFullSize.src = "./img/icon-max.svg";
        imgFullSize.setAttribute('onclick', 'fullScreen(this)');
        imgFullSize.setAttribute('class', 'icon imgFullSize');

        /* Agregar imagenes al div */
        let div = document.createElement('div');
        div.setAttribute('class', 'containerImg imgHover');
        div.setAttribute('id', `divGif${countID}`);

        div.appendChild(img); /* Agregar imagen buscada */
        div.appendChild(imgFavorite); /* Agregar icono Favorito <3*/
        div.appendChild(imgDownload); /* Agregar icono Descargar */
        div.appendChild(imgFullSize); /* Agregar icono Pantalla completa */
        div.appendChild(pUser); /* Agregar texto usuario */
        div.appendChild(pTitle); /* Agregar Titulo Gif */


        /* Agregar div a la seccion */
        let out = document.getElementById('searchIndex');
        out.appendChild(div);

        countID++;
    }
}

/* ____________________________________________ */
/*                                                          FUNCIONALIDADES                                                             */

/* Habilitar div de busqueda no encontrada */
function showMessageNoFound() {
    let divNofound = document.getElementById('noFound');
    divNofound.classList.remove('hidden');
    divNofound.classList.add('styleNoFound');
    document.getElementById('noFoundH2').innerText = document.getElementById('search').value;
    document.getElementById('sectionSearch').classList.add('hidden')
}


/* Desactivar el boton de busqueda una vez cambie el input */
document.getElementById("search").addEventListener('change', inputChange => {
    document.getElementById("btnSearch").disabled = false;
});


/* ____________________________________________ */
/*                                                          ALMACENAR LOCAL STORAGE                                                     */
var arrayFavorites = [];

var arrFav = JSON.parse(localStorage.getItem("sendFavorites"));
console.log(arrFav);
if (arrFav != null) {
    arrayFavorites = arrFav;
}


function addFavorites(iconFavorite) {

    let idImgHtml = iconFavorite.id;
    let extractLastDigit = idImgHtml.slice(6, idImgHtml.length);
    let tagGif = document.getElementById(`imgGIF${extractLastDigit}`);
    arrayFavorites.push(tagGif.src);
    
    
    
    localStorage.setItem('sendFavorites', JSON.stringify(arrayFavorites));
}

/* ____________________________________________ */

function onKeyUp(event) {
  /*   document.getElementById('ilustraheader').classList.add('hidden'); */

    var keycode = event.keyCode;
    if (keycode == '13') {
        document.getElementById('searchIndex').innerText = "";
        countSeeMore = 12;
        init();
    }
}


function suggestSearch() {

    let keyword = document.getElementById('search').value;
    if (keyword) {
        
    const endpoint = `https://api.giphy.com/v1/gifs/search/tags?api_key=${APIKEY}&q=${keyword}`; 

        fetch(endpoint)
            .then(response => response.json())
            .then(data => {

                var ulSearch = document.getElementById('ulSearch');
                ulSearch.innerHTML = "";
                ulSearch.classList.add('ulShow');

                for (var i = 0; i < 4; i++) {
                    let li = document.createElement('li');
                    li.innerText = data.data[i].name;
                    li.setAttribute('onclick', 'completeInput(this)')
                    ulSearch.appendChild(li);
                }
                
            })

            .catch (e => {console.log('Gif no existe')});
        document.getElementById('btnClose').classList.remove('btnCloseHidden');

        let containerInpImg = document.getElementById('containerInpImg');
        containerInpImg.classList.add('orderInpImg');
      

        document.getElementById('subtitleTrending').classList.add('hidden');
        document.getElementById('descriptionTrending').classList.add('hidden');

        document.getElementById('sectionMain').classList.add('hiddenTitleImg');


    } else {
        clearSuggest();
    }

}

function completeInput(valueLi) {
    let inputSearch = document.getElementById('search');
    inputSearch.value = valueLi.innerText;
    init();
    clearSuggest(false);
}

function clearSuggest(clear = true) {
    ulSearch.innerHTML = "";
    ulSearch.classList.remove('ulShow');
    document.getElementById('search').value = clear ? "" : document.getElementById('search').value;
    document.getElementById('containerInpImg').classList.remove('orderInpImg');
    document.getElementById('btnClose').classList.add('btnCloseHidden');
    document.getElementById('subtitleTrending').classList.remove('hidden');
    document.getElementById('descriptionTrending').classList.remove('hidden');
    document.getElementById('noFound').classList.add('hidden');
    document.getElementById('noFound').classList.remove('styleNoFound');
    document.getElementById('sectionMain').classList.remove('hiddenTitleImg');
    document.getElementById('sectionSearch').classList.add('hidden');
}



function closeFullScreen() {
    document.getElementById('divFullScreen').innerHTML = "";
    document.getElementById('divFullScreen').classList.add('hidden');
    document.getElementById('divFullScreen').classList.remove('styleFullScreen');
}

function fullScreen(iconFullScreen) {


    let idImgFullScreen = iconFullScreen.id;
    let extractLastDigit = idImgFullScreen.slice(6, idImgFullScreen.length);
    let imgFullScreenSrc = document.getElementById(`imgGIF${extractLastDigit}`).src;

    let imgClose = document.createElement('img');
    imgClose.src = './img/close.svg';
    imgClose.classList.add('styleClose');
    imgClose.setAttribute('onclick', 'closeFullScreen()');


    /* CONTENEDOR CON IMAGEN Y FLECHAS - SIGUIENTE ANTERIOR *******************/

    let btnBack = document.createElement('img');
    btnBack.src = './img/button-left.svg';
    btnBack.setAttribute('class', 'btnBack');
    btnBack.setAttribute('onclick', 'backGifFullScreen()');


    let imgFullScreen = document.createElement('img');
    imgFullScreen.src = imgFullScreenSrc;
    imgFullScreen.classList.add('styleImgFullScreen');
    imgFullScreen.setAttribute('id','ImgFullScreen');

    let btnNext = document.createElement('img');
    btnNext.src = './img/button-right.svg';
    btnNext.setAttribute('class', 'btnNext');
    btnNext.setAttribute('onclick', 'nextGifFullScreen()');


    let divImgDirection = document.createElement('div');
    divImgDirection.classList.add('styleImgDirection');

    divImgDirection.appendChild(btnBack);
    divImgDirection.appendChild(imgFullScreen);
    divImgDirection.appendChild(btnNext);



    /* CONTENEDOR CON TITULOS Y ICONOS *******************/
    let pUser = document.createElement('p');
    pUser.innerText = "User";

    let getTitle = document.getElementById(`divGif${extractLastDigit}`);
    let sendTitle = getTitle.getElementsByClassName('pTitle')[0].innerText;

    let pTitle = document.createElement('p');
    pTitle.innerText = sendTitle;

    let divText = document.createElement('div');
    divText.classList.add('styleDivText');

    divText.appendChild(pUser);
    divText.appendChild(pTitle);

    let imgFavorite = document.createElement('img');
    imgFavorite.src = "./img/icon-fav-hover.svg";
    imgFavorite.setAttribute('onclick', 'addFavoritesFullScreen(this)');
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

    /* CONTENEDOR PRINCIPAL *********************/
    let divFullScreen = document.getElementById('divFullScreen');
    divFullScreen.classList.add('styleFullScreen');
    divFullScreen.classList.remove('hidden');

    divFullScreen.appendChild(imgClose);
    divFullScreen.appendChild(divImgDirection);
    divFullScreen.appendChild(divDescription);
    document.querySelector('body').appendChild(divFullScreen);


}


async function download(e) {

    let idImgFullScreen = e.id;
    let extractLastDigit = idImgFullScreen.slice(6, idImgFullScreen.length);
    let imgFullScreenSrc = document.getElementById(`imgGIF${extractLastDigit}`).src;

    let a = document.createElement('a');
    let response = await fetch(imgFullScreenSrc);
    let file = await response.blob();
    a.download = e.id;
    a.href = window.URL.createObjectURL(file);
    a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
    a.click();
}

function nextGifFullScreen() {

    auxExtractLastDigitSearch++;
    backOrNextGif();
}

function backGifFullScreen() {

    auxExtractLastDigitSearch--;
    backOrNextGif();

}
function backOrNextGif() {

    let imgNextGif = document.getElementById(`imgGIF${auxExtractLastDigitSearch}`);
    let getTitle = document.getElementById(`divGif${auxExtractLastDigitSearch}`);
    if (getTitle) {
        let sendTitle = getTitle.getElementsByClassName('pTitle')[0].innerText;
        let imgFullScreen = document.getElementById(`imgFullScreen`);
        let getTitleFullScreen = document.getElementsByClassName(`styleDivText`)[0];
        let pTitle = getTitleFullScreen.getElementsByTagName(`p`)[1];

        if (imgNextGif != null) {
            imgFullScreen.src = imgNextGif.src;
            pTitle.innerText = sendTitle;
        }

    } else {
        console.log('No hay más imagenes')
        auxExtractLastDigitSearch = 0;
    }
}
