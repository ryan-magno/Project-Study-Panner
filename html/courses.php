<div class="sp-paging" id="page-courses">
    <!-- <div class="card p-4 mb-3">
        <div class="card-body">
            <h3 class="h3">Courses</h3>
        </div>
    </div> -->
    <!-- 
    <div class="card p-4 mb-3">
        <div class="card-body">
            <form method="POST" action="action.php?action=regCourse" class="needs-validation" novalidate>
                <div class="mb-3">
                    <p><strong>Insert Course Title here...</strong></p>

                    <label for="courseTitle" class="form-label">Course Title</label>
                    <input type="text" name="courseTitle" maxlength="255" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary sp-btn-success">Create</button>
                <button type="reset" class="btn btn-danger sp-reset">Reset</button>
            </form>
        </div>
    </div>

    <div class="card p-4 mb-3">
        <div class="card-body">
            <form class="">
                <div class="mb-3" id="div-file-course">
                    <label for="sheetFile" class="form-label">Or choose a spreadsheet file for multiple entries...</label>
                    <p><a href="./assets/templates/sp-courses.xlsx" download="">Click to download template</a></p>
                    <input type="file" accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" name="sheetFile" id="input-file-course" class="form-control">
                </div>
                <div class="mb-3 div-file" id="div-table-course"></div>
                <button type="submit" id="button-file-course" class="btn btn-primary button-file" disabled>Upload</button>
                <button type="reset" id="button-file-reset-course" class="btn btn-danger sp-reset">Reset</button>
            </form>
        </div>
    </div> 
-->

    <div class="card p-4 mb-3">
        <div class="card-body">
            <div class="mb-5">
                <h1>
                    Courses
                    <small class="text-body-secondary">Entry</small>
                </h1>
            </div>
            <div class="mt-3 mb-3">
                <?php
                $header = array("Course Title");
                generateTableCustomHeader($header, "Courses", 'id-courses', true, true);
                ?>
            </div>
        </div>
    </div>
</div>