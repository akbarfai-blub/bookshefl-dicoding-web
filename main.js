let books = [];
let editedBookId = null; // Menyimpan ID buku yang sedang diedit

// Fungsi untuk menambahkan atau memperbarui buku
const addOrUpdateBook = (title, author, year, isComplete) => {
  if (editedBookId !== null) {
    // Mode edit: update buku
    const bookIndex = books.findIndex((book) => book.id === editedBookId);
    if (bookIndex !== -1) {
      books[bookIndex] = {
        ...books[bookIndex],
        title,
        author,
        year,
        isComplete,
      };
    }
    editedBookId = null; // Reset setelah update
  } else {
    // Mode tambahkan buku baru
    const bookId = Date.now(); // Buat ID unik
    const book = {
      id: bookId,
      title,
      author,
      year,
      isComplete,
    };
    books.push(book);
  }

  renderBooks();
};

// Fungsi untuk menghapus buku berdasarkan ID-nya
const deleteBook = (bookId) => {
  books = books.filter((book) => book.id !== bookId);
  renderBooks();
};

// Fungsi untuk mengisi form dengan data buku yang akan diedit
const editBook = (bookId) => {
  const book = books.find((book) => book.id === bookId);
  if (book) {
    document.getElementById("bookFormTitle").value = book.title;
    document.getElementById("bookFormAuthor").value = book.author;
    document.getElementById("bookFormYear").value = book.year;
    document.getElementById("bookFormIsComplete").checked = book.isComplete;

    // Simpan ID buku yang akan diedit
    editedBookId = bookId;

    // Ubah teks tombol submit menjadi 'Update Buku'
    document.getElementById("bookFormSubmit").textContent = "Update Buku";
  }
};

// Fungsi untuk merender buku ke dalam HTML
const renderBooks = (bookList = books) => {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  bookList.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.setAttribute("data-bookid", book.id);
    bookElement.setAttribute("data-testid", "bookItem");
    bookElement.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">${
          book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"
        }</button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    `;

    // Event listener untuk tombol Ubah Status
    const toggleButton = bookElement.querySelector(
      '[data-testid="bookItemIsCompleteButton"]'
    );
    toggleButton.addEventListener("click", () => toggleBookStatus(book.id));

    // Event listener untuk tombol Hapus Buku
    const deleteButton = bookElement.querySelector(
      '[data-testid="bookItemDeleteButton"]'
    );
    deleteButton.addEventListener("click", () => deleteBook(book.id));

    // Event listener untuk tombol Edit Buku
    const editButton = bookElement.querySelector(
      '[data-testid="bookItemEditButton"]'
    );
    editButton.addEventListener("click", () => editBook(book.id));

    // Pisahkan buku ke dalam kategori belum selesai atau sudah selesai dibaca
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
};

// Fungsi untuk mencari buku berdasarkan judul
const searchBooks = (query) => {
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(query.toLowerCase())
  );

  // Render hasil pencarian
  renderBooks(filteredBooks);
};

// Event listener untuk form submit
document.getElementById("bookForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  addOrUpdateBook(title, author, year, isComplete); // Tambahkan atau update buku

  // Reset form setelah submit
  event.target.reset();

  // Kembalikan teks tombol submit menjadi 'Masukkan Buku'
  document.getElementById("bookFormSubmit").textContent =
    "Masukkan Buku ke rak";
});

// Event listener untuk form pencarian
document.getElementById("searchBook").addEventListener("submit", (event) => {
  event.preventDefault();

  const query = document.getElementById("searchBookTitle").value;
  searchBooks(query); // Panggil fungsi pencarian dengan input pengguna
});
