function remove_themes_already_applied() {
  themes_already_applied = document.querySelector(".theme");
  for (const theme in themes_already_applied) {
    if (Object.hasOwnProperty.call(themes_already_applied, theme)) {
      const theme = themes_already_applied[theme];
      theme.remove();
    }
  }
}

function append_theme(href) {
  let el = document.createElement("link");
  el.rel = "stylesheet";
  el.href = href;
  el.classList.add("theme");
  document.head.appendChild(el);
}

function change_to_theme(
  mode = document.querySelector("#theme_selector").value
) {
  remove_themes_already_applied();

  for (let index = 0; index < Object.keys(themes_paths).length; index++) {
    const key = Object.keys(themes_paths)[index];
    if (key == mode) {
      append_theme(Object.values(themes_paths)[index]);
      break;
    }
  }
}

function open_sidebar() {
  document.querySelector(".sidebar").classList.add("open_sidebar");
}

function close_sidebar() {
  document.querySelector(".sidebar").classList.remove("open_sidebar");
}

function put_themes_list() {
  for (const theme in themes_paths) {
    option = document.createElement("option");
    option.innerHTML = theme;
    document.querySelector("#theme_selector").appendChild(option);
  }
}

let themes_paths = {
  dark: "styles/dark mode.css",
  light: "styles/light mode.css",
};

async function fetchingdata(query) {
  return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`)
    .then((response) => {
      if (!response.ok) {
        return new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      return parsingData(data);
    })
    .catch((error) => {
      return "Some error occoured:<br />  You can check your internet connection<br />  or you can try another query";
    });
}

async function parsingData(wordData) {
  const result = {};

  for (const meaning of wordData[0].meanings) {
    const partOfSpeech = meaning.partOfSpeech;
    const definitions = meaning.definitions.slice(0, 5); // Get up to 5 definitions

    result[partOfSpeech] = definitions;
  }
  return result;
}

function beautifyingData(data) {
  let result = "";
  for (const [pos, meanings] of Object.entries(data)) {
    result += `${pos}:<br />`;
    meanings.forEach((meaning) => {
      result += `   ${meaning.definition}<br />`;
    });
    result += `<br />`;
  }
  return result;
}
function show_input(event) {
  event.preventDefault();
  input = document.createElement("div");

  input.style.width = "30vw";
  input.style.margin = "10px 10px 10px Auto";

  input.style.background = "inherit";
  input.style.borderRadius = "10px";
  input.style.textWrap = "wrap";

  user_query = document.querySelector("[name=user_query]").value;
  input.innerHTML = user_query;
  document.querySelector(".textarea").appendChild(input);
  get_output(user_query);
}

async function get_output(input) {
  raw_output = await fetchingdata(input);
  if (
    raw_output !=
    "Some error occoured:<br />  You can check your internet connection<br />  or you can try another query"
  ) {
    output = beautifyingData(raw_output);
  } else {
    output = raw_output;
  }
  output_div = document.createElement("div");

  output_div.style.width = "30vw";
  output_div.style.margin = "30px";

  output_div.style.background = "inherit";
  output_div.style.borderRadius = "10px";
  output_div.innerHTML = `${output}`;

  document.querySelector(".textarea").appendChild(output_div);
}

function main() {
  document
    .querySelector("#menu_button")
    .addEventListener("click", open_sidebar);

  document
    .querySelector("#exit_sidebar")
    .addEventListener("click", close_sidebar);

  document.querySelector("[name=submit]").addEventListener("click", show_input);

  put_themes_list();
}

main();
