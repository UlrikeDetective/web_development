let select = (e) => document.querySelector(e);
let selectAll = (e) => document.querySelectorAll(e);

gsap.registerPlugin(MotionPathPlugin);

const gsapWrapper = select("#gsapWrapper"),
    boat = select("#boat"),
    tank = select("#tank"),
    svgBoxPath = select("#svgBoxPath"),
    mPath = select("#mPath"),
    boxPath = select("#boxPath"),
    rain = select("#rain");

var vWidth = window.innerWidth + 40;
var vHeight = window.innerHeight / 2;

var updateCounter = 0;

// CSS clip-path: polygon() support?
let clipPathPolygonEnabled = false;
if (window.getComputedStyle(tank).getPropertyValue("clip-path") == "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)")
    clipPathPolygonEnabled = true;

const amp = 30,
    nNodes = 13,
    nodes = [];
for (let i = 0; i <= nNodes; i++)
    nodes.push({ x: 0, y: 0 });

init();
window.onresize = function (event) { init(); };


/* main sinewave timeline */
const tl = gsap.timeline({ defaults: { duration: 3 } })
    .to(nodes, {
        y: (i) => 100 + amp,
        ease: "sine.inOut",
        stagger: { amount: 6, repeat: -1, yoyo: true },
        onUpdate: onUpdatePath
    });

function init() {

    screenResizeRaindrops();
    vWidth = window.innerWidth + 40;
    vHeight = window.innerHeight / 2;

    for (let i = 0; i <= nNodes; i++) {
        nodes[i].x = Math.round(i / nNodes * vWidth);
        nodes[i].y = 0;
    }
    gsap.set(svgBoxPath, { attr: { viewBox: "0 0 " + vWidth + " " + vHeight } });
    onUpdatePath();
    gsap.set(gsapWrapper, { autoAlpha: 1 });

}

function onUpdatePath() {

    updateCounter++;
    //console.clear();
    //console.log("updatePath" + updateCounter);

    /* create SVG path for GSAP motionPath  */
    let dataPath = "M";
    for (let i = 0; i < nodes.length; i++)
        dataPath += Math.round(nodes[i].x) + "," + Math.round(nodes[i].y) + " ";
    gsap.set(mPath, { attr: { d: dataPath } });

    /* convert motionPath to a fill by adding height */
    dataPath += nodes[nodes.length - 1].x + ", " + vHeight + " " + nodes[0].x + ", " + vHeight + " Z";
    gsap.set(boxPath, { attr: { d: dataPath } });

    /* add fill as polygon or path based on clip-path: polygon() support */
    if (clipPathPolygonEnabled == true) {
        gsap.set(tank, { clipPath: "polygon(" + pathToPolygon() + ")" });
    }
    else {
        //console.clear();
        //console.log("path - " + dataPath);
        gsap.set(tank, { clipPath: 'path("' + dataPath + '")' });
    }

    /* position boat on motionPath */
    gsap.set("#boat", {
        motionPath: {
            path: mPath,
            align: mPath,
            alignOrigin: [0.5, 0.9],
            autoRotate: true,
            end: 0.5,
        },
        duration: 5,
        ease: "none"
    });

}

/* convert SVG path to CSS clip-path polygon */
function pathToPolygon() {

    let path = document.querySelector("#boxPath");

    let pathLength = Math.floor(path.getTotalLength());
    let steps = 10;
    let scaled = Math.floor(pathLength / steps);
    let bbox = path.getBBox();

    let points = Object.keys([...new Array(scaled)])
        .map((num) => {
            let point = path.getPointAtLength(num * steps);
            let x = ((point.x / bbox.width) * 100).toFixed(1);
            let y = ((point.y / bbox.height) * 100).toFixed(1);
            return `${x}% ${y}%`;
        })
        .join(",");

    //console.log("path - " + path);
    //console.log("polygon - " + points);

    return points;

}





/* create raindrops and animate */
let width = rain.getBoundingClientRect().width;
for (let i = 0; i < 100; i++) {

    let opacity = gsap.utils.random(0.05, 0.2, 0.05);
    //let blur = 10 - Math.floor(40 * opacity);
    let height = 140 + (400 * opacity);
    let duration = 24 - (40 * opacity);

    const raindrop = document.createElement("i");
    raindrop.id = "r" + i;
    raindrop.style.height = height + "px";
    raindrop.style.left = gsap.utils.random(width, 1) + "px";
    raindrop.style.animationDelay = gsap.utils.random(-20, 0, 1) + "s";
    raindrop.style.animationDuration = duration + "s";
    raindrop.style.opacity = opacity;
    //raindrop.style.filter = "blur(" + blur + "px)";
    raindrop.style.transform = "rotate(-25deg)";

    rain.appendChild(raindrop);

}
function screenResizeRaindrops() {

    let width = rain.getBoundingClientRect().width;

    for (let i = 0; i < 100; i++) {

        let opacity = gsap.utils.random(0.05, 0.2, 0.05);
        //let blur = 10 - Math.floor(40 * opacity);
        let height = 140 + (400 * opacity);
        let duration = 24 - (40 * opacity);

        var raindrop = select("#r" + i);
        if (raindrop) {
            raindrop.style.height = height + "px";
            raindrop.style.left = gsap.utils.random(width, 1) + "px";
            raindrop.style.animationDelay = gsap.utils.random(-20, 0, 1) + "s";
            raindrop.style.animationDuration = duration + "s";
            raindrop.style.opacity = opacity;
            //raindrop.style.filter = "blur(" + blur + "px)";
            //raindrop.style.transform = "rotate(-25deg)"; 
        }
    }

}