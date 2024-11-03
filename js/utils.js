async function checkSchoolIfExist(schoolName = null, swalInstance = null) {
    let returnValue = null;
    let response = null;

    try {
        response = await createDataRequest(
            "readSchoolBySchoolName",
            {
                schoolName: schoolName,
            },
            {
                instance: swalInstance,
                text: "Checking school if exist...",
            }
        );
    } catch (error) {
        console.error(error);
        return returnValue;
    }

    if (response.success) {
        returnValue = response.data;
    }

    return returnValue;
}

async function addSchool(schoolName = null, swalInstance = null) {
    let returnValue = null;
    let response = null;

    try {
        response = await createDataRequest(
            "addSchool",
            {
                schoolName: schoolName,
            },
            {
                instance: swalInstance,
                text: "Adding school...",
            }
        );
    } catch (error) {
        console.error(error);
        return returnValue;
    }

    if (response.success) {
        returnValue = response.data;
    }

    return returnValue;
}

async function checkCourseIfExist(courseTitle = null, swalInstance = null) {
    let returnValue = null;
    let response = null;

    try {
        response = await createDataRequest(
            "readCourseByCourseTitle",
            {
                courseTitle: courseTitle,
            },
            {
                instance: swalInstance,
                text: "Checking course if exist...",
            }
        );
    } catch (error) {
        console.error(error);
        return returnValue;
    }

    if (response.success) {
        returnValue = response.data;
    }

    return returnValue;
}

async function addCourse(courseTitle = null, swalInstance = null) {
    let returnValue = null;
    let response = null;

    try {
        response = await createDataRequest(
            "addCourse",
            {
                courseTitle: courseTitle,
            },
            {
                instance: swalInstance,
                text: "Adding course...",
            }
        );
    } catch (error) {
        console.error(error);
        return returnValue;
    }

    if (response.success) {
        returnValue = response.data;
    }

    return returnValue;
}

async function checkSchoolCourseBinding(
    schoolId = null,
    courseId = null,
    swalInstance = null
) {
    let returnValue = null;
    let response = null;

    try {
        response = await createDataRequest(
            "readMaxLoadViaSchoolCourse",
            {
                schoolId: schoolId,
                courseId: courseId,
            },
            {
                instance: swalInstance,
                text: "Checking school and course binding...",
            }
        );
    } catch (error) {
        console.error(error);
        return returnValue;
    }

    if (response.success) {
        returnValue = response.success;
    }

    return returnValue;
}

async function checkIfStudentExist(data = null, swalInstance = null) {
    let returnValue = null;
    let response = null;

    try {
        response = await createDataRequest("readStudentIfExist", data, {
            instance: swalInstance,
            text: "Checking student if exist...",
        });
    } catch (error) {
        console.error(error);
        return returnValue;
    }

    if (response.success) {
        returnValue = response.data;
    }

    return returnValue;
}

async function addStudent(data = null, swalInstance = null) {
    let returnValue = null;
    let response = null;

    try {
        response = await createDataRequest("insertToStudents", data, {
            instance: swalInstance,
            text: "Adding student...",
        });
    } catch (error) {
        console.error(error);
        return returnValue;
    }

    if (response.success) {
        returnValue = response.data;
    }

    return returnValue;
}

async function addStudentBinding(data = null, swalInstance = null) {
    let returnValue = null;
    let response = null;

    try {
        response = await createDataRequest(
            "assignSubjectsDataToStudent",
            data,
            {
                instance: swalInstance,
                text: "Adding student...",
            }
        );
    } catch (error) {
        console.error(error);
        return returnValue;
    }

    if (response.success) {
        returnValue = response.data;
    }

    return returnValue;
}

async function doUpload(data = null) {
    let schoolId = null;
    let courseId = null;
    let isSchoolCourseBinded = null;

    // get college and course
    let schoolName = data.schoolName;
    let courseTitle = data.courseTitle;
    let subjects = data.subjects;
    let schoolExist = false;
    let courseExist = false;

    let mainSwal = testMode ? null : spawnSwalLoading();

    try {
        // school
        schoolId = await checkSchoolIfExist(schoolName, mainSwal);
        if (schoolId == null) {
            schoolId = await addSchool(schoolName, mainSwal);
            schoolId = schoolId[0];
            if (schoolId == null) {
                throw new Error("Could not fetch or add school!");
            }
        } else {
            schoolId = schoolId[0]["id"];
            schoolExist = true;
        }

        // course
        courseId = await checkCourseIfExist(courseTitle, mainSwal);
        if (courseId == null) {
            courseId = await addCourse(courseTitle, mainSwal);
            courseId = courseId[0];
            if (courseId == null) {
                throw new Error("Could not fetch or add course!");
            }
        } else {
            courseId = courseId[0]["id"];
            courseExist = true;
        }

        // test if school and course already binded
        isSchoolCourseBinded = await checkSchoolCourseBinding(
            schoolId,
            courseId,
            mainSwal
        );
        if (isSchoolCourseBinded) {
            throw new Error("This data already exist!");
        }

        // pack subject and its metadata to usable form
        let responseBodySubjects = {
            collegeId: schoolId,
            courseId: courseId,
            subjects: subjects,
        };

        let responseSubjects = await createDataRequest(
            "insertSubjectInformation",
            responseBodySubjects,
            {
                instance: mainSwal,
                text: "Adding subjects...",
            }
        );
        if (!responseSubjects.success) {
            throw new Error(responseSubjects.message);
        }

        // save pre-requisites
        let filteredSubjectPrerequisites = subjects.filter(
            (el) => el.subjectPrerequisites.length != 0
        );
        let alignPrerequisiteArgs = {};
        for (let item of filteredSubjectPrerequisites) {
            alignPrerequisiteArgs[item.subjectCode] = item.subjectPrerequisites;
        }

        let prereqsArgs = {
            prerequisites: alignPrerequisiteArgs,
        };
        let responsePrerequisites = await createDataRequest(
            "insertSubjectMetaPreReqs",
            prereqsArgs,
            {
                instance: mainSwal,
                text: "Linking Pre-requisites...",
            }
        );

        let arrSubjectMaxLoad = [];
        let assocSubjects = sortToAssocByYearAndSemesterV2(subjects);

        for (let keyYear in assocSubjects) {
            let assocSubjectsYear = assocSubjects[keyYear];
            for (let keySemester in assocSubjectsYear) {
                let itemInner = assocSubjectsYear[keySemester];
                let totalUnit = null;
                for (let item1 of itemInner) {
                    totalUnit += item1.subjectUnit;
                }
                if (keyYear >= 4 && totalUnit <= 27) {
                    totalUnit = 27;
                }
                let dataSubjectMaxLoad = {
                    schoolId: schoolId,
                    courseId: courseId,
                    academicYear: keyYear,
                    academicSemester: keySemester,
                    maxUnits: totalUnit,
                };
                arrSubjectMaxLoad.push(dataSubjectMaxLoad);
            }
        }

        let responseMaxLoad = await createDataRequest(
            "addMaxLoadToSchoolCourse",
            arrSubjectMaxLoad,
            {
                instance: mainSwal,
                text: "Calculating max units...",
            }
        );
        if (responseMaxLoad == null) {
            throw new Error("Failed adding max load!");
        }
        if (!responseMaxLoad.success) {
            throw new Error(responseMaxLoad.message);
        }
    } catch (error) {
        if (mainSwal != null) mainSwal.close();
        Swal.fire("Failed", error.message, "error");
        return;
    }
    if (mainSwal != null) mainSwal.close();

    Swal.fire({
        title: "Success!",
        icon: "success",
        text: "Data has been saved!",
        showCancelButton: true,
        confirmButtonText: "Show Curriculum",
        cancelButtonText: "Dismiss",
    }).then(async (result) => {
        // init tables
        await initNewDataToDom();
        if (result.isConfirmed) {
            automateChooseViewCurriculumBySchool(
                schoolId,
                courseId,
                courseTitle
            );
        }

        // cleanup
        assocSubjectPrerequisites = {};
    });
    resetUi(formUploadCurriculum, tableContainerUploadCurriculum.id);
}

async function createStudent(data = null) {
    // student
    let mainSwal = testMode ? null : spawnSwalLoading();
    let studentExist = false;
    let studentId = await checkIfStudentExist(data, mainSwal);
    if (studentId == null) {
        studentId = await addStudent(data, mainSwal);
        studentId = studentId[0];
        if (studentId == null) {
            throw new Error("Could not fetch or add course!");
        }
    } else {
        studentId = studentId[0]["id"];
        studentExist = true;
    }
}

function disableFormInputs(form, value) {
    let textInputs = form.querySelectorAll('input[type="text"]');
    textInputs.forEach((element) => {
        element.disabled = value;
    });
    let selects = form.querySelectorAll("select");
    selects.forEach((element) => {
        element.disabled = value;
    });
}

function resetUi(form = null, tableId = null) {
    form.reset();
    disableFormInputs(form, true);

    domInputFile.disabled = false;
    document.getElementById(tableId).innerHTML = "";
    buttonUploadAll.disabled = true;

    tableCounters = {};
}

function getRandomId() {
    let returnVar = Math.random().toString(36).substring(7);
    return returnVar;
}

function generateOptionPlaceholder() {
    let domOption = document.createElement("option");
    domOption.value = "-1";
    domOption.setAttribute("selected", "");
    domOption.disabled = true;
    return domOption;
}

function populateActionButton(classButtonType = "", value = "", isIcon = true) {
    let returnValue = null;
    let button = isIcon
        ? `<button type="button" class="btn ${classButtonType} btn-sm">` +
          `<i class="bi ${value}"></i>` +
          `</button>`
        : `<button type="button" class="btn ${classButtonType} btn-sm">` +
          `<span>${value}</span>` +
          `</button>`;
    returnValue = button;
    return returnValue;
}

function setTooltip(id, elementClass = "", title = "", customClass = "") {
    $("#" + id + " tbody").on("mouseenter", elementClass, function () {
        $(this).tooltip({
            title: title, // Use button text as tooltip text
            placement: "top",
            trigger: "hover",
            container: "body",
            customClass: customClass,
        });
        $(this).tooltip("show");
    });

    // Destroy tooltips on mouse leave to avoid multiple tooltips
    $("#" + id + " tbody").on("mouseleave", elementClass, function () {
        $(this).tooltip("dispose");
    });
    $("#" + id + " tbody").on("click", elementClass, function () {
        $(this).tooltip("dispose");
    });
}

function sortToAssocByPrerequisite(prerequisiteData = []) {
    let returnValue = {};
    let buildAssoc = {};
    prerequisiteData.forEach((item) => {
        let mainSubjectCode = item.mainSubjectCode;
        let prereqSubjectCode = item.prereqSubjectCode;
        if (buildAssoc[mainSubjectCode] == null) {
            buildAssoc[mainSubjectCode] = [];
        }
        buildAssoc[mainSubjectCode].push(prereqSubjectCode);
    });

    returnValue = buildAssoc;
    return returnValue;
}

function alignDataSetArray(arrDataRaw = [], prerequisiteData = {}) {
    let returnValue = [];
    let arrData = [];
    arrDataRaw.forEach((item) => {
        let dataId = item.id;
        let subjectNumber = item.subjectNumber;
        let subjectCode = item.subjectCode;
        let subjectDescription = item.subjectDescription;
        let subjectUnit = item.subjectUnit;
        let status = item.status;
        let sortOrder = item.sortOrder;
        let subjectGrade = item.grade;
        let priority = item.priority;
        let subjectPrerequisites = [];
        let subjectCoRequisites = [];

        // defaults
        dataId = dataId != null ? dataId : -1;
        subjectNumber = subjectNumber != null ? subjectNumber : "-";
        subjectCode = subjectCode != null ? subjectCode : "-";
        subjectDescription =
            subjectDescription != null ? subjectDescription : "-";
        subjectUnit = subjectUnit != null ? subjectUnit : 0;
        status = status != null ? status : "Pending";
        sortOrder = sortOrder != null ? sortOrder : -1;
        subjectGrade = subjectGrade != null ? subjectGrade : "0.00";
        priority = priority != null ? priority : 0;

        subjectPrerequisites = prerequisiteData[subjectCode];

        let objSubject = {
            dataId: dataId,
            subjectNumber: subjectNumber,
            subjectCode: subjectCode,
            subjectDescription: subjectDescription,
            subjectUnit: subjectUnit,
            status: status,
            sortOrder: sortOrder,
            subjectGrade: subjectGrade,
            subjectPrerequisites: subjectPrerequisites,
            subjectCoRequisites: subjectCoRequisites,
            priority: priority,
        };
        arrData.push(objSubject);
    });
    returnValue = arrData;
    return returnValue;
}

