
const api = 'https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php';
const plays = JSON.parse(play_list);

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

    const id = e.target.dataset.id;
    const play = localStorage.getItem(id);
    if (!play) {
      //fetch
      fetch(`${api}?name=${id}`)
        .then(resp => resp.json())
        .then(data => {
          localStorage.setItem(id, JSON.stringify(data));
          displayPlay(localStorage.getItem(id));
        })
        .catch(error => alert(error));
    } else {
      displayPlay(play);
    }
    
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

function displayPlay(playString){
  //update Act drop downs
  const play = JSON.parse(playString);
  document.querySelector("#interface h2").textContent = play.short;
  document.querySelector("#playHere h2").textContent = play.title;

  populateActsList(play);
  populateScenesList(play);
  populatePlayersList(play, 0, 0);
  populateAct(play, 0);
  populateScene(play, 0, 0);
  
}

function show(element) {
  element.classList.remove("hidden");
  element.classList.add("visible");
}

function hide(element) {
  element.classList.remove("visible");
  element.classList.add("hidden");
}

function populateActsList(play){
  const actList = document.querySelector("#actList");
  play.acts.forEach(a => {
    const opt = document.createElement("option");
    //opt.setAttribute("data-id", a.name);
    opt.textContent = a.name;
    actList.appendChild(opt);
  });
}

function populateScenesList(play){
  const sceneList = document.querySelector("#sceneList");
  play.acts[0].scenes.forEach(s => {
    const opt = document.createElement("option");
    opt.textContent = s.name;
    sceneList.appendChild(opt);
  })
}

function populatePlayersList(play, act, scene){
  const playerList = document.querySelector("#playerList");
  playerList.textContent = ""
  const all = document.createElement("option");
  all.setAttribute("value", 0);
  for(let i=0; i < play.persona.length; i++){
    const opt = document.createElement("option");
    opt.setAttribute("value", i+1);
    opt.textContent = play.persona[i].player;
    playerList.appendChild(opt);
  }
}

function populateAct(play, act){
  document.querySelector("#actHere h3").textContent = play.acts[act].name;
}

function populateScene(play, act, scene){
  document.querySelector("#sceneHere h4").textContent = play.acts[act].scenes[scene].name;
  document.querySelector("#sceneHere p.title").textContent = play.acts[act].scenes[scene].title;
  document.querySelector("#sceneHere p.direction").textContent = play.acts[act].scenes[scene].stageDirection;
  
  const speeches = document.querySelector("#speeches");
  speeches.textContent = "";
  
  play.acts[act].scenes[scene].speeches.forEach(s => {
    const speech = document.createElement("div");
    speech.classList.add("speech");
    
    const speaker = document.createElement("span");
    speaker.textContent = s.speaker;
    speech.appendChild(speaker);
    
    s.lines.forEach(l => {
      const p = document.createElement("p");
      p.textContent = l;
      speech.appendChild(p);
    });
    speeches.appendChild(speech);
  });
  document.querySelector("#sceneHere").appendChild(speeches);
}