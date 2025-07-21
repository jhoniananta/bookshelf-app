// Local storage key for storing data
const STORAGE_KEY = "bookshelf-app-data";

// Array untuk menyimpan data buku
let books = [];

// Function untuk mengecek dukungan localStorage dari browser
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser tidak mendukung localStorage.");
    return false;
  }
  return true;
}

// Function untuk menyimpan data ke localStorage
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

// Function untuk memuat data dari localStorage
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
}

// Function untuk menghasilkan ID Unik Tiap Buku (berdasarkan tanggal dan waktu saat ini)
function generateId() {
  return +new Date();
}

// Function untuk membuat Object Buku baru
function makeBook(title, author, year, isComplete) {
  return {
    id: generateId(),
    title,
    author,
    year,
    isComplete,
  };
}

// Function untuk menambah buku ke Array dan LocalStorage
function addBook() {
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const bookObject = makeBook(title, author, year, isComplete);

  books.push(bookObject);

  saveData();
  renderAllBooks();
}

// Function untuk mencari buku berdasarkan berdasarkan ID
function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

// Function untuk mencari index buku berdasarkan ID
function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

// Function untuk memindahkan buku ke selesai baca
function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  saveData();
  renderAllBooks();
}

// Function untuk memindahkan buku ke belum selesai baca
function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  saveData();
  renderAllBooks();
}

// Function untuk menghapus buku
function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);

  saveData();
  renderAllBooks();
}

// Function untuk membuat elemen buku pada tampilan web nya
function makeBookElement(bookObject) {
  const bookItem = document.createElement("div");
  bookItem.setAttribute("data-bookid", bookObject.id);
  bookItem.setAttribute("data-testid", "bookItem");
  bookItem.classList.add(
    "border",
    "p-4",
    "rounded-lg",
    "shadow-sm",
    "flex",
    "flex-col",
    "justify-between",
    "bg-gray-50"
  );

  const bookInfo = document.createElement("div");

  const bookTitle = document.createElement("h3");
  bookTitle.setAttribute("data-testid", "bookItemTitle");
  bookTitle.classList.add("text-xl", "font-bold", "text-gray-900");
  bookTitle.innerText = bookObject.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.setAttribute("data-testid", "bookItemAuthor");
  bookAuthor.classList.add("text-gray-600");
  bookAuthor.innerText = `Penulis: ${bookObject.author}`;

  const bookYear = document.createElement("p");
  bookYear.setAttribute("data-testid", "bookItemYear");
  bookYear.classList.add("text-gray-600");
  bookYear.innerText = `Tahun: ${bookObject.year}`;

  bookInfo.append(bookTitle, bookAuthor, bookYear);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("flex", "gap-2", "mt-4");

  const actionButton = document.createElement("button");
  actionButton.setAttribute("data-testid", "bookItemIsCompleteButton");
  actionButton.classList.add(
    "flex-1",
    "text-white",
    "text-sm",
    "font-semibold",
    "py-2",
    "px-3",
    "rounded-md",
    "transition"
  );

  const editButton = document.createElement("button");
  editButton.setAttribute("data-testid", "bookItemEditButton");
  editButton.classList.add(
    "bg-yellow-500",
    "text-white",
    "text-sm",
    "font-semibold",
    "py-2",
    "px-3",
    "rounded-md",
    "hover:bg-yellow-600",
    "transition"
  );
  editButton.innerText = "Edit";

  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
  deleteButton.classList.add(
    "bg-red-500",
    "text-white",
    "text-sm",
    "font-semibold",
    "py-2",
    "px-3",
    "rounded-md",
    "hover:bg-red-600",
    "transition"
  );
  deleteButton.innerText = "Hapus";
  deleteButton.addEventListener("click", () => {
    removeBook(bookObject.id);
  });

  if (bookObject.isComplete) {
    actionButton.classList.add("bg-green-500", "hover:bg-green-600");
    actionButton.innerText = "Baca Lagi";
    actionButton.addEventListener("click", () => {
      undoBookFromCompleted(bookObject.id);
    });
  } else {
    actionButton.classList.add("bg-blue-500", "hover:bg-blue-600");
    actionButton.innerText = "Selesai";
    actionButton.addEventListener("click", () => {
      addBookToCompleted(bookObject.id);
    });
  }

  buttonContainer.append(actionButton, editButton, deleteButton);
  bookItem.append(bookInfo, buttonContainer);

  return bookItem;
}

function renderAllBooks() {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  // Clear list
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBookElement(bookItem); // Perbaiki nama fungsi
    if (bookItem.isComplete) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  }
}

// Event listener untuk form tambah buku
document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("bookForm");
  const searchForm = document.getElementById("searchBook"); // Perbaiki ID

  submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addBook();
    submitForm.reset();
  });

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const searchValue = document.getElementById("searchBookTitle").value;
    searchBooks(searchValue); // Perbaiki nama fungsi
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }

  renderAllBooks();
});

// Function untuk mencari buku berdasarkan judul
function searchBooks(title) {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  for (const bookItem of books) {
    if (
      bookItem.title.toLowerCase().includes(title.toLowerCase()) || // Perbaiki dari lowerCase() ke toLowerCase()
      title === ""
    ) {
      const bookElement = makeBookElement(bookItem); // Perbaiki nama fungsi
      if (bookItem.isComplete) {
        completeBookList.append(bookElement);
      } else {
        incompleteBookList.append(bookElement);
      }
    }
  }
}
