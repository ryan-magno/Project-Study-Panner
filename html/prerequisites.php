<div class="sp-paging" id="page-prerequisites">
    <div class="container">
        <div class="card p-4 mb-3">
            <div class="card-body">
                <div class="mb-5">
                    <h1>
                        Pre-requisites
                    </h1>
                </div>  
                <div class="mt-3 mb-3">

                    <form method="POST" action="action.php?action=regSubjectMetaPreRequisites" class="needs-validation" novalidate>
                        <div class="mb-3">
                            <label for="subjectId" class="form-label">Subject</label>
                            <select name="subjectId" class="form-select">
                                <option value="-1" select disabled></option>
                                <?php
                                $query = "SELECT * FROM SubjectInformation ORDER BY subjectCode";
                                $tableData = executeSelectInstant($query);
                                createHtmlOptionsFromData($tableData, array("subjectCode", "subjectDescription"), "id");
                                ?>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="subjectPreRequisiteId" class="form-label">Subject Pre-requisite</label>
                            <select name="subjectPreRequisiteId" class="form-select">
                                <option value="-1" select disabled></option>
                                <?php
                                $query = "SELECT * FROM SubjectInformation ORDER BY subjectCode";
                                $tableData = executeSelectInstant($query);
                                createHtmlOptionsFromData($tableData, array("subjectCode", "subjectDescription"), "id");
                                ?>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary sp-btn-success">Create</button>
                        <button type="reset" class="btn btn-danger sp-reset">Reset</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="card p-4 mb-3">
            <div id="students-table-container">
                <?php
                $header = array("Source Subject Code", "Source Subject Description", "Pre-requisite Subject Code", "Pre-requisite Subject Description");
                $arrDbTargetRows = array("subjectCode", "subjectDescription", "preReqSubjectCode" . "preReqSubjectDescription");
                $arrTableLabels = array("subjectCode", "subjectDescription", "preReqSubjectCode", "preReqSubjectDescription");

                $query = "SELECT si1.subjectCode AS subjectCode, si1.subjectDescription AS subjectDescription, si2.subjectCode AS preReqSubjectCode, si2.subjectDescription AS preReqSubjectDescription FROM SubjectMetaPreReqs INNER JOIN SubjectInformation AS si1 ON SubjectMetaPreReqs.subjectId = si1.id INNER JOIN SubjectInformation AS si2 ON SubjectMetaPreReqs.subjectPreRequisiteId = si2.id;";
                generateTableCustomHeaderInstantQuery($header, "Students", 'id-students', true, false, $query, $arrTableLabels);
                ?>
            </div>
        </div>
    </div>
</div>