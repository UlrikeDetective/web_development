let select = (e) => document.querySelector(e);
let selectAll = (e) => document.querySelectorAll(e);

const textDivs = selectAll(".sText");
const textDivsArray = [
    textDivs[0].innerHTML,
    textDivs[1].innerHTML,
    textDivs[2].innerHTML,
    textDivs[3].innerHTML
];

let tlHorArray = ["","","",""];
let splitTextArray = [[],[],[],[]];
let hasWritten = [false,false,false,false];


/* scroll down link to offer section */
select("#heroLink").addEventListener("click", () => {
    gsap.to( window, {
        duration: 3,
        scrollTo: "#offer",
        ease: "power2.out"
    });
});

/* SplitText reveals text on scrollTrigger. */
/* Product items alternating horizontal scroll */
/* Hero background image parallax scroll and fadeout */
/* Repeat setup on resize */
init();
addEventListener("resize", (event) => { init() });
function init() {

    /* reveal text */
		hasWritten = [false,false,false,false];
    textDivs.forEach( ( textDiv, i ) => {
        textDiv.innerHTML = textDivsArray[i];
        splitTextArray[i] = new SplitText(textDiv, { type:"lines" });
        gsap.set( splitTextArray[i].lines, { opacity: 0, y: 100, "filter": "blur(10px)", });
    });
    gsap.to("body", {
        scrollTrigger: {
            trigger: "#offer",
            start: "top top+=100",
            scrub: true,
            onEnter: (self) =>  {
                if( !hasWritten[0] ) 
								{
                	writeText( 0, 0 ); 
								}
            }
        }
    });


    /* horizontal scroll */
		selectAll(".horScroll").forEach((horScroll, i) => {

        let wrapper = horScroll.dataset.wrapper;
        if( !wrapper )
            wrapper = "#"+horScroll.parentNode.id;

				var thisAnimWrap = horScroll.querySelector('.animWrap');
        var getX = () => {
            let diff = thisAnimWrap.scrollWidth - window.innerWidth;
            return - diff;
        }
		
        if( tlHorArray[i] )
        {
            tlHorArray[i].kill();
            tlHorArray[i] = null;
        }
        tlHorArray[i] = gsap.fromTo( horScroll,
        {
            x: i%2 ? getX() : 0,
            ease: "sine.inOut"
        },
        {
            x: i%2 ? 0 : getX(),
            ease: "sine.inOut",

            scrollTrigger: {
                trigger: wrapper,
                start: "top top+=50%",/* +=500px */
                end: "top top+=400px",
                scrub: 1.5
            }

        });
	});
    

    /* Hero background image parallax scroll and fadeout */
    if( tlHorArray[3] )
    {
        tlHorArray[3].kill();
        tlHorArray[3] = null;
    }
    tlHorArray[3] = gsap.to("body", {
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            scrub: true,
            onUpdate: (self) => {
                let thisProgress = self.progress;
                let bgVerMovement = window.innerHeight;
                let bgProgress = parseInt(bgVerMovement * thisProgress) + "px";
                let bgBrightness= 100 * ( 1 - ( thisProgress * 2 ) ) + "%";
                gsap.set("body", { "--bgVerticalOffset": bgProgress });
                gsap.set("body", { "--bgBrightness": bgBrightness });
            }
        }
    });

    if( hasWritten[0] ) 
        writeText( 0, 0 );
	
}



/* glow border hover */
const cardWrappers = document.querySelectorAll("main");
cardWrappers.forEach((cardWrapper,index) => {
    cardWrapper.addEventListener("mousemove", handleMouseMove);
});
function handleMouseMove(e) {
	const cardWrapper = this.getBoundingClientRect();
	const mouseX = e.clientX - cardWrapper.left - cardWrapper.width / 2;
	const mouseY = e.clientY - cardWrapper.top - cardWrapper.height / 2;

	let angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);
	angle = (angle + 360) % 360;

	this.style.setProperty("--start", angle + 60);
}


/* text reveal recursive function */
function writeText( i, j ) {

    if( !hasWritten[i] && ( i < 200 ) && ( j < 200 ) )
    {

        let splitText = splitTextArray[i][j];
        gsap.timeline({ defaults: { repeatDelay: 0, duration: 0.5, }, onComplete:() => {
            
                let nextChar = j + 1;
                if( splitTextArray[i][nextChar] )
                    writeText( i,nextChar );
                else
                {
                    hasWritten[i] = true;
                    let nextLine = i + 1;
                    if( splitTextArray[nextLine] )
                    {
                        let delay = 300;
                        let remove = textDivs[i].getAttribute("sRemove");
                        if( remove && ( remove == "true" ) )
                            delay = 1000;
                        setTimeout(function () {
                            let remove = textDivs[i].getAttribute("sRemove");
                            if( remove && ( remove == "true" ) )
                                gsap.set( splitTextArray[i].lines, { opacity: 0 });
                            writeText( nextLine,0 ); 
                        }, delay);
                    }
                    else
                        return;
                }
            
        } })
        .to( splitTextArray[i].lines, {
                opacity: 1,
								y: 0,
								"filter": "blur(0px)",
                stagger: 0.2
        });
        
    }
    else
        return;

}