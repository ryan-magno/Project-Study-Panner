// no refresh redirector
var links = document.querySelectorAll("#sidebar .nav-item a");
var pages = document.querySelectorAll(".sp-paging");
var container = document.querySelector("#response-container");
var broadcastHash = null;
// sidebar
var selector = "bg-secondary";

document.addEventListener("DOMContentLoaded", function () {
    links.forEach(function (item) {
        item.addEventListener("click", function () {
            links.forEach(function (li) {
                li.classList.remove(selector);
                li.classList.remove("active");
                li.classList.remove("selected");
            });

            this.classList.add("active");
            this.classList.add("selected");
        });
    });

    links.forEach(function (item) {
        item.addEventListener("mouseover", function () {
            links.forEach(function (li) {
                li.classList.remove(selector);
            });
            if (!this.classList.contains("selected")) {
                this.classList.add(selector);
            }
        });
    });

    links.forEach(function (item) {
        item.addEventListener("mouseleave", function () {
            links.forEach(function (li) {
                if (!li.classList.contains("selected")) {
                    li.classList.remove(selector);
                }
            });
        });
    });
});

links.forEach(function (link) {
    link.addEventListener("click", function (event) {
        event.preventDefault();

        let href = this.getAttribute("href");
        let path = href.replace("#", "");
        broadcastHash = path;

        // hide all class first
        checkDomDisplay(path);

        window.location.hash = this.getAttribute("href");
    });
});

function checkDomVisibility(value, override) {
    pages.forEach((data, index) => {
        if (override) {
            data.style.visibility = "visible";
            return;
        }
        checkDomDisplay(null, true);
        let id = data.getAttribute("id");
        let pageValue = "page-".concat(value);

        isSelected = id == pageValue;
        if (isSelected) {
            data.style.visibility = "visible";
        } else {
            data.style.visibility = "hidden";
        }
    });
}

function checkDomDisplay(value, override) {
    pages.forEach((data, index) => {
        if (override) {
            data.style.display = "block";
            return;
        }
        checkDomVisibility(null, true);
        let id = data.getAttribute("id");
        let pageValue = "page-".concat(value);

        isSelected = id == pageValue;
        if (isSelected) {
            data.style.display = "block";
        } else {
            data.style.display = "none";
        }
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
}

function initialSelection() {
    let hash = window.location.hash;
    let linkValues = Object.values(links).map((el) => el.attributes.href.value);
    let linkIndex = linkValues.indexOf(hash);
    if (linkValues.indexOf(hash) !== -1) {
        links[linkIndex].classList.add("active");
    } else {
        linkIndex = linkValues.indexOf("#home");
        links[linkIndex].classList.add("active");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let page = "home"; // default
    // check for url hash
    let locationHash = window.location.hash.replace("#", "");
    if (locationHash.length != 0) {
        page = locationHash;
    }

    container.visibility = "visible";
    // let element = document.getElementById("page-" + locationHash);
    // element.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
        checkDomDisplay(page);
        broadcastHash = page;
        document.getElementById("sidebar").disabled = false;
    }, 100);

    initialSelection();
});

document.getElementById("sidebar").disabled = true;
