document.getElementById('signup-form').addEventListener('submit', function (e) {
  e.preventDefault();
  document.getElementById('form-cell').classList.add('is-submitted');
});