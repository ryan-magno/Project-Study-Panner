<div class="container p-3">
    <p>Do you want to save this entry?</p><br>
    <form id="form-student-confirm">
        <div class="input-group mb-3">
            <span class="input-group-text">Name</span>
            <input type="text" name="fullName" class="form-control" value="${firstName} ${middleName} ${lastName}" readonly>
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text">Year</span>
            <input type="text" name="educationYear" class="form-control" value="${educationYearTextContent}" readonly>
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text">School</span>
            <input type="text" name="school" class="form-control" value="${schoolTextContent}" readonly>
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text">Course</span>
            <input type="text" name="course" class="form-control" value="${courseTextContent}" readonly>
        </div>
    </form>
</div>