function convertDataToReadableDataset(
    dataSubject,
    academicYear,
    academicSemester
) {
    let returnValue = null;
    let buildAssoc = [];
    // check data existence
    for (let i = 0; i < dataSubject.length; i++) {
        let item = dataSubject[i];
        let dataId = item.dataId;
        let subjectNumber = item.subjectNumber;
        let subjectCode = item.subjectCode;
        let subjectDescription = item.subjectDescription;
        let subjectUnit = item.subjectUnit;
        let status = item.status;
        let sortOrder = item.sortOrder != -1 ? item.sortOrder : i;
        let subjectGrade = item.subjectGrade;
        let priority = item.priority != null ? item.priority : 0;
        let subjectPrerequisites =
            item.subjectPrerequisites == null ? [] : item.subjectPrerequisites;
        let subjectCoRequisites =
            item.subjectCoRequisites == null ? [] : item.subjectCoRequisites;

        let dataset = {
            sortRow: "", // blank for sorting row
            sortIndex: i, // act as sorting id helper
            academicYear: academicYear,
            academicSemester: academicSemester,
            subjectNumber: subjectNumber,
            subjectCode: subjectCode,
            subjectDescription: subjectDescription,
            subjectUnit: subjectUnit,
            status: status,
            sortOrder: sortOrder,
            subjectGrade: subjectGrade,
            priority: priority,
            subjectPrerequisites: subjectPrerequisites,
            subjectCoRequisites: subjectCoRequisites,
            dataId: dataId,
            flagEdit: false, // flag for edit
        };
        buildAssoc.push(dataset);
    }
    returnValue = buildAssoc;
    return returnValue;
}

// container + table population
async function generateSubjectsDataTable(
    academicYear = 0,
    academicSemester = 0,
    dataRaw = [],
    containerId,
    indexTableToArray = true,
    isActionVisible = true,
    form = null,
    enableRowReorder = true,
    enableStatusRow = false,
    actionType = -1
) {
    await $(document).ready(async function () {
        const ACTION_UPLOAD_CURRICULUM = 0;
        const ACTION_STUDY_PLAN = 1;
        const TABLE_ID = getRandomId();

        // create table contexts
        let keyPage = null;
        switch (containerId) {
            case tableContainerUploadCurriculum.id:
                keyPage = KEY_CURRICULUM_UPLOAD;
                break;
            case tableContainerStudent.id:
                keyPage = KEY_CURRICULUM_VIEW_STUDENT;
                break;
            case tableContainerSchool.id:
                keyPage = KEY_CURRICULUM_VIEW_SCHOOL;
                break;
            case tableContainerStudyPlan.id:
                keyPage = KEY_STUDY_PLAN;
                break;
        }

        if (keyPage != null) {
            if (collectionTableIds[keyPage][academicYear] == null) {
                collectionTableIds[keyPage][academicYear] = {};
            }
            collectionTableIds[keyPage][academicYear][academicSemester] =
                TABLE_ID;
        }

        let subjectsData = dataRaw;
        if (indexTableToArray) tableCounters[TABLE_ID] = subjectsData.length;

        // align data
        let datasetConverted = convertDataToReadableDataset(
            dataRaw,
            academicYear,
            academicSemester
        );

        // Bootstrap styling container
        var divCard = $("<div>").addClass("card p-4 mb-3");
        var divCardBody = $("<div>").addClass("card-body");
        divCardBody.appendTo(divCard);

        // Main table
        var table = $("<table>")
            .attr("id", TABLE_ID)
            // .attr("style", "width:100%")
            .addClass("table table-striped table-hover caption-top");
        var thead = $("<thead>").appendTo(table);
        var tbody = $("<tbody>").appendTo(table);
        var headerRow = $("<tr>").appendTo(thead);

        // input for max load
        let h3Title = $(
            `
            <div class="container">
            <div class="row">
                <div class="col">
                <strong><p class="text-muted">Curriculum</p></strong>
                </div>
            </div>
            <div class="row">
                <div class="col">
                <h4>Year ${academicYear} — Semester ${academicSemester}</h4>
                </div>
            </div>
            </div>
            `
        );
        let divLabelGroup = $('<div class="input-group mb-3">');
        let labelMaxUnits = $(
            '<span class="input-group-text bg-secondary text-white">Units</span>'
        );
        let inputMaxUnits = $(
            `<input name="unitMaxLoad" type="number" max="99" maxlength="2" class="form-control bg-secondary text-white" placeholder="Input max. units to allocate..." ` +
                `data-academic-year="${academicYear}" data-academic-semester="${academicSemester}"` +
                ` readonly>`
        );
        let buttonAutoCompute = $(
            '<button type="button" class="btn btn-outline-secondary">Auto-compute?</button>'
        );

        labelMaxUnits.appendTo(divLabelGroup);
        inputMaxUnits.appendTo(divLabelGroup);
        // buttonAutoCompute.appendTo(divLabelGroup);
        h3Title.appendTo(divCardBody);
        table.appendTo(divCardBody);
        divLabelGroup.appendTo(divCardBody);

        $("#" + containerId).append(divCard); // Main linker

        // datatable
        let defaultContent = "";
        if (actionType == ACTION_UPLOAD_CURRICULUM) {
            defaultContent =
                `
                <div class="container"> 
                    <div class="row row-cols-5 justify-content-center">
                        <div class="col col-2">
                ` +
                populateActionButton(
                    "btn-success btn-name-add_subject",
                    "bi-plus-circle"
                ) +
                `       </div>
                        <div class="col col-2">
                ` +
                populateActionButton(
                    "btn-primary btn-name-edit_subject",
                    "bi-pencil-square"
                ) +
                `</div>
                <div class="col col-2">` +
                populateActionButton(
                    "btn-warning btn-name-prerequisites",
                    "bi-link-45deg"
                ) +
                `</div>
                <div class="col col-2">` +
                populateActionButton(
                    "btn-warning btn-name-priority",
                    "bi-chevron-double-up"
                ) +
                `</div>
                <div class="col col-2">` +
                populateActionButton(
                    "btn-danger btn-name-delete_subject",
                    "bi-trash"
                ) +
                `
                </div>
                </div>
                </div>
                `;
        }
        if (actionType == ACTION_STUDY_PLAN) {
            defaultContent =
                populateActionButton(
                    "btn-success btn-action btn-name-set_passed",
                    "bi-check-circle"
                ) +
                populateActionButton(
                    "btn-danger btn-action btn-name-set_failed",
                    "bi-x-circle"
                ) +
                populateActionButton(
                    "btn-secondary btn-action btn-name-set_pending",
                    "bi-dash-circle"
                );
        }

        // render functions
        function renderSortRow(data, type, row, meta) {
            return '<i class="bi bi-list text-secondary"></i>';
        }
        function renderStatus(data, type, row) {
            return buildLabelFromText(data);
        }
        function renderPriority(data, type, row) {
            if (data == 2) {
                return buildLabelFromText("ON Manual", "text-bg-success");
            }
            if (data == 1) {
                return buildLabelFromText("ON Auto", "text-bg-success");
            }
            if (data == 0) {
                return buildLabelFromText("OFF", "text-bg-danger");
            }
        }
        function renderLabel(data, type, row) {
            let returnValue = "-";
            if (data == "-" || data == null) return returnValue;
            return buildLabelFromText(data);
        }
        function renderSubjectPrerequisites(data, type, row) {
            let returnValue = "-";
            if (data == null || typeof data == "string") return returnValue;
            if (typeof data == "object" && data.length == 0) return returnValue;

            let divMain = document.createElement("div");
            divMain.classList.add("container");

            for (let item of data) {
                let divRow = document.createElement("div");
                let formatItem = buildLabelFromText(item);
                divMain.append(divRow);
                divRow.classList.add(["row", "mb-3"]);
                divRow.innerHTML = formatItem;
            }
            returnValue = divMain;
            return returnValue;
        }

        let dataTable = $(table).DataTable({
            columns: [
                {
                    data: "sortRow",
                    name: "sortRow",
                    title: "",
                    className: "text-center",
                    visible: enableRowReorder,
                    render: renderSortRow,
                },
                {
                    data: "sortIndex",
                    name: "sortIndex",
                    title: "Sort Index",
                    visible: false,
                },
                {
                    data: "academicYear",
                    title: "Year",
                    visible: false,
                },
                {
                    data: "academicSemester",
                    title: "Semester",
                    visible: false,
                },
                {
                    data: "subjectNumber",
                    name: "subjectNumber",
                    title: "Subject Number",
                    render: renderLabel,
                },
                {
                    data: "subjectCode",
                    name: "subjectCode",
                    title: "Subject Code",
                    render: renderLabel,
                },
                {
                    data: "subjectDescription",
                    name: "subjectDescription",
                    title: "Subject Description",
                },
                {
                    data: "subjectUnit",
                    name: "subjectUnit",
                    className: "text-center",
                    title: "Unit",
                },
                {
                    data: "status",
                    name: "status",
                    title: "Status",
                    className: "text-center",
                    visible: enableStatusRow,
                    render: renderStatus,
                },
                {
                    data: "sortOrder",
                    title: "Sort Order",
                    visible: false,
                },
                {
                    data: "subjectGrade",
                    title: "Grade",
                    visible: false,
                },
                {
                    data: "priority",
                    name: "priority",
                    title: "Priority",
                    className: "text-center",
                    render: renderPriority,
                },
                {
                    data: "dataId",
                    title: "#",
                    visible: false,
                },
                {
                    data: "subjectPrerequisites",
                    name: "subjectPrerequisites",
                    title: "Pre-requisites",
                    className: "text-center",
                    render: renderSubjectPrerequisites,
                },
                {
                    data: "subjectCoRequisites",
                    name: "subjectCoRequisites",
                    title: "Link Subjects",
                    className: "text-center",
                    render: renderSubjectPrerequisites,
                },
                {
                    data: "flagEdit",
                    title: "isEdited",
                    visible: false,
                },
                {
                    data: "action",
                    name: "action",
                    title: "Action",
                    className: "text-center",
                    data: null,
                    defaultContent,
                    visible: isActionVisible,
                },
            ],
            columnDefs: [
                {
                    targets: ["sortRow:name"],
                    width: "5%",
                    className: "reorder",
                    orderable: false,
                },
                {
                    targets: ["sortIndex:name"],
                    orderable: false,
                },
                {
                    targets: ["subjectNumber:name", "subjectCode:name"],
                    width: "5%",
                    className: "dt-left",
                    type: "string",
                    orderable: false,
                },
                {
                    targets: ["subjectDescription:name"],
                    width: "30%",
                    className: "dt-left",
                    type: "string",
                    orderable: false,
                },
                {
                    targets: [
                        "subjectUnit:name",
                        "status:name",
                        "priority:name",
                    ],
                    width: "5%",
                    className: "dt-left",
                    type: "string",
                    orderable: false,
                },
                {
                    targets: [
                        "subjectPrerequisites:name",
                        "subjectCoRequisites:name",
                    ],
                    width: "10%",
                    className: "dt-left",
                    type: "string",
                    orderable: false,
                },
                {
                    targets: "action:name",
                    width: "45%",
                    className: "dt-left",
                    type: "string",
                    orderable: false,
                },
                {
                    targets: "_all",
                    width: "5%",
                },
            ],
            rowReorder: {
                //enable: enableRowReorder,
                enable: false,
                dataSrc: "sortIndex",
            },
            data: datasetConverted,
            paging: false,
            order: [1, "asc"],
            info: false,
            autoWidth: false,
            wordWrap: true,
        });

        // FIXME: why this is being triggered when changing action on study planner? idk
        // maybe wrong index?
        // dataTable.order([LOCAL_INDEX_SUBJECT_ORDER, "asc"]).draw();
        // dataTable.order([LOCAL_INDEX_MAIN_INDEX, "asc"]);

        // events for row reorder
        let rowOrder = [];
        dataTable.on("row-reordered", function (e, diff, edit) {
            rowOrder = dataTable.rows().indexes().toArray();
        });
        // events
        buttonAutoCompute.on("click", async function () {
            if (form == null) {
                // rely on initial data
                // let totalUnits = subjectsData
                //     .map((element) => element.subjectUnit)
                //     .reduce(
                //         (accumulator, currentValue) =>
                //             accumulator + currentValue,
                //         0
                //     );
                // inputMaxUnits.val(totalUnits);

                // rely on datatable
                let currentData = dataTable.data().toArray();
                let totalUnits = 0;
                for (let data of currentData) {
                    totalUnits += data.subjectUnit;
                }

                // hacks
                if (currentData[0].academicYear == 4 && totalUnits <= 27) {
                    totalUnits = 27;
                }
                inputMaxUnits.val(totalUnits);
                return;
            }

            // new! rely on db now!
            let studentId = form.elements["studentId"].value;
            let dataHtml = inputMaxUnits.data();
            let academicYear = dataHtml.academicYear;
            let academicSemester = dataHtml.academicSemester;
            let arr = {
                studentId: studentId,
                academicYear: academicYear,
                academicSemester: academicSemester,
            };

            let resp = await createDataRequest("readMaxLoad", arr);
            let maxUnits = resp.data[0].maxUnits;
            inputMaxUnits.val(maxUnits);
        });
        // event
        buttonAutoCompute.click();

        if (actionType == ACTION_UPLOAD_CURRICULUM) {
            handleAddClick(table, dataTable, buttonAutoCompute);
            handleEditClick(table, dataTable, buttonAutoCompute);
            handleDeleteClick(table, dataTable, buttonAutoCompute);
            await handlePrerequisiteClick(table, dataTable);
            handlePriorityClick(table, dataTable);

            setTooltip(
                TABLE_ID,
                ".btn-name-add_subject",
                "Add subject",
                "custom-tooltip-bs-green"
            );
            setTooltip(
                TABLE_ID,
                ".btn-name-edit_subject",
                "Edit subject",
                "custom-tooltip-bs-blue"
            );
            setTooltip(
                TABLE_ID,
                ".btn-name-prerequisites",
                "Pre-requisites",
                "custom-tooltip-bs-yellow"
            );
            setTooltip(
                TABLE_ID,
                ".btn-name-priority",
                "Toggle priority",
                "custom-tooltip-bs-yellow"
            );
            setTooltip(
                TABLE_ID,
                ".btn-name-delete_subject",
                "Delete subject",
                "custom-tooltip-bs-red"
            );
        }

        if (actionType == ACTION_STUDY_PLAN) {
            $("#" + TABLE_ID + " tbody").on(
                "click",
                ".btn-name-set_passed",
                async function () {
                    await handleStudentStatus(dataTable, 0, this);
                }
            );

            $("#" + TABLE_ID + " tbody").on(
                "click",
                ".btn-name-set_failed",
                async function () {
                    await handleStudentStatus(dataTable, 1, this);
                }
            );

            $("#" + TABLE_ID + " tbody").on(
                "click",
                ".btn-name-set_pending",
                async function () {
                    await handleStudentStatus(dataTable, 2, this);
                }
            );

            // tooltips
            setTooltip(
                TABLE_ID,
                ".btn-name-set_passed",
                "Passed",
                "custom-tooltip-bs-green"
            );
            setTooltip(
                TABLE_ID,
                ".btn-name-set_failed",
                "Failed",
                "custom-tooltip-bs-red"
            );
            setTooltip(
                TABLE_ID,
                ".btn-name-set_pending",
                "Pending",
                "custom-tooltip-bs-gray"
            );
        }
    });
}

