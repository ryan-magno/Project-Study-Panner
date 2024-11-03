<div class="sp-paging" id="page-<?php echo PAGE_CREATE_STUDY_PLAN; ?>">
    <div class="container">
        <div class="card p-4 mb-3">
            <div class="card-body">
                <div class="mb-5">
                    <h1>
                        Study
                        <small class="text-body-secondary">Plan</small>
                    </h1>
                </div>
                <?php createFormStudentPicker("sp-userData", true); ?>
            </div>
        </div>
    </div>

    <div class="container">
        <div id="sp-table-container"></div>
    </div>

</div>
