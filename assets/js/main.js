var api_key = "fbeac58db80c173ab98f88e1773e023b";
var typeOfSelection = "now_playing";
var tab = [];
var obj = {};
var movieId = null;
var i = 0;

$(document).ready(function() {
  getMovies(typeOfSelection);
  $(".sousHeader" + typeOfSelection).css("display", "block");
  $(".under" + typeOfSelection).css("display", "block");

  // Choix de la selection.

  $("#upcoming, #now_playing, #popular, #top_rated").click(function() {
    typeOfSelection = $(this).attr("id");

    // condition pour affiché le bon titre
    if (
      $(".sousHeadernow_playing").css("display") === "block" ||
      $(".sousHeaderpopular").css("display") === "block" ||
      $(".sousHeadertop_rated").css("display") === "block" ||
      $(".sousHeaderupcoming").css("display") === "block"
    ) {
      $(
        ".sousHeadernow_playing, .sousHeaderpopular, .sousHeadertop_rated, .sousHeaderupcoming"
      ).css("display", "none");
      $(".sousHeader" + typeOfSelection).css("display", "block");
    }

    // condition pour souligné le bon titre

    if (
      $(".undernow_playing").css("display") === "block" ||
      $(".underpopular").css("display") === "block" ||
      $(".undertop_rated").css("display") === "block" ||
      $(".underupcoming").css("display") === "block"
    ) {
      $(
        ".undernow_playing, .underpopular, .undertop_rated, .underupcoming"
      ).css("display", "none");
      $(".under" + typeOfSelection).css("display", "block");
    }

    tab = [];
    i = 0;
    getMovies(typeOfSelection);
  });

  // Appel pour la recuperation de la liste des films.

  function getMovies(element) {
    $.get(
      "https://api.themoviedb.org/3/movie/" + element,
      {
        api_key: api_key,
        language: "fr-FR",
        page: 1,
        region: "FR"
      },
      function(data) {
        let limit = typeOfSelection == "upcoming" ? 11 : 15;
        if (i < limit) {
          var obj = {
            title: data.results[i].title,
            posterPath:
              "https://image.tmdb.org/t/p/w500" + data.results[i].poster_path,
            voteAverage: data.results[i].vote_average,
            overView: data.results[i].overview,
            id: data.results[i].id
          };
          $(".loader").css("display", "block");
          getCredit(data.results[i].id, obj);
        } else {
          $(".loader").css("display", "none");
        }
      }
    ).fail(function(err) {
      console.log("error");
    });
    $("#template-container").loadTemplate("assets/components/card.html", tab);
  }

  // Appel aux informations concernant le nom du réalisateur et des acteurs principaux

  function getCredit(movieId, obj) {
    $.get(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=fbeac58db80c173ab98f88e1773e023b`,
      function(data) {
        //actors: `<a href="#">${data.cast[0].name}</a>, <a href="#">${data.cast[1].name}</a>, <a href="#">${data.cast[2].name}</a>`,
        obj.actors = `${data.cast[0].name}, ${data.cast[1].name}, ${
          data.cast[2].name
        }`;
        obj.director = data.crew[0].name;
      }
    )
      .done(function(data) {
        i++;
        getMovies(typeOfSelection);
      })
      .fail(function(err) {
        console.log("error");
      });
    tab.push(obj);
  }

  // Récupération de la bande annonce

  function getTeaser(id) {
    $.get(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=fbeac58db80c173ab98f88e1773e023b&language=fr-FR`,
      function(data) {
        var key;
        for (var i = 0; i < data.results.length; i++) {
          if (data.results[i].site === "YouTube") {
            key = data.results[i].key;
            break;
          }
        }
        if (!key) {
          alert("pas de teaser");
        } else {
          autoPlayVideo(key, "560", "315");
          $("#videoContainer").css("display", "block");
          $(".background").css("display", "block");
        }
      }
    );
  }

  // Appel à la bande annonce

  $(".cards").on("click", ".teaser", function(event) {
    event.preventDefault();
    getTeaser($(this).attr("id"));
  });

  // Fonction video

  function autoPlayVideo(id, width, height) {
    $("#videoContainer").html(
      '<iframe width="' +
        width +
        '" height="' +
        height +
        '" src="https://www.youtube.com/embed/' +
        id +
        '?autoplay=1&loop=1&rel=0&wmode=transparent" frameborder="0" allowfullscreen wmode="Opaque"></iframe>'
    );
  }

  // Partie du scroll

  $(window).scroll(function() {
    console.log("Scroll position:", $(this).scrollTop());
    if ($(this).scrollTop() > 1) {
      $(".arrow").css("display", "block");
    } else {
      $(".arrow").css("display", "none");
    }
  });

  $(".arrow").on("click", function() {
    //$(window).scrollTop(0);
    $("html").animate(
      {
        scrollTop: 0
      },
      "slow"
    );
    $("#videoContainer").css("display", "none");
    $("#videoContainer").empty();
  });
});

$(window).click(function(event) {
  if ($("#videoContainer").css("display") == "block") {
    $("#videoContainer").css("display", "none");
    $("#videoContainer").empty();
  }
});
