<?php
function createFormStudentPicker($attrId = "", $hasExport = false)
{
    if (true) { ?>

        <form method="GET" class="needs-validation" id=<?php echo '"' . $attrId . '"'; ?> novalidate>
            <div>
                <p><strong>Student Information</strong></p>
                <hr>
            </div>
            <div class="mb-3">
                <label for="studentId" class="form-label">Student Name</label>
                <select name="studentId" class="form-select populate-student" title="Select student">
                    <option value selected disabled></option>
                    <?php
                    $data = fetchDatasFromTable("Students", "firstName");
                    createHtmlOptionsFromData($data, array("firstName", "middleName", "lastName"), "id");
                    ?>
                </select>
            </div>
            <div class="mb-3">
                <div class="input-group input-group-sm mb-3">
                    <input type="text" name="schoolId" class="form-control" readonly disabled>
                    <span class="input-group-text">School</span>
                </div>
                <div class="input-group input-group-sm mb-3">
                    <input type="text" name="courseId" class="form-control" readonly disabled>
                    <span class="input-group-text">Course</span>
                </div>
                <div class="input-group input-group-sm mb-3">
                    <input type="text" name="educationYear" class="form-control" readonly disabled>
                    <span class="input-group-text">Education Year</span>
                </div>
            </div>

            <button type="submit" class="btn btn-primary" name="button-submit">Generate Data</button>
            <button type="reset" class="btn btn-danger sp-reset" name="reset">Reset Fields</button>
            <?php
            if ($hasExport) { ?>
                <button type="button" name="button-export-excel" class="btn btn-secondary" disabled>Export to Excel</button>
                <button type="button" name="button-export-pdf" class="btn btn-secondary" disabled>Export to PDF</button>
            <?php } ?>
            <!-- <button type="button" class="btn btn-success" name="button-analyze" disabled>Create Study Plan</button> -->
        </form>
<?php }
}
?>