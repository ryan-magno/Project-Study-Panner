<?php
define('PW_SALT', 'aB3dF5gH8jK*lM@7oP2qRsT9uVwX<Yz^1_+0-=');
define('CODE_PDO_FETCH_NUM', 0);
define('CODE_PDO_FETCH_ASSOC', 1);
define('CODE_PDO_FETCH_BOTH', 2);

// paging
define('PAGE_CREATE_STUDY_PLAN', 'create_study_plan');
define('PAGE_CREATE_STUDENT', 'create_student');
define('PAGE_VIEW_CURRICULUM', 'view_curriculum');

$DB_TABLE_EDUCATION_YEAR = "educationYear";
$DB_CASE_YEAR_NAME =
  "CASE " .
      "WHEN $DB_TABLE_EDUCATION_YEAR = 1 THEN 'First Year' " .
      "WHEN $DB_TABLE_EDUCATION_YEAR = 2 THEN 'Second Year' " .
      "WHEN $DB_TABLE_EDUCATION_YEAR = 3 THEN 'Third Year' " .
      "WHEN $DB_TABLE_EDUCATION_YEAR = 4 THEN 'Fourth Year' " .
      "WHEN $DB_TABLE_EDUCATION_YEAR = 5 THEN 'Fifth Year' " .
      "WHEN $DB_TABLE_EDUCATION_YEAR = 6 THEN 'Sixth Year' " .
      "WHEN $DB_TABLE_EDUCATION_YEAR = 7 THEN 'Seventh Year' " .
      "WHEN $DB_TABLE_EDUCATION_YEAR = 8 THEN 'Eight Year' " .
      "WHEN $DB_TABLE_EDUCATION_YEAR = 9 THEN 'Ninth Year' " .
    "END AS yearName";

// javascript
function applyConstantsToJs() {
  echo "<script>\n";
  echo "  const CODE_PDO_FETCH_NUM = " . CODE_PDO_FETCH_NUM . ";\n";
  echo "  const CODE_PDO_FETCH_ASSOC = " . CODE_PDO_FETCH_ASSOC . ";\n";
  echo "  const CODE_PDO_FETCH_BOTH = " . CODE_PDO_FETCH_BOTH . ";\n";
  echo "  const PAGE_CREATE_STUDY_PLAN = \"" . PAGE_CREATE_STUDY_PLAN . "\";\n";
  echo "  const PAGE_CREATE_STUDENT = \"" . PAGE_CREATE_STUDENT . "\";\n";
  echo "  const PAGE_VIEW_CURRICULUM = \"" . PAGE_VIEW_CURRICULUM . "\";\n";
  echo "</script>\n";
}
