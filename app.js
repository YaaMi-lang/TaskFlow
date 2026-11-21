
// =====================================
// DATA TUGAS
// =====================================

let todos = JSON.parse(localStorage.getItem("todos")) || [];

// =====================================
// MENGAMBIL ELEMEN HTML
// =====================================

const formTodo = document.getElementById("form-todo");
const inputTodo = document.getElementById("input-todo");
const listTodo = document.getElementById("list-todo");
const stats = document.getElementById("stats");

const navLinks = document.querySelectorAll(".nav-link");
const pageViews = document.querySelectorAll(".page-view");
const breadcrumb = document.getElementById("page-breadcrumb");

// =====================================
// NAVIGASI HALAMAN
// =====================================

function pindahHalaman(halaman) {
    pageViews.forEach(function(page) {
        page.classList.remove("active");
    });

    navLinks.forEach(function(link) {
        link.classList.remove("active");
    });

    const halamanTujuan = document.getElementById("view-" + halaman);
    const menuAktif = document.querySelector(
        `.nav-link[data-view="${halaman}"]`
    );

    if (!halamanTujuan) return;

    halamanTujuan.classList.add("active");

    if (menuAktif) {
        menuAktif.classList.add("active");
    }

    if (breadcrumb) {
        breadcrumb.textContent = halaman === "home"
            ? "Ruang Kerja / Beranda"
            : "Ruang Kerja / Semua Tugas";
    }

    if (halaman === "tasks") {
        inputTodo.focus();
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Event untuk menu sidebar
navLinks.forEach(function(link) {
    link.addEventListener("click", function() {
        pindahHalaman(link.dataset.view);
    });
});

// Event tombol Lihat Semua Tugas
document.querySelectorAll('[data-view="tasks"]').forEach(function(button) {
    button.addEventListener("click", function() {
        pindahHalaman("tasks");
    });
});

// =====================================
// MENYIMPAN DATA
// =====================================

function simpan() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

// =====================================
// STATISTIK BERANDA
// =====================================

function updateStatistik() {
    const total = todos.length;

    const selesai = todos.filter(function(todo) {
        return todo.selesai;
    }).length;

    const belumSelesai = total - selesai;

    document.getElementById("total-tugas").textContent = total;
    document.getElementById("belum-selesai").textContent = belumSelesai;
    document.getElementById("tugas-selesai").textContent = selesai;

    stats.textContent = `${belumSelesai} tugas belum selesai`;
}

// =====================================
// MENAMPILKAN DAFTAR TUGAS
// =====================================

function render() {
    listTodo.innerHTML = "";

    if (todos.length === 0) {
        listTodo.innerHTML = `
            <li class="empty-state">
                Belum ada tugas. Yuk, tambahkan tugas pertamamu!
            </li>
        `;
    }

    todos.forEach(function(todo) {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.selesai;

        const span = document.createElement("span");
        span.textContent = todo.teks;

        const tombolHapus = document.createElement("button");
        tombolHapus.textContent = "Hapus";
        tombolHapus.className = "btn-hapus";

        if (todo.selesai) {
            li.classList.add("selesai");
        }

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(tombolHapus);

        li.dataset.id = todo.id;

        listTodo.appendChild(li);
    });

    updateStatistik();
}

// =====================================
// MENAMBAHKAN TUGAS
// =====================================

function tambahTodo(teks) {
    if (teks.trim() === "") {
        return;
    }

    const todoBaru = {
        id: Date.now(),
        teks: teks.trim(),
        selesai: false
    };

    todos.push(todoBaru);

    simpan();
    render();
}

// =====================================
// MENGHAPUS TUGAS
// =====================================

function hapusTodo(id) {
    todos = todos.filter(function(todo) {
        return todo.id !== id;
    });

    simpan();
    render();
}

// =====================================
// MENGUBAH STATUS TUGAS
// =====================================

function toggleSelesai(id) {
    todos = todos.map(function(todo) {
        if (todo.id === id) {
            todo.selesai = !todo.selesai;
        }

        return todo;
    });

    simpan();
    render();
}

// =====================================
// EVENT FORM TAMBAH TUGAS
// =====================================

formTodo.addEventListener("submit", function(event) {
    event.preventDefault();

    tambahTodo(inputTodo.value);

    inputTodo.value = "";
    inputTodo.focus();
});

// =====================================
// EVENT CHECKBOX
// =====================================

listTodo.addEventListener("change", function(event) {
    if (event.target.type === "checkbox") {
        const id = Number(
            event.target.closest("li").dataset.id
        );

        toggleSelesai(id);
    }
});

// =====================================
// EVENT TOMBOL HAPUS
// =====================================

listTodo.addEventListener("click", function(event) {
    if (event.target.classList.contains("btn-hapus")) {
        const id = Number(
            event.target.closest("li").dataset.id
        );

        hapusTodo(id);
    }
});

// =====================================
// INISIALISASI APLIKASI
// =====================================

render();
pindahHalaman("home");


// =====================================
// DROPDOWN PROFIL
// =====================================

const profileToggle = document.getElementById("profile-toggle");
const profileDropdown = document.getElementById("profile-dropdown");
const themeToggle = document.getElementById("theme-toggle");
const themeLabel = document.getElementById("theme-label");
const themeIcon = document.getElementById("theme-icon");
const themeSwitch = document.getElementById("theme-switch");
const aboutToggle = document.getElementById("about-toggle");

function tutupDropdownProfil() {
    if (!profileToggle || !profileDropdown) return;

    profileDropdown.hidden = true;
    profileToggle.setAttribute("aria-expanded", "false");
}

if (profileToggle && profileDropdown) {
    profileToggle.addEventListener("click", function(event) {
        event.stopPropagation();

        const sedangTerbuka = profileToggle.getAttribute("aria-expanded") === "true";
        profileDropdown.hidden = sedangTerbuka;
        profileToggle.setAttribute("aria-expanded", String(!sedangTerbuka));
    });

    document.addEventListener("click", function(event) {
        if (!event.target.closest(".profile-menu")) {
            tutupDropdownProfil();
        }
    });

    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            tutupDropdownProfil();
        }
    });
}

// Preferensi tema disimpan agar tetap sama setelah halaman dimuat ulang.
function perbaruiKontrolTema() {
    const modeGelapAktif = document.body.classList.contains("dark-mode");

    if (themeLabel) {
        themeLabel.textContent = modeGelapAktif ? "Mode terang" : "Mode gelap";
    }

    if (themeIcon) {
        themeIcon.textContent = modeGelapAktif ? "☀" : "☾";
    }

    if (themeSwitch) {
        themeSwitch.setAttribute("aria-label", modeGelapAktif ? "Mode gelap aktif" : "Mode terang aktif");
    }
}

const temaTersimpan = localStorage.getItem("taskflow-theme");
if (temaTersimpan === "dark") {
    document.body.classList.add("dark-mode");
}
perbaruiKontrolTema();

if (themeToggle) {
    themeToggle.addEventListener("click", function() {
        document.body.classList.toggle("dark-mode");

        const temaBaru = document.body.classList.contains("dark-mode") ? "dark" : "light";
        localStorage.setItem("taskflow-theme", temaBaru);

        perbaruiKontrolTema();
    });
}

if (aboutToggle) {
    aboutToggle.addEventListener("click", function() {
        alert("TaskFlow adalah aplikasi sederhana untuk membantu mahasiswa mencatat dan mengelola tugas kuliah.");
        tutupDropdownProfil();
    });
}

