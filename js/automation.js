async function automateChooseViewCurriculumBySchool(
    schoolId = null,
    courseId = null,
    courseTitle = null
) {
    checkDomDisplay(PAGE_VIEW_CURRICULUM);
    document.querySelector("#card-option-school_course").click();
    let domSelectSchool = formViewCurriculumViaSchool.elements["select-school"];
    let domSelectCourse = formViewCurriculumViaSchool.elements["select-course"];

    domSelectCourse.disabled = true;

    let selectSchoolOptions = domSelectSchool.options;
    let selectCourseOptions = domSelectCourse.options;

    // change tab no redirect
    for (let i = 0; i < links.length; i++) {
        let getLink = links[i];
        let linkHref = getLink.getAttribute("href");
        if (linkHref == `#${PAGE_VIEW_CURRICULUM}`) {
            getLink.click();
        }
    }

    // choose school option
    for (let i = 0; i < selectSchoolOptions.length; i++) {
        let getOption = selectSchoolOptions[i];
        let value = parseInt(getOption.value);
        if (value == schoolId) {
            selectSchoolOptions.selectedIndex = i;
            break;
        }
    }

    // choose course option
    let tempOption = document.createElement("option");
    tempOption.value = courseId;
    tempOption.textContent = courseTitle;
    tempOption.selected = true;
    selectCourseOptions.add(tempOption);

    domSelectSchool.value = schoolId;
    domSelectCourse.value = courseId;

    formViewCurriculumViaSchool.elements["button-submit"].click();
}
async function automateChooseViewCurriculumByStudent(id = null) {
    checkDomDisplay(PAGE_VIEW_CURRICULUM);
    document.querySelector("#card-option-student").click();

    let studentSelect = formViewCurriculumViaStudent.elements["studentId"];
    let options = studentSelect.options;

    // change tab no redirect
    for (let i = 0; i < links.length; i++) {
        let getLink = links[i];
        let linkHref = getLink.getAttribute("href");
        if (linkHref == `#${PAGE_VIEW_CURRICULUM}`) {
            getLink.click();
        }
    }

    // choose option
    for (let i = 0; i < options.length; i++) {
        let getOption = options[i];
        let value = parseInt(getOption.value);
        if (value == id) {
            options.selectedIndex = i;
            break;
        }
    }

    studentSelect.value = id;
    await studentSelect.dispatchEvent(new Event("change"));
    await formViewCurriculumViaStudent.elements["button-submit"].click();
}

async function automateStudyPlanEvent(id = null) {
    checkDomDisplay("study_plan");
    let studentSelect = formStudyPlan.elements["studentId"];
    let options = studentSelect.options;

    // change tab no redirect
    for (let i = 0; i < links.length; i++) {
        let getLink = links[i];
        let linkHref = getLink.getAttribute("href");
        if (linkHref == `#${PAGE_CREATE_STUDY_PLAN}`) {
            getLink.click();
        }
    }

    // choose option
    for (let i = 0; i < options.length; i++) {
        let getOption = options[i];
        let value = parseInt(getOption.value);
        if (value == id) {
            options.selectedIndex = i;
            break;
        }
    }

    studentSelect.value = id;
    studentSelect.dispatchEvent(new Event("change"));
    formStudyPlan.elements["button-submit"].click();
}