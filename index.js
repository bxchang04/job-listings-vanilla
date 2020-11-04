//bugs
/*
0. Articles jumping around
1. visual bug on top.
2. delete comments
3. remove transitions

*/

// Filters
const filtersSelected = new Set();

// queryselectors
const filters = document.querySelector(".filter-cover");
const clear = document.querySelector(".clear");

const bgImg = document.getElementById("bg-img");

// media query?
if (window.innerWidth <= 540) {
  let bg = bgImg.src.split("/");
  console.log(bg, bg.length);
  bg[bg.length - 1] = "bg-header-mobile.svg";
  bgImg.src = bg.join("/");
}

const filterParent = filters.parentElement;

// destructuring?
// !!! Need to add hardcoded listing into data
// What does realJobList do?
let data, main = document.querySelector("main"), realJobList = [];


// API call using fetch
fetch("data.json")
.then((data) => data.json())
.then((res) => {
    data = res;
    createList(data);
});

// Create list of filtered tags?


function createList(data) {

  // filterParent.classList.add('none'); // leftover. Ugly.

  let docf = document.createDocumentFragment(); // creates a DOM tree?
  data.forEach((el) => {
    let listing = document.createElement("article");
    listing.classList.add("job");

    let listFrag = document.createDocumentFragment();
    listing.companyName = el.company;
    listing.data_filters = new Set([
      ...el.languages,
      ...el.tools,
      el.role,
      el.level,
    ]);
    listing.data_filters.forEach((l) => {
      let li = document.createElement("li");
      let btn = document.createElement("button");
      btn.classList.add("button");
      btn.classList.add("job__filter");
      btn.textContent = l;
      btn.setAttribute("data-filter", l);
      listFrag.appendChild(li);
      li.appendChild(btn);
    });

    // check against screenshots if needed

    listing.innerHTML = 
    `
    <header class="job__header" style="background-image: url(${el.logo})">
        <h2 class="job__title"><a href="#" class="job__title-link">${el.position}</a></h2>
        <p class="job__meta">
            <span class="job__company-name">${el.company}</span>
            <em 
                class="badge badge--primary" 
                style="display:${el.new ? "inline-block" : "none"}"
            >
                New!
            </em>
            <em 
                class="badge badge--secondary"
                style="display:${el.featured ? "inline-block" : "none"}"
            >
                Featured
            </em>
        </p>
        
        <div class="job__details">
            <time class="job__time">${el.postedAt}</time>
            <span class="job__type">${el.contract}</span>
            <address class="job__location">${el.location}</address>
        </div>
    </header>

    <ul class="job__tags job__filters">
    </ul>
    `;

    // These lines enable filter buttons to work??
    listing.querySelector(".job__filters").append(listFrag);
    realJobList.push(listing);
    docf.append(listing);

    // Test 3 lines above
  });

  // What is this?
  main.append(docf);
  // console.log(main)

  // Nani?
  const filterBtns = document.querySelectorAll(".job__filters > .job__filter");
  const filterBtns2 = document.querySelectorAll(".job__filters button"); // for learning purposes // experiment here!

  filterBtns.forEach((el) => {
    el.addEventListener("click", (ev) => {
      addFilter(el.dataset.filter);
    });
  });

// For learning
  filterBtns2.forEach((el) => {
    el.addEventListener("click", (ev) => {
      addFilter(el.dataset.filter);
    });
  });
  
}

// Add event listeners for filter buttons

function addFilter(filter) {
  if (filtersSelected.has(filter)) {
    return;
  }

  // Check if selected filters have none, there is nothing to filter, so add it back to the main space
  if (filtersSelected.size == 0) {
    filterParent.classList.remove("none");
    main.classList.add("main-space");
  }

  let newFilter = document.createElement("div");

  newFilter.classList.add("filter");

  newFilter.textContent = filter;

  newFilter.addEventListener("click", filterClick);

  newFilter.setAttribute("data-filter", filter);

  filters.append(newFilter);

  filtersSelected.add(filter);

  filterJobs();
}

// Actually filter each job based on filtersSelected
// When commented out:
// clear button breaks
// jobs aren't filtered on click

function filterJobs() {
  realJobList.forEach((job) => {
    // uses helper functions
    if (check(filtersSelected, job.data_filters)) {
      showJob(job);
    } else {
      hideJob(job);
    }
  });
}

// Removes selected filter on click

function filterClick(ev) {
  filtersSelected.delete(this.dataset.filter);

  console.log(filtersSelected); // not sure why this doesn't output to console

  if (filtersSelected.size == 0) {
    filterParent.classList.add("none");
    main.classList.remove("main-space");
  }
  this.remove();
  filterJobs(this.dataset.filter);
}

// Transitions. !!! Don't use verbatim!!!

function setTransitionEvent() {
  var t;
  var el = document.createElement("fakeelement");
  var transitions = {
    WebkitTransition: "webkitTransitionEnd",
    MozTransition: "transitionend",
    MSTransition: "msTransitionEnd",
    OTransition: "oTransitionEnd",
    transition: "transitionEnd",
  };

  for (t in transitions) {
    if (el.style[t] !== undefined) {
      return transitions[t];
    }
  }
}

// Begin: Helper functions
function hideJob(job) {
  let event = setTransitionEvent();
//   let event = "transitionEnd";
  job.classList.add("fade");
  job.addEventListener(`${event}`, (ev) => job.classList.add("none"), {
    once: true,
  });
}

function showJob(job) {
  job.classList.remove("none");
  job.classList.add("fadeAnim");
  job.addEventListener(
    "animationend",
    (ev) => job.classList.remove("fade", "fadeAnim"),
    { once: true }
  );
}

function check(set1, set2) {
  // to check if set2 contains all elements of set1
  let bool = false;
  if (set1.size == 0) {
    return true;
  }
  let i = 0;
  set1.forEach((s) => {
    if (i == 0) {
      if (set2.has(s)) {
        bool = true;
      } else {
        i++;
        bool = false;
      }
    }
  });
  return bool;
}
// End: Helper functions

// Begin: Clear button logic
//for cleanup?
clear.addEventListener("click", (ev) => {
  if (filtersSelected.size == 0) {
    return;
  }
  filtersSelected.clear();
  filterJobs();
  clearFilters();
});

function clearFilters() {
  while (filters.firstElementChild) {
    filters.lastElementChild.remove();
  }
  filterParent.classList.add("none");
  main.classList.remove("main-space");
}

// End: Clear button logic
