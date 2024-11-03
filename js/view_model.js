function sanitizeInput(stringData) {
    let returnValue = stringData;
    returnValue = returnValue.trim();
    returnValue = returnValue.length == 0 ? null : returnValue;
    return returnValue;
}

function extractTextValueFromSelect(form, elementName) {
    let element = form.elements[elementName];
    index = element.selectedIndex;
    text = element.options[index].text;
    text = sanitizeInput(text);
    value = element.options[index].value;
    element = {
        text: text,
        value: value,
    };

    return element;
}

function viewModelFormCurriculum() {
    let returnValue = null;
    let schoolName = null;
    let courseTitle = null;
    let data = {};

    schoolName = formUploadCurriculum.elements["school"].value;
    courseTitle = formUploadCurriculum.elements["course"].value;

    schoolName = sanitizeInput(schoolName);
    courseTitle = sanitizeInput(courseTitle);

    data = {
        schoolName: schoolName,
        courseTitle: courseTitle,
    }

    returnValue = data;
    return returnValue;
}

function viewModelFormCreateStudent() {
    let returnValue = null;
    let firstName = null;
    let middleName = null;
    let lastName = null;
    let educationYear = null;
    let schoolName = null;
    let courseTitle = null;
    let data = {};

    firstName = formCreateStudent.elements["firstName"].value;
    middleName = formCreateStudent.elements["middleName"].value;
    lastName = formCreateStudent.elements["lastName"].value;

    educationYear = extractTextValueFromSelect(formCreateStudent, "educationYear");
    schoolName = extractTextValueFromSelect(formCreateStudent, "select-school");
    courseTitle = extractTextValueFromSelect(formCreateStudent, "select-course");

    firstName = sanitizeInput(firstName);
    middleName = sanitizeInput(middleName);
    lastName = sanitizeInput(lastName);

    data = {
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        educationYear: educationYear,
        schoolName: schoolName,
        courseTitle: courseTitle,
    }

    returnValue = data;
    return returnValue;
}

function viewModelFormStudyPlan() {
    let returnValue = null;
    let studentData = null;

    studentData = extractTextValueFromSelect(formStudyPlan, "studentId");

    data = {
        studentData: studentData,
    }

    returnValue = data;
    return returnValue;
}

function viewModelFormViewCurriculumViaStudents() {
    let returnValue = null;
    let studentData = null;

    studentData = extractTextValueFromSelect(formViewCurriculumViaStudent, "studentId");

    data = {
        studentData: studentData,
    }
    
    returnValue = data;
    return returnValue;
}

function viewModelFormViewCurriculumViaSchool() {
    let returnValue = null;
    let schoolName = null;
    let courseTitle = null;

    schoolName = extractTextValueFromSelect(formViewCurriculumViaSchool, "select-school");
    courseTitle = extractTextValueFromSelect(formViewCurriculumViaSchool, "select-course");

    data = {
        schoolName: schoolName,
        courseTitle: courseTitle,
    }

    returnValue = data;
    return returnValue;
}