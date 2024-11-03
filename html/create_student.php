    <div class="sp-paging" id="page-<?php echo PAGE_CREATE_STUDENT; ?>">
        <div class="container">
            <div class="card p-4 mb-3">
                <div class="card-body">
                    <div class="mb-5">
                        <h1>
                            Create
                            <small class="text-body-secondary">Student</small>
                        </h1>
                    </div>
                    <form method="POST" class="needs-validation" id="form-create-student" novalidate>
                        <div>
                            <p><strong>Student Information</strong></p>
                            <hr>
                        </div>
                        <div class="mb-3 input-group">
                            <span class="input-group-text">Full Name</span>
                            <input type="text" name="firstName" maxlength="255" id="sp-firstName" class="form-control" aria-label="First name" class="form-control" placeholder="First Name" required>
                            <input type="text" name="middleName" maxlength="255" id="sp-middleName" class="form-control" aria-label="Middle name" class="form-control" placeholder="Middle Name (leave blank if none)">
                            <input type="text" name="lastName" maxlength="255" id="sp-lastName" class="form-control" aria-label="Last name" class="form-control" placeholder="Last Name" required>
                            <div class="invalid-feedback">
                                Please fill First and Last Name
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="educationYear" class="form-label">Education Year</label>
                            <select class="form-select" name="educationYear" title="Education Year" required>
                                <option selected disabled></option>
                                <option value="1">First Year</option>
                                <option value="2">Second Year</option>
                                <option value="3">Third Year</option>
                                <option value="4">Fourth Year</option>
                                <option value="5">Fifth Year</option>
                                <option value="6">Sixth Year</option>
                                <option value="7">Seventh Year</option>
                                <option value="8">Eight Year</option>
                                <option value="9">Ninth Year</option>
                            </select>
                        </div>
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
                            <button type="submit" class="btn btn-primary">Register Student</button>
                            <button type="reset" class="btn btn-danger sp-reset">Reset Fields</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>