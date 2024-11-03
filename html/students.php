<div class="sp-paging" id="page-students">
    <!-- <div class="card p-4 mb-3">
        <div class="card-body">
            <h3 class="h3">Students</h3>
        </div>
    </div> -->

    <!--     
    <div class="card p-4 mb-3">
        <div class="card-body">
            <form method="POST" action="action.php?action=regStudent" class="needs-validation sp-form-create" novalidate>
                <div class="mb-3">
                    <p><strong>Insert Student data here...</strong></p>
                    <label for="firstName" class="form-label">First Name</label>
                    <input type="text" name="firstName" maxlength="255" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label for="middleName" class="form-label">Middle Name</label>
                    <input type="text" name="middleName" maxlength="255" class="form-control">
                </div>
                <div class="mb-3">
                    <label for="lastName" class="form-label">Last Name</label>
                    <input type="text" name="lastName" maxlength="255" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label for="schoolId" class="form-label">School</label>
                    <select name="schoolId" class="form-select">
                        <option value="-1" selected>(No school)</option>
                        <?php
                        // $data = fetchDatasFromTable("Schools", "schoolName");
                        // createHtmlOptionsFromData($data, array("schoolName"), "id");
                        ?>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="courseId" class="form-label">Course</label>
                    <select name="courseId" class="form-select">
                        <option value="-1" selected>(No course)</option>
                        <?php
                        // $data = fetchDatasFromTable("Courses", "courseTitle");
                        // createHtmlOptionsFromData($data, array("courseTitle"), "id");
                        ?>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary sp-btn-success">Create</button>
                <button type="reset" class="btn btn-danger sp-reset">Reset</button>
            </form>
        </div>
    </div> 
-->
    <div class="container">
        <div class="card p-4 mb-3">
            <div class="card-body">
                <div class="mb-5">
                    <h1>
                        Students
                        <small class="text-body-secondary">Information</small>
                    </h1>
                </div>
                <div class="container">
                    <label for="student-select-school" class="form-label">School</label>
                    <select name="student-select-school" class="form-select" id="student-select-school" required>
                        <option value="-1" selected>(All)</option>
                        <?php
                        $dataSchool = fetchDatasFromTable("Schools", "schoolName");
                        createHtmlOptionsFromData($dataSchool, array("schoolName"), "id");
                        ?>
                    </select>
                </div>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="card p-4 mb-3">
            <div id="table-container-student">
                <!-- <?php
                $header = array("First Name", "Middle Name", "Last Name", "School", "Course Title", "Education Year");
                $arrDbTargetRows = array("firstName", "middleName", "lastName", "schoolName", "courseTitle");
                $arrTableLabels = array("firstName", "middleName", "lastName", "schoolName", "courseTitle", "yearName");
                $strbuild = "";
                for ($i = 0; $i < count($arrDbTargetRows); $i++) {
                    $strbuild .= $arrDbTargetRows[$i];
                    if ($i != count($arrDbTargetRows) - 1) $strbuild .= ", ";
                }
                $query = "SELECT Students.id AS id, $DB_CASE_YEAR_NAME, $strbuild FROM Students INNER JOIN Schools ON Students.schoolId = Schools.id INNER JOIN Courses ON Students.courseId = Courses.id;";
                generateTableCustomHeaderInstantQuery($header, "Students", 'id-students', true, false, $query, $arrTableLabels);
                ?> -->
            </div>
        </div>
    </div>
</div>