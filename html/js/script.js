function select_tag(b) {
  let searchParams = new URLSearchParams(window.location.search);
  let current_val = searchParams.get("tags");
  let arr = current_val ? current_val.split(".") : [];
  if (arr.includes(b)) {
    arr = arr.filter((i) => i != b);
  } else {
    arr.push(b);
  }
  console.log(arr);
  if (arr.length > 0) searchParams.set("tags", arr.join("."));
  else searchParams.delete("tags");
  window.location.search = searchParams.toString();
}

function select_category(b) {
  let searchParams = new URLSearchParams(window.location.search);
  if (b != "") searchParams.set("category", b);
  else searchParams.delete("category");
  window.location.search = searchParams.toString();
}

function onSumbit(e) {
  e.preventDefault();
}
