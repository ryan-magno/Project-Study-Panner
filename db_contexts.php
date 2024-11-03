<?php
include("./sql_proc.php");
// setups
function initRequiredTables()
{
    createTable(
        "Users",
        "id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, " .
        "timeCreated DATETIME DEFAULT CURRENT_TIMESTAMP, " .
        "timeUpdated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " .
        "username VARCHAR(255) UNIQUE NOT NULL, " .
        "password TEXT NOT NULL, " . // hashed
        "firstName TEXT NOT NULL, " .
        "middleName TEXT, " .
        "lastName TEXT NOT NULL"
        // "school TEXT NOT NULL, " .
        // "course TEXT"
    );

    createTable(
        "Schools",
        "id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, " .
        "timeCreated DATETIME DEFAULT CURRENT_TIMESTAMP, " .
        "timeUpdated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " .
        "schoolName VARCHAR(255) UNIQUE NOT NULL"
    );

    createTable(
        "Courses",
        "id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, " .
        "timeCreated DATETIME DEFAULT CURRENT_TIMESTAMP, " .
        "timeUpdated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " .
        "courseTitle VARCHAR(255) UNIQUE NOT NULL"
    );

    createTable(
        "Students",
        "id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, " .
        "timeCreated DATETIME DEFAULT CURRENT_TIMESTAMP, " .
        "timeUpdated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " .
        "firstName VARCHAR(255) NOT NULL, " .
        "middleName VARCHAR(255), " .
        "lastName VARCHAR(255) NOT NULL, " .
        "schoolId INT, " .
        "courseId INT, " .
        "educationYear INT DEFAULT 1, " .
        "UNIQUE KEY unique_students (firstName, middleName, lastName, schoolId, courseId), " .
        "FOREIGN KEY (schoolId) REFERENCES Schools(id) ON DELETE CASCADE, " .
        "FOREIGN KEY (courseId) REFERENCES Courses(id) ON DELETE CASCADE"
    );

    createTable(
        "SubjectInformation",
        "id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, " .
        "timeCreated DATETIME DEFAULT CURRENT_TIMESTAMP, " .
        "timeUpdated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " .
        "subjectNumber VARCHAR(255) DEFAULT '-', " .
        "subjectCode VARCHAR(255) DEFAULT '-', " .
        "subjectDescription VARCHAR(255) DEFAULT '-', " .
        "subjectUnit INT DEFAULT 0, " .
        "sortOrder INT NOT NULL, " . // global sort order
        "priority INT NOT NULL DEFAULT 1, " . // global priority
        "UNIQUE KEY unique_subject_inf (subjectNumber, subjectCode, subjectDescription, subjectUnit)"
    );

    // UNIT NAME may be unit or lec,labskill, clinic, internship, etc.
    createTable(
        "SubjectMetaUnit",
        "id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, " .
        "timeCreated DATETIME DEFAULT CURRENT_TIMESTAMP, " .
        "timeUpdated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " .
        "subjectId INT NOT NULL, " .
        "subjectUnitName VARCHAR(255) NOT NULL, " .
        "subjectUnitValue INT NOT NULL, " .
        "UNIQUE KEY unique_subject_meta_unit (subjectId, subjectUnitName, subjectUnitValue), " .
        "FOREIGN KEY (subjectId) REFERENCES SubjectInformation(id) ON DELETE CASCADE"
    );

    createTable(
        "SubjectMetaPreReqs",
        "id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, " .
        "timeCreated DATETIME DEFAULT CURRENT_TIMESTAMP, " .
        "timeUpdated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " .
        "subjectId INT NOT NULL, " .
        "subjectPreRequisiteId INT NOT NULL, " .
        "CONSTRAINT unique_data_viceversa UNIQUE (subjectId, subjectPreRequisiteId), ".
        "UNIQUE KEY unique_subject_prerequisite (subjectId, subjectPreRequisiteId), " .
        "FOREIGN KEY (subjectId) REFERENCES SubjectInformation(id) ON DELETE CASCADE, " .
        "FOREIGN KEY (subjectPreRequisiteId) REFERENCES SubjectInformation(id) ON DELETE CASCADE"
    );

    // new table for student and subjects to take , data of student

    createTable(
        "StudentSubjects",
        "id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, " .
        "timeCreated DATETIME DEFAULT CURRENT_TIMESTAMP, " .
        "timeUpdated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " .
        "studentId INT NOT NULL, " .
        "subjectId INT NOT NULL, " .
        "academicYear VARCHAR(20) NOT NULL, " .
        "academicSemester VARCHAR(20) NOT NULL, " .
        "status VARCHAR(255) NOT NULL DEFAULT 'Passed', " .
        "grade DECIMAL(3,2) NOT NULL DEFAULT 0, " .
        "sortOrder INT NOT NULL, " .
        "priority INT NOT NULL DEFAULT 1, " . // local priority
        "UNIQUE KEY unique_user_subject (studentId, subjectId), " .
        "FOREIGN KEY (studentId) REFERENCES Students(id) ON DELETE CASCADE, " .
        "FOREIGN KEY (subjectId) REFERENCES SubjectInformation(id) ON DELETE CASCADE"
    );

    createTable(
        "SubjectRelations",
        "id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, " .
        "timeCreated DATETIME DEFAULT CURRENT_TIMESTAMP, " .
        "timeUpdated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " .
        "academicYear VARCHAR(20) NOT NULL, " .
        "academicSemester VARCHAR(20) NOT NULL, " .
        "subjectId INT NOT NULL, " .
        "schoolId INT NOT NULL, " .
        "courseId INT NOT NULL, " .
        "UNIQUE KEY unique_user_subject (academicYear, academicSemester, subjectId, schoolId, courseId), " .
        "FOREIGN KEY (subjectId) REFERENCES SubjectInformation(id) ON DELETE CASCADE, " .
        "FOREIGN KEY (schoolId) REFERENCES Schools(id) ON DELETE CASCADE, " .
        "FOREIGN KEY (courseId) REFERENCES Courses(id) ON DELETE CASCADE"
    );

    createTable(
        "StudentUnitsAllocation",
        "id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, " .
        "timeCreated DATETIME DEFAULT CURRENT_TIMESTAMP, " .
        "timeUpdated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " .
        "studentId INT NOT NULL, " .
        "academicYear VARCHAR(20) NOT NULL, " .
        "academicSemester VARCHAR(20) NOT NULL, " .
        "maxUnits INT NOT NULL, " .
        "UNIQUE KEY unique_user_max_load (studentId, academicYear, academicSemester), " .
        "FOREIGN KEY (studentId) REFERENCES Students(id) ON DELETE CASCADE"
    );

    createTable(
        "SchoolCourseUnitAllocation",
        "id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, " .
        "timeCreated DATETIME DEFAULT CURRENT_TIMESTAMP, " .
        "timeUpdated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " .
        "schoolId INT NOT NULL, " .
        "courseId INT NOT NULL, " .
        "academicYear VARCHAR(20) NOT NULL, " .
        "academicSemester VARCHAR(20) NOT NULL, " .
        "maxUnits INT NOT NULL, " .
        "UNIQUE KEY unique_user_max_load (schoolId, courseId, academicYear, academicSemester, maxUnits), " .
        "FOREIGN KEY (schoolId) REFERENCES Schools(id) ON DELETE CASCADE, " .
        "FOREIGN KEY (courseId) REFERENCES Courses(id) ON DELETE CASCADE"
    );
}
