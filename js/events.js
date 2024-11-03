formUploadCurriculum.addEventListener("submit", function (event) {
    let viewModelData = viewModelFormCurriculum();
    let schoolName = viewModelData.schoolName;
    let courseTitle = viewModelData.courseTitle;
    let subjects = [];
    let dataUpload = {};

    if (schoolName == null || courseTitle == null) {
        Swal.fire({
            title: "Failed",
            text: "Please fill up required fields!",
            icon: "error",
            didClose: () => {
                document
                    .querySelector(".container-items")
                    .scrollTo({ top: 0, behavior: "smooth" });
            },
        });
        return;
    }

    Swal.fire({
        title: "Confirm",
        text: "You are about to enter multiple entries. Continue?",
        icon: "question",
        showCancelButton: true,
    }).then(async (result) => {
        subjects = $(`#${tableContainerUploadCurriculum.id} table`)
            .DataTable()
            .data()
            .toArray();
        dataUpload = {
            schoolName: schoolName,
            courseTitle: courseTitle,
            subjects: subjects,
        }
        await doUpload(dataUpload, result);
    });
});

formUploadCurriculum.addEventListener("reset", function (event) {
    resetUi(formUploadCurriculum, tableContainerUploadCurriculum.id);
});

domInputFile.addEventListener("change", function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    let schoolName = null;
    let courseTitle = null;

    // TODO: merge this as form.elements
    buttonUploadAll.disabled = true;

    if (!file) return;

    reader.onload = function (readerEvent) {
        const result = readerEvent.target.result;
        let spreadsheet = null;
        // TODO: merge this as form.elements
        domInputFile.disabled = true;
        try {
            const arrayResult = new Uint8Array(result);
            spreadsheet = XLSX.read(arrayResult, { type: "array" });
        } catch (error) {
            Swal.fire("Failed", error.message, "error");
            return;
        }
        const nameSheet1 = spreadsheet.SheetNames[0];
        const sheet1 = spreadsheet.Sheets[nameSheet1];

        if (sheet1 == null || sheet1.length == 0) {
            Swal.fire("Failed", "Invalid file!", "error");
            return;
        }

        let dataCurriculum = null;

        try {
            dataCurriculum = parseCurriculumsData(sheet1);
            if (
                dataCurriculum == null ||
                Object.keys(dataCurriculum).length == 0
            ) {
                Swal.fire("Failed", "Invalid file!", "error");
                buttonUploadAll.disabled = false;
                domInputFile.disabled = false;
                domInputFile.value = "";
                return;
            }
        } catch (e) {
            Swal.fire("Failed", "Cannot parse the file! " + e.message, "error");
            buttonUploadAll.disabled = false;
            domInputFile.disabled = false;
            domInputFile.value = "";
            return;
        }

        schoolName = getStringByRegex(sheet1, /[Uu]niversity/);
        courseTitle = getStringByRegex(sheet1, /[Bb]achelor/, "Bachelor");

        if (schoolName == null) {
            console.log("Failed to parse college on sheet!");
        }
        if (courseTitle == null) {
            console.log("Failed to parse course on sheet!");
        }
        if (dataCurriculum == null) {
            console.log("Failed to parse curriculums on sheet!");
            return;
        }
        // set sortIndex to dataCurriculum
        for (let keyYear in dataCurriculum) {
            let itemCurriculumYear = dataCurriculum[keyYear];
            for (let keySemester in itemCurriculumYear) {
                let itemCurriculumYearSemester =
                    dataCurriculum[keyYear][keySemester];
                let index = 0;
                for (let innerItem of itemCurriculumYearSemester) {
                    innerItem["sortIndex"] = index++;
                }
            }
        }

        // ui
        formUploadCurriculum.elements["school"].value = schoolName;
        formUploadCurriculum.elements["course"].value = courseTitle;

        // reset
        disableFormInputs(formUploadCurriculum, false);
        buttonUploadAll.disabled = false;
        tableContainerUploadCurriculum.innerHTML = "";

        collectionSubjects[KEY_CURRICULUM_UPLOAD] = dataCurriculum;
        collectionTableIds[KEY_CURRICULUM_UPLOAD] = {};

        for (let keyYear in dataCurriculum) {
            for (let keySem in dataCurriculum[keyYear]) {
                // important gawing non assoc array since datatables only reads 2d array
                let arrDataRaw = dataCurriculum[keyYear][keySem];
                let arrData = alignDataSetArray(arrDataRaw);
                generateSubjectsDataTable(
                    keyYear,
                    keySem,
                    arrData,
                    tableContainerUploadCurriculum.id,
                    true,
                    true,
                    null,
                    true,
                    false,
                    0
                );
            }
        }
        // jq wrap for proper placement
        $(document).ready(function () {
            // append button to analyze subject
            let container = document.getElementById(
                tableContainerUploadCurriculum.id
            );

            // bootstrap container
            let bsHtmlContainer = `<div class="card mb-3 align-items-center"><div class="card-body"><button type="button" class="btn btn-outline-primary" name="button-analyze">Upload Curriculum</button></div></div>`;

            let parser = new DOMParser();
            let parsedHtml = parser.parseFromString(
                bsHtmlContainer,
                "text/html"
            );
            let actualHtml = parsedHtml.querySelector("div");
            container.append(actualHtml);

            const domButtonUploadCurriculum =
                actualHtml.querySelector("button");
            domButtonUploadCurriculum.addEventListener(
                "click",
                function (event) {
                    document.getElementById("sp-button-upload-all").click();
                }
            );
        });
    };

    try {
        reader.readAsArrayBuffer(file);
    } catch (error) {
        console.log(error);
    }
});

