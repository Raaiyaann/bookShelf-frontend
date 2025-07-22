const books = [];
const RENDER_EVENT = "render-books"; //mengontrol kapan UI (halaman HTML) harus diperbarui (di-render ulang)
const SAVED_EVENT = "saved-books";
const STORAGE_KEY = "BOOKSHELF_APPS";

function generateId() {
  return +new Date(); // ini nanti menghasilkan milidetik
}
function isStorageExist() {
  // fungsi boolean
  if (typeof Storage === undefined) {
    alert("browser Tidak mendukung local storage");
    return false;
  }
  return true;
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData); // jadikan data di variabel serialized ini menjadi format json
  if (data !== null) {
    for (let book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function savedData() {
  // untuk saveData pada local storage
  if (isStorageExist()) {
    const parse = JSON.stringify(books); // dijadikan fromat string json objek di array books
    localStorage.setItem(STORAGE_KEY, parse); // nilai tadi jadi nilai pada key STORAGE_KEY untuk di simpan pada local storage nanti
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}
function findBook(bookId) {
  // mencari objek buku berdasarkan id
  for (let book of books) {
    if (book.id === bookId) {
      return book;
    }
  }
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function searchBook() {
  const titleBook = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const bookList = books;
  const foundBook = bookList.find(
    (book) => book.title.toLowerCase() === titleBook
  );
  if (foundBook) {
    alert("BUKUNYA TERSEDIA !!!");
    return foundBook;
  } else {
    alert("Maaf Buku yang Anda Cari Tidak Ada :(");
  }
}

// fungsi menambah buku
function addBook() {
  const titleBook = document.getElementById("bookFormTitle").value;
  const authorBook = document.getElementById("bookFormAuthor").value;
  const yearBook = Number(document.getElementById("bookFormYear").value);

  const generateID = generateId();
  const bookObject = generateBookObject(
    generateID,
    titleBook,
    authorBook,
    yearBook,
    false
  ); // ini menyimpan buku Objek dengan menggunakan fungsi diatas, dan isComplete masih false
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  savedData();
}

// fungsi untuk buat bukunya selesai dibaca
function addBookComplete(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;
  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  savedData();
}
// mengembalikan state buku jadi belum dibaca
function undoBookComplete(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  savedData();
}

// hapus data buku, hanya pada rak buku yang selesai dibaca
function removeBookCompleted(bookId) {
  const bookTargetId = findBookIndex(bookId);

  if (bookTargetId.id === -1) return; // karena dicari berdasarkan index, maka dicek apakah -1 atau artinya tidak ada buku pada index 0 maka hentikan program

  books.splice(bookTargetId, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  savedData();
}

// fungsi untuk buat containernya saat datanya ditambahkan
function makeBook(bookObject) {
  const bookTitle = document.createElement("h3");
  bookTitle.innerText = bookObject.title;
  bookTitle.setAttribute("data-testid", "bookItemTitle");

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = `Penulis: ${bookObject.author}`;
  bookAuthor.setAttribute("data-testid", "bookItemAuthor");

  const bookYear = document.createElement("p");
  bookYear.innerText = `Tahun: ${bookObject.year}`;
  bookYear.setAttribute("data-testid", "bookItemYear");

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("container-button");

  const container = document.createElement("div");
  container.setAttribute("data-bookid", "123123123");
  container.setAttribute("data-testid", "bookItem");
  container.classList.add("book-item");
  container.append(bookTitle, bookAuthor, bookYear); // ini untuk tambah textnya

  if (bookObject.isComplete) {
    const deleteButton = document.createElement("button");
    deleteButton.innerText = `Hapus Buku`;
    deleteButton.setAttribute("data-testid", "bookItemDeleteButton");

    const unfinishedButton = document.createElement("button");
    unfinishedButton.innerText = `Belum Selesai Dibaca`;
    unfinishedButton.setAttribute("data-testid", "bookItemIsCompleteButton");

    deleteButton.addEventListener("click", function () {
      removeBookCompleted(bookObject.id);
    });
    unfinishedButton.addEventListener("click", function () {
      undoBookComplete(bookObject.id);
    });
    buttonContainer.append(deleteButton, unfinishedButton);
  } else {
    const finishButton = document.createElement("button");
    finishButton.innerText = `Selesai Dibaca`;
    finishButton.setAttribute("data-testid", "bookItemIsCompleteButton");

    finishButton.addEventListener("click", function () {
      addBookComplete(bookObject.id);
    });

    const editButton = document.createElement("button");
    editButton.innerText = `Edit Buku`;
    editButton.setAttribute("data-testid", "bookItemEditButton");

    editButton.addEventListener("click", function () {
      // ---> belum ada, nanti dibuat <---
    });
    const deleteButton = document.createElement("button");
    deleteButton.innerText = `Hapus Buku`;
    deleteButton.setAttribute("data-testid", "bookItemDeleteButton");

    deleteButton.addEventListener("click", function () {
      removeBookCompleted(bookObject.id);
    });

    buttonContainer.append(finishButton, editButton, deleteButton); // bungkus dulu ke dalam div button-container
  }
  container.append(buttonContainer);
  return container;
}

document.addEventListener("DOMContentLoaded", function () {
  const submitBookForm = document.getElementById("bookForm");
  const searchBookForm = document.getElementById("searchBook");
  submitBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
    event.target.reset(); // supaya saat submit book, nilai di inputnya jadi ke reset ulang
  });

  searchBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });

  document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookList = document.getElementById("incompleteBookList");
    incompleteBookList.innerHTML = "";

    const completeBookList = document.getElementById("completeBookList");
    completeBookList.innerHTML = "";

    for (const bookItem of books) {
      const bookElement = makeBook(bookItem); // fungsi untuk buat struktur htmlnya
      if (!bookItem.isComplete) {
        incompleteBookList.append(bookElement);
      } else {
        completeBookList.append(bookElement);
      }
    }
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
