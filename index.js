// Vanilla JavaScript solution Benjamin X. Chang. Inspired by https://github.com/varunbhalla19/static-job-listings-frontendmentor

// Filters
const filtersSelected = new Set();

// queryselectors
const filters = document.querySelector(".filter-cover");
const clear = document.querySelector(".clear");

const filterParent = filters.parentElement;

let data, main = document.querySelector("main"), realJobList = [];

// API call using fetch
fetch("data.json")
.then((data) => data.json())
.then((res) => {
    data = res;
    createList(data);
});

// Create list of filter buttons and assign them to each job listing
function createList(data) {

  let docf = document.createDocumentFragment();
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

    // Dynamically generate all job listings in data.json
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

    listing.querySelector(".job__filters").append(listFrag);
    realJobList.push(listing);
    docf.append(listing);
  });

  // Append jobs to main element
  main.append(docf);
  
  // Add event listeners to filter buttons on each listing
  const filterBtns = document.querySelectorAll(".job__filters button"); 

  filterBtns.forEach((el) => {
    el.addEventListener("click", (ev) => {
      addFilter(el.dataset.filter);
    });
  });
  
}

// Add event listeners to selected filter, then filter all job listings
function addFilter(filter) {
  if (filtersSelected.has(filter)) {
    return;
  }

  // If no filters are selected, display all job listings
  if (filtersSelected.size == 0) {
    filterParent.classList.remove("none");
    main.classList.add('main-space') ; // not sure what this does
  }

  let newFilter = document.createElement("div");

  newFilter.classList.add("filter");

  newFilter.textContent = filter;

  newFilter.addEventListener("click", filterClick);

  newFilter.setAttribute("data-filter", filter);

  filters.append(newFilter);

  filtersSelected.add(filter);

  // Filter all job listings
  filterJobs();
}

// Filter job listing based on selected filters
function filterJobs() {
  realJobList.forEach((job) => {
    // Check filters selected; if arg2 contains all elements of arg1, show job
    if (check(filtersSelected, job.data_filters)) {
      showJob(job);
    } else {
      hideJob(job);
    }
  });
}

// Remove selected filter on click
function filterClick(ev) {
  filtersSelected.delete(this.dataset.filter);

  console.log(filtersSelected);

  if (filtersSelected.size == 0) {
    filterParent.classList.add("none");
    main.classList.remove('main-space') ; // not sure what this does
  }
  this.remove();

  // Filter all job listings
  filterJobs(this.dataset.filter);
}


// Begin: Helper functions
function hideJob(job) {
  job.classList.add("fade");
  job.addEventListener(`webkitTransitionEnd`, (ev) => job.classList.add("none"), {
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
  main.classList.remove('main-space') ; // not sure what this does
}
// End: Clear button logic