studentSelectSchool.addEventListener("change", async function () {
    let value = this.options[this.selectedIndex].value;
    let data = null;

    if (value != -1) {
        data = await createDataRequest(
            "readStudentViaSchool",
            {
                schoolId: value,
            },
            { text: "Fetching students data..." }
        );
    } else {
        data = await createDataRequest(
            "readStudentAll",
            { fetchMethod: CODE_PDO_FETCH_NUM },
            { text: "Fetching students data..." }
        );
    }

    generateStudentRecordsTableViaSchool(
        tableContainerViewStudents.id,
        data.data
    );
});

$(document).ready(async function () {
    const data = await createDataRequest("readStudentAll", {
        fetchMethod: CODE_PDO_FETCH_NUM,
    });
    generateStudentRecordsTableViaSchool(
        tableContainerViewStudents.id,
        data.data
    );
});

formViewCurriculumViaStudent.elements["studentId"].addEventListener(
    "change",
    function () {
        eventForStudentNameSelection(
            formViewCurriculumViaStudent,
            tableContainerStudent.id
        );
    }
);
formViewCurriculumViaStudent.addEventListener("submit", async function (event) {
    let data = null;
    let assocYearAndSemester = null;
    let preRequisiteResponse = null;

    event.preventDefault();

    if (!isStudentSelected(this)) return;
    handleEventResetUserData(tableContainerStudent.id);
    // generate table where values are these
    let formSelectElement = formViewCurriculumViaStudent.elements["studentId"];
    let index = formSelectElement.selectedIndex;
    let studentId = formSelectElement.options[index].value;
    let mainSwal = spawnSwalLoading("Loading...");
    
    try {
        data = await createDataRequest(
            "readStudentSubjectsWithId",
            {
                studentId: studentId,
                fetchMethod: CODE_PDO_FETCH_BOTH,
            },
            {
                instance: mainSwal,
                text: "Fetching student information...",
            }
        );
        if (!data.success) {
            throw new Error(data.message);
        }
        assocYearAndSemester = sortToAssocByYearAndSemester(data, true);
        preRequisiteResponse = await createDataRequest(
            "readSubjectPrerequisitesByStudentMulti",
            {
                studentId: studentId,
            }
        );
        if (!preRequisiteResponse.success) {
            throw new Error(preRequisiteResponse.message);
        }
    } catch (error) {
        mainSwal.close();
        console.log(error);
        Swal.fire("Failed", error.message, "error");
        return;
    }
    mainSwal.close();

    let preRequisiteData = sortToAssocByPrerequisite(preRequisiteResponse.data);
    collectionSubjects[KEY_CURRICULUM_VIEW_STUDENT] = assocYearAndSemester;
    collectionTableIds[KEY_CURRICULUM_VIEW_STUDENT] = {};
    createLinkSubjectsFromPrerequisites(
        preRequisiteData,
        KEY_CURRICULUM_VIEW_STUDENT
    );

    for (let keyYear in assocYearAndSemester) {
        for (let keySem in assocYearAndSemester[keyYear]) {
            // important gawing non assoc array since datatables only reads 2d array
            let arrDataRaw = assocYearAndSemester[keyYear][keySem];
            let arrData = alignDataSetArray(arrDataRaw, preRequisiteData);
            await generateSubjectsDataTable(
                keyYear,
                keySem,
                arrData,
                tableContainerStudent.id,
                false,
                false,
                formViewCurriculumViaStudent,
                false
            );
        }
    }
    $(document).ready(function () {
        loadLinksSubjectsOnExistingDataTable(KEY_CURRICULUM_VIEW_STUDENT);
    });
});

