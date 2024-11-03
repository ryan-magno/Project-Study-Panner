<div class="sp-paging" id="page-home">
    <div class="container">
        <div class="card p-4 mb-3" id="page-home">
            <div class="card-body">
                <div class="mb-1">
                    <h1>
                        Welcome back,
                        <small class="text-body-secondary">user!</small>
                    </h1>
                </div>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="card p-4 mb-3" id="page-home">
            <div class="card-body">
                <div class="mb-3">
                    <div>
                        <p class="text-muted text-center">Select guideline to view</p>
                    </div>

                    <div class="d-flex justify-content-center">
                        <div class="row">
                        <div class="col card text-start btn card-radio mb-3 ms-3 me-3 border-primary bg-primary text-white" id="card-option-data_privacy">
                            <div class="card-body">
                                <h5 class="card-title">Data Privacy</h5>
                                <p class="card-text">View data privacy</p>
                            </div>
                        </div>
                            <div class="col card text-start btn card-radio mb-3 ms-3 me-3 border-primary bg-primary text-white" id="card-option-user_manual">
                                <div class="card-body">
                                    <h5 class="card-title">User Manual</h5>
                                    <p class="card-text">View user manual</p>
                                </div>
                            </div>
                            <div class="col card text-start btn card-radio mb-3 ms-3 me-3 text-muted" id="card-option-restrictions">
                                <div class="card-body">
                                    <h5 class="card-title">Restrictions</h5>
                                    <p class="card-text">View restrictions</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="data-privacy" style="display: none;">
                    <p class="text-left"><strong>Data Privacy Notice</strong></p>
                    <p class="text-left">We are committed to protecting your privacy and ensuring that your personal data is handled in a safe and responsible manner. This Data Privacy Notice outlines how we collect, use, disclose, and protect your information when you use the Academic Study Plan Recommender and Simulator System.</p>
                    <hr>
                    <p class="text-left">
                        <strong>a. Data Collection</strong>
                        <ul>
                            <li>
                                We collect the following types of information:
                                <ol>
                                    <li><strong>Personal Information:</strong> Name, email address, student ID, and other identifying information.</li>
                                    <li><strong>Academic Information:</strong> Courses, grades, academic plans, and related data.</li>
                                </ol>
                            </li>
                        </ul>
                    </p>
                    <p class="text-left">
                        <strong>b. Use of Data</strong>
                        <ul>
                            <li>
                                Your data will be used for the following purposes:
                                <ol>
                                    <li>To generate and recommend personalized academic study plans.</li>
                                    <li>To simulate academic progress and outcomes.</li>
                                    <li>To improve the functionality and user experience of the system.</li>
                                </ol>
                            </li>
                        </ul>
                    </p>
                    <p class="text-left">
                        <strong>c. Data Sharing and Disclosure</strong>
                        <ul>
                            <li>
                                We will not share your personal data with third parties except:
                                <ol>
                                    <li>When required by law.</li>
                                    <li>With your explicit consent.</li>
                                    <li>To protect the rights, property, or safety of our system and users.</li>
                                </ol>
                            </li>
                        </ul>
                    </p>
                    <p class="text-left">
                        <strong>d. Data Security</strong>
                        <ul>
                            <li>
                                We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction. These measures include:
                                <ol>
                                    <li>Encryption of data during transmission and storage.</li>
                                    <li>Regular security assessments and updates.</li>
                                </ol>
                            </li>
                        </ul>
                    </p>
                    <p class="text-left">
                        <strong>e. Data Retention</strong>
                        <ul>
                            <li>
                                We will retain your data only as long as necessary to fulfill the purposes outlined in this notice or as required by law. Upon request, we will delete or anonymize your data.
                            </li>
                        </ul>
                    </p>
                    <p class="text-left">
                        <strong>f. Your Rights</strong>
                        <ul>
                            <li>
                                You have the right to:
                                <ol>
                                    <li>Access your personal data and obtain a copy.</li>
                                    <li>Correct any inaccuracies in your data.</li>
                                    <li>Request the deletion of your data.</li>
                                    <li>Object to the processing of your data.</li>
                                    <li>Withdraw your consent at any time.</li>
                                </ol>
                            </li>
                        </ul>
                        By using the Academic Study Plan Recommender and Simulator System, you acknowledge that you have read and understood this Data Privacy Notice. Thank you for trusting us with your personal and academic information.
                    </p>
                    </div>
                    <div id="guides-to-remember" style="display: none;">
                        <p class="text-left"><strong>Functionality Overview</strong></p>
                        <hr>
                        <p class="text-left">
                            <strong>a. Generate Curriculum</strong>
                            <ul>
                                <li>
                                    <strong>Description:</strong> This feature allows you to upload a curriculum by specifying academic subjects, courses, and learning objectives.
                                </li>
                                <li>
                                    <strong>How to Use:</strong>
                                    <ol>
                                        <li>Access the Generate "Curriculum" option from the main menu.</li>
                                        <li>Follow the prompts to input relevant details such as uploading the Curriculum, school, and course.</li>
                                        <li>Add or edit the required prerequisites for all the subjects that need to have prerequisites.</li>
                                        <li>Review and finalize the generated curriculum.</li>
                                    </ol>
                                </li>
                            </ul>
                        </p>
                        <p class="text-left">
                            <strong>b. Create Student</strong>
                            <ul>
                                <li>
                                    <strong>Description:</strong> Input student information to generate personalized study plans based on individual academic needs and goals.
                                </li>
                                <li>
                                    <strong>How to Use:</strong>
                                    <ol>
                                        <li>Select the Create "Student" option from the main menu.</li>
                                        <li>Enter the student's details, including name, education year, and select the School and Course from the database of the system.</li>
                                        <li>Save the student profile for future reference.</li>
                                    </ol>
                                </li>
                            </ul>
                        </p>
                        <p class="text-left">
                            <strong>c. Generate Study Plan</strong>
                            <ul>
                                <li>
                                    <strong>Description:</strong> Utilize Forward Chaining and Heuristic Algorithms to recommend optimized study plans created to each student's profile.
                                </li>
                                <li>
                                    <strong>How to Use:</strong>
                                    <ol>
                                        <li>Choose the "Generate Study Plan" option from the main menu.</li>
                                        <li>Select the student for whom you wish to generate the study plan.</li>
                                        <li>Click the "Generate Data" button.</li>
                                        <li>Follow the system prompts to specify passed, failed subjects, or pending subjects.</li>
                                        <li>Click the "Create Study Plan" button.</li>
                                        <li>Review the recommended and generated study plan.</li>
                                    </ol>
                                </li>
                            </ul>
                        </p>
                        <p class="text-left">
                            <strong>d. View Curriculum</strong>
                            <ul>
                                <li>
                                    <strong>Description:</strong> Review the generated curriculum to ensure alignment with academic standards and requirements.
                                </li>
                                <li>
                                    <strong>How to Use:</strong>
                                    <ol>
                                        <li>Access the "View Curriculum" option from the main menu.</li>
                                        <li>Select whether you want to specifically view a student's curriculum or the school, then select the course curriculum you want to view.</li>
                                        <li>Navigate through the curriculum sections to examine subject details, course titles, and learning objectives.</li>
                                    </ol>
                                </li>
                            </ul>
                        </p>
                        <p class="text-left">
                            <strong>e. View Student Records</strong>
                            <ul>
                                <li>
                                    <strong>Description:</strong> Access and manage student records to track progress, performance, and study plan history.
                                </li>
                                <li>
                                    <strong>How to Use:</strong>
                                    <ol>
                                        <li>Select the "View Student Records" option from the main menu.</li>
                                        <li>Search for specific student profiles by school.</li>
                                        <li>Review study plans, view curriculum, and any additional student-related data.</li>
                                    </ol>
                                </li>
                            </ul>
                        </p>
                    </div>
                    <div id="restrictions" style="display: none;">
                        <p class="text-left"><strong>Getting Started</strong></p>
                        <p class="text-left">Before you begin using the system, ensure that you have access to a compatible device with an internet connection. Follow the steps below to navigate through the system's functionalities:</p>
                        <hr>
                        <p class="text-left">
                            <strong>a. Generate Curriculum</strong>
                            <ul>
                                <li>
                                    <strong>Restrictions:</strong>
                                    <ol>
                                        <li>Requires administrative access.</li>
                                        <li>Curriculum generation may take time depending on the complexity of the requirements.</li>
                                    </ol>
                                </li>
                            </ul>
                        </p>
                        <p class="text-left">
                            <strong>b. Create Student</strong>
                            <ul>
                                <li>
                                    <strong>Restrictions:</strong>
                                    <ol>
                                        <li>Administrative access may be required.</li>
                                        <li>Student information must be accurate to generate effective study plans.</li>
                                    </ol>
                                </li>
                            </ul>
                        </p>
                        <p class="text-left">
                            <strong>c. Generate Study Plan</strong>
                            <ul>
                                <li>
                                    <strong>Restrictions:</strong>
                                    <ol>
                                        <li>Study plans are based on available curriculum and student profiles.</li>
                                        <li>System may not accommodate extremely specific or relocate study requirements.</li>
                                    </ol>
                                </li>
                            </ul>
                        </p>
                        <p class="text-left">
                            <strong>d. View Curriculum</strong>
                            <ul>
                                <li>
                                    <strong>Restrictions:</strong>
                                    <ol>
                                        <li>Access may be limited to authorized personnel.</li>
                                        <li>Modifications to the curriculum may require administrative approval.</li>
                                    </ol>
                                </li>
                            </ul>
                        </p>
                        <p class="text-left">
                            <strong>e. View Student Records</strong>
                            <ul>
                                <li>
                                    <strong>Restrictions:</strong>
                                    <ol>
                                        <li>Access may be restricted to authorized personnel.</li>
                                        <li>Student records should be handled in compliance with privacy regulations.</li>
                                    </ol>
                                </li>
                            </ul>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<style>
    /* Override Bootstrap button styles */
    #card-option-data_privacy.btn,
    #card-option-user_manual.btn,
    #card-option-restrictions.btn {
        width: 400px; /* Adjust the width as needed */
    }
    /* Override Bootstrap button styles */
    #card-option-data_privacy .card-title,
    #card-option-data_privacy .card-text,
    #card-option-user_manual .card-title,
    #card-option-user_manual .card-text,
    #card-option-restrictions .card-title,
    #card-option-restrictions .card-text {
        text-align: center;
        width: 100%;
    }
</style>
<script>
    window.addEventListener('load', function() {
        document.getElementById('card-option-data_privacy').click();
    });

    document.getElementById('card-option-data_privacy').addEventListener('click', function () {
        document.getElementById('data-privacy').style.display = 'block';
        document.getElementById('guides-to-remember').style.display = 'none';
        document.getElementById('restrictions').style.display = 'none';
    });

    document.getElementById('card-option-user_manual').addEventListener('click', function () {
        document.getElementById('guides-to-remember').style.display = 'block';
        document.getElementById('data-privacy').style.display = 'none';
        document.getElementById('restrictions').style.display = 'none';
    });

    document.getElementById('card-option-restrictions').addEventListener('click', function () {
        document.getElementById('restrictions').style.display = 'block';
        document.getElementById('guides-to-remember').style.display = 'none';
        document.getElementById('data-privacy').style.display = 'none';
    });
</script>