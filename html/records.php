<div class="sp-paging" id="page-records">
    <!-- <div class="card p-4 mb-3">
        <div class="card-body">
            <h3 class="h3">Curriculum</h3>
        </div>
    </div> -->
    <div class="card p-4 mb-3">
        <div class="card-body">
            <div class="mt-3 mb-3">
                <h3>List of taken curriculums</h3>
                <?php
                //$header = array("Student Name", "Subject", "Academic Year", "Academic Semester", "Status", "Sort Order");
                // $header = array("Subject ID", "School ID", "Course ID");
                $header = array("First Name", "Middle Name", "Last Name", "Subject Code", "Subject Description", "Subject Units", "Education Year", "Academic Semester");
                $arrTableLabels = array("firstName", "middleName", "lastName", "subjectCode", "subjectDescription", "subjectUnit", "educationYear", "academicSemester");
                $arrDbTargetRows = array("firstName", "middleName", "lastName", "subjectCode", "subjectDescription", "subjectUnit", "educationYear", "academicSemester");
                $strbuild = "";
                for ($i = 0; $i < count($arrDbTargetRows); $i++) {
                    $strbuild .= $arrDbTargetRows[$i];
                    if ($i != count($arrDbTargetRows) - 1) $strbuild .= ", ";
                }
                $query = "SELECT StudentSubjects.id AS id, $strbuild FROM StudentSubjects INNER JOIN Students ON StudentSubjects.studentId = Students.id INNER JOIN SubjectInformation ON StudentSubjects.subjectId = SubjectInformation.id;";
                generateTableCustomHeaderInstantQuery($header, "StudentSubjects", 'id-students-subjects', true, true, $query, $arrTableLabels);
                ?>
            </div>
        </div>
    </div>
</div>
