
const api = 'https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php';
const plays = JSON.parse(play_list);

document.addEventListener("DOMContentLoaded", () => {
  const list = document.querySelector("#playList ul");
  const sortMethod = document.querySelector("#sort_method");
  const viewBtn = document.querySelector("#btnViewText");
  const synopsisInfo = document.querySelector("#Synopsis");
  const playInfo = document.querySelector("#playInfo");
  const textSelect = document.querySelector("#text-select");
  const playText = document.querySelector("#PlayText");
  
  // Initial load of play list
  sortListByName();
  updateList(list);

  // Displays author name(me) and course name when hovered
  document.querySelector("#credits").addEventListener("mouseover", () => {
    const credits = document.querySelector("#creditPopup");
    show(credits);
    setTimeout(() => hide(credits), 5000);
  })

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

  // Display play info on li click
  list.addEventListener("click", (e) => {
    e.stopPropagation();
    if(e.target.nodeName == "LI") {
      list.querySelectorAll("li").forEach(li => {li.classList.remove("active")});
      e.target.classList.add("active");

      // show info view
      show(document.querySelector("#Synopsis fieldset"));
      show(document.querySelector("#details"));
      show(synopsisInfo);
      show(playInfo);
      hide(textSelect);
      hide(playText);

      const match = plays.find(p => p.id === e.target.dataset.id);
      
      // Populate column 2 - Play title and Synopsis   
      // include view button if text is available
      document.querySelector("#Synopsis h2").textContent = match.title;
      document.querySelector("#Synopsis p").textContent = match.synopsis;
      if(match.filename != "") {
        show(viewBtn);
        viewBtn.setAttribute("data-id", e.target.dataset.id);
      } else {
        hide(viewBtn);
      }

      // Populate column 3 - Play Information
      document.querySelector("#playInfo h3").textContent = "Play Details:";
      document.querySelector("#DoC").textContent = match.likelyDate;
      document.querySelector("#genre").textContent = match.genre;
      document.querySelector("#description").textContent = match.desc;

      const wiki = document.querySelector("#wiki");
      wiki.setAttribute("href", match.wiki);
      wiki.textContent = "Wikipedia";

      const gut = document.querySelector("#gutenberg");
      gut.setAttribute("href", match.gutenberg);
      gut.textContent = "Gutenberg";

      const sOrg = document.querySelector("#shakespeareOrg"); 
      sOrg.setAttribute("href", match.shakespeareOrg);
      sOrg.textContent = "Shakespeare.org";
    }
  })

  // load play text on click
  viewBtn.addEventListener("click", (e) => {
    // show play text view
    hide(synopsisInfo);
    hide(playInfo);
    show(textSelect);
    show(playText);

    const id = e.target.dataset.id;
    const play = localStorage.getItem(id);

    // Retrieve from local storage, or fetch and store
    if (!play) {
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
  });

  // Revert back to play info view
  document.querySelector("#btnClose").addEventListener("click", () => {
    hide(textSelect);
    hide(playText);
    show(synopsisInfo);
    show(playInfo);
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

// Updates play list, used to refresh list after sorting by name/date
function updateList(parent){
  parent.textContent = "";
  plays.forEach(p => {
    const li = document.createElement("li");
    li.setAttribute("data-id", p.id);
    li.textContent = p.title;

    // add book icon if text is available
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

// Displays play text
function displayPlay(playString){
  const play = JSON.parse(playString);
  document.querySelector("#interface h2").textContent = play.short;
  document.querySelector("#playHere h2").textContent = play.title;

  // Initially display act 1, scene 1.
  populateActsList(play);
  populateScenesList(play, 0);
  populatePlayersList(play);
  populateAct(play, 0);
  populateScene(play, 0, 0);

  // Changes text to selected act, updates scene list
  const act = document.querySelector("#actList");
  act.addEventListener("change", (e) => changeAct(e.target.value, play));
  const scene = document.querySelector("#sceneList");
  scene.addEventListener("change", (e) => populateScene(play, act.value, e.target.value));

  // Enables filter on click
  document.querySelector("#btnHighlight").addEventListener("click", () => filterText(play, act.value, scene.value));
}

// Shows given element
function show(element) {
  element.classList.remove("hidden");
  element.classList.add("visible");
}

// Hides given element
function hide(element) {
  element.classList.remove("visible");
  element.classList.add("hidden");
}

// Fills act list depending on play
function populateActsList(play){
  const actList = document.querySelector("#actList");
  actList.textContent = "";
  let i = 0;
  play.acts.forEach(a => {
    const opt = document.createElement("option");
    opt.setAttribute("value", i++);
    opt.textContent = a.name;
    actList.appendChild(opt);
  });
}

// Fills scene list depending on play
function populateScenesList(play, act){
  const sceneList = document.querySelector("#sceneList");
  sceneList.textContent = "";
  let i = 0;
  play.acts[act].scenes.forEach(s => {
    const opt = document.createElement("option");
    opt.setAttribute("value", i++);
    opt.textContent = s.name;
    sceneList.appendChild(opt);
  })
}

// Fills player list based on persona of play
function populatePlayersList(play){
  const playerList = document.querySelector("#playerList");
  playerList.textContent = ""
  const all = document.createElement("option");
  all.setAttribute("value", 0);
  all.textContent = "All Players"
  playerList.appendChild(all);

  for(let i=0; i < play.persona.length; i++){
    const opt = document.createElement("option");
    opt.setAttribute("value", i+1);
    opt.textContent = play.persona[i].player;
    playerList.appendChild(opt);
  }
}

// Displays correct act number in text header
function populateAct(play, act){
  document.querySelector("#actHere h3").textContent = play.acts[act].name;
}

// Updates play text with scene header, stage direction, and speeches of scene
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

// Updates play text with selected act and display scene 1
function changeAct(act, play){
  populateAct(play, act);
  document.querySelector("#sceneList").selectedIndex = 0;
  populateScenesList(play, act);
  populateScene(play, act, 0);
}

// Filters speeches such that only the selected players' are displayed
function filterText(play, act, scene){
  const player = document.querySelector("#playerList").value - 1;
  const txt = document.querySelector("#txtHighlight").value;
  const regexp = new RegExp(txt);

  const speeches = document.querySelector("#speeches");
  speeches.textContent = "";

  // If 'all players' is selected
  if(player < 0){
    play.acts[act].scenes[scene].speeches.forEach(s => populateFilteredSpeech(s, txt, regexp))
    document.querySelector("#sceneHere").appendChild(speeches);
  } else {
    // Display selected players' speeches, highlight provided term
    play.acts[act].scenes[scene].speeches.forEach(s => {
      if(s.speaker === play.persona[player].player) populateFilteredSpeech(s, txt, regexp)
    });
    document.querySelector("#sceneHere").appendChild(speeches);
  }
}

/* Filters highlights provided term in each speech
   Note: term is not case sensitive as replacing the play text with a case 
   sensitive term causes inconsistent formatting.
*/
function populateFilteredSpeech(s, txt, regexp){
  const speech = document.createElement("div");
      speech.classList.add("speech");

      const speaker = document.createElement("span");
      speaker.textContent = s.speaker;
      speech.appendChild(speaker);
      
      s.lines.forEach(l => {
        const p = document.createElement("p");
        p.textContent = l;
        if(txt != ""){p.innerHTML = p.innerHTML.replace(regexp, `<b>${txt}</b>`);}
        speech.appendChild(p);
      });
      speeches.appendChild(speech);
}