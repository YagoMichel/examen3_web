$(document).ready(function () {
  $("#searchInput").on("input", function () {
    const query = $(this).val().trim();

    if (query.length < 3) {
      $("#suggestionsContainer").hide().empty();
      return;
    }

    $.ajax({
      url: "/api/search/suggestions",
      data: { query: query },
      success: function (result) {
        const container = $("#suggestionsContainer");
        container.empty();

        if (result.length > 0) {
          result.forEach(function (suggestion) {
            const div = $("<div></div>")
              .text(suggestion)
              .addClass("px-4 py-2 hover:bg-gray-200 cursor-pointer")
              .on("click", function () {
                $("#searchInput").val(suggestion);
                container.hide();
              });

            container.append(div);
          });

          container.show();
        } else {
          container.hide();
        }
      },
      error: function () {
        console.error("Error al obtener sugerencias");
      }
    });
  });

  // Ocultar sugerencias si se hace clic fuera
  $(document).on("click", function (e) {
    if (!$(e.target).closest("#searchInput, #suggestionsContainer").length) {
      $("#suggestionsContainer").hide();
    }
  });
});