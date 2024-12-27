import regulations from './regulations.js';

const grades = {
    "O": 10,
    "S": 9,
    "A": 8,
    "B": 7,
    "C": 6,
    "D": 5,
    "E": 4,
    "F": 0
};

function updateCourses() {
    let regulation = document.getElementById("regulation").value;
    let courseDropdown = document.getElementById("course");

    // Clear previous options
    courseDropdown.innerHTML = "";

    for (let course in regulations[regulation]) {
        let option = document.createElement("option");
        option.value = course;
        option.textContent = course;
        courseDropdown.appendChild(option);
    }

    // Update semesters for the first course by default
    updateSemesters();
}

function updateSemesters() {
    let regulation = document.getElementById("regulation").value;
    let course = document.getElementById("course").value;
    let semesterDropdown = document.getElementById("semester");

    // Clear previous options
    semesterDropdown.innerHTML = "";

    for (let semester in regulations[regulation][course]) {
        let option = document.createElement("option");
        option.value = semester;
        option.textContent = semester;
        semesterDropdown.appendChild(option);
    }
}

function goToSubjectsPage() {
    let regulation = document.getElementById("regulation").value;
    let course = document.getElementById("course").value;
    let semester = document.getElementById("semester").value;

    localStorage.setItem("selectedRegulation", regulation);
    localStorage.setItem("selectedCourse", course);
    localStorage.setItem("selectedSemester", semester);

    window.location.href = "subjects.html";
}

// Attach the function to the global scope
window.goToSubjectsPage = goToSubjectsPage;

function populateSubjects() {
    let regulation = localStorage.getItem("selectedRegulation");
    let course = localStorage.getItem("selectedCourse");
    let semester = localStorage.getItem("selectedSemester");

    let subjects = regulations[regulation][course][semester];
    let container = document.getElementById("subjectsContainer");

    subjects.forEach(subjectObj => {
        let label = document.createElement("label");

        label.textContent = subjectObj.subject + " (" + subjectObj.credit + ")";

        let select = document.createElement("select");
        for (let grade in grades) {
            let option = document.createElement("option");
            option.value = grade;
            option.textContent = grade;
            select.appendChild(option);
        }

        container.appendChild(label);
        container.appendChild(select);
    });
}

function calculateGPA() {
    let selects = document.getElementById("subjectsContainer").querySelectorAll("select");
    let totalGradePoints = 0;
    let totalCredits = 0;

    selects.forEach((select, index) => {
        let regulation = localStorage.getItem("selectedRegulation");
        let course = localStorage.getItem("selectedCourse");
        let semester = localStorage.getItem("selectedSemester");

        let credit = regulations[regulation][course][semester][index].credit;
        totalCredits += credit;

        totalGradePoints += grades[select.value] * credit;
    });

    let gpa = totalGradePoints / totalCredits;
    let ele = document.getElementById("result")
    ele.innerHTML = `<span>Your SGPA:</span> ${gpa.toFixed(2)}`;
    ele.scrollIntoView();
}
window.calculateGPA = calculateGPA
// document.querySelector('#calculate-sgpa-button').addEventListener('click', calculateGPA)

// Check if the current page is the main page (gpa-calculator.html)
if (window.location.pathname.includes("sgpa-calculator")) {
    updateCourses();
}

// If on subjects.html, populate subjects
if (window.location.pathname.includes("subjects.html")) {
    populateSubjects();
}