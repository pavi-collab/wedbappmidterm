# Albert Einstein: Personal Website

A responsive personal website for a fictional Albert Einstein, built for the CSCI-6655 midterm. In the scenario, Einstein has been brought to the present day and wants a place online for his photo, his published papers and a blog. The site is the first step before a larger online learning platform.

**Live site:** https://github.com/pavi-collab/wedbappmidterm
**Author:** Pavani Dabbugottu

> The scenario and characters are fictional and exist only for this exam.

## What is on the site

| Section | What it shows |
|---|---|
| Hero | Einstein's tongue-out photo with a short introduction |
| About me | A short paragraph with a link to his Wikipedia page |
| Published papers | One block per paper, all sharing a single paper icon. Each block links to the paper |
| Key ideas | Relativity, E = mc² and the photoelectric effect in plain words |
| Life timeline | Milestones from 1879 onward |
| Awards | Major medals and prizes |
| Hobbies | Violin, sailing, walking and thought experiments |
| Favorite quotes | Quotes with a documented source |
| Image collection | A photo gallery with captions |
| Blog | A form where Einstein writes and publishes his own articles |
| Contact | A message form |

## How it meets the brief

- **Elegant, subtle colors:** a soft mist, white and dusty-blue palette with Cormorant Garamond headings and Karla body text.
- **Same layout on a small laptop and a big screen:** content sits in a centered container with a maximum width of 1120px.
- **CSS Grid for the layout:** the page frame, header, hero, every card grid, the gallery and the blog and contact sections all use Grid.
- **Easy to expand:** the papers, key ideas, timeline, awards, hobbies, quotes and gallery are lists in `script.js`. Adding one object adds one block, with no HTML changes.
- **Readable on a phone:** a viewport meta tag, a single-column layout under 760px, larger text and tap targets, and a hamburger menu for the navigation.

## The blog

1. Einstein enters a title, the article text and an optional photo.
2. He presses **Publish**, and a box asks "Publish this article?"
3. **Yes** adds the article to the list beside the form, newest first, with its photo, title and date. **No** keeps his draft in the form.
4. Each article has a **Delete** button.

The blog list starts empty and shows "No articles yet." until he publishes something.

**Limitation:** articles are stored in the browser's `localStorage`. They survive a refresh, but they are visible only in the browser that published them. A server and database would be needed to share articles with other visitors, which the future learning platform would require.

## Contact form

The form is written for **Netlify Forms**. On Netlify, messages appear in the site's Forms tab. On other hosts, such as GitHub Pages, pressing Send shows an error message because there is nothing to receive the message.

## Project structure

```
index.html     Page structure
style.css      Styles, layout (CSS Grid) and responsive rules
script.js      Content lists, blog, contact form and mobile menu
images/        Photos and icons
```

## Adding content

Open `script.js` and add an object to the matching list.

```js
// papers: title, url, year, journal, summary
{ title: "Paper title", url: "https://...", year: 1905, journal: "Journal", summary: "One sentence." }

// ideas, timeline, awards, hobbies: tag (optional), title, text
{ tag: "1940", title: "American citizen", text: "Short description." }

// quotes: text, source
{ text: "Quote text.", source: "Where it was said, year" }

// gallery: src, alt, caption
{ src: "images/photo.jpg", alt: "Describe the photo", caption: "Caption" }
```

Put new photos in the `images/` folder and match the filename exactly, including capital letters, because GitHub Pages is case-sensitive.

## Run it locally

Download the project and open `index.html` in a browser. No build step or install is needed.

## Deploy with GitHub Pages

1. Push the files to a public repository with `index.html` at the top level.
2. Go to **Settings**, then **Pages**.
3. Choose **Deploy from a branch**, select `main` and `/ (root)`, and save.
4. Open the link GitHub shows after a minute or two.

## Built with

HTML5, CSS3 (Grid, custom properties, transitions, keyframe animation, `dialog::backdrop`) and vanilla JavaScript. There are no frameworks or external code libraries. Fonts come from Google Fonts.

## Image credits

Add the source and license for each photo in `images/` here, for example from Wikimedia Commons.