function handlePriorityClick(table, dataTable) {
    $("#" + table.attr("id") + " tbody").on(
        "click",
        ".btn-name-priority",
        function () {
            let data = dataTable.row($(this).parents("tr")).data();
            let subjectPrerequisites = data.subjectPrerequisites;
            let subjectCoRequisites = data.subjectCoRequisites;
            let priority = data.priority;
            let priorityPost = priority == 0 ? 2 : 0;
            let icon = "bi-chevron-double-up";

            if (subjectPrerequisites.length != 0) {
                console.log(subjectPrerequisites);
                Swal.fire({
                    text: "You cannot change priority unless remove pre-requisites",
                    title: "Failed",
                    icon: "error",
                });
                return;
            }
            if (subjectCoRequisites.length != 0) {
                console.log(subjectCoRequisites);

                Swal.fire({
                    text: "You cannot change priority unless remove linked subject",
                    title: "Failed",
                    icon: "error",
                });
                return;
            }

            // change icon based on priority level
            // also reflect it on priority datatable column
            switch (priorityPost) {
                case 1:
                    icon = "bi-chevron-double-down";
                    break;
                case 2:
                    icon = "bi-chevron-down";
                    break;
                case 3:
                    icon = "bi-chevron-contract";
                    break;
                case 4:
                    icon = "bi-chevron-up";
                    break;
                case 5:
                    icon = "bi-chevron-double-up";
                    break;
                default:
            }

            let children = $(this).find("i");
            children.removeClass();
            children.addClass(`bi ${icon}`);

            data.priority = priorityPost;
            dataTable.row($(this).parents("tr")).data(data).draw();
        }
    );
}

function handleEditClick(table, dataTable, button) {
    $("#" + table.attr("id") + " tbody").on(
        "click",
        ".btn-name-edit_subject",
        async function () {
            let data = dataTable.row($(this).parents("tr")).data();
            // parse inner html first into text
            let status = stripHtmlTextContent(data.status);
            let radioDataOngoing = status == "Ongoing" ? "checked" : "";
            let radioDataPassed = status == "Passed" ? "checked" : "";
            let radioDataFailed = status == "Failed" ? "checked" : "";
            // Sweetalert2
            const { value: formValues } = await Swal.fire({
                title: "Edit Data",
                icon: "info",
                showCancelButton: true,
                html: `
            <div class="mb-2 p-1">
            <p class="text-start m-1 fw-bold">Subject Number</p>
            <input id="swal-inputSubjectNumber" class="form-control" value=${data.subjectNumber}>
            </div>

            <div class="mb-2 p-1 fw-bold">
            <p class="text-start m-1">Subject Code</p>
            <input id="swal-inputSubjectCode" class="form-control" value="${data.subjectCode}">
            </div>

            <div class="mb-2 p-1 fw-bold">
            <p class="text-start m-1">Subject Description</p>
            <input id="swal-inputSubjectDescription" class="form-control" value="${data.subjectDescription}">
            </div>

            <div class="mb-2 p-1 fw-bold">
            <p class="text-start m-1">Units</p>
            <input id="swal-inputUnits" class="form-control" value="${data.subjectUnit}">
            </div>

            <!--<div class="mb-2 p-1 fw-bold">
                <p class="text-start m-1">Status</p>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="statusRadios" id="swal-radioOngoing" value="Pending" ${radioDataOngoing}>
                    <label class="form-check-label" for="statusRadioOngoing">
                    Pending
                    </label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="statusRadios" id="swal-radioPassed" value="Passed" ${radioDataPassed}>
                    <label class="form-check-label" for="statusRadioPassed">
                    Passed
                    </label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="statusRadios" id="swal-radioFailed" value="Failed" ${radioDataFailed}>
                    <label class="form-check-label" for="statusRadioFailed">
                    Failed
                    </label>
                </div>
            </div>!-->
            `,
                focusConfirm: false,
                preConfirm: () => {
                    // let status = document.querySelector(
                    //     'input[type="radio"][name="statusRadios"]:checked'
                    // ).value;
                    return {
                        subjectNumber: document.getElementById(
                            "swal-inputSubjectNumber"
                        ).value,
                        subjectCode: document.getElementById(
                            "swal-inputSubjectCode"
                        ).value,
                        subjectDescription: document.getElementById(
                            "swal-inputSubjectDescription"
                        ).value,
                        subjectUnit: parseInt(
                            document.getElementById("swal-inputUnits").value
                        ),
                        status: buildLabelFromText(status),
                    };
                },
            });

            if (formValues) {
                let modifiedData = {
                    sortRow: data.sortRow,
                    sortIndex: data.sortIndex,
                    academicYear: data.academicYear,
                    academicSemester: data.academicSemester,
                    subjectNumber: formValues.subjectNumber,
                    subjectCode: formValues.subjectCode,
                    subjectDescription: formValues.subjectDescription,
                    subjectUnit: formValues.subjectUnit,
                    status: formValues.status,
                    sortOrder: data.sortOrder,
                    subjectGrade: data.subjectGrade,
                    priority: data.priority,
                    dataId: data.dataId,
                    subjectPrerequisites: data.subjectPrerequisites,
                    flagEdit: true,
                };
                dataTable.row($(this).parents("tr")).data(modifiedData).draw();
                Swal.fire({
                    title: "Success",
                    text: "Entry has been edited!",
                    icon: "success",
                });
                button.click();
            }
        }
    );
}

function handleAddClick(table, dataTable, button) {
    let offset = 2;
    $("#" + table.attr("id") + " tbody").on(
        "click",
        ".btn-name-add_subject",
        async function () {
            let data = dataTable.row($(this).parents("tr")).data();

            // Sweetalert2
            const { value: formValues } = await Swal.fire({
                title: "Add Data",
                icon: "info",
                showCancelButton: true,
                html: `
            <div class="mb-2 p-1">
                <p class="text-start m-1 fw-bold">Subject Number</p>
                <input id="swal-inputSubjectNumber" class="form-control">
            </div>

            <div class="mb-2 p-1 fw-bold">
                <p class="text-start m-1">Subject Code</p>
                <input id="swal-inputSubjectCode" class="form-control">
            </div>

            <div class="mb-2 p-1 fw-bold">
                <p class="text-start m-1">Subject Description</p>
                <input id="swal-inputSubjectDescription" class="form-control">
            </div>

            <div class="mb-2 p-1 fw-bold">
                <p class="text-start m-1">Units</p>
                <input id="swal-inputUnits" class="form-control">
            </div>

            <!--<div class="mb-2 p-1 fw-bold">
                <p class="text-start m-1">Status</p>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="statusRadios" id="swal-radioOngoing" value="Ongoing" checked>
                    <label class="form-check-label" for="statusRadioOngoing">
                    Ongoing
                    </label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="statusRadios" id="statusRadioPassed" value="Passed">
                    <label class="form-check-label" for="statusRadioPassed">
                    Passed
                    </label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="statusRadios" id="statusRadioFailed" value="Failed">
                    <label class="form-check-label" for="statusRadioFailed">
                    Failed
                    </label>
                </div>!-->
                
            </div>
            `,
                focusConfirm: false,
                preConfirm: () => {
                    return {
                        subjectNumber: document.getElementById(
                            "swal-inputSubjectNumber"
                        ).value,
                        subjectCode: document.getElementById(
                            "swal-inputSubjectCode"
                        ).value,
                        subjectDescription: document.getElementById(
                            "swal-inputSubjectDescription"
                        ).value,
                        subjectUnit: parseInt(
                            document.getElementById("swal-inputUnits").value
                        ),
                    };
                },
            });

            if (formValues) {
                // server code

                // client code
                // collect data first
                let modifiedData = {
                    sortRow: "",
                    sortIndex: data.sortIndex,
                    academicYear: data.academicYear,
                    academicSemester: data.academicSemester,
                    subjectNumber: formValues.subjectNumber,
                    subjectCode: formValues.subjectCode,
                    subjectDescription: formValues.subjectDescription,
                    subjectUnit: formValues.subjectUnit,
                    status: "Pending",
                    sortOrder: tableCounters[table.attr("id")]++,
                    subjectGrade: "0.00",
                    priority: 0,
                    dataId: "-",
                    subjectPrerequisites: [],
                    subjectCoRequisites: [],
                    flagEdit: false,
                };

                dataTable.row.add(modifiedData).draw();
                Swal.fire({
                    title: "Success",
                    text: "Entry has been edited!",
                    icon: "success",
                });
                button.click();
            }
        }
    );
}

function handleDeleteClick(table, dataTable, button) {
    $("#" + table.attr("id") + " tbody").on(
        "click",
        ".btn-name-delete_subject",
        function () {
            let data = dataTable.row($(this).parents("tr")).data();
            let row = $(this).closest("tr");

            Swal.fire({
                title: "Really?",
                text: `You sure to delete this entry?`,
                icon: "question",
                footer: `${data.subjectDescription} (${data.subjectCode})`,
                showCancelButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    dataTable.row(row).remove().draw();

                    Swal.fire({
                        title: "Deleted",
                        text: "Entry has been deleted!",
                        icon: "success",
                    });
                    button.click();
                }
            });
        }
    );
}

function handlePrerequisiteDeleteClick(
    table,
    dataTable,
    academicYear,
    academicSemester,
    subjectCode,
    subjectDescription
) {
    $("#" + table.attr("id") + " tbody").on(
        "click",
        ".btn-name-delete_subject",
        function () {
            let row = $(this).closest("tr");
            dataTable.row(row).remove().draw();
        }
    );
}

