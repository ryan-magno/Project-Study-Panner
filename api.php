<?php
include("./sql_proc.php");
include("./constants.php");
// simple api, all methods are post only
$action = isset($_POST['action']) ? $_POST['action'] : '';
$response = array();

// default response to error if not processed
$response["success"] = false;
$response["message"] = "Error with request! Check your parameters!";
$response["data"] = array();
$response["requestCode"] = null;

$value = isset($_POST["value"]) ? $_POST["value"] : "";
$jsonPostData = isset($_POST["jsonData"]) ? $_POST["jsonData"] : "";
$tableName = null;
$arrayBuild = array();
$rowName = null;

if (!isset($jsonPostData)) {
    echo json_encode($response);
    return;
};

$jsonDecoded = json_decode($jsonPostData, true);
switch ($action) {
    case "insertSubjectInformation":
        $tableName = "SubjectInformation";
        $collegeId = $jsonDecoded["collegeId"];
        $courseId = $jsonDecoded["courseId"];
        $subjects = $jsonDecoded["subjects"];
        $isLoopBroken = false;
        for ($i = 0; $i < count($subjects); $i++) {
            $item = $subjects[$i];
            // build data
            $academicYear = $item["academicYear"];
            $academicSemester = $item["academicSemester"];
            $subjectNumber = $item["subjectNumber"];
            $subjectCode = $item["subjectCode"];
            $subjectDescription = $item["subjectDescription"];
            $subjectUnit = $item["subjectUnit"];
            $status = $item["status"];
            $sortOrder = $item["sortIndex"]; // yes, this is correct!
            $priority = $item["priority"];

            // sanitize
            $subjectNumber = trim($subjectNumber . "");
            $subjectCode = trim($subjectCode . "");
            $subjectDescription = trim($subjectDescription . "");
            $subjectUnit = trim($subjectUnit . "");

            $subjectUnit = (int) $subjectUnit;

            $subjectNumber = strlen($subjectNumber) != 0 ? $subjectNumber : null;
            $subjectCode = strlen($subjectCode) != 0 ? $subjectCode : null;
            $subjectDescription = strlen($subjectDescription) != 0 ? $subjectDescription : null;
            $subjectUnit = strlen($subjectUnit) != 0 ? $subjectUnit : null;

            // DB table: SubjectInformation
            // try to find data if exist
            $tableData = array(
                "subjectNumber" => $subjectNumber,
                "subjectCode" => $subjectCode,
                "subjectDescription" => $subjectDescription,
                "subjectUnit" => $subjectUnit,
            );
            if ($subjectNumber == 800037) {
                $aiwoe = 0;
            }
            $subjectPrerequisiteId = fetchDataFromTableSpecific("SubjectInformation", null, $tableData);

            // insert data ONLY if there is no data
            // else autoincrement will iterate unexpectedly
            if (!isSqlValid($subjectPrerequisiteId)) {
                $tableData["sortOrder"] = $sortOrder;
                $tableData["priority"] = $priority;
                $subjectPrerequisiteId = insertToTable($tableName, $tableData);
            } else if (count($subjectPrerequisiteId) != 0) {
                $subjectPrerequisiteId = $subjectPrerequisiteId[0][0];
            } else {
                $isLoopBroken = true;
                break;
            }

            // DB table: SubjectRelations
            // build subject-college-course relation to data
            $tableData = array(
                "academicYear" => $academicYear,
                "academicSemester" => $academicSemester,
                "subjectId" => $subjectPrerequisiteId,
                "schoolId" => $collegeId,
                "courseId" => $courseId,
            );
            $result = fetchDataFromTableSpecific("SubjectRelations", null, $tableData);

            if (!isSqlValid($result)) {
                $result = insertToTable("SubjectRelations", $tableData);
                if (!isSqlValid($result)) {
                    $isLoopBroken = true;
                    break;
                }
            }
        }
        if (!$isLoopBroken) setResponse(true, "Subject inserted successfully!", array(), 0);
        break;
    case "readStudentSubjectsWithId":
        $studentId = $jsonDecoded["studentId"];
        $query = "SELECT StudentSubjects.id, academicYear, academicSemester, subjectNumber, subjectCode, subjectDescription, subjectUnit, status, StudentSubjects.sortOrder, StudentSubjects.priority, SubjectInformation.id AS mSubjectId FROM StudentSubjects INNER JOIN SubjectInformation ON StudentSubjects.subjectId = SubjectInformation.id WHERE studentId = $studentId ORDER BY academicYear, academicSemester, SubjectInformation.sortOrder;";
        $result = executeSelectInstant($query);
        if (!isSqlValid($result, "StudentSubjects")) break;
        setResponse(true, "Fetched student data success!", $result);
        break;
    case "readStudent":
        $studentId = $jsonDecoded["studentId"];

        $getRaw = isset($jsonDecoded["getRaw"]) ? $jsonDecoded["getRaw"] : false;
        $query = null;
        if ($getRaw) {
            $query = "SELECT Students.id AS id, firstName, middleName, lastName, schoolName, courseTitle, educationYear FROM Students INNER JOIN Schools ON Students.schoolId = Schools.id INNER JOIN Courses ON Students.courseId = Courses.id WHERE Students.id = $studentId;";
        } else {
            $query = "SELECT Students.id AS id, firstName, middleName, lastName, schoolName, courseTitle, $DB_CASE_YEAR_NAME FROM Students INNER JOIN Schools ON Students.schoolId = Schools.id INNER JOIN Courses ON Students.courseId = Courses.id WHERE Students.id = $studentId;";
        }
        $result = executeSelectInstant($query);
        if (!isSqlValid($result)) break;
        setResponse(true, "Fetched student data success!", $result);
        break;
    case "readStudentViaSchool":
        $schoolId = $jsonDecoded["schoolId"];
        $query = "SELECT Students.id AS id, firstName, middleName, lastName, schoolName, courseTitle, $DB_CASE_YEAR_NAME FROM Students INNER JOIN Schools ON Students.schoolId = Schools.id INNER JOIN Courses ON Students.courseId = Courses.id WHERE Students.schoolId = $schoolId;";
        $result = executeSelectInstant($query, PDO::FETCH_NUM);
        if (!isSqlValid($result)) break;
        setResponse(true, "Fetched student via school data success!", $result);
        break;
    case "readStudentAll":
        $fetchMethod = $jsonDecoded["fetchMethod"];
        $fetchMethodToPdo = setFetchMethod($fetchMethod);
        $query = "SELECT Students.id AS id, firstName, middleName, lastName, schoolName, courseTitle, $DB_CASE_YEAR_NAME FROM Students INNER JOIN Schools ON Students.schoolId = Schools.id INNER JOIN Courses ON Students.courseId = Courses.id ORDER BY firstName;";
        $result = executeSelectInstant($query, $fetchMethodToPdo);
        setResponse(true, "Fetched student data success!", $result);
        break;
    case "readSubjectAsPrerequisiteOf":
        $failedSubjectCode = $jsonDecoded["failedSubjectCode"];

        $strbuild = "";
        // build string
        for ($i = 0; $i < count($failedSubjectCode); $i++) {
            $strbuild .= '"' . $failedSubjectCode[$i] . '"';
            if ($i != count($failedSubjectCode) - 1) $strbuild .= ", ";
        }
        $query = "SELECT si2.subjectCode AS failedSubjectCode, si1.subjectCode AS preReqSubjectCode FROM SubjectMetaPreReqs INNER JOIN SubjectInformation AS si1 ON SubjectMetaPreReqs.subjectId = si1.id INNER JOIN SubjectInformation AS si2 ON
        SubjectMetaPreReqs.subjectPreRequisiteId = si2.id WHERE si2.subjectCode IN ($strbuild);";
        $result = executeSelectInstant($query);
        setResponse(true, "Fetched student data success!", $result);
        break;
    case "readSubjectPrerequisitesByStudentMulti":
        $studentId = $jsonDecoded["studentId"];
        $query = "SELECT SubjectMetaPreReqs.id, subjectId, subjectPreRequisiteId, S1.subjectCode AS mainSubjectCode, S2.subjectCode AS prereqSubjectCode FROM SubjectMetaPreReqs INNER JOIN SubjectInformation S1 ON SubjectMetaPreReqs.subjectId = S1.id INNER JOIN SubjectInformation S2 ON SubjectMetaPreReqs.subjectPreRequisiteId = S2.id WHERE subjectId IN (SELECT subjectId FROM StudentSubjects WHERE studentId = $studentId);";
        $result = executeSelectInstant($query);
        if (!isSqlValid($result, "SubjectMetaPreReqs", true)) break;
        setResponse(true, "Fetched multiple pre-requisites by student successfully!", $result);
        break;
    case "readSubjectPrerequisitesBySchoolCourseMulti":
        $schoolId = $jsonDecoded["schoolId"];
        $courseId = $jsonDecoded["courseId"];
        $query = "SELECT SubjectMetaPreReqs.id, subjectId, subjectPreRequisiteId, S1.subjectCode AS mainSubjectCode, S2.subjectCode AS prereqSubjectCode FROM SubjectMetaPreReqs INNER JOIN SubjectInformation S1 ON SubjectMetaPreReqs.subjectId = S1.id INNER JOIN SubjectInformation S2 ON SubjectMetaPreReqs.subjectPreRequisiteId = S2.id WHERE subjectId IN (SELECT subjectId FROM SubjectRelations WHERE schoolId = $schoolId AND courseId = $courseId);";
        $result = executeSelectInstant($query);
        if (!isSqlValid($result)) break;
        setResponse(true, "Fetched multiple pre-requisites by student successfully!", $result);
        break;
    case "updateGrade":
        $studentSubjectId = $jsonDecoded["studentSubjectId"];
        $grade = $jsonDecoded["grade"];
        $status = $jsonDecoded["status"];

        $query = "UPDATE StudentSubjects SET grade = \"$grade\", status=\"$status\" WHERE id = $studentSubjectId ;";
        executeRaw($query);
        setResponse(true, "Updated user on studentSubject $studentSubjectId successfully!", array());
        break;
    case "updateViaStudyPlan":
        $studentSubjectId = $jsonDecoded["dataId"];
        $academicYear = $jsonDecoded["academicYear"];
        $grade = $jsonDecoded["subjectGrade"];
        $status = $jsonDecoded["status"];

        $query = "UPDATE StudentSubjects SET academicYear = \"$academicYear\", grade = \"$grade\", status=\"$status\" WHERE id = $studentSubjectId ;";
        executeRaw($query);
        setResponse(true, "Updated user on studentSubject $studentSubjectId successfully!", array());
        break;
    case "addMaxLoad":
        foreach ($jsonDecoded as $item) {
            $studentId = $item['studentId'];
            $academicYear = $item['academicYear'];
            $academicSemester = $item['academicSemester'];
            $maxUnits = $item['maxUnits'];
            $query = "INSERT INTO StudentUnitsAllocation (`studentId`, `academicYear`, `academicSemester`, `maxUnits`) VALUES ('$studentId', '$academicYear', '$academicSemester', '$maxUnits');";
            executeRaw($query);
        }
        setResponse(true, "Insertion to student max load success!", array());
        break;
    case "addMaxLoadToSchoolCourse":
        foreach ($jsonDecoded as $item) {
            $schoolId = $item['schoolId'];
            $courseId = $item['courseId'];
            $academicYear = $item['academicYear'];
            $academicSemester = $item['academicSemester'];
            $maxUnits = $item['maxUnits'];
            $query = "INSERT INTO SchoolCourseUnitAllocation (`schoolId`, `courseId`, `academicYear`, `academicSemester`, `maxUnits`) VALUES ('$schoolId', '$courseId', '$academicYear', '$academicSemester', '$maxUnits');";
            executeRaw($query);
        }
        setResponse(true, "Insertion to max load success!", array());
        break;
    case "readMaxLoad":
        $studentId = $jsonDecoded['studentId'];
        $academicYear = $jsonDecoded['academicYear'];
        $academicSemester = $jsonDecoded['academicSemester'];

        $query = "SELECT id, studentId, academicYear, academicSemester, maxUnits FROM StudentUnitsAllocation WHERE studentId = '$studentId' AND academicYear = '$academicYear' AND academicSemester = '$academicSemester';";
        $result = executeSelectInstant($query, setFetchMethod(CODE_PDO_FETCH_ASSOC));
        setResponse(true, "Read to max load success!", $result);
        break;
    case "readMaxLoadAllViaStudent":
        $studentId = $jsonDecoded['studentId'];

        $query = "SELECT id, studentId, academicYear, academicSemester, maxUnits FROM StudentUnitsAllocation WHERE studentId = '$studentId';";
        $result = executeSelectInstant($query, setFetchMethod(CODE_PDO_FETCH_ASSOC));
        setResponse(true, "Read to max load success!", $result);
        break;
    case "readSchools":
        $query = "SELECT id, schoolName FROM Schools";
        $result = executeSelectInstant($query, setFetchMethod(CODE_PDO_FETCH_ASSOC));
        setResponse(true, "Read schools success!", $result);
        break;
    case "insertToStudents":
        $result = insertToTable("Students", $jsonDecoded);
        if (!isSqlValid($result, "Student")) break;
        setResponse(true, "Added student successfully!", $result);
        break;
    case "addSchool":
        $schoolName = $jsonDecoded["schoolName"];
        $sqlArgs = array(
            "schoolName" => $schoolName
        );
        $result = insertToTable("Schools", $sqlArgs);
        if (!isSqlValid($result, "School")) break;
        setResponse(true, "Added school successfully!", $result);
        break;
    case "addCourse":
        $courseTitle = $jsonDecoded["courseTitle"];
        $sqlArgs = array(
            "courseTitle" => $courseTitle
        );
        $result = insertToTable("Courses", $sqlArgs);
        if (!isSqlValid($result, "Courses")) break;
        setResponse(true, "Added course successfully!", $result);
        break;
    case "readSchoolBySchoolName":
        $schoolName = $jsonDecoded["schoolName"];
        $sqlArgs = array(
            "schoolName" => $schoolName
        );
        $result = fetchDataFromTableSpecific("Schools", array("id", "schoolName"), $sqlArgs);
        if (!isSqlValid($result, "School")) break;
        setResponse(true, "Read school successfully!", $result);
        break;
    case "readSchoolById":
        $id = $jsonDecoded["id"];
        $sqlArgs = array(
            "id" => $id
        );
        $result = fetchDataFromTableSpecific("Schools", array("id", "schoolName"), $sqlArgs);
        if (!isSqlValid($result, "School")) break;
        setResponse(true, "Read school successfully!", $result);
        break;
    case "readCourseByCourseTitle":
        $courseTitle = $jsonDecoded["courseTitle"];
        $sqlArgs = array(
            "courseTitle" => $courseTitle
        );
        $result = fetchDataFromTableSpecific("Courses", array("id", "courseTitle"), $sqlArgs);
        if (!isSqlValid($result, "Courses")) break;
        setResponse(true, "Read course successfully!", $result);
        break;
    case "readCourseById":
        $id = $jsonDecoded["id"];
        $sqlArgs = array(
            "id" => $id
        );
        $result = fetchDataFromTableSpecific("Courses", array("id", "courseTitle"), $sqlArgs);
        if (!isSqlValid($result, "Courses")) break;
        setResponse(true, "Read course successfully!", $result);
        break;
    case "readStudentIfExist":
        $result = fetchDataFromTableSpecific("Students", null, $jsonDecoded);
        if (!isSqlValid($result)) {
            break;
        }
        setResponse(true, "Student exists!", $result);
        break;
    case "readSubjectRelationIfExist":
        $result = fetchDataFromTableSpecific("SubjectRelations", null, $jsonDecoded);
        if (!isSqlValid($result)) {
            setResponse(false, "Selected data has empty subjects!", $result);
            break;
        }
        setResponse(true, "Subject Relation Exists!", $result);
        break;
    case "assignSubjectsDataToStudent":
        $studentId = $jsonDecoded["studentId"];
        $schoolId = $jsonDecoded["schoolId"];
        $courseId = $jsonDecoded["courseId"];

        $subjectRelationArgs = array(
            "schoolId" => $schoolId,
            "courseId" => $courseId
        );

        $query = "SELECT SR.id, SR.academicYear, SR.academicSemester, SR.subjectId, SR.schoolId, SR.courseId, SI.sortOrder, SI.priority FROM SubjectRelations AS SR INNER JOIN SubjectInformation AS SI
        ON SI.id = SR.subjectId WHERE SR.schoolId = $schoolId AND courseId = $courseId;";
        $resultFetchSubjectRelation = executeSelectInstant($query);
        if (count($resultFetchSubjectRelation) == 0) {
            setResponse(false, "Failure due to selected data has no subjects binded!", array(), -1);
            break;
        }
        $hasFailedInsideLoop = false;
        $i = 0;
        foreach ($resultFetchSubjectRelation as $key => $value) {
            $subjectPrerequisiteId = $value["subjectId"];
            $academicYear = $value["academicYear"];
            $academicSemester = $value["academicSemester"];
            $status = isset($value["status"]) ? $value["status"] : "Pending";
            $grade = isset($value["grade"]) ? $value["grade"] : "0.00";
            $sortOrder = $value["sortOrder"];
            $priority = $value["priority"];

            $studentSubjectArgs = array(
                "studentId" => $studentId,
                "subjectId" => $subjectPrerequisiteId,
                "academicYear" => $academicYear,
                "academicSemester" => $academicSemester,
                "status" => $status,
                "grade" => $grade,
                "sortOrder" => $sortOrder,
                "priority" => $priority,
            );
            $resultInsertStudentSubject = insertToTable("StudentSubjects", $studentSubjectArgs);
            if (!isSqlValid($resultInsertStudentSubject, "Data " . $subjectPrerequisiteId)) {
                $hasFailedInsideLoop = true;
                break;
            }
        }

        if ($hasFailedInsideLoop) break;

        // unit allocation
        $resultSchoolCourseAlloc = fetchDataFromTableSpecific("SchoolCourseUnitAllocation", null, $subjectRelationArgs);
        $hasFailedInsideLoop = false;
        foreach ($resultSchoolCourseAlloc as $key => $value) {
            $academicYear = $value["academicYear"];
            $academicSemester = $value["academicSemester"];
            $maxUnits = $value["maxUnits"];

            $studentAllocationArgs = array(
                "studentId" => $studentId,
                "academicYear" => $academicYear,
                "academicSemester" => $academicSemester,
                "maxUnits" => $maxUnits
            );
            $resultInsertStudentUnitsAlloc = insertToTable("StudentUnitsAllocation", $studentAllocationArgs);
            if (!isSqlValid($resultInsertStudentUnitsAlloc, "StudentUnitsAllocation")) {
                $hasFailedInsideLoop = true;
                break;
            }
        }
        if ($hasFailedInsideLoop) break;
        setResponse(true, "Assign subjects to student success", array());
        break;
    case "assignUnitAllocationToStudent": // was implemented in assignSubjectsDataToStudent
        break;
    case "readCurriculumsViaSchoolCourse":
        $schoolId = $jsonDecoded["schoolId"];
        $courseId = $jsonDecoded["courseId"];
        $query = "SELECT SubjectRelations.id, academicYear, academicSemester, subjectNumber, subjectCode, subjectDescription, subjectUnit, sortOrder, priority, SubjectInformation.id AS mSubjectId FROM SubjectRelations INNER JOIN SubjectInformation ON SubjectRelations.subjectId = SubjectInformation.id WHERE schoolId = $schoolId AND courseId = $courseId ORDER BY academicYear, academicSemester, SubjectInformation.sortOrder;";
        $result = executeSelectInstant($query);
        if (isSqlValid($result, "SubjectRelations")) {
            setResponse(true, "Read Curriculums via school and course successfully!", $result);
        }
        break;
    case "insertSubjectMetaPreReqs":
        $isLoopBroken = false;
        $subjectData = $jsonDecoded["prerequisites"];
        foreach ($subjectData as $key => $value) {
            $srcSubjectCode = $key;
            foreach ($value as $prereqSubjectCode) {
                $subjectPrerequisiteId = fetchDataFromTableSpecific("SubjectInformation", array("id"), array("subjectCode" => $prereqSubjectCode));
                $subjectId = fetchDataFromTableSpecific("SubjectInformation", array("id"), array("subjectCode" => $srcSubjectCode));
                $sqlArgs = array(
                    "subjectPreRequisiteId" => $subjectPrerequisiteId[0]["id"],
                    "subjectId" => $subjectId[0]["id"],
                );
                $resultSubjectMetaPreReqs = insertToTable("SubjectMetaPreReqs", $sqlArgs);
                // if (!isSqlValid($resultSubjectMetaPreReqs)) setResponse(false, "Failed to insert subjects!", array());
            }
        }
        setResponse(true, "Created and linked subjects successfully!", array());
        break;
    case "readSchoolAvailableCourses":
        $schoolId = $jsonDecoded["schoolId"];
        $query = "SELECT DISTINCT SubjectRelations.courseId AS id, Courses.courseTitle FROM SubjectRelations INNER JOIN Courses ON SubjectRelations.courseId = Courses.id WHERE schoolId = $schoolId;";
        $result = executeSelectInstant($query);
        if (isSqlValid($result, "SubjectRelations")) {
            setResponse(true, "Read Available Courses successfully!", $result);
        }
        break;
    case "readMaxLoadViaSchoolCourse":
        $schoolId = $jsonDecoded["schoolId"];
        $courseId = $jsonDecoded["courseId"];
        $subjectRelationArgs = array(
            "schoolId" => $schoolId,
            "courseId" => $courseId,
        );
        $resultSchoolCourseAlloc = fetchDataFromTableSpecific("SchoolCourseUnitAllocation", null, $subjectRelationArgs);
        if (isSqlValid($resultSchoolCourseAlloc, "FIXME")) {
            setResponse(true, "Read Available Courses successfully!", $resultSchoolCourseAlloc);
        }
        break;
    default:
        setResponse(false, "Request code invalid!", array(), -1);
}

