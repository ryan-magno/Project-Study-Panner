<?php
$jsonDecoded = isset($_POST["jsonData"]) ? json_decode($_POST["jsonData"], true) : null;
$subjectPrerequisiteId = isset($jsonDecoded["subjectId"]) ? $jsonDecoded["subjectId"] : -1;
$subjectCode = isset($jsonDecoded["subjectCode"]) ? $jsonDecoded["subjectCode"] : "";
$subjectDescription = isset($jsonDecoded["subjectDescription"]) ? $jsonDecoded["subjectDescription"] : "";
?>
<div class="container p-3">
    <div class="mb-3">
        <div class="d-flex align-items-end">
            <p><strong>Subject Information</strong></p>
        </div>

        <div class="form-floating mb-3">
            <input type="text" readonly class="form-control" id="floatingSubjectCode" value="<?php echo $subjectCode; ?>">
            <label for="floatingSubjectCode" class="fs-6">Subject Code</label>
        </div>
        <div class="form-floating mb-3">
            <input type="text" readonly class="form-control" id="floatingSubjectDescription" value="<?php echo $subjectDescription; ?>">
            <label for="floatingSubjectDescription" class="fs-6">Subject Description</label>
        </div>
    </div>

    <div class="mb-3">
        <div class="d-flex align-items-end">
            <p><strong>Add Pre-requisites</strong></p>
        </div>
        <select class="form-select" id="swalSelectSubjectForPrerequisites">
            <option value selected disabled></option>
        </select>
        <div class="invalid-feedback">
            <div class="d-flex align-items-center">
                Already in table.
            </div>
        </div>
        <button type="button" class="btn btn-primary mt-3" id="swalButtonAddPrerequisite">Add Pre-requisites</button>
    </div>

    <div class="card p-3 mb-3">
        <div class="card-body">
            <div class="d-flex align-items-center">
                <p class="fs-6">List of Pre-requisite/s:</p>
            </div>
            <table id="swalUploadCurriculumTable" class="table table-striped"></table>
        </div>
    </div>
</div>