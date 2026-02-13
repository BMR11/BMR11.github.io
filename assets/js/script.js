'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// Navigate to a specific page/section
function navigateToPage(pageName, updateHistory = true) {
  const targetPage = pageName.toLowerCase();
  
  for (let j = 0; j < pages.length; j++) {
    if (targetPage === pages[j].dataset.page) {
      pages[j].classList.add("active");
    } else {
      pages[j].classList.remove("active");
    }
  }
  
  // Update active state on nav links
  navigationLinks.forEach(link => {
    if (link.innerHTML.trim().toLowerCase() === targetPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
  
  // Update URL using History API
  if (updateHistory) {
    const newPath = targetPage === 'about' ? '/' : '/' + targetPage;
    window.history.pushState({ page: targetPage }, '', newPath);
  }
  
  window.scrollTo(0, 0);
}

// Get page name from URL path
function getPageFromURL() {
  const path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
  // Valid pages in the navigation
  const validPages = ['about', 'blog', 'talks'];
  
  if (path === '' || path === 'index.html') {
    return 'about';
  }
  
  if (validPages.includes(path.toLowerCase())) {
    return path.toLowerCase();
  }
  
  return 'about'; // default fallback
}

// Handle browser back/forward navigation
window.addEventListener('popstate', function(event) {
  if (event.state && event.state.page) {
    navigateToPage(event.state.page, false);
  } else {
    navigateToPage(getPageFromURL(), false);
  }
});

// Initialize page based on URL on load
document.addEventListener('DOMContentLoaded', function() {
  // Check if we were redirected from 404.html
  const redirectPath = sessionStorage.getItem('redirect_path');
  if (redirectPath) {
    sessionStorage.removeItem('redirect_path');
    const pageName = redirectPath.replace(/^\//, '').toLowerCase() || 'about';
    navigateToPage(pageName, false);
    // Update URL to show the correct path
    const newPath = pageName === 'about' ? '/' : '/' + pageName;
    window.history.replaceState({ page: pageName }, '', newPath);
  } else {
    const initialPage = getPageFromURL();
    navigateToPage(initialPage, false);
    // Replace current history entry with proper state
    window.history.replaceState({ page: initialPage }, '', window.location.pathname);
  }
});

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const pageName = this.innerHTML.trim().toLowerCase();
    navigateToPage(pageName, true);
  });
}



// Google Analytics 4 - Automatic Button Click Tracking
// This code automatically tracks all button clicks and links with class "button"
(function() {
  // Function to send button click event to GA4
  function trackButtonClick(element) {
    // Check if gtag is available
    if (typeof gtag === 'undefined') {
      return;
    }

    // Extract button information
    const buttonText = element.textContent.trim() || element.innerText.trim() || 'Unknown';
    const buttonId = element.id || 'no-id';
    const buttonClass = element.className || 'no-class';
    const buttonType = element.tagName.toLowerCase();
    const buttonHref = element.href || 'N/A';
    
    // Get the page path for context
    const pagePath = window.location.pathname;
    
    // Send event to GA4
    gtag('event', 'button_click', {
      'button_text': buttonText.substring(0, 100), // Limit text length
      'button_id': buttonId,
      'button_class': buttonClass,
      'button_type': buttonType,
      'button_href': buttonHref,
      'page_path': pagePath,
      'event_category': 'Button Interaction',
      'event_label': buttonText.substring(0, 100)
    });
  }

  // Use event delegation to catch all button clicks (including dynamically added buttons)
  document.addEventListener('click', function(event) {
    const target = event.target;
    
    // Track all <button> elements
    if (target.tagName === 'BUTTON') {
      trackButtonClick(target);
    }
    
    // Track all <a> elements with class "button"
    if (target.tagName === 'A' && target.classList.contains('button')) {
      trackButtonClick(target);
    }
    
    // Also check if the clicked element is inside a button or button-link
    const buttonParent = target.closest('button');
    if (buttonParent) {
      trackButtonClick(buttonParent);
      return;
    }
    
    const linkButtonParent = target.closest('a.button');
    if (linkButtonParent) {
      trackButtonClick(linkButtonParent);
    }
  });
})();