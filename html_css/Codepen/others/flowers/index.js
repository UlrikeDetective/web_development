document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#scheme");
  const scope = document.querySelector(".grid");

  const schemes = {
    complementary: [150, 210],
    analogous: [30, 330],
    triadic: [120, 240]
  };

  function applyScheme(schemeName) {
    const [offset1, offset2] = schemes[schemeName];
    scope.style.setProperty("--offset-1", offset1);
    scope.style.setProperty("--offset-2", offset2);
  }

  form.addEventListener("change", (e) => {
    if (e.target.name !== "scheme") return;
    applyScheme(e.target.value);
  });

  applyScheme(form.querySelector('input[name="scheme"]:checked').value);
});
