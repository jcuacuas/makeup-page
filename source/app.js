import mobileNav from "./utils/mobileNav.js";
let slideIndex = 0;
let slideTimeout;
const button = document.querySelector("button");
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
  slideTimeout = setTimeout(showSlides, 6000);
}

function currentSlide(n) {
  clearTimeout(slideTimeout);
  slideIndex = n;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
  slideTimeout = setTimeout(showSlides, 6000);
}

// Add click listeners to dots
const dots = document.getElementsByClassName("dot");
for (let i = 0; i < dots.length; i++) {
  dots[i].addEventListener("click", function() {
    currentSlide(i + 1);
  });
}

// Reveal the about image when scrolled into view
const aboutImage = document.querySelector(".about__image");
const aboutImageMobile = document.querySelector(".about__image--mobile");

if (aboutImage) {
  const aboutObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });
  aboutObserver.observe(aboutImage);
}

if (aboutImageMobile) {
  const mobileObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });
  mobileObserver.observe(aboutImageMobile);
}

mobileNav();