formViewCurriculumViaStudent.addEventListener("reset", function (event) {
    handleEventResetUserData(tableContainerStudent.id);
});

formStudyPlanSelectStudent.addEventListener("change", function () {
    handleEventResetUserData("sp-table-container");
    eventForStudentNameSelection(formStudyPlan, "sp-table-container");
});

formViewCurriculumViaSchool.elements["select-course"].addEventListener(
    "change",
    async function (event) {
        document.getElementById(tableContainerSchool.id).innerHTML = "";
    }
);

formViewCurriculumViaSchool.addEventListener("submit", async function (event) {
    let viewModelData = viewModelFormViewCurriculumViaSchool();
    let schoolId = viewModelData.schoolName.value;
    let courseId = viewModelData.courseTitle.value;
    let mainSwal = null;
    event.preventDefault();
    event.stopPropagation();
    
    mainSwal = spawnSwalLoading("Loading...");
    if (schoolId == -1 || courseId == -1) {
        mainSwal.close();
        Swal.fire("Failed", "Please select required fields", "error");
        return;
    }

    document.getElementById(tableContainerSchool.id).innerHTML = "";
    let data = null;
    let assocYearAndSemester = null;
    let preRequisiteResponse = null;
    try {
        data = await createDataRequest(
            "readCurriculumsViaSchoolCourse",
            {
                schoolId: schoolId,
                courseId: courseId,
            },
            {
                instance: mainSwal,
                text: "Fetching curriculums...",
            }
        );

        assocYearAndSemester = sortToAssocByYearAndSemester(data, true);
        preRequisiteResponse = await createDataRequest(
            "readSubjectPrerequisitesBySchoolCourseMulti",
            {
                schoolId: schoolId,
                courseId: courseId,
            },
            {
                instance: mainSwal,
                text: "Fetchiing Prerequisites...",
            }
        );
    } catch (error) {
        mainSwal.close();
        Swal.fire("Failed", error.message, "error");
        return;
    }
    let preRequisiteData = sortToAssocByPrerequisite(preRequisiteResponse.data);

    mainSwal.close();

    collectionSubjects[KEY_CURRICULUM_VIEW_SCHOOL] = assocYearAndSemester;
    collectionTableIds[KEY_CURRICULUM_VIEW_SCHOOL] = {};
    createLinkSubjectsFromPrerequisites(
        preRequisiteData,
        KEY_CURRICULUM_VIEW_SCHOOL
    );

    for (let keyYear in assocYearAndSemester) {
        for (let keySem in assocYearAndSemester[keyYear]) {
            // important gawing non assoc array since datatables only reads 2d array
            let arrDataRaw = assocYearAndSemester[keyYear][keySem];
            let arrData = alignDataSetArray(arrDataRaw, preRequisiteData);
            await generateSubjectsDataTable(
                keyYear,
                keySem,
                arrData,
                tableContainerSchool.id,
                false,
                false,
                null,
                false
            );
        }
    }
    $(document).ready(function () {
        loadLinksSubjectsOnExistingDataTable(KEY_CURRICULUM_VIEW_SCHOOL);
    });
});

formViewCurriculumViaSchool.addEventListener("reset", function (event) {
    this.classList.remove("was-validated");
    let domSelectSchool = this.elements["select-school"];
    let domSelectCourse = this.elements["select-course"];

    domSelectCourse.innerHTML = "";
    domSelectCourse.options.add(generateOptionPlaceholder());
    domSelectCourse.disabled = true;
    document.getElementById(tableContainerSchool.id).innerHTML = "";
});

