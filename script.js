
const papers = [
  {
    title: "On a Heuristic Point of View Concerning the Production and Transformation of Light",
    url: "https://doi.org/10.1002/andp.19053220607",
    year: 1905,
    journal: "Annalen der Physik",
    summary: "Proposes that light comes in discrete packets of energy, explaining the photoelectric effect."
  },
  {
    title: "On the Movement of Small Particles Suspended in Stationary Liquids",
    url: "https://doi.org/10.1002/andp.19053220806",
    year: 1905,
    journal: "Annalen der Physik",
    summary: "Explains Brownian motion and gives evidence that atoms and molecules exist."
  },
  {
    title: "On the Electrodynamics of Moving Bodies",
    url: "https://doi.org/10.1002/andp.19053221004",
    year: 1905,
    journal: "Annalen der Physik",
    summary: "Introduces the special theory of relativity and rethinks space and time."
  },
  {
    title: "Does the Inertia of a Body Depend Upon Its Energy Content?",
    url: "https://doi.org/10.1002/andp.19053231314",
    year: 1905,
    journal: "Annalen der Physik",
    summary: "Shows that mass and energy are linked, leading to the equation E = mc²."
  },
  {
    title: "On the Quantum Theory of Radiation",
    url: "https://forohistorico.coit.es/index.php/biblioteca/articulos-seminales/item/zur-quantentheorie-der-strahlung-the-quantum-theory-of-radiation",
    year: 1917,
    journal: "Physikalische Zeitschrift",
    summary: "Describes stimulated emission, the idea behind the laser."
  },
  {
    title: "The Foundation of the General Theory of Relativity",
    url: "https://doi.org/10.1002/andp.19163540702",
    year: 1916,
    journal: "Annalen der Physik",
    summary: "Presents gravity as the curvature of spacetime."
  },
  {
    title: "Quantum Theory of the Monatomic Ideal Gas",
    url: "https://en.wikipedia.org/wiki/Bose%E2%80%93Einstein_condensate",
    year: 1924,
    journal: "Prussian Academy of Sciences",
    summary: "Extends Bose's work on photons to atoms, predicting Bose-Einstein condensation."
  },
  {
    title: "Can Quantum-Mechanical Description of Physical Reality Be Considered Complete?",
    url: "https://doi.org/10.1103/PhysRev.47.777",
    year: 1935,
    journal: "Physical Review",
    summary: "Written with Podolsky and Rosen, it questions whether quantum mechanics tells the whole story."
  }
];

const grid = document.getElementById("paper-grid");

function buildPaper(paper) {
  const card = document.createElement("article");
  card.className = "paper";

  const icon = document.createElement("img");
  icon.src = "images/paper-icon.svg";
  icon.alt = "";
  icon.width = 40;
  icon.height = 40;

  // The title is a link; CSS stretches it so the whole block is clickable
  const link = document.createElement("a");
  link.href = paper.url;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = paper.title;

  const title = document.createElement("h3");
  title.appendChild(link);

  const meta = document.createElement("p");
  meta.className = "meta";
  meta.textContent = paper.journal + ", " + paper.year;

  const summary = document.createElement("p");
  summary.className = "summary";
  summary.textContent = paper.summary;

  card.append(icon, title, meta, summary);
  return card;
}

papers.forEach(function (paper) {
  grid.appendChild(buildPaper(paper));
});

document.getElementById("year").textContent = new Date().getFullYear();

//Blog

const STORAGE_KEY = "einstein-blog-posts";

const form = document.getElementById("blog-form");
const titleInput = document.getElementById("post-title");
const bodyInput = document.getElementById("post-body");
const imageInput = document.getElementById("post-image");
const statusEl = document.getElementById("form-status");
const postList = document.getElementById("post-list");
const dialog = document.getElementById("confirm-dialog");

let posts = loadPosts();
let pendingPost = null;

function loadPosts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function savePosts() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    return true;
  } catch (error) {
    return false; // storage full or not available
  }
}

function readImage(file) {
  return new Promise(function (resolve) {
    const reader = new FileReader();
    reader.onload = function () { resolve(reader.result); };
    reader.onerror = function () { resolve(""); };
    reader.readAsDataURL(file);
  });
}

