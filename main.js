const books = [];
const RENDER_EVENT = "render-books";
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
  document.dispatchEvent(new Event(SAVED_EVENT));
}

function savedData() {
  // untuk saveData pada local storage
  if (isStorageExist) {
    const parse = JSON.stringify(books); // dijadikan fromat string json objek di array books
    localStorage.setItem(STORAGE_KEY, parse); // nilai tadi jadi nilai pada key STORAGE_KEY untuk di simpan pada local storage nanti
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function findBook(bookId) {
  // mencari objek buku berdasarkan id
  for (let book of books) {
    if (bookId.id === bookId) {
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

// fungsi menambah buku
function addBook() {
  const titleBook = document.getElementById("bookFormTitle").value;
  const authorBook = document.getElementById("bookFormAuthor").value;
  const yearBook = document.getElementById("bookFormYear").value;

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
function undoBookComplete(bookId){
const bookTarget = findBook(bookId);

if(bookTarget == null) return;

bookTarget.isComplete = false;
document.dispatchEvent(new Event(RENDER_EVENT));
savedData();
}

// hapus data buku, hanya pada rak buku yang selesai dibaca
function removeBookCompleted(bookId){
    const bookTarget = findBookIndex(bookId);

    if(bookTarget.id == -1) return; // karena dicari berdasarkan index, maka dicek apakah -1 atau artinya tidak ada buku pada index 0 maka hentikan program

}