async function handlePrerequisiteClick(table, dataTable) {
    $("#" + table.attr("id") + " tbody").on(
        "click",
        ".btn-name-prerequisites",
        async function () {
            let data = dataTable.row($(this).parents("tr")).data();
            let academicYear = data.academicYear;
            let academicSemester = data.academicSemester;
            let subjectCode = data.subjectCode;
            let subjectDescription = data.subjectDescription;

            Swal.close();
            await showSwalForPrerequisite(
                dataTable.row($(this).parents("tr")),
                academicYear,
                academicSemester,
                subjectCode,
                subjectDescription
            );
        }
    );
}

async function showSwalForPrerequisite(
    dataTableRow,
    academicYear,
    academicSemester,
    subjectCode,
    subjectDescription
) {
    let arrPreloadedSubjectPrereqs = [];
    let subjectCodeHook = null;

    const { value: swalData } = await Swal.fire({
        title: "Pre-requisites",
        html: swalHtmlPopupPrerequisites,
        width: "30%",
        showCancelButton: true,
        confirmButtonText: "Create Pre-requisite",
        didOpen: () => {
            const domSubjectCode = document.querySelector(
                "#floatingSubjectCode"
            );
            const domSubjectDescription = document.querySelector(
                "#floatingSubjectDescription"
            );
            const domSubjectSelectPrerequisites = document.querySelector(
                "#swalSelectSubjectForPrerequisites"
            );

            // check then fill
            let dataset = [];
            if (assocSubjectPrerequisites[subjectCode] != null) {
                assocSubjectPrerequisites[subjectCode].forEach((item) => {
                    dataset.push({
                        subjectCode: item,
                    });
                });
            }

            // hook datatemp
            arrPreloadedSubjectPrereqs = dataset;
            const defaultContent = populateActionButton(
                "btn-danger btn-action btn-name-delete_subject",
                "bi-trash"
            );

            const selectSubjectPrerequisite = document.querySelector(
                "#swalSelectSubjectForPrerequisites"
            );

            const buttonAddPrerequisite = document.querySelector(
                "#swalButtonAddPrerequisite"
            );
            const jqUploadCurriculumTable = $("#swalUploadCurriculumTable");
            const jqUploadCurriculumDataTable =
                jqUploadCurriculumTable.DataTable({
                    paging: false,
                    searching: false,
                    data: dataset,
                    columns: [
                        {
                            data: "subjectCode",
                            title: "Subject Code",
                        },
                        {
                            title: "Action",
                            data: null,
                            defaultContent,
                        },
                    ],
                    info: false,
                    columnDefs: [
                        {
                            targets: -1,
                            width: "100px",
                        },
                        {
                            targets: "_all",
                            orderable: false,
                            className: "dt-left",
                            type: "string",
                        },
                    ],
                    order: [],
                });
            jqUploadCurriculumDataTable.draw();
            domSubjectCode.value = subjectCode;
            // FIXME: make assoc array on return instead of these
            subjectCodeHook = subjectCode;
            domSubjectDescription.value = subjectDescription;

            // handle individual button
            selectSubjectPrerequisite.addEventListener(
                "change",
                function (event) {
                    selectSubjectPrerequisite.classList.remove("is-valid");
                    selectSubjectPrerequisite.classList.remove("is-invalid");
                }
            );
            buttonAddPrerequisite.addEventListener("click", function (event) {
                const selectedSubjectPrerequisiteIndex =
                    selectSubjectPrerequisite.selectedIndex;
                const selectedOption =
                    selectSubjectPrerequisite.options[
                        selectedSubjectPrerequisiteIndex
                    ];
                const selectedOptionValue = selectedOption.value;

                // check if exist on table
                // dont add it exist
                const subjectPrerequisiteTableData = jqUploadCurriculumDataTable
                    .data()
                    .toArray();
                if (!selectedOptionValue) return;

                if (subjectPrerequisiteTableData.length != 0) {
                    let hasMatch = false;
                    subjectPrerequisiteTableData.forEach((item) => {
                        if (item.subjectCode !== selectedOptionValue) return;
                        hasMatch = true;
                    });
                    if (hasMatch) {
                        selectSubjectPrerequisite.classList.remove("is-valid");
                        selectSubjectPrerequisite.classList.add("is-invalid");
                        return;
                    } else {
                        selectSubjectPrerequisite.classList.remove(
                            "is-invalid"
                        );
                        selectSubjectPrerequisite.classList.add("is-valid");
                    }
                }

                jqUploadCurriculumDataTable.row
                    .add({ subjectCode: selectedOptionValue })
                    .draw();
            });

            // handle buttons inside table
            handlePrerequisiteDeleteClick(
                jqUploadCurriculumTable,
                jqUploadCurriculumDataTable,
                academicYear,
                academicSemester,
                subjectCode,
                subjectDescription
            );
            setTooltip(
                "swalUploadCurriculumTable",
                ".btn-name-delete_subject",
                "Delete Pre-requisite",
                "custom-tooltip-bs-red"
            );
            // populate select option based on previous year / sem
            let i = 0; // this counter helps user not to accidentally add incorrect data to prereqs
            let tableSubjects = getAlignedDataFromUploadCurriculumTable();
            Object.keys(tableSubjects).forEach((item) => {
                let itemAcademicYear = parseInt(item);
                if (academicYear < itemAcademicYear) {
                    return;
                }
                let objectItemYear = tableSubjects[item];
                Object.keys(objectItemYear).forEach((itemSemester) => {
                    let itemAcademicSemester = parseInt(itemSemester);
                    if (
                        academicSemester < itemAcademicSemester &&
                        academicYear < itemAcademicYear
                    ) {
                        return;
                    }
                    i++;
                    let arrInnerSubjects = objectItemYear[itemAcademicSemester];

                    arrInnerSubjects.forEach((itemSubject) => {
                        let itemSubjectCode = itemSubject.subjectCode;
                        let itemSubjectDescription =
                            itemSubject.subjectDescription;

                        let domOption = document.createElement("option");
                        domOption.value = itemSubjectCode;
                        domOption.textContent =
                            itemSubjectCode + " " + itemSubjectDescription;
                        domSubjectSelectPrerequisites.add(domOption);
                    });
                });
            });

            if (i == 0) {
                Swal.close();
                Swal.fire({
                    title: "Failed",
                    icon: "error",
                    text: "No prior courses before this table. Select later courses.",
                });
            }
        },
        preConfirm: () => {
            // this is the table INSIDE swal popup!
            return $("#swalUploadCurriculumTable").DataTable().data().toArray();
        },
    });

    if (swalData) {
        let dataCurriculum = $(`#${tableContainerUploadCurriculum.id} table`)
            .DataTable()
            .data()
            .toArray();
        dataCurriculum = sortToAssocByYearAndSemesterV2(dataCurriculum);

        collectionSubjects[KEY_CURRICULUM_UPLOAD] = dataCurriculum;

        // reset fill
        let data = dataTableRow.data();
        assocSubjectPrerequisites[subjectCode] = [];
        for (let item of swalData) {
            assocSubjectPrerequisites[subjectCode].push(item.subjectCode);
        }

        // set data to current row
        if (data.priority != 2) {
            data.priority =
                assocSubjectPrerequisites[subjectCode].length >= 1 ? 1 : 0;
        }
        data["subjectPrerequisites"] = assocSubjectPrerequisites[subjectCode];
        dataTableRow.data(data).draw();

        // coreqs
        // remove old data and push newly created one
        let cLinkSubject = collectionLinkSubjects[KEY_CURRICULUM_UPLOAD];
        let cSubject = collectionSubjects[KEY_CURRICULUM_UPLOAD];
        let cTableId = collectionTableIds[KEY_CURRICULUM_UPLOAD];

        arrPreloadedSubjectPrereqs.forEach(function (item) {
            if (cLinkSubject[item.subjectCode] != null) {
                let dataNew = cLinkSubject[item.subjectCode].filter(function (
                    filtItem
                ) {
                    return filtItem !== subjectCodeHook;
                });
                cLinkSubject[item.subjectCode] = dataNew;
            }
        });

        for (let item of swalData) {
            if (cLinkSubject[item.subjectCode] == null) {
                cLinkSubject[item.subjectCode] = [];
            }
            cLinkSubject[item.subjectCode].push(subjectCodeHook);
        }

        // draw on datatable
        loadLinksSubjectsOnExistingDataTable(KEY_CURRICULUM_UPLOAD);

        // clear hooks
        subjectCodeHook = null;

        Swal.fire({
            icon: "success",
            title: "Success",
            text: "Saved Pre-requisite/s successfully!",
        });
    }
}

function loadLinksSubjectsOnExistingDataTable(keyPage) {
    let cLinkSubject = collectionLinkSubjects[keyPage];
    let cSubject = collectionSubjects[keyPage];
    let cTableId = collectionTableIds[keyPage];
    for (let key in cLinkSubject) {
        let dataLinkSubject = cLinkSubject[key];
        let dataMatch = searchAssocArray(cSubject, key);
        let academicYear = dataMatch.academicYear;
        let academicSemester = dataMatch.academicSemester;
        let matchTableId = cTableId[academicYear][academicSemester];
        let mDataTable = $(`#${matchTableId}`).DataTable();

        // get row
        let dataDtColumnSubjectCode = mDataTable
            .column("subjectCode:name")
            .data()
            .toArray();
        let rowIndex = -1;
        for (let i = 0; i < dataDtColumnSubjectCode.length; i++) {
            let item = dataDtColumnSubjectCode[i];
            if (item == key) {
                rowIndex = i;
                break;
            }
        }
        let currentRow = mDataTable.row(rowIndex);
        let currentRowData = currentRow.data();
        let currentRowDataPriority = currentRowData.priority;

        currentRowData["subjectCoRequisites"] = dataLinkSubject;

        // priority data
        if (currentRowDataPriority != 2) {
            currentRowData["priority"] = dataLinkSubject.length >= 1 ? 1 : 0;
        }
        currentRow.data(currentRowData).draw();
    }
}

function createLinkSubjectsFromPrerequisites(dataPrerequisite, keyPage) {
    let cLinkSubject = (collectionLinkSubjects[keyPage] = {});
    for (let key in dataPrerequisite) {
        let itemPrerequisite = dataPrerequisite[key];
        for (let item of itemPrerequisite) {
            if (cLinkSubject[item] == null) {
                cLinkSubject[item] = [];
            }
            cLinkSubject[item].push(key);
        }
    }
}

function searchAssocArray(assocArray, subjectCode) {
    let dataResult = null;

    outerLoop: for (let keyYear in assocArray) {
        let dataItem1 = assocArray[keyYear];

        for (let keySemester in dataItem1) {
            let dataItem2 = dataItem1[keySemester];

            for (let item1 of dataItem2) {
                if (item1.subjectCode == subjectCode) {
                    dataResult = {
                        academicYear: keyYear,
                        academicSemester: keySemester,
                    };
                    break outerLoop;
                }
            }
        }
    }
    return dataResult;
}

async function handleStudentStatus(dataTable, value, eventElement) {
    $(eventElement).tooltip("dispose");
    let data = dataTable.row($(eventElement).parents("tr")).data();
    let modifiedData = deepCopy(data);

    // refrain use of switch
    let statusValue = null;
    if (value == 0) {
        statusValue = "Passed";
    }
    if (value == 1) {
        statusValue = "Failed";
    }
    if (value == 2) {
        statusValue = "Pending";
    }
    modifiedData.status = statusValue;

    let fetchStatus = statusValue;
    let fetchStudentSubjectId = data.dataId;
    let fetchGrade = data.subjectGrade;

    // set datas
    dataTable.row($(eventElement).parents("tr")).data(modifiedData).draw();
    await createDataRequest(
        "updateGrade",
        {
            studentSubjectId: fetchStudentSubjectId,
            grade: fetchGrade,
            status: fetchStatus,
        },
        {
            text: "Updating grade...",
        }
    );
}

async function initNewDataToDom() {
    Swal.fire({
        text: "Synching data, please wait...",
        didOpen: () => {
            Swal.showLoading();
        },
    });
    await initMultipleDomStudent();

    // for student view
    document
        .querySelector("#student-select-school")
        .dispatchEvent(new Event("change"));
    Swal.close();
}

async function fetchHtml(url, extraArgs, parseToDOM = false) {
    let doc = null;
    const formData = new FormData();
    formData.append("jsonData", JSON.stringify(extraArgs));

    await fetch(url, {
        method: "POST",
        body: formData,
    })
        .then((response) => {
            return response.text();
        })
        .then((html) => {
            doc = html;
            if (parseToDOM) {
                const parser = new DOMParser();
                doc = parser.parseFromString(html, "text/html");
            }
        });

    return doc;
}

