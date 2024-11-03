<div class="sp-paging" id="page-<?php echo PAGE_VIEW_CURRICULUM ?>">
    <div class="container">
        <div class="card p-4 mb-3">
            <div class="card-body">
                <div class="mb-5">
                    <h1>
                        Curriculums
                        <small class="text-body-secondary">Records</small>
                    </h1>
                </div>

                <div class="mb-3">
                    <div>
                        <p class="text-muted text-center">Select record to view</p>
                    </div>

                    <div class="d-flex justify-content-center">
                        <div class="row">
                            <div class="col card text-start btn card-radio mb-3 ms-3 me-3 border-primary bg-primary text-white" id="card-option-student">
                                <div class="card-body">
                                    <h5 class="card-title">Students</h5>
                                    <p class="card-text">View curriculum content via student information</p>
                                </div>
                            </div>
                            <div class="col card text-start btn card-radio mb-3 ms-3 me-3 text-muted" id="card-option-school_course">
                                <div class="card-body">
                                    <h5 class="card-title">School</h5>
                                    <p class="card-text">View curriculum content via school/course key</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="view-student">
                    <?php createFormStudentPicker("curriculum-userData"); ?>
                </div>

                <div id="view-school_course" hidden>
                    <form method="POST" class="needs-validation" id="form-view-curriculum-school" novalidate>
                        <div>
                            <p><strong>Academic Information</strong></p>
                            <hr>
                        </div>
                        <div class="mb-3">
                            <label for="select-school" class="form-label">School</label>
                            <select name="select-school" class="form-select populate-school" required>
                                <option value selected disabled></option>
                                <?php
                                $dataSchool = fetchDatasFromTable("Schools", "schoolName");
                                createHtmlOptionsFromData($dataSchool, array("schoolName"), "id");
                                ?>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="select-course" class="form-label">Course</label>
                            <select name="select-course" class="form-select" required disabled>
                                <option value selected disabled></option>
                                <?php
                                $dataSchool = fetchDatasFromTable("Courses", "courseTitle");
                                createHtmlOptionsFromData($dataSchool, array("courseTitle"), "id");
                                ?>
                            </select>
                        </div>

                        <div id="button-submit-container">
                            <button type="submit" name="button-submit" class="btn btn-primary">View Data</button>
                            <button type="reset" class="btn btn-danger sp-reset">Reset Fields</button>
                            <button type="button" name="button-export-excel" class="btn btn-secondary" disabled hidden>Export to Excel</button>
                            <button type="button" name="button-export-pdf" class="btn btn-secondary" disabled hidden>Export to PDF</button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    </div>

    <div class="container">
        <div id="curriculums-table-container-student"></div>
        <div id="curriculums-table-container-school"></div>
    </div>
</div>