/* $(document).ready(function() {
    $("h1").css("color", "blue");
    $("button").css("color", "red"); 
    $("button").css("background-color", "lightgreen");
}); */

/* $("h1").css("color", "blue");
$("h1").css("font-size", "7rem");
$("button").css("color", "red"); 
$("button").css("background-color", "lightgreen"); */

$("h1").addClass("big-title margin-50");
$("h2").addClass("title-h2 margin-20");
$("img").addClass("margin-20");
$("button").addClass("margin-20");

// $("button");
// $("button").text("Don't Click me");

$("button").html("<em>Hey</em>");
console.log($("img").attr("src"));
$("a").attr("href", "https://www.wired.com");

$("h1").click(function() {
    $("h1").css("color", "purple");
});

/* $("button").click(function() {
    $("h2").css("color", "magenta");
}); */

// saves input into input
/* $("input").keypress(function(event) {
    console.log(event.key);
});  */

// Changing the H1 into everything you type into the keyboard
/* $(document).keypress(function(event) {
    $("h1").text(event.key);
}); */

// changes the color of the h1 when hovering over the buttons.
/* $("button").on("mouseover", function() {
    $("h1").css("color", "orange");
}); */

/* $("button").on("mouseover", function() {
    $("h2").hide();
}); */

//hide and show H2
/* $("button").on("mouseover", function() {
    $("h2").toggle();
}); */

$("button").on("click", function() {
    $("h1").slideToggle();
});


/* $("button").on("click", function() {
    $("h2").fadeToggle();
}); */

// costume fade to half
$("button").on("click", function() {
    $("h2").animate({opacity: 0.5});
});

$("button").on("click", function() {
    $("h1").slideUp().slideDown().animate({opacity: 0.5});
});
