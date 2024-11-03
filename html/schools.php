<div class="sp-paging" id="page-schools">

    <!-- 
    <div class="card p-4 mb-3">
        <div class="card-body">
            <h3 class="h3">School</h3>
        </div>
    </div>
    -->

    <!-- 
    <div class="card p-4 mb-3">
        <div class="card-body">
            <form method="POST" action="action.php?action=regSchool" class="needs-validation " novalidate>
                <div class="mb-3">
                    <p><strong>Insert Student data here...</strong></p>
                    <label for="schoolName" class="form-label">School Name</label>
                    <input type="text" name="schoolName" maxlength="255" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary sp-btn-success">Create</button>
                <button type="reset" class="btn btn-danger sp-reset">Reset</button>
            </form>
        </div>
    </div>

    <div class="card p-4 mb-3">
        <div class="card-body">
            <form class="">
                <div class="mb-3" id="div-file-school">
                    <label for="sheetFile" class="form-label">Or choose a spreadsheet file for multiple entries...</label>
                    <p><a href="./assets/templates/sp-schools.xlsx" download="">Click to download template</a></p>
                    <input type="file" accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" name="sheetFile" id="input-file-school" class="form-control">
                </div>
                <div class="mb-3 div-file" id="div-table-school"></div>
                <button type="submit" id="button-file-school" class="btn btn-primary button-file" disabled>Upload</button>
                <button type="reset" id="button-file-reset-school" class="btn btn-danger sp-reset">Reset</button>
            </form>
        </div>
    </div> 
    -->

    <div class="card p-4 mb-3">
        <div class="card-body">
            <div class="mb-5">
                <h1>
                    Schools
                    <small class="text-body-secondary">Entry</small>
                </h1>
            </div>

            <div class="mt-3 mb-3">
                <?php
                $header = array("School Name");
                generateTableCustomHeader($header, "Schools", 'id-schools', true, true);
                ?>
            </div>
        </div>
    </div>
</div>