function buildPost(post, index) {
  const article = document.createElement("article");
  article.className = "post";

  if (post.image) {
    const img = document.createElement("img");
    img.src = post.image;
    img.alt = "";
    article.appendChild(img);
  }

  const title = document.createElement("h3");
  title.textContent = post.title;

  const time = document.createElement("time");
  time.dateTime = post.date;
  time.textContent = new Date(post.date).toLocaleDateString(undefined, {
    year: "numeric", month: "long", day: "numeric"
  });

  article.append(title, time);

  // A blank line in the text starts a new paragraph
  post.body.split(/\n\s*\n/).forEach(function (chunk) {
    const p = document.createElement("p");
    p.textContent = chunk.trim();
    article.appendChild(p);
  });

  // Lets Einstein remove his own article
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "post-delete";
  remove.textContent = "Delete";
  remove.addEventListener("click", function () {
    if (confirm("Delete this article?")) {
      posts.splice(index, 1);
      savePosts();
      renderPosts(false);
    }
  });
  article.appendChild(remove);

  return article;
}

function renderPosts(highlightFirst) {
  postList.textContent = "";

  if (posts.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No articles yet. Write your first one and press Publish.";
    postList.appendChild(empty);
    return;
  }

  posts.forEach(function (post, index) {
    const card = buildPost(post, index);
    if (highlightFirst && index === 0) card.classList.add("is-new");
    postList.appendChild(card);
  });
}

// Step 1: the form is submitted, so ask for confirmation
form.addEventListener("submit", async function (event) {
  event.preventDefault();
  statusEl.textContent = "";

  const file = imageInput.files[0];
  pendingPost = {
    title: titleInput.value.trim(),
    body: bodyInput.value.trim(),
    date: new Date().toISOString(),
    image: file ? await readImage(file) : ""
  };

  dialog.showModal();
});

// Step 2: Yes publishes the post, No keeps the draft in the form
dialog.addEventListener("close", function () {
  if (dialog.returnValue === "yes" && pendingPost) {
    posts.unshift(pendingPost);
    const saved = savePosts();
    renderPosts(true);
    form.reset();
    statusEl.textContent = saved
      ? "Published."
      : "Published, but it could not be saved in this browser. Try a smaller photo.";
  }
  pendingPost = null;
  dialog.returnValue = "";
});

renderPosts(false);

// Extra sections
// Each list is data
const ideas = [
  { tag: "1905", title: "Special relativity", text: "The laws of physics are the same for everyone moving at a steady speed, and the speed of light never changes. Space and time are linked." },
  { tag: "1905", title: "E = mc\u00b2", text: "Mass and energy are two forms of the same thing. A tiny amount of mass holds a huge amount of energy." },
  { tag: "1905", title: "Photoelectric effect", text: "Light arrives in tiny packets of energy. This idea helped start quantum theory." },
  { tag: "1915", title: "General relativity", text: "Gravity is not a pull. It is the bending of space and time by mass." }
];

const timeline = [
  { tag: "1879", title: "Born in Ulm", text: "I was born in Ulm, Germany, and grew up curious about compasses and geometry." },
  { tag: "1896", title: "Studied in Zurich", text: "I enrolled at the Swiss Federal Polytechnic to train as a physics and mathematics teacher." },
  { tag: "1902", title: "Patent office in Bern", text: "I began work as a patent examiner, which left me time to think about physics." },
  { tag: "1905", title: "Four famous papers", text: "In one year I published work on light, atoms, relativity and the link between mass and energy." },
  { tag: "1919", title: "Starlight bends", text: "A solar eclipse showed that light bends around the Sun, as my general theory of relativity predicted." },
  { tag: "1921", title: "Nobel Prize in Physics", text: "Awarded for my explanation of the photoelectric effect." },
  { tag: "1933", title: "Moved to Princeton", text: "I settled in the United States to work at the Institute for Advanced Study." },
  { tag: "1940", title: "American citizen", text: "I became a United States citizen and kept my Swiss citizenship." }
];

const awards = [
  { tag: "1921", title: "Nobel Prize in Physics", text: "Awarded for services to theoretical physics, especially the law of the photoelectric effect." },
  { tag: "1925", title: "Copley Medal", text: "Given by the Royal Society of London for my work on relativity and quantum theory." },
  { tag: "1929", title: "Max Planck Medal", text: "Given by the German Physical Society. Max Planck and I were the first to receive it." },
  { tag: "1935", title: "Franklin Medal", text: "Given by the Franklin Institute in Philadelphia for my contributions to physics." }
];

