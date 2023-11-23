function select_tag() {
  console.log("selected");
}

function select_category(b) {
  var searchParams = new URLSearchParams(window.location.search);
  if (b != "") searchParams.set("category", b);
  else searchParams.delete(category);
  window.location.search = searchParams.toString();
}
