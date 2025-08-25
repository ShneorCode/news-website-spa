// מפתחות API
const API_KEY = "a96c9cf6f512db9ad3d7746fdb6dbd3a";
const API_URL = `https://gnews.io/api/v4/top-headlines?lang=en&token=${API_KEY}`;

// קונטיינר ראשי
const appContainer = document.getElementById("app-container");
let newsData = [];

// משיכת חדשות
const fetchNews = async () => {
  try {
    const cachedNews = localStorage.getItem("newsData");

    if (cachedNews) {
      newsData = JSON.parse(cachedNews);
      return;
    }

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch news");
    }

    const data = await response.json();
    newsData = data.articles.map((article) => ({
      title: article.title,
      description: article.description,
      content: article.content,
      image: article.image,
      source: article.source,
      author: article.author,
      isUserStory: false,
    }));

    localStorage.setItem("newsData", JSON.stringify(newsData));
  } catch (error) {
    console.error("Error fetching news:", error);
  }
};

// יצירת Header
const getHeader = () => {
  const header = document.createElement("header");
  header.className = "header";

  const title = document.createElement("h1");
  title.textContent = "News Now";

  const nav = document.createElement("nav");

  const homeLink = document.createElement("a");
  homeLink.href = "#";
  homeLink.textContent = "News";
  homeLink.addEventListener("click", (e) => {
    e.preventDefault();
    getHomePage();
  });

  const createLink = document.createElement("a");
  createLink.href = "#";
  createLink.textContent = "Submit News";
  createLink.addEventListener("click", (e) => {
    e.preventDefault();
    getCreateStoryPage();
  });

  nav.appendChild(homeLink);
  nav.appendChild(createLink);
  header.appendChild(title);
  header.appendChild(nav);

  document.body.prepend(header);
};

// יצירת דף הבית - חדשות
const getHomePage = () => {
  appContainer.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "news-card-grid";

  newsData.forEach((newsItem, index) => {
    const card = document.createElement("div");
    card.className = "news-card";

    /*  כפתור מחיקה  */
    // const deleteBtn = document.createElement('button');
    // deleteBtn.textContent = 'delete';
    // deleteBtn.className = 'delete-btn';
    // deleteBtn.addEventListener('click', (e) => {
    //     e.stopPropagation();
    //     deleteNewsItem(index);
    // });

    const image = document.createElement("img");
    image.className = "news-card-image";
    image.src = newsItem.image;
    image.alt = newsItem.title;

    const contentDiv = document.createElement("div");
    contentDiv.className = "news-card-content";

    const title = document.createElement("h3");
    title.textContent = newsItem.title;

    const author = document.createElement("p");
    author.textContent = `Author: ${
      newsItem.author || newsItem.source?.name || "Unknown"
    }`;

    contentDiv.appendChild(title);
    contentDiv.appendChild(author);
    // card.appendChild(deleteBtn);
    card.appendChild(image);
    card.appendChild(contentDiv);

    card.addEventListener("click", () => renderExpandedStory(newsItem));
    grid.appendChild(card);
  });
  appContainer.appendChild(grid);
};

// מחיקת כתבה
const deleteNewsItem = (index) => {
  newsData.splice(index, 1);
  localStorage.setItem("newsData", JSON.stringify(newsData));
  getHomePage();
};

// דף כתבה מורחבת
const getExpandedStory = (story) => {
  appContainer.innerHTML = "";
  const storyDiv = document.createElement("div");
  storyDiv.className = "expanded-story";

  const image = document.createElement("img");
  image.className = "story-image";
  image.src = story.image;
  image.alt = story.title;

  const title = document.createElement("h2");
  title.textContent = story.title;

  const description = document.createElement("p");
  description.className = "story-content";
  description.textContent = story.description || story.content || "";

  storyDiv.appendChild(image);
  storyDiv.appendChild(title);
  storyDiv.appendChild(description);

  appContainer.appendChild(storyDiv);
};

// דף שליחת כתבה
const getCreateStoryPage = () => {
  appContainer.innerHTML = "";
  const form = document.createElement("form");
  form.className = "create-form";
  form.id = "create-story-form";

  const titleElement = document.createElement("h2");
  titleElement.textContent = "Submit News";
  form.appendChild(titleElement);

  const fields = [
    { label: "title", id: "title", type: "text" },
    { label: "author", id: "author", type: "text" },
    { label: "image url", id: "image", type: "url" },
  ];

  fields.forEach((field) => {
    const label = document.createElement("label");
    label.setAttribute("for", field.id);
    label.textContent = field.label;
    const input = document.createElement("input");
    input.type = field.type;
    input.id = field.id;
    input.name = field.id;
    input.required = true;
    form.appendChild(label);
    form.appendChild(input);
  });

  const contentLabel = document.createElement("label");
  contentLabel.setAttribute("for", "content");
  contentLabel.textContent = "content";
  const contentTextarea = document.createElement("textarea");
  contentTextarea.id = "content";
  contentTextarea.name = "content";
  contentTextarea.rows = 10;
  contentTextarea.required = true;
  form.appendChild(contentLabel);
  form.appendChild(contentTextarea);

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "submit";
  form.appendChild(submitButton);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const newStory = {
      author: form.author.value,
      title: form.title.value,
      image: form.image.value,
      content: form.content.value,
      isUserStory: true,
    };
    newsData.unshift(newStory);
    localStorage.setItem("newsData", JSON.stringify(newsData));

    const successMessage = document.createElement("div");
    successMessage.className = "success-message";
    successMessage.textContent = "!Article submitted successfully";
    appContainer.innerHTML = "";
    appContainer.appendChild(successMessage);

    setTimeout(geterHomePage, 2000);
  });

  appContainer.appendChild(form);
};

// טעינת האתר
document.addEventListener("DOMContentLoaded", async () => {
  getHeader();
  await fetchNews();
  getHomePage();
});
