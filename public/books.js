import {
    inputEnabled,
    setDiv,
    message,
    setToken,
    token,
    enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";

let booksDiv = null;
let booksTable = null;
let booksTableHeader = null;

export const handleBooks = () => {
    booksDiv = document.getElementById("books");
    const logoff = document.getElementById("logoff");
    const addBook = document.getElementById("add-book");
    booksTable = document.getElementById("books-table");
    booksTableHeader = document.getElementById("books-table-header");

    booksDiv.addEventListener("click", (e) => {
        if (inputEnabled && e.target.nodeName === "BUTTON") {
            if (e.target === addBook) {
                showAddEdit(null);
            } else if (e.target === logoff) {
                setToken(null);
                message.textContent = "You have been logged off.";
                booksTable.replaceChildren([booksTableHeader]);
                showLoginRegister();
            }
            else if (e.target.classList.contains("editButton") || e.target.classList.contains("deleteButton")) {
                let buttonClass = "";
                if (e.target.classList.contains("editButton")) {
                    buttonClass = "editButton";
                } else {
                    buttonClass = "deleteButton";
                }
                message.textContent = "";
                showAddEdit(e.target.dataset.id, buttonClass);
            }
        }
    });
};

export const showBooks = async () => {
    try {
        enableInput(false);
        const response = await fetch("/api/v1/books", {
            method: "GET",
            headers: {
                "CONTENT-TYPE": "application/json",
                AUTHORIZATION: `Bearer ${token}`,
            }
        });

        const data = await response.json();
        let children = [booksTableHeader];

        if (response.status === 200) {
            if (data.count === 0) {
                booksTable.replaceChildren(...children);
            }
            else {
                for (let i = 0; i < data.books.length; i++) {
                    let rowEntry = document.createElement("tr");
                    let editButton = `<td><button type="button" class="editButton" data-id=${data.books[i]._id}>edit</button></td>`;
                    let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.books[i]._id}>delete</button></td>`;
                    let rowHTML = `
                        <td>${data.books[i].title}</td>
                        <td>${data.books[i].author}</td>
                        <td>${data.books[i].price}</td>
                        <td>${data.books[i].genres}</td>
                        <div>${editButton}${deleteButton}</div>`;

                    rowEntry.innerHTML = rowHTML;
                    children.push(rowEntry);
                }
                booksTable.replaceChildren(...children);
            }
        } else {
            message.textContent = data.msg;
        }
    } catch (error) {
        console.log(error)
        message.textContent = "A communication error occurred.";
    }
    enableInput(true);
    setDiv(booksDiv);
};