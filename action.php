<?php
include("./sql_proc.php");
include("./constants.php");

$action = isset($_GET['action']) ? $_GET['action'] : null;

switch ($action) {
  case 'delete':
    $table = isset($_POST['table']) ? $_POST['table'] : null;
    $id = isset($_POST['id']) ? $_POST['id'] : null;

    // sanitize
    $sanitizedTable = htmlspecialchars($table);
    $sanitizedId = htmlspecialchars($id);

    $args = array('id' => $sanitizedId);
    deleteToTable($sanitizedTable, $args);
    break;
  /** ACTION **/
  case 'regSchool':
    $schoolName = isset($_POST['schoolName']) ? $_POST['schoolName'] : null;

    $arrayBuild = array(
      'schoolName' => $schoolName
    );

    insertToTable('Schools', $arrayBuild);
    break;

  /** ACTION **/
  case 'regCourse':
    $courseTitle = isset($_POST['courseTitle']) ? $_POST['courseTitle'] : null;

    $arrayBuild = array(
      'courseTitle' => $courseTitle
    );

    insertToTable('Courses', $arrayBuild);
    break;

  /** ACTION **/
  case 'regSubjectInformation':
    $subjectNumber = isset($_POST['subjectNumber']) ? $_POST['subjectNumber'] : null;
    $subjectCode = isset($_POST['subjectCode']) ? $_POST['subjectCode'] : null;
    $subjectDescription = isset($_POST['subjectDescription']) ? $_POST['subjectDescription'] : null;
    $subjectUnit = isset($_POST['subjectUnit']) ? $_POST['subjectUnit'] : null;

    $arrayBuild = array(
      "subjectNumber" => $subjectNumber,
      "subjectCode" => $subjectCode,
      "subjectDescription" => $subjectDescription,
      "subjectUnit" => $subjectUnit
    );

    insertToTable('SubjectInformation', $arrayBuild);
    break;

  /** ACTION **/
  case 'regUser':
    $username = isset($_POST['username']) ? $_POST['username'] : null;
    $password = isset($_POST['password']) ? $_POST['password'] : null;
    $password2 = isset($_POST['password2']) ? $_POST['password2'] : null;
    $firstName = isset($_POST['firstName']) ? $_POST['firstName'] : null;
    $middleName = isset($_POST['middleName']) ? $_POST['middleName'] : null;
    $lastName = isset($_POST['lastName']) ? $_POST['lastName'] : null;

    // validation
    $passwordLength = strlen($password);
    if ($passwordLength <= 6) {
      echo "Password length must be higher than 6 characters.<br>";
      exit(1);
    }
    if ($password !== $password2) {
      echo "Password does not match.<br>";
      exit(1);
    }

    $hashPassword = hash('sha256', PW_SALT . $password);

    $tableData = array(
      'username' => $username,
      'password' => $hashPassword,
      'firstName' => $firstName,
      'middleName' => $middleName,
      'lastName' => $lastName
    );
    insertToTable('Users', $tableData);
    break;

  /** ACTION **/
  case 'regStudent':
    $firstName = isset($_POST['firstName']) ? $_POST['firstName'] : null;
    $middleName = isset($_POST['middleName']) ? $_POST['middleName'] : null;
    $lastName = isset($_POST['lastName']) ? $_POST['lastName'] : null;
    $schoolId = isset($_POST['schoolId']) ? $_POST['schoolId'] : null;
    $courseId = isset($_POST['courseId']) ? $_POST['courseId'] : null;

    // 2nd pass
    $schoolId = $schoolId === "-1" ? null : $schoolId;
    $courseId = $courseId === "-1" ? null : $courseId;

    $tableData = array(
      'firstName' => $firstName,
      'middleName' => $middleName,
      'lastName' => $lastName,
      'schoolId' => $schoolId,
      'courseId' => $courseId
    );

    $tableData = array(
      'firstName' => $firstName,
      'middleName' => $middleName,
      'lastName' => $lastName,
      'schoolId' => $schoolId,
      'courseId' => $courseId
    );
    insertToTable('Students', $tableData);
    break;

  /** ACTION **/
  case 'regSubjectMetaUnit':
    $subjectPrerequisiteId = isset($_POST['subjectId']) ? $_POST['subjectId'] : null;
    $subjectUnitName = isset($_POST['subjectUnitName']) ? $_POST['subjectUnitName'] : null;
    $subjectUnitValue = isset($_POST['subjectUnitValue']) ? $_POST['subjectUnitValue'] : null;

    // 2nd pass
    $subjectUnitValue = $subjectUnitValue === "-1" ? null : $subjectUnitValue;

    $tableData = array(
      'subjectId' => $subjectPrerequisiteId,
      'subjectUnitName' => $subjectUnitName,
      'subjectUnitValue' => $subjectUnitValue
    );
    insertToTable('SubjectMetaUnit', $tableData);
    break;

  /** ACTION **/
  case 'regSubjectMetaPreRequisites':
    $subjectPrerequisiteId = isset($_POST['subjectId']) ? $_POST['subjectId'] : null;
    $subjectId = isset($_POST['subjectPreRequisiteId']) ? $_POST['subjectPreRequisiteId'] : null;

    // 2nd pass
    $subjectPrerequisiteId = $subjectPrerequisiteId === "-1" ? null : $subjectPrerequisiteId;
    $subjectId = $subjectId === "-1" ? null : $subjectId;

    $similarData = $subjectPrerequisiteId === $subjectId;
    if ($similarData) {
      echo "Similar Subject is not possible! <br>";
      exit(1);
    }

    $tableData = array(
      'subjectId' => $subjectPrerequisiteId,
      'subjectPreRequisiteId' => $subjectId
    );
    insertToTable('SubjectMetaPreReqs', $tableData);
    break;

  /** ACTION **/
  case 'regStudentSubjects';
    $studentId = isset($_POST['studentId']) ? $_POST['studentId'] : null;
    $subjectPrerequisiteId = isset($_POST['subjectId']) ? $_POST['subjectId'] : null;

    // 2nd pass
    $studentId = $studentId === "-1" ? null : $studentId;
    $subjectPrerequisiteId = $subjectPrerequisiteId === "-1" ? null : $subjectPrerequisiteId;

    $tableData = array(
      'studentId' => $studentId,
      'subjectId' => $subjectPrerequisiteId
    );

    insertToTable('StudentSubjects', $tableData);
    break;

}

// Redirect after action...
header('Location: ' . '/');