function getAlignedDataFromUploadCurriculumTable() {
    var arrUploadCurriculumDatas = $(
        `#${tableContainerUploadCurriculum.id} table`
    )
        .DataTable()
        .data()
        .toArray();
    var arrAligneduploadCurriculumDatas = {};
    arrUploadCurriculumDatas.forEach((item) => {
        let academicYear = item.academicYear;
        let academicSem = interpretSemesterToNumber(item.academicSemester);
        if (arrAligneduploadCurriculumDatas[academicYear] == null) {
            arrAligneduploadCurriculumDatas[academicYear] = {};
        }
        if (
            arrAligneduploadCurriculumDatas[academicYear][academicSem] == null
        ) {
            arrAligneduploadCurriculumDatas[academicYear][academicSem] = [];
        }
        arrAligneduploadCurriculumDatas[academicYear][academicSem].push(item);
    });
    return arrAligneduploadCurriculumDatas;
}

function interpretSemesterToNumber(value) {
    let returnValue = null;
    let semesterToNumber = value;

    let test = parseInt(value);
    if (isNaN(test)) {
        if (value.toLowerCase() == "summer") {
            semesterToNumber = 3;
        } else if (value.toLowerCase() == "bridge") {
            semesterToNumber = 4;
        } else {
            semesterToNumber = 5;
        }
    }

    semesterToNumber = parseInt(semesterToNumber);
    if (isNaN(semesterToNumber)) semesterToNumber = null;
    returnValue = semesterToNumber;
    return returnValue;
}

async function initMultipleDomStudent() {
    let arrDomStudent = document.querySelectorAll(".populate-student");
    let arrDomSchool = document.querySelectorAll(".populate-school");
    let fetchDataStudents = await createDataRequest("readStudentAll", {
        fetchMethod: CODE_PDO_FETCH_ASSOC,
    });
    let fetchDataSchools = await createDataRequest("readSchools");

    arrDomStudent.forEach((item) => {
        populateSelect(item, 0, fetchDataStudents.data);
    });

    arrDomSchool.forEach((item) => {
        populateSelect(item, 1, fetchDataSchools.data);
    });
}

function populateSelect(select, selectType = -1, arrayDataAssoc) {
    let option = document.createElement("option");

    // reset html
    select.innerHTML = "";
    option.value = "";
    option.textContent = "";
    option.selected = true;
    option.disabled = true;
    select.append(option);

    if (selectType == -1) return;

    arrayDataAssoc.forEach((data) => {
        let id = null;
        let textContent = null;

        // i know switch, i just dont
        // until it needs to
        if (selectType == 0) {
            let firstName = data.firstName;
            let middleName = data.middleName;
            let lastName = data.lastName;

            id = data.id;
            if (middleName == null || middleName.length == 0) {
                textContent = `${firstName} ${lastName}`;
            } else {
                textContent = `${firstName} ${middleName} ${lastName}`;
            }
        }
        if (selectType == 1) {
            let schoolName = data.schoolName;

            id = data.id;
            textContent = schoolName;
        }

        let option = document.createElement("option");
        option.value = id;
        option.textContent = textContent;
        select.append(option);
    });
}