formStudyPlan.addEventListener("submit", async function (event) {
    let viewModelData = viewModelFormStudyPlan();
    let studentId = viewModelData.studentData.value;
    let mainSwal = null;

    event.preventDefault();

    enableExports(this);

    if (!isStudentSelected(this)) return;
    handleEventResetUserData("sp-table-container");

    // loading ui
    mainSwal = spawnSwalLoading("Loading...");

    // generate table
    let dataStudentSubjects = await createDataRequest(
        "readStudentSubjectsWithId",
        {
            studentId: studentId,
            fetchMethod: CODE_PDO_FETCH_BOTH,
        },
        {
            instance: mainSwal,
            text: "Fetching linked subjects...",
        }
    );

    let assocYearAndSemester = sortToAssocByYearAndSemester(
        dataStudentSubjects,
        true
    );
    let preRequisiteResponse = await createDataRequest(
        "readSubjectPrerequisitesByStudentMulti",
        {
            studentId: studentId,
        },
        {
            instance: mainSwal,
            text: "Fetching subjects pre-requisites...",
        }
    );
    let preRequisiteData = sortToAssocByPrerequisite(preRequisiteResponse.data);

    collectionSubjects[KEY_STUDY_PLAN] = assocYearAndSemester;
    collectionTableIds[KEY_STUDY_PLAN] = {};
    createLinkSubjectsFromPrerequisites(preRequisiteData, KEY_STUDY_PLAN);

    for (let keyYear in assocYearAndSemester) {
        for (let keySem in assocYearAndSemester[keyYear]) {
            // important gawing non assoc array since datatables only reads 2d array
            let arrDataRaw = assocYearAndSemester[keyYear][keySem];
            let arrData = alignDataSetArray(arrDataRaw, preRequisiteData);
            await generateSubjectsDataTable(
                keyYear,
                keySem,
                arrData,
                "sp-table-container",
                false,
                true,
                formStudyPlan,
                false,
                true,
                1
            );
        }
    }

    mainSwal.close();
    $(document).ready(function () {
        loadLinksSubjectsOnExistingDataTable(KEY_STUDY_PLAN);
    });

    // jq wrap for proper placement
    $(document).ready(function () {
        // append button to analyze subject
        let container = document.getElementById(tableContainerStudyPlan.id);

        // bootstrap container
        let bsHtmlContainer = `<div class="card mb-3 align-items-center"><div class="card-body"><button type="button" class="btn btn-outline-primary" name="button-analyze">Create Study Plan</button></div></div>`;

        let parser = new DOMParser();
        let parsedHtml = parser.parseFromString(bsHtmlContainer, "text/html");
        let actualHtml = parsedHtml.querySelector("div");
        container.append(actualHtml);

        const domButtonAnalyze = actualHtml.querySelector("button");
        addEventToButtonAnalyze(domButtonAnalyze);
    });
});

formStudyPlan.addEventListener("reset", function (event) {
    handleEventResetUserData(tableContainerStudyPlan.id);
});

