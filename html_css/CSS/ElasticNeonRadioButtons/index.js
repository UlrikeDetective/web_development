class RadioButtonEffect {
  constructor(radioBtnGroups) {
    this.previousRadioBtn = null;
    this.setCircleStroke();
    radioBtnGroups.forEach((group) => {
      const radioBtn = gsap.utils.selector(group)("input[type='radio']")[0];

      radioBtn.addEventListener("change", () => {
        const nodes = this.getNodes(radioBtn);
        if (this.previousRadioBtn && this.previousRadioBtn !== radioBtn) {
          this.changeEffect(this.getNodes(this.previousRadioBtn), false);
        }

        this.changeEffect(nodes, true);
        this.previousRadioBtn = radioBtn;
      });
    });
  }

  setCircleStroke() {
    document
      .querySelectorAll(".radio-btn-group g.checked circle")
      .forEach((circle) => {
        const length = circle.getTotalLength();
        circle.style.strokeDasharray = `${length}px`;
        circle.style.strokeDashoffset = `${length}px`;
      });
  }

  getNodes(radioBtn) {
    const container = radioBtn.closest(".radio-btn-group");
    return [
      gsap.utils.selector(container)("circle.blue")[0],
      gsap.utils.selector(container)("circle.pink")[0]
    ];
  }

  changeEffect(nodes, isChecked) {
    const blueCircle = nodes[0];
    const pinkCircle = nodes[1];
    const length = Math.ceil(blueCircle.getTotalLength());

    if (isChecked) {
      gsap.to([blueCircle, pinkCircle], {
        strokeDashoffset: 0,
        duration: 2.5,
        ease: "elastic.out(2.5, 0.2)"
      });
    } else {
      gsap.killTweensOf([blueCircle, pinkCircle]);
      gsap.to([blueCircle, pinkCircle], {
        strokeDashoffset: `${length}px`,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const radioBtnGroups = document.querySelectorAll(".radio-btn-group");
  new RadioButtonEffect(radioBtnGroups);
});