async function createDataRequest(action, arrayData = null, loadingScreen = {}) {
    let returnValue = null;
    let jsonData = JSON.stringify(arrayData);
    let formData = new FormData();
    formData.append("action", action);
    formData.append("jsonData", jsonData);

    // for loading
    if (
        loadingScreen.instance != null &&
        loadingScreen.text != null &&
        !testMode
    ) {
        let text = loadingScreen.text;
        let swalInstance = loadingScreen.instance;
        swalInstance.update({
            text: text,
        });
    } else if (loadingScreen.text != null && !testMode) {
        let text = loadingScreen.text;
        Swal.fire({
            text: text,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
    }

    const response = await fetch(API, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ${text} entry!`);
    }

    const data = await response.json();

    if (data) returnValue = data;
    if (loadingScreen.instance == null && loadingScreen.text != null) {
        Swal.close();
    }
    return returnValue;
}

function sortToAssocByYearAndSemester(srcData) {
    let returnValue = null;
    let dstData = {};
    // get unique array values
    var test = srcData.data.map((el) => [
        el["academicYear"],
        el["academicSemester"],
    ]);
    let uniqueData = [];
    test.forEach((data, index) => {
        if (index == 0) {
            uniqueData.push(data);
            return;
        }
        let similar = false;
        uniqueData.forEach((data2, index2) => {
            if (data[0] == data2[0] && data[1] == data2[1]) {
                similar = true;
                return;
            }
        });
        if (!similar) {
            uniqueData.push(data);
        }
    });

    let uniqueYears = new Set(uniqueData.map((el) => el[0]));
    uniqueYears.forEach((element) => {
        dstData[element] = {};
    });

    uniqueData.forEach((element) => {
        dstData[element[0]][element[1]] = [];
    });

    srcData.data.forEach((element) => {
        let keyYear = element["academicYear"];
        let keySemester = element["academicSemester"];
        dstData[keyYear][keySemester].push(element);
    });

    returnValue = dstData;
    return returnValue;
}

// FIXME: merge
function sortToAssocByYearAndSemesterV2(srcData, spliceData = null) {
    let returnValue = null;
    let dstData = {};
    // get unique array values
    let test = srcData.map((el) => [
        el["academicYear"],
        el["academicSemester"],
    ]);
    let uniqueData = [];
    test.forEach((data, index) => {
        if (index == 0) {
            uniqueData.push(data);
            return;
        }
        let similar = false;
        uniqueData.forEach((data2, index2) => {
            if (data[0] == data2[0] && data[1] == data2[1]) {
                similar = true;
                return;
            }
        });
        if (!similar) {
            uniqueData.push(data);
        }
    });

    let uniqueYears = new Set(uniqueData.map((el) => el[0]));
    uniqueYears.forEach((element) => {
        dstData[element] = {};
    });

    uniqueData.forEach((element) => {
        dstData[element[0]][element[1]] = [];
    });

    if (spliceData != null) {
        srcData.forEach((element) => {
            let keyYear = element["academicYear"];
            let keySemester = element["academicSemester"];
            dstData[keyYear][keySemester] = element[spliceData];
        });
    } else {
        srcData.forEach((element) => {
            let keyYear = element["academicYear"];
            let keySemester = element["academicSemester"];
            dstData[keyYear][keySemester].push(element);
        });
    }
    returnValue = dstData;
    return returnValue;
}

function stripHtmlTextContent(stringHtml) {
    let returnValue = null;

    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = stringHtml;
    returnValue = tempDiv.textContent;
    return returnValue;
}

function buildLabelFromText(stringText, customColor = null) {
    let returnValue = null;
    let statusLabel = "text-bg-secondary";

    if (customColor == null) {
        if (stringText == "Passed") {
            statusLabel = "text-bg-success";
        }
        if (stringText == "Failed") {
            statusLabel = "text-bg-danger";
        }
        if (stringText == "Ongoing") {
            statusLabel = "text-bg-warning";
        }
        if (
            stringText == "Retake" ||
            stringText == "Adjusted" ||
            stringText == "Priority Adjusted"
        ) {
            statusLabel = "text-bg-primary";
        }
    } else {
        statusLabel = customColor;
    }
    returnValue = `<span class="badge rounded-pill ${statusLabel}">${stringText}</span>`;

    return returnValue;
}

async function createSheet(data, id = "") {
    // loading ui
    const mainSwal = Swal.fire({
        title: "Generating",
        allowOutsideClick: false,
        showConfirmButton: false,
        didRender: () => {
            Swal.showLoading();
        },
    });
    let studentId = data.studentId;
    let studentName = data.studentName;
    let school = data.school;
    let course = data.course;
    let educationYear = data.educationYear;
    let assocYearAndSemester = data.subjects;
    const maxUnits = data.maxUnits;

    const COLUMN_HEADER = [
        "Subject Number",
        "Subject Code",
        "Subject Description",
        "Units",
        "Pre-requisite",
    ];

    let arrSheetReadable = [
        ["Student Name:", studentName],
        ["School:", school],
        ["Course:", course],
        ["Year:", educationYear],
        [],
    ];
    for (let keyYear in assocYearAndSemester) {
        for (let keySemester in assocYearAndSemester[keyYear]) {
            // important gawing non assoc array since datatables only reads 2d array
            let arrData = assocYearAndSemester[keyYear][keySemester];
            let maxUnit = maxUnits[keyYear][keySemester];

            arrSheetReadable.push(
                [`Year ${keyYear} Semester ${keySemester}`],
                COLUMN_HEADER
            );

            for (let i = 0; i < arrData.length; i++) {
                let dataSubject = arrData[i];
                let subjectPrerequisites =
                    dataSubject.subjectPrerequisites != null
                        ? dataSubject.subjectPrerequisites.toString()
                        : "-";
                let arrBuildFromDataSubject = [
                    dataSubject.subjectNumber,
                    dataSubject.subjectCode,
                    dataSubject.subjectDescription,
                    dataSubject.subjectUnit,
                    subjectPrerequisites,
                ];
                arrSheetReadable.push(arrBuildFromDataSubject);
            }

            // push blanks
            arrSheetReadable.push(
                [`Max Units: ${maxUnit[0].maxUnits}`],
                [],
                []
            );
        }
    }

    var workbook = XLSX.utils.book_new();
    var firstWorksheet = XLSX.utils.aoa_to_sheet(arrSheetReadable);

    // resize
    var range = XLSX.utils.decode_range(firstWorksheet["!ref"]);
    // Define the desired width for columns (in Excel's character width units)
    var columnWidth = 15; // Width for all columns

    // Set the width for all columns in the worksheet
    for (var i = range.s.c; i <= range.e.c; i++) {
        switch (i) {
            case 0:
            case 1:
            case 4:
                columnWidth = 15;
                break;
            case 2:
                columnWidth = 45;
                break;
            case 3:
                columnWidth = 25;
                break;
        }
        firstWorksheet["!cols"] = firstWorksheet["!cols"] || [];
        firstWorksheet["!cols"][i] = { wch: columnWidth };
    }

    // Define the desired height for rows (in Excel's point size units)
    var rowHeight = 20; // Height for all rows

    // Set the height for all rows in the worksheet
    for (var j = range.s.r; j <= range.e.r; j++) {
        firstWorksheet["!rows"] = firstWorksheet["!rows"] || [];
        firstWorksheet["!rows"][j] = { hpt: rowHeight };
    }

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, firstWorksheet, "Study Plan");

    // Write the workbook to a file
    XLSX.writeFile(workbook, data.filename);

    mainSwal.close();
}

async function createPdf(data, tableContainerId) {
    let jsonData = JSON.stringify(data);
    const targetUrl = "./nodeapi.php/pdf";
    let contentType = null;
    let serverFileName = null;

    fetch(targetUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: jsonData,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response failed");
            }
            contentType = response.headers.get("Content-Type");
            serverFileName = response.headers.get("filename");
            return response;
        })
        .then((response) => {
            if (contentType.includes("application/json")) {
                return response.json();
            }
            return response.blob();
        })
        .then((blob) => {
            if (contentType.includes("application/pdf")) {
                const file = blob;
                let fileUrl = URL.createObjectURL(file);
                var link = document.createElement("a");
                link.download = data.filename;
                link.href = fileUrl;
                link.click();
                URL.revokeObjectURL(fileUrl);
            } else if (contentType.includes("application/json")) {
                Swal.fire({
                    text: blob.message,
                    title: "Failed",
                    icon: "error",
                });
            } else {
                console.log("Unsupported file type");
            }
        })
        .catch((error) => {
            console.error("Error fetching the file:", error);
        });
}
async function initStudentSchoolSelectData() {
    studentSelectSchool.innerHTML = "";

    let srvRequest = await createDataRequest("readSchools", null);
    srvRequest = srvRequest.data;

    // set default option
    const optionDefaultElement = document.createElement("option");
    optionDefaultElement.value = -1;
    optionDefaultElement.text = "(All)";
    optionDefaultElement.selected = true;
    studentSelectSchool.add(optionDefaultElement);

    // dispatch select event so it reflects on record
    let event = new Event("change", {
        bubbles: true,
        cancelable: true,
    });
    studentSelectSchool.dispatchEvent(event);

    srvRequest.forEach((item) => {
        let id = item.id;
        let schoolName = item.schoolName;

        const optionElement = document.createElement("option");
        optionElement.value = id;
        optionElement.text = schoolName;
        studentSelectSchool.add(optionElement);
    });
}

function generateDataTable(
    divContainerId = "",
    newTableId = "",
    columns = [],
    dataSet = [],
    extra = { hasBootstrap: true },
    dtExtra = {}
) {
    let hasBootstrap = extra.hasBootstrap;
    let captionMessage = extra.captionMessage;
    let captionTop = extra.captionTop;

    document.querySelector(`#${divContainerId}`).innerHTML = "";
    $(document).ready(function () {
        let table = $("<table>");
        let caption = $("<caption>");
        let id = newTableId;
        table.attr("id", id);

        if (hasBootstrap) {
            table.addClass("table table-hover");
            if (captionTop) table.addClass("caption-top");
        }
        if (captionMessage != null && captionMessage.length != 0) {
            caption.text(captionMessage);
            table.prepend(caption);
        }

        // inject to div
        $(`#${divContainerId}`).append(table);

        if (Object.entries(dtExtra) == 0) {
            table.DataTable({
                data: dataSet,
                columns: columns,
                info: false,
            });
        } else {
            table.DataTable(dtExtra);
        }

        $(`#${id}`).on("click", ".btn-name-curriculum", async function () {
            // simulate
            await automateChooseViewCurriculumByStudent($(this).data("id"));
        });
        $(`#${id}`).on("click", ".btn-name-study-plan", async function () {
            await automateStudyPlanEvent($(this).data("id"));
        });
    });
}

function generateStudentRecordsTableViaSchool(divContainerId, dataSet = []) {
    var columns = [
        { title: "#", visible: false },
        { title: "First Name" },
        { title: "Middle Name" },
        { title: "Last Name" },
        { title: "School" },
        { title: "Course" },
        { title: "Education Year" },
        {
            title: "Action",
            data: null,
            render: function (data, type, row) {
                return (
                    `<button type="button" class="btn btn-action btn-name-curriculum btn-primary btn-sm" data-id="${row[0]}">Curriculum</button>` +
                    `<button type="button" class="btn btn-action btn-name-study-plan btn-warning btn-sm" data-id="${row[0]}">Study Plan</button>`
                );
            },
        },
    ];

    let dtExtra = {
        autoWidth: false,
        data: dataSet,
        columns: columns,
        paging: false,
        columnDefs: [
            { width: "150px", targets: [0, 1, 2, 3, 6] }, // Set width for Column 1
            { width: "500px", targets: [4, 5, 7] }, // Set width for Column 1
            // Add more targets for additional columns as needed
        ],
        fixedColumns: true, // Enable fixed columns
        info: false,
    };
    let id = getRandomId();

    generateDataTable(
        divContainerId,
        id,
        columns,
        dataSet,
        {
            hasBootstrap: true,
        },
        dtExtra
    );
}

function addEventToButtonAnalyze(button) {
    button.addEventListener("click", function (event) {
        Swal.fire({
            title: "Heads up!",
            text: "System will generate optimal data for you automatically. This will overwrite current data. Proceed?",
            icon: "question",
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                let data = await $(`#${tableContainerStudyPlan.id} table`)
                    .DataTable()
                    .data()
                    .toArray();
                let studentId = formStudyPlan.elements["studentId"].value;
                if (await analyzeSubjectsV2(data, studentId, false)) {
                    Swal.close();
                    Swal.fire({
                        title: "Success!",
                        text: "Data has been modified!",
                        icon: "success",
                    }).then((result) => {
                        let studentId =
                            formStudyPlan.elements["studentId"].value;
                        automateStudyPlanEvent(studentId);
                    });
                } else {
                    Swal.fire({
                        title: "Umm...",
                        text: "Nothing to parse!",
                        icon: "info",
                    }).then((result) => {
                        // TODO: if something interesting to do, put here
                    });
                }
            }
        });
    });
}

function fetchDatatableArrayFromContainer(containerId, isUnified = false) {
    let returnValue = null;
    let fetchTables = [];
    let currentTables = $(`${containerId} table`);
    if (isUnified) {
        fetchTables = currentTables.DataTable().data().toArray();
    } else {
        currentTables.each((index, data) => {
            let dataTable = $(data).DataTable();
            fetchTables.push(dataTable.data().toArray());
        });
    }
    returnValue = fetchTables;
    return returnValue;
}

async function analyzeSubjectsV3(dataSubjects = null, dataMaxUnits = null, reportOnly = false) {
    let subjectsModified = [];
    let subjectsFailed = [];
    let sfPrerequisitePass1 = [];

    if (dataSubjects == null || dataMaxUnits == null) {
        return subjectsModified;
    }
    
    // get all failed subjectss
    subjectsFailed = dataSubjects.filter(el => el.status == "Failed");
    // get all failed subject's prerequisites recursively!
    sfPrerequisitePass1 = dataSubjects.filter(el => el.subjectPrerequisites.length != 0);
    // prepare recursive prererqs
    
    subjectsModified = deepCopy(dataSubjects);
    return subjectsModified;
}
async function analyzeSubjectsV2(
    data = null,
    studentId = null,
    reportOnly = false
) {
    let dataQueueServerRequest = {
        addMaxLoad: [],
        updateViaStudyPlan: [],
    };

    let serverDataStudentSubjects = null;
    let dataStudentSubjects = null;
    let subjectsFailedRaw = null;
    let subjectsFailedSorted = null;
    let subjectsFailed = [];
    let dataFailedSubsPost = []; // lookup para sa mga namodify na row
    let subjectsFailedLinks = [];
    let dataFailedSubsWithPrereqsPost = [];
    let dataSubsPriorityOnlyPre = [];
    let dataSubsPriorityOnlyPost = [];
    let dataStudentMaxUnits = null;
    let dataStudentMaxUnitsSorted = null;
    let dataStudentMaxUnitsSortedCurrent = {};
    let arrSubjectFailedWithLink = [];
    let dataFailedSubsLinkSubjectsPre = [];
    let dataFailedSubsLinkSubjectsPost = [];
    let dataSubjectNonPriority = [];
    let dataSubjectNonPrioritySorted = {};
    let dataSubjectCollateral = [];
    let serverStudentInfo = null;

    let studentData = null;
    let studentFirstName = null;
    let studentMiddleName = null;
    let studentLastName = null;
    let studentEducationYear = null;
    let studentSchoolName = null;
    let studentCourseTitle = null;

    // recursively get linked subs
    function recursiveCheckLinks(paramSubjectCode) {
        let data = subjectsFailedRaw.filter(
            (el) => el.subjectCode == paramSubjectCode
        );
        for (let item of data) {
            let idata = item.subjectCoRequisites;
            arrSubjectFailedWithLink.push(idata.flat(2));
            if (idata.length == 0) return;
            for (let item2 of idata) {
                recursiveCheckLinks(item2);
            }
        }
    }

    if (studentId == null || studentId === "") {
        Swal.fire({
            icon: "error",
            title: "Failed",
            text: "Please supply student id.",
        });
        return null;
    }

    serverStudentInfo = await createDataRequest("readStudent", {
        studentId: studentId,
        getRaw: true,
    });

    if (serverStudentInfo == null) {
        return null;
    }

    studentData = serverStudentInfo.data[0];
    studentFirstName = studentData.firstName;
    studentMiddleName = studentData.middleName;
    studentLastName = studentData.lastName;
    studentSchoolName = studentData.schoolName;
    studentCourseTitle = studentData.courseTitle;
    studentEducationYear = studentData.educationYear;
    if (!testMode) {
        console.log(
            `
        Executing student: \n
        Name: ${studentFirstName} ${studentMiddleName} ${studentLastName} \n
        School: ${studentSchoolName} \n
        Course: ${studentCourseTitle} \n
        Education Year: ${studentEducationYear}
        `
        );
    }

    subjectsFailedRaw = data;
    subjectsFailedSorted = sortToAssocByYearAndSemesterV2(subjectsFailedRaw);
    subjectsFailed = subjectsFailedRaw.filter((el) => el.status == "Failed");
    if (subjectsFailed.length == 0) {
        Swal.fire({
            icon: "error",
            title: "Failed",
            text: "No failed subjects found.",
        });
        return;
    }

    subjectsFailedLinks = subjectsFailed.filter(
        (el) => el.subjectCoRequisites.length != 0
    );

    arrSubjectFailedWithLink = subjectsFailedLinks
        .map((el) => el.subjectCoRequisites)
        .flat(2);

    // prevent loop
    /*
    let tempArrSubjectFailedWithLink = deepCopy(arrSubjectFailedWithLink);
    for (let fsItem of tempArrSubjectFailedWithLink) {
        recursiveCheckLinks(fsItem);
    }
    */
    arrSubjectFailedWithLink.flat();

    arrSubjectFailedWithLink = Array.from(new Set(arrSubjectFailedWithLink)); // unique

    for (let item of arrSubjectFailedWithLink) {
        let subjectData = subjectsFailedRaw.filter(
            (el) => el.subjectCode == item
        );
        dataFailedSubsLinkSubjectsPre =
            dataFailedSubsLinkSubjectsPre.concat(subjectData);
    }
    dataSubjectNonPriority = subjectsFailedRaw.filter(
        (el) => !el.priority && el.status == "Pending"
    );
    dataSubjectNonPrioritySorted = sortToAssocByYearAndSemesterV2(
        dataSubjectNonPriority
    );

    dataStudentMaxUnits = await createDataRequest("readMaxLoadAllViaStudent", {
        studentId: studentId,
    });
    dataStudentMaxUnitsSorted = sortToAssocByYearAndSemesterV2(
        dataStudentMaxUnits.data,
        "maxUnits"
    );
    dataStudentMaxUnitsSortedCurrent = deepCopy(dataStudentMaxUnitsSorted);

    // test failed subs, do not process duplicate subs
    // this avoids redundancy!
    subjectsFailed = subjectsFailed.filter(
        (itemX) =>
            !dataFailedSubsLinkSubjectsPre.some(
                (itemY) => itemX.subjectCode === itemY.subjectCode
            )
    );

    // calculate all subjects in tables
    for (let keyYear in subjectsFailedSorted) {
        let item = subjectsFailedSorted[keyYear];
        for (let keySemester in item) {
            let units = 0;
            let item2 = item[keySemester];
            for (let innerItem of item2) {
                units += innerItem.subjectUnit;
            }
            dataStudentMaxUnitsSortedCurrent[keyYear][keySemester] = units;
        }
    }

    // decrease max units so we can use it as
    // a basis when inserting to tables
    for (let item of subjectsFailed) {
        let subjectCode = item.subjectCode;
        let subjectUnit = item.subjectUnit;
        let academicYear = item.academicYear;
        let academicSemester = item.academicSemester;

        dataStudentMaxUnitsSortedCurrent[academicYear][academicSemester] -=
            subjectUnit;
    }
    for (let item of dataFailedSubsLinkSubjectsPre) {
        let subjectCode = item.subjectCode;
        let subjectUnit = item.subjectUnit;
        let academicYear = item.academicYear;
        let academicSemester = item.academicSemester;

        dataStudentMaxUnitsSortedCurrent[academicYear][academicSemester] -=
            subjectUnit;
    }

    const PROCESS_FAILED_SUBJECTS = 0;
    const PROCESS_FAILED_SUBJECTS_PREREQS = 1;
    const PROCESS_FAILED_SUBJECTS_PRIORITY = 2;
    const PROCESS_COLLATERAL_SUBJECTS = 3;

    function processSubjects(subjectsType, paramData) {
        // main algo for subject anayze
        // idea: original location offset
        for (let item of paramData) {
            let subjectCode = item.subjectCode;
            let subjectPrerequisites = item.subjectPrerequisites;
            let subjectUnit = item.subjectUnit;
            let isPriority = item.priority > 0;
            let itemStatus = item.status;
            let academicYear = item.academicYear;
            let academicSemester = item.academicSemester;
            let srcSemesterToNumber =
                interpretSemesterToNumber(academicSemester);
            let yearToMove = academicYear;
            let needsToMove = true;

            if (!testMode) {
                console.log(
                    "Processing ",
                    subjectCode,
                    ` (Year ${academicYear} Semester ${academicSemester} Unit ${subjectUnit})`
                );
            }

            if (subjectsType == PROCESS_FAILED_SUBJECTS_PREREQS) {
                let maxYear = null;
                let dstSemesterToNumber = null;
                let dataOfMaxYear = null;
                let itemOriginal = subjectsFailedRaw.filter((el) =>
                    subjectPrerequisites.some(
                        (subjectPrereq) => el.subjectCode == subjectPrereq
                    )
                );

                for (let innerItemOriginal of itemOriginal) {
                    let innerMaxYear = innerItemOriginal.academicYear;
                    let innerSemester = innerItemOriginal.academicSemester;
                    if (maxYear == null || maxYear < innerMaxYear) {
                        maxYear = innerMaxYear;
                        dstSemesterToNumber = innerSemester;
                    }
                    if (innerItemOriginal.academicYear == academicYear) {
                        dataOfMaxYear = innerItemOriginal;
                    }
                }
                let item2 = dataFailedSubsPost.filter((el) =>
                    subjectPrerequisites.some(
                        (subjectPrereq) => el.subjectCode == subjectPrereq
                    )
                );
                // get max year of its prereqs so it does not fall on year similar or less than all of its subject prereqs
                for (let innerItem2 of item2) {
                    let innerMaxYear = innerItem2.academicYear;
                    let innerSemester = innerItem2.academicSemester;
                    if (maxYear == null || maxYear < innerMaxYear) {
                        maxYear = innerMaxYear;
                        dstSemesterToNumber = innerSemester;
                    }
                }
                yearToMove = maxYear;
                dstSemesterToNumber =
                    interpretSemesterToNumber(dstSemesterToNumber);
                if (!testMode) {
                    console.log(
                        subjectCode,
                        ": semester is ",
                        srcSemesterToNumber
                    );
                }
                needsToMove = yearToMove > academicYear;
                if (yearToMove == academicYear) {
                    needsToMove = srcSemesterToNumber <= dstSemesterToNumber;
                }
                if (!needsToMove) {
                    if (!testMode) {
                        console.log(subjectCode, ": will NOT MOVE!");
                    }
                }
                if (
                    dataOfMaxYear != null &&
                    dataOfMaxYear.academicYear == academicYear
                )
                    yearToMove--;
            }

            // // FIXME: hook
            if (yearToMove < studentEducationYear) {
                yearToMove = studentEducationYear - 1;
                if (!testMode) {
                    console.log(
                        `ST-${subjectsType}: Padded to ${yearToMove} since student is in year ${studentEducationYear}`
                    );
                }
            }

            needsToMove = itemStatus != "Passed";
            if (itemStatus == "Passed") {
                if (!testMode) {
                    console.log(
                        `${subjectCode}: will not move, status is "${itemStatus}"`
                    );
                }
            }

            while (needsToMove) {
                let dataYear = null;
                let dataYearCurrent = null;
                let dataSemester = null;
                let dataSemesterCurrent = null;
                let curriculumMaxUnits = null;
                let curriculumAllocatedUnits = null;
                let hasPriorityMatch = false;
                let isAllocatable = false;

                yearToMove++;

                // test before use
                dataYear = dataStudentMaxUnitsSorted[yearToMove];
                dataYearCurrent = dataStudentMaxUnitsSortedCurrent[yearToMove];
                if (dataYear == null) {
                    dataYear = dataStudentMaxUnitsSorted[yearToMove] = {};
                }
                if (dataYearCurrent == null) {
                    dataYearCurrent = dataStudentMaxUnitsSortedCurrent[
                        yearToMove
                    ] = {};
                }

                dataSemester =
                    dataStudentMaxUnitsSorted[yearToMove][academicSemester];
                dataSemesterCurrent =
                    dataStudentMaxUnitsSortedCurrent[yearToMove][
                        academicSemester
                    ];
                if (dataSemester == null || dataSemesterCurrent == null) {
                    let maxUnits = 27;
                    dataStudentMaxUnitsSorted[yearToMove][academicSemester] =
                        maxUnits;
                    dataStudentMaxUnitsSortedCurrent[yearToMove][
                        academicSemester
                    ] = 0;
                    dataQueueServerRequest.addMaxLoad.push([
                        {
                            studentId: studentId,
                            academicYear: yearToMove,
                            academicSemester: academicSemester,
                            maxUnits: maxUnits,
                        },
                    ]);
                }

                curriculumMaxUnits =
                    dataStudentMaxUnitsSorted[yearToMove][academicSemester];
                curriculumAllocatedUnits =
                    dataStudentMaxUnitsSortedCurrent[yearToMove][
                        academicSemester
                    ];
                isAllocatable =
                    curriculumMaxUnits >=
                    curriculumAllocatedUnits + subjectUnit;

                if (isPriority && !isAllocatable) {
                    let dataCurriculum =
                        dataSubjectNonPrioritySorted[yearToMove][
                            academicSemester
                        ];
                    let collateralSubject = [];
                    // test if there is a subject here that is equal (or greater than) current subject to move
                    let testEqOrGtUnit = dataCurriculum.filter(
                        (el) =>
                            el.subjectUnit >= subjectUnit &&
                            el.status != "Passed"
                    );
                    testEqOrGtUnit.sort(
                        (a, b) => a.subjectUnit - b.subjectUnit
                    );

                    if (testEqOrGtUnit.length != 0 && !hasPriorityMatch) {
                        let eqSubject = testEqOrGtUnit[0];
                        if (!testMode) {
                            console.log(
                                "Removing ",
                                eqSubject.subjectCode,
                                "(Year ",
                                eqSubject.academicYear,
                                " Sem. ",
                                eqSubject.academicSemester,
                                ")"
                            );
                        }
                        // delete
                        dataSubjectNonPrioritySorted[yearToMove][
                            academicSemester
                        ] = dataSubjectNonPrioritySorted[yearToMove][
                            academicSemester
                        ].filter((el) => el != testEqOrGtUnit[0]);
                        collateralSubject.push(eqSubject);
                        dataStudentMaxUnitsSortedCurrent[yearToMove][
                            academicSemester
                        ] -= eqSubject.subjectUnit;
                        hasPriorityMatch = true;
                    }

                    if (!hasPriorityMatch) {
                        let totalUnit = 0;
                        let index = 0;
                        dataCurriculum =
                            dataSubjectNonPrioritySorted[yearToMove][
                                academicSemester
                            ];
                        for (let subject of dataCurriculum) {
                            if (!testMode) {
                                console.log(
                                    "Attempt for removal of ",
                                    subject.subjectCode,
                                    "(Year ",
                                    subject.academicYear,
                                    " Sem. ",
                                    subject.academicSemester,
                                    " Unit: ",
                                    subject.subjectUnit,
                                    ")"
                                );
                            }

                            collateralSubject.push(subject);
                            totalUnit += subject.subjectUnit;
                            if (totalUnit >= subjectUnit) break;
                            index++;
                        }

                        if (totalUnit >= subjectUnit) {
                            hasPriorityMatch = true;
                            // delete
                            dataCurriculum.splice(0, index + 1);
                            if (!testMode) {
                                console.log("Removal success!");
                            }
                            dataSubjectNonPrioritySorted[yearToMove][
                                academicSemester
                            ] = dataCurriculum;
                        } else {
                            if (!testMode) {
                                console.log("Removal discontinued!");
                            }
                            collateralSubject = [];
                        }
                    }

                    dataSubjectCollateral =
                        dataSubjectCollateral.concat(collateralSubject);
                }

                // debug msg only
                let msgIntro = "";
                if (isAllocatable || hasPriorityMatch) {
                    if (subjectsType == PROCESS_FAILED_SUBJECTS) {
                        msgIntro = "FAIL_SUBJECT";
                    }
                    if (subjectsType == PROCESS_FAILED_SUBJECTS_PREREQS) {
                        msgIntro = "FAIL_SUBJECT_PREREQ";
                    }
                    if (subjectsType == PROCESS_COLLATERAL_SUBJECTS) {
                        msgIntro = "COLLATERAL_SUBJECT";
                    }
                    if (!testMode) {
                        console.log(
                            msgIntro,
                            ": ",
                            item.subjectCode,
                            " inserted to year ",
                            yearToMove,
                            " semester ",
                            academicSemester,
                            " with unit of ",
                            subjectUnit,
                            " since current unit is ",
                            curriculumAllocatedUnits,
                            " and max unit is ",
                            curriculumMaxUnits
                        );
                    }
                }

                // continue proc
                if (isAllocatable || hasPriorityMatch) {
                    if (subjectsType == PROCESS_FAILED_SUBJECTS) {
                        dataStudentMaxUnitsSortedCurrent[yearToMove][
                            academicSemester
                        ] += subjectUnit;

                        let dataModified = deepCopy(item);
                        dataModified.academicYear = yearToMove;
                        dataModified.status = "Retake";
                        dataFailedSubsPost.push(dataModified);
                    }
                    if (subjectsType == PROCESS_FAILED_SUBJECTS_PREREQS) {
                        dataStudentMaxUnitsSortedCurrent[yearToMove][
                            academicSemester
                        ] += subjectUnit;

                        let dataModified = deepCopy(item);
                        dataModified.academicYear = yearToMove;
                        dataModified.status = "Adjusted";
                        dataFailedSubsPost.push(dataModified);
                    }
                    if (subjectsType == PROCESS_COLLATERAL_SUBJECTS) {
                        dataStudentMaxUnitsSortedCurrent[yearToMove][
                            academicSemester
                        ] += subjectUnit;

                        let dataModified = deepCopy(item);
                        dataModified.academicYear = yearToMove;
                        dataModified.status = "Priority Adjusted";
                        dataFailedSubsPost.push(dataModified);
                    }
                    break;
                }
            }
        }
    }

    processSubjects(PROCESS_FAILED_SUBJECTS, subjectsFailed);
    processSubjects(
        PROCESS_FAILED_SUBJECTS_PREREQS,
        dataFailedSubsLinkSubjectsPre
    );
    processSubjects(PROCESS_COLLATERAL_SUBJECTS, dataSubjectCollateral);

    // set for api
    for (let itemPost of dataFailedSubsPost) {
        dataQueueServerRequest.updateViaStudyPlan.push(itemPost);
    }

    if (!reportOnly) {
        await processAllRequest(dataQueueServerRequest);
    }

    if (!testMode) {
        console.log("Complete! Result below");
        console.log(dataFailedSubsPost);
    }
    return dataFailedSubsPost;
}

async function processAllRequest(arrPostBody) {
    for (const key in arrPostBody) {
        const item = arrPostBody[key];
        const request = key;
        let mainSwal = spawnSwalLoading();
        let index = 1;
        let itemLength = item.length;
        for (const postBody of item) {
            await createDataRequest(request, postBody, {
                text: "Processing subject " + index++ + " of " + itemLength,
                instance: mainSwal,
            });
        }
        mainSwal.close();
    }
}

function deepCopy(dataParam) {
    return JSON.parse(JSON.stringify(dataParam));
}

function flattenObject(dataParam) {
    let returnValue = {};
    dataParam.forEach((data) => {
        Object.keys(data).forEach((data2) => {
            returnValue[data2] = data[data2];
        });
    });
    return returnValue;
}

function cardDefaultClass() {
    cardRadios.forEach((item) => {
        item.classList.remove("border-primary", "bg-primary", "text-white");
        item.classList.add("text-muted");
    });
}

// common forms
async function commonFormSchoolCourseValidateAndLoad(form, event) {
    const domSelectSchool = form.elements["select-school"];
    const domSelectCourse = form.elements["select-course"];

    const domSelectSchoolIndex = domSelectSchool.selectedIndex;
    const selectSchoolValue =
        domSelectSchool.options[domSelectSchoolIndex].value;
    const selectSchoolTextContent =
        domSelectSchool.options[domSelectSchoolIndex].textContent;
    const schoolId = selectSchoolValue;

    domSelectCourse.disabled = true;
    domSelectCourse.innerHTML = "";
    const elementOption = document.createElement("option");
    elementOption.value = "-1";
    elementOption.selected = true;
    elementOption.disabled = true;
    domSelectCourse.add(elementOption);
    domSelectCourse.disabled = false;

    let courseArgs = {
        schoolId: schoolId,
    };

    let response = await createDataRequest(
        "readSchoolAvailableCourses",
        courseArgs,
        {
            text: "Fetching courses available...",
        }
    );
    let responseData = response.data;

    responseData.forEach((item) => {
        let id = item.id;
        let courseTitle = item.courseTitle;
        const elementOption2 = document.createElement("option");
        elementOption2.value = id;
        elementOption2.textContent = courseTitle;
        domSelectCourse.add(elementOption2);
    });
}

// download pdfs and excel
function setButtonClicksForExports(form = null, containerId = "") {
    let dataToExport = {
        studentId: "",
        schoolId: "",
        courseId: "",
    };
    let formButtonExcel = form.elements["button-export-excel"];
    let formButtonPdf = form.elements["button-export-pdf"];

    if (formButtonExcel != null) {
        formButtonExcel.addEventListener("click", async function () {
            if (form == formViewCurriculumViaSchool) {
                let selectSchool = form.elements["select-school"];
                let selectSchoolIndex = selectSchool.selectedIndex;
                let optionsSchool = selectSchool.options[selectSchoolIndex];
                let schoolName = optionsSchool.textContent;
                let schoolId = optionsSchool.value;

                let selectCourse = form.elements["select-course"];
                let selectCourseIndex = selectCourse.selectedIndex;
                let optionsCourse = selectCourse.options[selectCourseIndex];
                let courseTitle = optionsCourse.textContent;
                let courseId = optionsCourse.value;

                let data = await getDataForExportV2(
                    {
                        schoolId: schoolId,
                        courseId: courseId,
                    },
                    "xlsx",
                    form
                );
                if (data.returnMessage != null) {
                    Swal.fire("Failed", data.returnMessage, "error");
                    return;
                }
                await createSheet(data, containerId);
            }
            if (form == formViewCurriculumViaStudent || form == formStudyPlan) {
                let selectStudent = form.elements["studentId"];
                let selectStudentIndex = selectStudent.selectedIndex;
                let optionsStudent = selectStudent.options[selectStudentIndex];
                let studentName = optionsStudent.textContent;
                let studentId = optionsStudent.value;
                let data = await getDataForExportV2(
                    {
                        studentId: studentId,
                    },
                    "xlsx",
                    form
                );
                if (data == null) return;
                await createSheet(data, containerId);
            }
        });
    }

    if (formButtonPdf != null) {
        formButtonPdf.addEventListener("click", async function () {
            if (form == formViewCurriculumViaSchool) {
                let selectSchool = form.elements["select-school"];
                let selectSchoolIndex = selectSchool.selectedIndex;
                let optionsSchool = selectSchool.options[selectSchoolIndex];
                let schoolName = optionsSchool.textContent;
                let schoolId = optionsSchool.value;

                let selectCourse = form.elements["select-course"];
                let selectCourseIndex = selectCourse.selectedIndex;
                let optionsCourse = selectCourse.options[selectCourseIndex];
                let courseTitle = optionsCourse.textContent;
                let courseId = optionsCourse.value;

                let data = await getDataForExportV2(
                    {
                        schoolId: schoolId,
                        courseId: courseId,
                        school: schoolName,
                        course: courseTitle,
                    },
                    "pdf",
                    form
                );
                if (data.returnMessage != null) {
                    Swal.fire("Failed", data.returnMessage, "error");
                    return;
                }
                await createPdf(data, containerId);
                return;
            }
            let selectStudent = form.elements["studentId"];
            let selectStudentIndex = selectStudent.selectedIndex;
            let optionsStudent = selectStudent.options[selectStudentIndex];
            let studentName = optionsStudent.textContent;
            let studentId = optionsStudent.value;
            let data = await getDataForExportV2(
                {
                    studentId: studentId,
                },
                "pdf",
                form
            );
            if (data == null) return;
            await createPdf(data, containerId);
        });
    }
}

function enableExports(form, enableExport = true) {
    form.elements["button-export-excel"].disabled = !enableExport;
    form.elements["button-export-pdf"].disabled = !enableExport;
}
setButtonClicksForExports(
    formViewCurriculumViaStudent,
    tableContainerStudent.id
);
setButtonClicksForExports(formViewCurriculumViaSchool, tableContainerSchool.id);
setButtonClicksForExports(formStudyPlan, "sp-table-container");

async function getDataForExport(studentId, extension, form) {
    let returnValue = null;
    let data = {
        studentId: studentId,
        studentName: "",
        school: "",
        course: "",
        educationYear: "",
        filename: "",
        subjects: {},
        maxUnits: {},
    };
    let mainSwal = spawnSwalLoading();
    try {
        let responseStudentInfo = await createDataRequest(
            "readStudent",
            {
                studentId: studentId,
            },
            {
                instance: mainSwal,
                text: "Getting student information...",
            }
        );
        if (!responseStudentInfo.success) {
            throw new Error("Failed to get Student information");
        }
        let responseStudentSubjects = await createDataRequest(
            "readStudentSubjectsWithId",
            {
                studentId: studentId,
            },
            {
                instance: mainSwal,
                text: "Fetching linked subjects...",
            }
        );
        if (!responseStudentSubjects.success) {
            throw new Error("Failed to get subjects");
        }
        let responsePreRequisites = await createDataRequest(
            "readSubjectPrerequisitesByStudentMulti",
            {
                studentId: studentId,
            },
            {
                instance: mainSwal,
                text: "Fetching subjects pre-requisites...",
            }
        );
        if (!responsePreRequisites.success) {
            throw new Error("Failed to get pre-requisites");
        }
        let responseUnitsAlloc = await createDataRequest(
            "readMaxLoadAllViaStudent",
            {
                studentId: studentId,
            },
            {
                instance: mainSwal,
                text: "Fetching assigned units allocation...",
            }
        );
        if (!responseUnitsAlloc.success) {
            throw new Error("Failed to get student units allocation");
        }

        let convertedDataSubject = sortToAssocByYearAndSemester(
            responseStudentSubjects
        );
        let convertedDataPreReqs = sortToAssocByPrerequisite(
            responsePreRequisites.data
        );
        let convertedDataUnits =
            sortToAssocByYearAndSemester(responseUnitsAlloc);

        for (let keyYear in convertedDataSubject) {
            for (let keySem in convertedDataSubject[keyYear]) {
                // important gawing non assoc array since datatables only reads 2d array
                let arrDataRaw = convertedDataSubject[keyYear][keySem];
                let arrData = alignDataSetArray(
                    arrDataRaw,
                    convertedDataPreReqs
                );
                convertedDataSubject[keyYear][keySem] = arrData;
            }
        }
        let studentInfo = responseStudentInfo.data[0];
        let studentName =
            studentInfo.firstName +
            " " +
            studentInfo.middleName +
            " " +
            studentInfo.lastName;
        let filename = studentName.replaceAll(" ", "_");

        if (form == formStudyPlan) {
            data.filename = `${filename}_study_planner.${extension}`;
        }
        if (form == formViewCurriculumViaStudent) {
            data.filename = `${filename}_study_plan.${extension}`;
        }

        data.studentName = studentName;
        data.school = studentInfo.schoolName;
        data.course = studentInfo.courseTitle;
        data.educationYear = studentInfo.yearName;
        data.subjects = convertedDataSubject;
        data.maxUnits = convertedDataUnits;

        mainSwal.close();
        returnValue = data;
    } catch (error) {
        mainSwal.close();
        Swal.fire("Failed", error.message, "error");
        return returnValue;
    }
    returnValue = data;
    return returnValue;
}

async function getDataForExportV2(dataParam, extension) {
    const REQUEST_STUDENT = 0;
    const REQUEST_SCHOOL_COURSE = 1;
    let returnValue = null;
    let requestType = null;
    let dataForServerRequest = null;
    let responseStudentInfo = null;
    let responseSchoolInfo = null;
    let responseCourseInfo = null;
    let responseSubjects = null;
    let responsePrerequisites = null;
    let responseMaxLoad = null;
    let filename = null;

    if (dataParam == null) {
        return {
            returnMessage: "No parameters provided.",
        };
    }

    let dataParamStudentId = dataParam.studentId;
    let dataParamsSchoolId = dataParam.schoolId;
    let dataParamCourseId = dataParam.courseId;

    // decide what data being requested
    // school course or student
    if (dataParamStudentId != null) {
        requestType = REQUEST_STUDENT;
    }
    if (dataParamsSchoolId != null && dataParamCourseId != null) {
        requestType = REQUEST_SCHOOL_COURSE;
    }

    if (requestType == null) {
        return {
            returnMessage: "Parameters provided incorrect.",
        };
    }

    let mainSwal = spawnSwalLoading();
    let apiParam = {
        schoolId: dataParam.schoolId,
        courseId: dataParam.courseId,
    };

    if (requestType == REQUEST_STUDENT) {
        responseStudentInfo = await createDataRequest(
            "readStudent",
            {
                studentId: dataParamStudentId,
            },
            {
                instance: mainSwal,
                text: "Getting student information...",
            }
        );
        if (!responseStudentInfo.success) {
            throw new Error("Failed to get Student information");
        }
        responseSubjects = await createDataRequest(
            "readStudentSubjectsWithId",
            {
                studentId: dataParamStudentId,
            },
            {
                instance: mainSwal,
                text: "Fetching linked subjects...",
            }
        );
        if (!responseSubjects.success) {
            throw new Error("Failed to get subjects");
        }
        responsePrerequisites = await createDataRequest(
            "readSubjectPrerequisitesByStudentMulti",
            {
                studentId: dataParamStudentId,
            },
            {
                instance: mainSwal,
                text: "Fetching subjects pre-requisites...",
            }
        );
        if (!responsePrerequisites.success) {
            throw new Error("Failed to get pre-requisites");
        }
        responseMaxLoad = await createDataRequest(
            "readMaxLoadAllViaStudent",
            {
                studentId: dataParamStudentId,
            },
            {
                instance: mainSwal,
                text: "Fetching assigned units allocation...",
            }
        );
        if (!responseMaxLoad.success) {
            throw new Error("Failed to get student units allocation");
        }

        let studentInfo = responseStudentInfo.data[0];
        let studentName =
            studentInfo.middleName != null
                ? `${studentInfo.firstName} ${studentInfo.middleName} ${studentInfo.lastName}`
                : `${studentInfo.firstName} ${studentInfo.lastName}`;

        filename = studentName.replaceAll(" ", "_");
        filename = `${filename}_study_plan.${extension}`;

        dataForServerRequest = {
            studentId: dataParamStudentId,
            studentName: studentName,
            school: studentInfo.schoolName,
            course: studentInfo.courseTitle,
            educationYear: studentInfo.yearName,
            filename: filename,
            subjects: {},
            maxUnits: {},
        };
    }
    if (requestType == REQUEST_SCHOOL_COURSE) {
        responseSchoolInfo = await createDataRequest(
            "readSchoolById",
            {
                id: dataParamsSchoolId,
            },
            {
                instance: mainSwal,
                text: "Reading school info...",
            }
        );

        responseCourseInfo = await createDataRequest(
            "readCourseById",
            {
                id: dataParamCourseId,
            },
            {
                instance: mainSwal,
                text: "Reading course info...",
            }
        );

        responseSubjects = await createDataRequest(
            "readCurriculumsViaSchoolCourse",
            apiParam,
            {
                instance: mainSwal,
                text: "Fetching subjects available...",
            }
        );

        responsePrerequisites = await createDataRequest(
            "readSubjectPrerequisitesBySchoolCourseMulti",
            apiParam,
            {
                instance: mainSwal,
                text: "Fetching subjects prerequisites...",
            }
        );

        responseMaxLoad = await createDataRequest(
            "readMaxLoadViaSchoolCourse",
            apiParam,
            {
                instance: mainSwal,
                text: "Fetching subjects max loads...",
            }
        );

        let schoolName = responseSchoolInfo.data[0].schoolName;
        let courseTitle = responseCourseInfo.data[0].courseTitle;

        filename = courseTitle.replaceAll(" ", "_");
        filename = `${filename}_study_plan.${extension}`;

        dataForServerRequest = {
            schoolId: dataParamsSchoolId,
            courseId: dataParamCourseId,
            school: schoolName,
            course: courseTitle,
            filename: filename,
            subjects: {},
            maxUnits: {},
        };
    }

    // importants subjects and maxload
    let convertedDataSubject = sortToAssocByYearAndSemesterV2(
        responseSubjects.data
    );
    let convertedDataPreReqs = sortToAssocByPrerequisite(
        responsePrerequisites.data
    );
    let convertedDataUnits = sortToAssocByYearAndSemesterV2(
        responseMaxLoad.data
    );

    for (let keyYear in convertedDataSubject) {
        for (let keySem in convertedDataSubject[keyYear]) {
            // important gawing non assoc array since datatables only reads 2d array
            let arrDataRaw = convertedDataSubject[keyYear][keySem];
            let arrData = alignDataSetArray(arrDataRaw, convertedDataPreReqs);
            convertedDataSubject[keyYear][keySem] = arrData;
        }
    }

    dataForServerRequest.subjects = convertedDataSubject;
    dataForServerRequest.maxUnits = convertedDataUnits;

    mainSwal.close();
    returnValue = dataForServerRequest;
    return returnValue;
}

function spawnSwalLoading(text = "Loading...") {
    return Swal.fire({
        text: text,
        showConfirmButton: false,
        allowOutsideClick: false,
        didRender: () => {
            Swal.showLoading();
        },
    });
}
