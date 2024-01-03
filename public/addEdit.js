import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showBooks } from "./books.js";

let addEditDiv = null;
let title = null;
let author = null;
let price = null;
let genres = null;
let addingBook = null;

export const handleAddEdit = () => {
    addEditDiv = document.getElementById("edit-book");
    title = document.getElementById("title");
    author = document.getElementById("author");
    price = document.getElementById("price");
    genres = document.getElementById("genres");
    addingBook = document.getElementById("adding-book");
    const editCancel = document.getElementById("edit-cancel");

    addEditDiv.addEventListener("click", async (e) => {
        if (inputEnabled && e.target.nodeName === "BUTTON") {
            if (e.target === addingBook) {
                enableInput(false);

                let method = "POST"
                let url = "/api/v1/books";

                if (addingBook.textContent === "update") {
                    method = "PATCH";
                    url = `/api/v1/books/${addEditDiv.dataset.id}`;
                }

                try {
                    const response = await fetch(url, {
                        method: method,
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            title: title.value,
                            author: author.value,
                            price: price.value,
                            genres: genres.value,
                        })
                    });

                    const data = await response.json();
                    if (response.status === 200 || response.status === 201) {
                        if (response.status === 200) {
                            message.textContent = "The book entry was updated.";
                        } else {
                            message.textContent = `Book added succesfully`;
                        }
                        title.value = "";
                        author.value = "";
                        price.value = "";
                        genres.value = "fiction";
                        showBooks();
                    }
                    else {
                        message.textContent = data.msg;
                    }
                } catch (error) {
                    console.log(error)
                    message.textContent = data.msg
                }
                enableInput(true);
            } else if (e.target === editCancel) {
                message.textContent = "";
                showBooks();
            }
        }
    });
};

export const showAddEdit = async (bookId, buttonClass) => {
    if (!bookId) {
        title.value = "";
        author.value = "";
        price.value = "";
        genres.value = "fiction";
        addingBook.textContent = "add";
        message.textContent = "";

        setDiv(addEditDiv);
    } else {
        enableInput(false);

        let url = `/api/v1/books/${bookId}`;
        let method = "GET";

        if (buttonClass == "deleteButton") {
            method = "DELETE";
        }
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.status === 200) {
                if (buttonClass == "deleteButton") {
                    message.textContent = "The book entry was deleted.";
                    showBooks();
                    return;
                }
                title.value = data.book.title;
                author.value = data.book.author;
                price.value = data.book.price;
                genres.value = data.book.genres;
                addingBook.textContent = "update";
                message.textContent = "";
                addEditDiv.dataset.id = bookId;

                setDiv(addEditDiv);
            } else {
                message.textContent = "The book entry was not found";
                showBooks();
            }
        } catch (error) {
            console.log(error)
            message.textContent = "Communication error";
            showBooks();
        }
        enableInput(true);
    }
};