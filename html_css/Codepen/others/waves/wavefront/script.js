let select = (e) => document.querySelector(e);
let selectAll = (e) => document.querySelectorAll(e);

let lastWave = "a";
let lastEasing = "power1.inOut";


/* setup initial waves and add horizontal offsets */

gsap.set(["#l5"], { x: -20, attr: { d: select("#wave5c").getAttribute("d") } });
gsap.set(["#l4"], { x: -16, attr: { d: select("#wave4b").getAttribute("d") } });
gsap.set(["#l3"], { x: -12, attr: { d: select("#wave3c").getAttribute("d") } });
gsap.set(["#l2"], { x: -8, attr: { d: select("#wave2a").getAttribute("d") } });
gsap.set(["#l1"], { x: -4, attr: { d: select("#wave1b").getAttribute("d") } });
gsap.set(["#l0"], { attr: { d: select("#wave0c").getAttribute("d") } });

gsap.set("svgWrapper", { autoAlpha: 1 });


/* setup GSAP timelines */
waveAnim();
function waveAnim(){

	let returnEasing = getEasing();

	gsap.timeline({
		repeat: 1,
		yoyo: true,
		repeatDelay: 0,
		onComplete: waveAnim,
		defaults: { duration: 6 }
	})
	.to( [ "#l0" ], {
		morphSVG: "#waveReturn",
		opacity: 1,
		ease: returnEasing
	})
	.to( [ "#l1", "#l2", "#l3", "#l4", "#l5" ], {
		morphSVG: "#waveReturn",
		opacity: 0.2,
		ease: returnEasing
	}, "<" )
	.to( ["#l5"], { morphSVG: getWave(5), opacity: 1, ease: getEasing() } )
	.to( ["#l4"], { morphSVG: getWave(4), opacity: 1, ease: getEasing() }, "<" )
	.to( ["#l3"], { morphSVG: getWave(3), opacity: 1, ease: getEasing() }, "<" )
	.to( ["#l2"], { morphSVG: getWave(2), opacity: 1, ease: getEasing() }, "<" )
	.to( ["#l1"], { morphSVG: getWave(1), opacity: 1, ease: getEasing() }, "<" )
	.to( ["#l0"], { morphSVG: getWave(0), ease: getEasing() }, "<" );

	function getEasing() {
		
		let eases = ["power1.inOut","power2.inOut","power3.inOut"];
		
		/* disable repeat easing by removing previous */
		let oldIndex = eases.indexOf(lastEasing);
  	eases.splice(oldIndex, 1);
		let newEasing = gsap.utils.random(eases);	
		lastEasing = newEasing;
		
		return newEasing;
		
	}
	
	function getWave(i) {
		
		let wave = ["a","b","c"];
		
		/* disable repeat wave by removing previous */
		let oldIndex = wave.indexOf(lastWave);
  	wave.splice(oldIndex, 1);
		let newWave = gsap.utils.random(wave);		
		lastWave = newWave;
		
		return "#wave"+i+newWave;
		
	}

}