function setResponse($success, $message, $data, $exitCode = 0)
{
    global $response;
    global $action;
    global $table;

    $setSuccess = $success;
    $setMessage = "Operation completed successfully;";
    $setExitCode = $exitCode;
    $setData = $data;

    if (!isset($data)) $data = array();

    $dataType = gettype($data);

    if ($dataType === "array") {
        $setSuccess = $success;
        $setMessage = $message;
        $setExitCode = $exitCode;
        $setData = $data;
    }
    if (
        false
        || $dataType === "integer"
        || $dataType === "float"
        || $dataType === "double"
        || $dataType === "string"
    ) {
        $setSuccess = $success;
        $setMessage = $message;
        $setExitCode = $exitCode;
        $setData = array($data);
    }

    $response["success"] = $setSuccess;
    $response["message"] = $setMessage;
    $response["exitCode"] = $setExitCode;
    $response["data"] = $setData;
    $response["requestCode"] = $action . $table;
}

function isSqlValid($data = null, $sourceTable = "Table", $isZeroExpected = false)
{
    if (!isset($data)) {
        return false;
    }

    if (is_array($data) && count($data) == 0 && !$isZeroExpected) {
        return false;
    }

    $dataType = gettype($data);
    if ($dataType === "object" && $data instanceof PDOException) {
        $errorCode = $data->errorInfo[1];
        $errorMessage = $data->getMessage();
        if ($errorCode == 1062) {
            $errorMessage = "$sourceTable already exists!";
        }
        setResponse(false, $errorMessage, null, $errorCode);
        return false;
    }

    return true;
}

function setFetchMethod($code)
{
    $returnValue = PDO::FETCH_BOTH;
    switch ($code) {
        case CODE_PDO_FETCH_NUM:
            $returnValue = PDO::FETCH_NUM;
            break;
        case CODE_PDO_FETCH_ASSOC:
            $returnValue = PDO::FETCH_ASSOC;
            break;
        case CODE_PDO_FETCH_BOTH:
            $returnValue = PDO::FETCH_BOTH;
            break;
    }
    return $returnValue;
}

echo json_encode($response);
