<?php
include("./db_contexts.php");
initConnection();
initRequiredTables();



include("./modify_dom.php");



$page = isset($_GET["page"]) ? $_GET["page"] : "all";

switch ($page) {
    case 'home':
        include('./html/home.php');
        break;
    case 'schools':
        include('./html/schools.php');
        break;
    case 'courses':
        include('./html/courses.php');
        break;
    case 'subjects':
        include('./html/subjects.php');
        break;
    case 'students':
        include('./html/students.php');
        break;
    case 'curriculum':
        include('./html/curriculum.php');
        break;
    case 'study_plan':
        include('./html/study_plan.php');
        break;
    default:
        include('./html/home.php');
        break;
}
