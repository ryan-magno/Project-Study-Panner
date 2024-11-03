<div class="sp-paging" id="page-upload_curriculum">
    <!-- <div class="card p-4 mb-3">
    <div class="card-body">
        <h3 class="h3">Study Plan</h3>
    </div>
</div> -->
    <div class="container">
        <div class="card p-4 mb-3">
            <div class="card-body">
                <div class="mb-4">
                    <h1>
                        Curriculum
                        <small class="text-body-secondary">Upload</small>
                    </h1>
                </div>
                <form method="POST" class="needs-validation" id="sp-form-userData" novalidate>
                    <div class="container mb-3">
                        <label for="fileCurriculum" class="form-label">Upload Grades Checklist</label>
                        <input type="file" class="form-control" id="sp-upload-file" name="fileCurriculum" accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
                    </div>

                    <div class="container">
                        <p><strong>Academic Information</strong></p>
                        <hr>
                    </div>

                    <div class="container">
                        <div class="row mb-3">
                            <div class="col">
                                <div class="form-floating">
                                    <input type="text" class="form-control" id="floatingInputSchool" name="school" maxlength="255" placeholder="" disabled required />
                                    <label for="floatingInputSchool">School</label>
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-floating">
                                    <input type="text" class="form-control" id="floatingInputCourse" name="course" maxlength="255" placeholder="" disabled required />
                                    <label for="course" class="form-label">Course</label>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <div id="button-upload-container">
                                    <button type="submit" id="sp-button-upload-all" class="btn btn-primary" disabled hidden>Upload Curriculum</button>
                                    <button type="reset" id="sp-button-upload-reset" class="btn btn-danger sp-reset">Reset</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="container">
        <div id="table-container-upload-curriculum"></div>
    </div>
</div>