const hobbies = [
  { title: "Violin", text: "Music helps me think. I played the violin for most of my life." },
  { title: "Sailing", text: "Quiet hours on a small boat are a good place for big questions." },
  { title: "Walking", text: "A long walk clears my head better than any desk." },
  { title: "Thought experiments", text: "Imagining what it would be like to chase a beam of light led me to relativity." }
];

const gallery = [
  { src: "images/child.jpg", alt: "Albert Einstein as a boy, seated in front of a painted landscape", caption: "Albert Einstein as a child" },
  { src: "images/Albert.jpg", alt: "Portrait of Albert Einstein sitting at an angle with his arm resting on a chair", caption: "Albert Einstein, portrait" },
  { src: "images/friends.jpg", alt: "Albert Einstein with two friends in a studio portrait", caption: "Albert Einstein with friends Habicht and Solovine, ca. 1903" },
  { src: "images/studios.jpg", alt: "Albert Einstein at a desk with papers and a lamp", caption: "Einstein, photo from 1920" },
  { src: "images/conf.jpg", alt: "Group photograph of the participants of the 1927 Solvay Conference", caption: "Solvay Conference 1927" },
  { src: "images/wife.jpg", alt: "Albert Einstein holding a pipe, smiling with his wife Elsa on a ship", caption: "Einstein with his wife Elsa" }
];

const quotes = [
  { text: "Imagination is more important than knowledge.", source: "Interview, The Saturday Evening Post, 1929" },
  { text: "The important thing is not to stop questioning.", source: "Life magazine, 1955" },
  { text: "I have no special talent. I am only passionately curious.", source: "Letter to Carl Seelig, 1952" },
  { text: "The most beautiful thing we can experience is the mysterious.", source: "Essay \u201cWhat I Believe\u201d, 1930" }
];

function buildQuote(item) {
  const block = document.createElement("blockquote");
  block.className = "quote";
  const text = document.createElement("p");
  text.textContent = "\u201c" + item.text + "\u201d";
  const source = document.createElement("footer");
  source.textContent = item.source;
  block.append(text, source);
  return block;
}

function buildCard(item) {
  const card = document.createElement("article");
  card.className = "card";
  if (item.tag) {
    const tag = document.createElement("p");
    tag.className = "meta";
    tag.textContent = item.tag;
    card.appendChild(tag);
  }
  const title = document.createElement("h3");
  title.textContent = item.title;
  const text = document.createElement("p");
  text.className = "summary";
  text.textContent = item.text;
  card.append(title, text);
  return card;
}

function buildFigure(item) {
  const figure = document.createElement("figure");
  figure.className = "gallery-item";
  const img = document.createElement("img");
  img.src = item.src;
  img.alt = item.alt;
  img.loading = "lazy";
  const caption = document.createElement("figcaption");
  caption.textContent = item.caption;
  figure.append(img, caption);
  return figure;
}

function fill(id, items, builder) {
  const target = document.getElementById(id);
  items.forEach(function (item) { target.appendChild(builder(item)); });
}

fill("ideas-grid", ideas, buildCard);
fill("timeline-grid", timeline, buildCard);
fill("awards-grid", awards, buildCard);
fill("hobbies-grid", hobbies, buildCard);
fill("quotes-grid", quotes, buildQuote);
fill("gallery-grid", gallery, buildFigure);

//Contact form
// Sends the message to Netlify Forms without reloading, then shows a confirmation.
const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");

contactForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  contactStatus.textContent = "Sending...";

  try {
    const response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(contactForm)).toString()
    });
    if (!response.ok) throw new Error("Request failed");
    contactForm.reset();
    contactStatus.textContent = "Thank you! Your message has been sent.";
  } catch (error) {
    contactStatus.textContent = "Sorry, your message could not be sent. Please try again once the site is online.";
  }
});
// Mobile menu
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.getElementById("site-nav");

function setMenu(open) {
  siteNav.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", open);
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

navToggle.addEventListener("click", function () {
  setMenu(!siteNav.classList.contains("is-open"));
});

// Close the menu after choosing a link, or when Escape is pressed
siteNav.addEventListener("click", function (event) {
  if (event.target.tagName === "A") setMenu(false);
});
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") setMenu(false);
});