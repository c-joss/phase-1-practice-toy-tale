let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});


async function fetchToys() {
  try {
    const response = await fetch("http://localhost:3000/toys");
    if (!response.ok) {
      throw new Error("Error Fetching Toys");
    }
    const toys = await response.json();
    renderToys(toys);
  } catch (error) {
    console.error("Error", error)
  }
}

function renderToys(toys) {
  const toyList = document.getElementById("toy-collection");
  toyList.textContent = "";

  toys.forEach(toy => {
    const toyCard = document.createElement("div");
    toyCard.classList.add("toy-card");
    toyCard.id = toy.id;

    const img = document.createElement("img");
    img.src = toy.image;
    img.classList.add("toy-avatar");
    img.alt = toy.name;
    img.width = 300;

    const title = document.createElement("h2");
    title.textContent = toy.name;

    const btn = document.createElement("button");
    btn.classList.add("like-btn");
    btn.id = toy.id;
    btn.textContent = "like";

    const likes = document.createElement("p");
    likes.textContent = `${toy.likes} Likes`;

    toyCard.appendChild(title);
    toyCard.appendChild(img);
    toyCard.appendChild(likes);
    toyCard.appendChild(btn);    

    toyList.appendChild(toyCard);
  });
}

async function createToy(toyData) {
  try {
    const response = await fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(toyData),
    });

    if (!response.ok) {
      throw new Error("Can't add new toy")
    }

    const newToy = await response.json();
    return newToy
  } catch (error) {
    console.error ("Error:", error);
  }
}

document.querySelector(".add-toy-form").addEventListener("submit", (e) => {
  e.preventDefault();
  
  const name = document.querySelector("input[name='name']").value;
  const image = document.querySelector("input[name='image']").value;
  const likes = 0;

  const toyData = {
    name,
    image,
    likes
  };

  createToy(toyData)
    .then(() => fetchToys())
  .catch((error) => console.error("Error adding toy:",error));
});

document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  toyCollection.addEventListener("click", (e) => {
    if (e.target.classList.contains("like-btn")) {
      const toyId = e.target.id;
      const toyCard = document.getElementById(toyId);
      const likesParagraph = toyCard.querySelector("p");

      let newLikes = parseInt(likesParagraph.textContent) + 1;
      likesParagraph.textContent = `${newLikes} Likes`; 
  
      updateLikes(toyId, newLikes);
    }
  });
});

async function updateLikes(toyId, newLikes) {
  try {
    const response = await fetch(`http://localhost:3000/toys/${toyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ likes: newLikes}),
    });

    if (!response.ok) {
      throw new Error("Failed");
    }

    const updateToy = await response.json();
    console.log("Toy likes updated:", updateToy)
  } catch (error) {
    console.error("Error:", error);
  }
}

document.addEventListener("DOMContentLoaded", fetchToys);
