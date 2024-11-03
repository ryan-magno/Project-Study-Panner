// globals
const API = "/api.php";
const formStudyPlan = document.querySelector("#sp-userData");
const formStudyPlanSelectStudent = formStudyPlan.elements["studentId"];

const formViewCurriculumViaStudent = document.querySelector("#curriculum-userData");
const formViewCurriculumViaSchool = document.querySelector("#form-view-curriculum-school");

const formCreateStudent = document.querySelector("#form-create-student");
const formUploadCurriculum = document.querySelector("#sp-form-userData");

const cardRadios = document.querySelectorAll(".card-radio");
const cardOptionStudent = document.querySelector("#card-option-student");
const cardOptionSchoolCourse = document.querySelector("#card-option-school_course");
const divViewStudent = document.querySelector("#view-student");
const divViewSchoolCourse = document.querySelector("#view-school_course");

const tableContainerUploadCurriculum = document.querySelector("#table-container-upload-curriculum");
const tableContainerStudent = document.querySelector("#curriculums-table-container-student");
const tableContainerSchool = document.querySelector("#curriculums-table-container-school");
const tableContainerViewStudents = document.querySelector("#table-container-student");
const tableContainerStudyPlan = document.querySelector("#sp-table-container");

const domInputFile = document.querySelector("#sp-upload-file");
const buttonUploadAll = document.querySelector("#sp-button-upload-all");
const studentSelectSchool = document.querySelector("#student-select-school");

const KEY_CURRICULUM_UPLOAD = "curriculumUpload";
const KEY_CURRICULUM_VIEW_STUDENT = "curriculumViewStudent";
const KEY_CURRICULUM_VIEW_SCHOOL = "curriculumViewSchool";
const KEY_STUDY_PLAN = "studyPlan";

let testMode = false;
let activation = false;

var fetchedStudentId = -1;
var tableCounters = {};
var spTables = {};
var swalHtmlPopupPrerequisites = null;
var swalHtmlPopupStudentConfirm = null;

// for coreqs

let assocSubjectPrerequisites = {};

let collectionSubjects = {
    curriculumUpload: {},
    curriculumViewStudent: {},
    curriculumViewSchool: {},
    studyPlan: {},
};
let collectionLinkSubjects = {
    curriculumUpload: {},
    curriculumViewStudent: {},
    curriculumViewSchool: {},
    studyPlan: {},
};

let collectionTableIds = {
    curriculumUpload: {},
    curriculumViewStudent: {},
    curriculumViewSchool: {},
    studyPlan: {},
};

// load popup contents
document.addEventListener("DOMContentLoaded", async function () {
    swalHtmlPopupPrerequisites = await fetchHtml(
        "/html/fragment/prerequisite_view.php",
        null
    );
    swalHtmlPopupStudentConfirm = await fetchHtml(
        "/html/fragment/student_confirm_popup.php",
        null
    )
});

// Bootstrap functions
(() => {
    "use strict";
    const forms = document.querySelectorAll(".needs-validation");

    Array.from(forms).forEach((form) => {
        form.addEventListener(
            "submit",
            (event) => {
                event.preventDefault();
                event.stopPropagation();

                form.classList.add("was-validated");
            },
            false
        );
    });
})();

function loadEdit() {
    const editButtons = document.querySelectorAll(".edit-btn");

    editButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const row = this.closest("tr");
            const cells = row.cells;

            // get all data of rows, create html of it
            let buildHtml = "";
            let count = 0;
            for (let value of cells) {
                if (count >= cells.length - 1) break;
                buildHtml +=
                    '<input id="swal-input' +
                    count++ +
                    '" class="swal2-input" value="' +
                    value.innerText +
                    '">';
            }

            Swal.fire({
                title: "Edit Data",
                html: buildHtml,
                showCancelButton: true,
                confirmButtonText: "Save",
            }).then((result) => {
                if (result.isConfirmed) {
                    for (let i = 0; i < cells.length; i++) {
                        if (i >= cells.length - 1) break;

                        let domData = document.getElementById(
                            "swal-input" + i
                        ).value;
                        cells[i].innerText = domData;
                    }

                    Swal.fire("Data updated successfully!", "", "success");
                }
            });
        });
    });
}
document.addEventListener("DOMContentLoaded", loadEdit);

// events callback
async function eventForStudentNameSelection(form, divContainerId) {
    let domEducationYear = form.elements["educationYear"];
    let domSchool = form.elements["schoolId"];
    let domCourse = form.elements["courseId"];
    let domStudent = form.elements["studentId"];

    function setStudentInputs(school, course, yearName) {
        domSchool.value = school;
        domCourse.value = course;
        domEducationYear.value = yearName;
    }

    setStudentInputs("", "", "");
    handleEventResetUserData(divContainerId);

    let index = domStudent.selectedIndex;
    let studentId = domStudent.options[index].value;

    let postData = {
        studentId: studentId,
    };

    let result = await createDataRequest("readStudent", postData, {
        text: "Fetching students data...",
    });
    let fetchedData = result.data[0];
    let serverSchoolName = fetchedData.schoolName;
    let serverCourseTitle = fetchedData.courseTitle;
    let serverYearName = fetchedData.yearName;

    setStudentInputs(serverSchoolName, serverCourseTitle, serverYearName);
}

function isStudentSelected(form) {
    let returnValue = false;

    let domStudent = form.elements["studentId"];

    if (domStudent.value == "") {
        domStudent.setCustomValidity("Select Student");
        domStudent.reportValidity();
    } else {
        domStudent.setCustomValidity("");
        domStudent.reportValidity();
        returnValue = true;
    }

    return returnValue;
}

function handleEventResetUserData(divContainerId) {
    let divContainer = document.getElementById(divContainerId);
    divContainer.innerHTML = "";
}

// finish dom loading
Swal.fire({
    text: "Loading resources...",
    allowOutsideClick: false,
    didOpen: () => {
        Swal.showLoading();
    },
});

document.addEventListener("DOMContentLoaded", function (event) {
    Swal.close();
});
