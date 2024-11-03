const { createServer } = require("http");
const { jsPDF } = require("jspdf");
const fs = require("fs");
const autoTable = require("jspdf-autotable");

const express = require("express");
const { off, exit } = require("process");
const app = express();
const hostname = "127.0.0.1";
const port = 3000;

// jspdf position const
const tablePageOneInitialPos = 55;
const tableAfterPageOneInitialPos = 15;

// express middleware
app.use(express.json());

app.listen(port, function () {
    console.log(`Express server listening on http://${hostname}:${port}/`);
});

app.get("/", function (req, res) {
    console.log("GET Established!");
    res.send({ message: "Nework ok!"});
});

app.post("/", function (req, res) {
    console.log("POST Established!");
    res.send({ message: "Nework ok!"});
});

app.get("/pdf", function (req, res) {
    console.log("Ok!");
    res.send("Ok!");
});

app.post("/pdf", function (req, res) {
    let data = req.body;
    console.log(data);
    let filename = createPdf(data);
    try {
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${filename}"`
        );
        res.setHeader("Content-Type", "application/pdf");

        // Stream the PDF file as the response
        let rs = fs.createReadStream(filename);
        rs.on("open", function () {
            rs.pipe(res);
            fs.unlinkSync(filename);
        });
    } catch (error) {
        res.send();
        console.log(error.message);
    }
});

function createPdf(dataInformation = null) {
    let filename = null;
    if (dataInformation == null) {
        return null;
    }
    const studentName = dataInformation.studentName;
    const school = dataInformation.school;
    const course = dataInformation.course;
    const educationYear = dataInformation.educationYear;
    const subjects = dataInformation.subjects;
    const maxUnits = dataInformation.maxUnits;

    const doc = new jsPDF();
    const COLUMN_HEADER = [
        "Subject Number",
        "Subject Code",
        "Subject Description",
        "Units",
        "Pre-requisite",
    ];

    // prevent multi-user collision?
    // use uuid
    let randomString = generateRandomText(15);
    filename = `${randomString}.pdf`;
    let textAlign = 15;

    doc.setFontSize(11);
    doc.setTextColor(51, 51, 51);

    let posY = 20;
    let posX = 15;
    doc.setFont("helvetica", "bold");
    doc.text("Student Name: ", posX, posY);
    doc.text("School: ", posX, posY + 6);
    doc.text("Course: ", posX, posY + 12);
    doc.text("Year: ", posX, posY + 18);

    posX = 45;
    doc.setFont("helvetica", "normal");
    doc.text(studentName, posX, posY);
    doc.text(school, posX, posY + 6);
    doc.text(course, posX, posY + 12);
    doc.text(educationYear, posX, posY + 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.line(195, 45, 15, 45);

    doc.setFont("helvetica", "bold");
    let data = {
        newPage: true,
        lastHeight: tablePageOneInitialPos,
    };

    for (let keyYear in subjects) {
        for (let keySemester in subjects[keyYear]) {
            let arrData = subjects[keyYear][keySemester];
            let headerText = `Year ${keyYear} Semester ${keySemester}`;
            let maxUnit = maxUnits[keyYear][keySemester];
            let arrTableBody = [];
            for (let i = 0; i < arrData.length; i++) {
                let dataSubject = arrData[i];
                
                let subjectPrerequisites = dataSubject.subjectPrerequisites != null ? dataSubject.subjectPrerequisites : "-";
                let arrBuildFromDataSubject = [
                    dataSubject.subjectNumber,
                    dataSubject.subjectCode,
                    dataSubject.subjectDescription,
                  {
                    content: dataSubject.subjectUnit,
                    styles: { halign: 'center' }
                  },
                  {
                    content: subjectPrerequisites,
                    styles: { halign: 'center' }
                  },
                ];
                arrTableBody.push(arrBuildFromDataSubject);
            }
            console.log("maxunit: ", maxUnit);
            arrTableBody.push([
                  {
                    // FIXME: sayang sa data transfer at max Units lanh nsman ang need
                    content: `Max Units: ${maxUnit[0].maxUnits}`,
                    colSpan: 5,
                    styles: {
                      fontStyle: "bold",
                      fillColor: [51, 51, 51],
                      textColor: [255, 255, 255],
                    },
                  },
            ]);
            data = generateAutotable(doc, headerText, arrTableBody, data);
        }
    }
    doc.save(filename);
    return filename;
}

function generateAutotable(doc = null, headerTitle = "Table", arrTableBody, data) {
    console.log(headerTitle + " lastHeight " + data.lastHeight);
    const COLUMN_HEADER = [
        "Subject Number",
        "Subject Code",
        "Subject Description",
        "Units",
        "Pre-requisite",
    ];
    let mutData = {
        newPage: data.newPage,
        lastHeight: data.lastHeight,
    };
    let textAlign = 15;
    let offset = 5;
    let startY = null;
    if (data.newPage) {
        startY = data.lastHeight;
        offset = -2;
        data.newPage = false;
    }

    doc.text(headerTitle, textAlign, data.lastHeight + offset);
    doc.autoTable({
        startY: startY,
        head: [COLUMN_HEADER],
        body: arrTableBody,
        margin: { top: 10 },
        styles: {
            minCellHeight: 9,
            halign: "left",
            valign: "middle",
            fontSize: 11,
        },
        headStyles: {
            fillColor: [51, 24, 107],
        },
        didDrawPage: function (callbackData) {
            console.log("cursor: " + callbackData.cursor.y);
            callbackData.cursor.y += 16;
            mutData.lastHeight = callbackData.cursor.y;
        },
    });

    if (mutData.lastHeight >= 200) {
        console.log("break page");
        doc.addPage();
        mutData = {
            newPage: true,
            lastHeight: tableAfterPageOneInitialPos,
        };
    }

    return mutData;
}

function generateRandomText(length) {
    const charset =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomText = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        randomText += charset.charAt(randomIndex);
    }

    return randomText;
}
