
const api = 'https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php';
const plays = JSON.parse(play_list);
/*
 To get a specific play, add play's id property (in plays.json) via query string, 
   e.g., url = url + '?name=hamlet';
 
 https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php?name=hamlet
 https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php?name=jcaesar
 https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php?name=macbeth
 
 NOTE: Only a few plays have text available. If the filename property of the play is empty, 
 then there is no play text available.
*/
 

/* note: you may get a CORS error if you test this locally (i.e., directly from a
   local file). To work correctly, this needs to be tested on a local web server.  
   Some possibilities: if using Visual Code, use Live Server extension; if Brackets,
   use built-in Live Preview.
*/

document.addEventListener("DOMContentLoaded", () => {
  const list = document.querySelector("#playList ul");
  const sortMethod = document.querySelector("#sort_method");
  const title = document.querySelector("#Synopsis h2");
  const synop = document.querySelector("#Synopsis p");
  const viewBtn = document.querySelector("#btnViewText");
  const date = document.querySelector("#DoC");
  const genre = document.querySelector("#genre");
  const wiki = document.querySelector("#wiki");
  const gutenberg = document.querySelector("#gutenberg");
  const shakespeare_org = document.querySelector("#shakespeareOrg");
  const description = document.querySelector("#description");
  const synopsisInfo = document.querySelector("#Synopsis");
  const playInfo = document.querySelector("#playInfo");
  const textSelect = document.querySelector("#text-select");
  const playText = document.querySelector("#PlayText");

  sortListByName();
  updateList(list);

  // Sort play list based on radio button selection
  sortMethod.addEventListener("input", (e) =>{
    if(e.target.id == "sort_name") {
      sortListByName();
      updateList(list);
    } else {
      sortListByDate();
      updateList(list);
    }
  })

  // Display play infor on text
  list.addEventListener("click", (e) => {
    e.stopPropagation();
    if(e.target.nodeName == "LI") {
      list.querySelectorAll("li").forEach(li => {li.classList.remove("active")});
      e.target.classList.add("active");

      show(synopsisInfo);
      show(playInfo);
      hide(textSelect);
      hide(playText);

      const match = plays.find(p => p.id === e.target.dataset.id);
      
      // Populate column 2
      title.textContent = match.title;
      synop.textContent = match.synopsis;
      if(match.filename != "") {
        show(viewBtn);
        viewBtn.setAttribute("data-id", e.target.dataset.id);
      } else {
        hide(viewBtn);
      }

      // Populate column 3
      date.textContent = match.likelyDate;
      genre.textContent = match.genre;
      wiki.textContent = match.wiki;
      gutenberg.textContent = match.gutenberg;
      shakespeare_org.textContent = match.shakespeareOrg;
      description.textContent = match.desc;

    }
  })

  viewBtn.addEventListener("click", (e) => {
    hide(synopsisInfo);
    hide(playInfo);
    show(textSelect);
    show(playText);

    

  })
});

// Sorts plays alphabetically by title
// https://www.javascripttutorial.net/array/javascript-sort-an-array-of-objects/
function sortListByName(){
  plays.sort((a, b) => {
    let fa = a.title.toLowerCase(),
        fb = b.title.toLowerCase();

    if (fa < fb) return -1; 
    if (fa > fb) return 1; 
    return 0;
  });
}

// Sorts plays by date (oldest to newest)
function sortListByDate(){
  plays.sort((a, b) => {return a.likelyDate - b.likelyDate});
}

// Updates play list
function updateList(parent){
  parent.textContent = "";
  plays.forEach(p => {
    const li = document.createElement("li");
    li.setAttribute("data-id", p.id);
    li.textContent = p.title;
    if(p.filename != "") {
      const icon = document.createElement("i");
      // icon from: https://fontawesome.com/v5.15/icons/book-reader?style=solid
      icon.classList.add("fas");
      icon.classList.add("fa-book-reader");
      li.appendChild(icon);
    }
    
    parent.appendChild(li);
  })
}

function show(element) {
  element.classList.remove("hidden");
  element.classList.add("visible");
}

function hide(element) {
  element.classList.remove("visible");
  element.classList.add("hidden");
}