<div id="topbar"></div>

<div class="container-fluid">
    <div class="row d-flex">
        <div class="col flex-grow-0">
            <main>
                <div class="d-flex flex-column flex-shrink-0 p-3 text-white" id="sidebar">
                    <div class="mb-3" style="min-height: 40px;"></div>
                    <div class="row text-center">
                        <span class="fs-4">Study Plan</span>
                    </div>
                    <hr />
                    <ul class="nav nav-pills flex-column mb-auto">
                        <li class="nav-item">
                            <a href="#home" class="nav-link text-white d-flex align-items-center" aria-current="page">
                                <i class="bi bi-house me-3"></i>
                                Home
                            </a>
                        </li>
                        <hr />
                        <li class="nav-item">
                            <div class="ms-3">
                                <p><strong>Generate</strong></p>
                            </div>
                        </li>
                        <li class="nav-item">
                            <a href="#upload_curriculum" class="nav-link text-white d-flex align-items-center" aria-current="page">
                                <i class="bi bi-check-circle me-3"></i>
                                Curriculum
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#<?php echo PAGE_CREATE_STUDENT; ?>" class="nav-link text-white">
                                <i class="bi bi-people-fill me-3"></i>
                                Student
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#<?php echo PAGE_CREATE_STUDY_PLAN; ?>" class="nav-link text-white">
                                <i class="bi bi-journal-bookmark me-3"></i>
                                Study Plan
                            </a>
                        </li>
                        <!-- <li class="nav-item" hidden>
                            <a href="#prerequisites" class="nav-link text-white">
                                <i class="bi bi-pen me-3"></i>
                                Prerequisites
                            </a>
                        </li> -->
                        <hr />
                        <li class="nav-item">
                            <div class="ms-3">
                                <p><strong>Records</strong></p>
                            </div>
                        </li>
                        <!-- <li class="nav-item" hidden>
                            <a href="#schools" class="nav-link text-white d-flex align-items-center" aria-current="page">
                                <i class="bi bi-buildings me-3"></i>
                                Schools
                            </a>
                        </li> -->
                        <li class="nav-item">
                            <a href="#<?php echo PAGE_VIEW_CURRICULUM ?>" class="nav-link text-white d-flex align-items-center" aria-current="page">
                                <i class="bi bi-file-earmark-text me-3"></i>
                                View Curriculum
                            </a>
                        </li>
                        <!-- <li class="nav-item" hidden>
                            <a href="#courses" class="nav-link text-white d-flex align-items-center" aria-current="page">
                                <i class="bi bi-mortarboard me-3"></i>
                                Courses
                            </a>
                        </li> -->
                        <li class="nav-item">
                            <a href="#students" class="nav-link text-white">
                                <i class="bi bi-people-fill me-3"></i>
                                View Students
                            </a>
                        </li>
                        <!-- <li class="nav-item" hidden>
                            <a href="#subjects" class="nav-link text-white">
                                <i class="bi bi-journal-bookmark me-3"></i>
                                Subjects
                            </a>
                        </li>
                        <li class="nav-item" hidden>
                            <a href="#records" class="nav-link text-white">
                                <i class="bi bi-pen me-3"></i>
                                Student Records
                            </a>
                        </li> -->
                    </ul>
                    <hr />
                    <div class="dropdown">
                        <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src="assets/placeholder.png" alt="" width="32" height="32" class="rounded-circle me-2" />
                            <strong>user</strong>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                            <li><a class="dropdown-item" href="#">Settings</a></li>
                            <li>
                                <hr class="dropdown-divider" />
                            </li>
                            <li><a class="dropdown-item" href="#">Sign out</a></li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
        <div class="col">
            <div class="container-items">
                <div id="response-container" style="visibility: hidden">
                    <?php
                    include("./html/home.php");
                    include("./html/upload_curriculum.php");
                    include("./html/" . PAGE_CREATE_STUDENT . ".php");
                    include("./html/" . PAGE_CREATE_STUDY_PLAN . ".php");
                    include("./html/" . PAGE_VIEW_CURRICULUM . ".php");
                    include("./html/students.php");
                    
                    // include("./html/schools.php");
                    // include("./html/courses.php");
                    // include("./html/subjects.php");
                    // include("./html/records.php");
                    // include("./html/prerequisites.php");
                    ?>
                </div>
            </div>
        </div>
    </div>
</div>