// create student
formCreateStudent.addEventListener("submit", async function () {
    let viewModelData = viewModelFormCreateStudent();
    let firstName = viewModelData.firstName;
    let middleName = viewModelData.middleName;
    let lastName = viewModelData.lastName;

    let educationYearValue = viewModelData.educationYear.value;
    let educationYearText = viewModelData.educationYear.text;

    let schoolNameValue = viewModelData.schoolName.value;
    let schoolNameText = viewModelData.schoolName.text;

    let courseTitleValue = viewModelData.courseTitle.value;
    let courseTitleText = viewModelData.courseTitle.text;
    
    // data
    let dataStudent = {};
    let responseStudentValidate = {};
    let responseSubjectRelationExist = {};
    let responseSubjectStudent = {};
    let responseStudents = {};
    let dataArgsRelation = {};
    // db data
    let studentId = null;
    // swal
    let resultSwalStudentPostConfirm = null;

    // swal start
    let mainSwal = spawnSwalLoading("Registering...");

    // validator
    try {
        if (firstName == null || firstName.length == 0) {
            throw new Error("First Name not defined!");
        }
        if (middleName == null || middleName.length == 0) {
            middleName = null;
        }
        if (lastName == null || lastName.length == 0) {
            throw new Error("Last Name not defined!");
        }
        if (
            educationYearValue == null ||
            educationYearValue == -1 ||
            educationYearValue == ""
        ) {
            throw new Error("Education Year not defined!");
        }
        if (
            schoolNameValue == null ||
            schoolNameValue == -1 ||
            schoolNameValue == ""
        ) {
            throw new Error("School not defined!");
        }
        if (
            courseTitleValue == null ||
            courseTitleValue == -1 ||
            courseTitleValue == ""
        ) {
            throw new Error("Course not defined!");
        }
    } catch (error) {
        mainSwal.close();
        Swal.fire("Failed", error.message, "error");
        return;
    }

    // validate student
    // halt this function if student exist
    dataStudent = {
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        schoolId: schoolNameValue,
        courseId: courseTitleValue,
        educationYear: educationYearValue,
    };

    try {
        responseStudentValidate = await createDataRequest(
            "readStudentIfExist",
            dataStudent,
            {
                instance: mainSwal,
                text: "Checking student information...",
            }
        );

        if (!responseStudentValidate.success) {
            // throw new Error(responseStudentValidate.message);
        }
    } catch (error) {
        mainSwal.close();
        Swal.fire("Server Failed", error.message, "error");
        return;
    }

    // check if school and course has binded subjects
    // halt if none
    dataArgsRelation = {
        schoolId: schoolNameValue,
        courseId: courseTitleValue,
    };

    try {
        responseSubjectRelationExist = await createDataRequest(
            "readSubjectRelationIfExist",
            dataArgsRelation,
            {
                instance: mainSwal,
                text: "Checking subject availabilities on school and semester...",
            }
        );

        if (!responseSubjectRelationExist.success) {
            throw new Error(responseSubjectRelationExist.message);
        }
    } catch (error) {
        mainSwal.close();
        Swal.fire("Server Failed", error.message, "error");
        return;
    }

    resultSwalStudentPostConfirm = await Swal.fire({
        title: "Confirm",
        html: swalHtmlPopupStudentConfirm,
        showCancelButton: true,
        allowOutsideClick: false,
        didOpen: () => {
            let fullName =
                middleName != null
                    ? `${firstName} ${middleName} ${lastName}`
                    : `${firstName} ${lastName}`;

            const formStudentConfirmData = document.querySelector(
                "#form-student-confirm"
            );
            formStudentConfirmData.elements["fullName"].value = fullName;
            formStudentConfirmData.elements[
                "educationYear"
            ].value = `${educationYearText}`;
            formStudentConfirmData.elements[
                "school"
            ].value = `${schoolNameText}`;
            formStudentConfirmData.elements[
                "course"
            ].value = `${courseTitleText}`;
        },
        icon: "info",
    });

    if (!resultSwalStudentPostConfirm.isConfirmed) return;

    mainSwal = spawnSwalLoading("Loading...");
    try {
        responseStudents = await createDataRequest(
            "insertToStudents",
            dataStudent,
            {
                instance: mainSwal,
                text: "Storing student information...",
            }
        );
        if (!responseStudents.success) {
            throw new Error(responseStudents.message);
        }
        studentId = responseStudents.data[0];
        dataArgsRelation = {
            studentId: studentId,
            schoolId: schoolNameValue,
            courseId: courseTitleValue,
        };
        responseSubjectStudent = await createDataRequest(
            "assignSubjectsDataToStudent",
            dataArgsRelation,
            {
                instance: mainSwal,
                text: "Linking subjects...",
            }
        );
        if (!responseSubjectStudent.success) {
            throw new Error(responseSubjectStudent.message);
        }

        mainSwal.close();
        Swal.fire({
            title: "Success",
            text: responseStudents.message,
            showCancelButton: true,
            confirmButtonText: "Show Curriculum",
            cancelButtonText: "Dismiss",
            icon: "success",
        }).then(async (result) => {
            // init tables
            formCreateStudent.reset();
            let domSelectCourse = this.elements["select-course"];

            this.classList.remove("was-validated");
            domSelectCourse.innerHTML = "";
            domSelectCourse.options.add(generateOptionPlaceholder());
            domSelectCourse.disabled = true;

            await initNewDataToDom();

            if (result.isConfirmed) {
                await automateChooseViewCurriculumByStudent(studentId);
            }
        });
    } catch (error) {
        console.log(error);
        mainSwal.close();
        Swal.fire("Failed", error.message, "error");

        if (studentId != null) {
            // delete student
        }
        return;
    }
});

formCreateStudent.addEventListener("reset", function (event) {
    let domSelectCourse = this.elements["select-course"];

    this.classList.remove("was-validated");
    domSelectCourse.innerHTML = "";
    domSelectCourse.options.add(generateOptionPlaceholder());
    domSelectCourse.disabled = true;
});

formCreateStudent.elements["select-school"].addEventListener(
    "change",
    async function (event) {
        await commonFormSchoolCourseValidateAndLoad(formCreateStudent, event);
    }
);

cardRadios.forEach((item) => {
    item.addEventListener("click", function (event) {
        cardDefaultClass();
        item.classList.remove("text-muted");
        this.classList.add("border-primary", "bg-primary", "text-white");
    });
});

// view curriculum
formViewCurriculumViaSchool.elements["select-school"].addEventListener(
    "change",
    async function (event) {
        document.getElementById(tableContainerSchool.id).innerHTML = "";
        await commonFormSchoolCourseValidateAndLoad(
            formViewCurriculumViaSchool,
            event
        );
    }
);

// cards
cardOptionStudent.addEventListener("click", function (event) {
    divViewStudent.hidden = false;
    divViewSchoolCourse.hidden = true;
    document.getElementById(tableContainerStudent.id).hidden = false;
    document.getElementById(tableContainerSchool.id).hidden = true;
});

cardOptionSchoolCourse.addEventListener("click", function (event) {
    divViewStudent.hidden = true;
    divViewSchoolCourse.hidden = false;
    document.getElementById(tableContainerStudent.id).hidden = true;
    document.getElementById(tableContainerSchool.id).hidden = false;
});