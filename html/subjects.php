<div class="sp-paging" id="page-subjects">
    <!-- <div class="card p-4 mb-3">
        <div class="card-body">
            <h3 class="h3">Subject Information</h3>
        </div>
    </div> -->
    <!-- 
    <div class="card p-4 mb-3">
        <div class="card-body">
            <form method="POST" action="action.php?action=regSubjectInformation" class="needs-validation " novalidate>
                <div class="mb-3">
                    <p><strong>Insert Subject Information here...</strong></p>

                    <label for="subjectNumber" class="form-label">Subject No.</label>
                    <input type="text" name="subjectNumber" maxlength="255" class="form-control">
                </div>
                <div class="mb-3">
                    <label for="subjectCode" class="form-label">Subject Code</label>
                    <input type="text" name="subjectCode" maxlength="255" class="form-control">
                </div>
                <div class="mb-3">
                    <label for="subjectDescription" class="form-label">Subject Description</label>
                    <input type="text" name="subjectDescription" maxlength="255" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label for="subjectUnit" class="form-label">Subject Unit</label>
                    <input type="number" name="subjectUnit" max="999" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary sp-btn-success">Create</button>
                <button type="reset" class="btn btn-danger sp-reset">Reset</button>
            </form>
        </div>
    </div>

    <div class="card p-4 mb-3">
        <div class="card-body">
            <form class="">
                <div class="mb-3" id="div-file-subjectInf">
                    <label for="sheetFile" class="form-label">Or choose a spreadsheet file for multiple entries...</label>
                    <p><a href="./assets/templates/sp-subject-information.xlsx" download="">Click to download template</a>
                    </p>
                    <input type="file" accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" name="sheetFile" id="input-file-subjectInf" class="form-control">
                </div>
                <div class="mb-3 div-file" id="div-table-subjectInf"></div>
                <button type="submit" id="button-file-subjectInf" class="btn btn-primary button-file" disabled>Upload</button>
                <button type="reset" id="button-file-reset-subjectInf" class="btn btn-danger sp-reset">Reset</button>
            </form>
        </div>
    </div> 
-->

    <div class="card p-4 mb-3">
        <div class="card-body">
            <div class="mb-5">
                <h1>
                    Subjects
                    <small class="text-body-secondary">Entry</small>
                </h1>
            </div>
            <div class="mt-3 mb-3">
                <?php
                $header = array("Subject Number", "Subject Code", "Description", "Units");
                generateTableCustomHeader($header, "SubjectInformation", 'id-subject-information', true, true);
                ?>
            </div>
        </div>
    </div>
</div>