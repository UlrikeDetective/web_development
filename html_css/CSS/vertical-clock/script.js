const HEIGHT = 50;
let FORMAT = 24;

const wrapper = document.querySelector(".wrapper");
const formatEl = document.querySelector(".clock .format");
const formats = document.querySelectorAll(".clock .format > span");
const toggleFormatBtn = document.querySelector("#toggle-format");
const toggleThemeBtn = document.querySelector("#theme-btn");
const variantSelectEl = document.querySelector("#variant-select");
const digits = [...document.querySelectorAll(".clock .digit")];

const numbersCache = digits.map((d) => [
  ...d.querySelectorAll(":scope > span")
]);
let prevTime = null;
let prevPeriod = null;

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


function startTime() {
  const today = new Date();
  let h = today.getHours();

  if (FORMAT === 12) {
    const period = h >= 12 ? 1 : 0;

    if (prevPeriod !== period) {
      formats.forEach(n => n.classList.remove("active"));
      formats[period].classList.add("active");

      formatEl.style.transform = `translatey(-${HEIGHT * period + 1}px)`;
      formatEl.style.setProperty("--factor", ((Math.random() - 0.5) * 2).toFixed(2));

      let formatPos = period * -1;

      formats.forEach(f => {
        f.style.setProperty("--pos", formatPos);
        f.style.setProperty("--n-factor", ((Math.random() - 0.5) * 2).toFixed(2));
        f.dataset.pos = formatPos;
        formatPos++;
      });

      prevPeriod = period;
    }

    h = h % 12 || 12;
  }

  const newTime = [
    Math.floor(h / 10),
    h % 10,
    Math.floor(today.getMinutes() / 10),
    today.getMinutes() % 10,
    Math.floor(today.getSeconds() / 10),
    today.getSeconds() % 10
  ];

  newTime.forEach((d, i) => {
    if (!prevTime || prevTime[i] !== d) {
      digits[i].style.transform = `translatey(-${HEIGHT * d + 1}px)`;
      digits[i].style.setProperty("--factor", ((Math.random() - 0.5) * 2).toFixed(2));

      if (prevTime) {
        numbersCache[i][prevTime[i]].classList.remove("active");
      }

      numbersCache[i][d].classList.add("active");

      let pos = d * -1;

      numbersCache[i].forEach(num => {
        num.style.setProperty("--pos", pos);
        // num.style.setProperty("--n-factor", ((Math.random() - 0.5) * 2).toFixed(2));
        num.dataset.pos = pos;
        pos++;
      });
    }
  });

  prevTime = newTime;
}

function setFormat(newFormat) {
  FORMAT = parseInt(newFormat);
  prevPeriod = null;
  // prevTime = null;
  document.documentElement.dataset.format = newFormat;
  toggleFormatBtn.innerText =
    FORMAT === 12 ? "Switch to 24-hour" : "Switch to 12-hour";
  localStorage.setItem("format", newFormat);
}

function setPhotos() {
  document.querySelectorAll(".col > span > span").forEach(el => el.style.setProperty("--photo", `url("https://picsum.photos/id/${randomIntFromInterval(1,600)}/50")`))
}

function setTheme(theme) {
    toggleThemeBtn.innerText = `Use ${theme === "light" ? "dark" : "light"} theme`;
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);
}

function setVariant(variant) {
  document.documentElement.dataset.variant = variant;
  variantSelectEl.value = variant;
  localStorage.setItem("variant", variant);
  
  if (variant === "photos") {
    setPhotos();
  }
}

(function main() {
  const savedFormat = localStorage.getItem("format") || "24";
  const savedTheme = localStorage.getItem("theme") || "light";
  const savedVariant = localStorage.getItem("variant") || "default";

  setFormat(savedFormat);
  setTheme(savedTheme);
  setVariant(savedVariant);
  
  numbersCache.forEach(digit => {
  digit.forEach(num => {
    num.style.setProperty(
      "--n-factor",
      ((Math.random() - 0.5) * 2).toFixed(2)
    );
  });
});


  startTime();
  setInterval(startTime, 1000);
  
  toggleThemeBtn.addEventListener("click", () => {
    const newTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";   
    setTheme(newTheme);
  });

  toggleFormatBtn.addEventListener("click", () => {
    const newFormat =
      document.documentElement.dataset.format === "12" ? 24 : 12;

    formats.forEach((n) => n.classList.remove("active"));
    formatEl.style.transform = `translatey(0px)`;

    setFormat(newFormat);
  });

  variantSelectEl.addEventListener("input", (e) => setVariant(e.target.value));
})();