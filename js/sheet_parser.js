// Create data prediction based on
// heuristic approach
const PRE_DEFINED_HEADERS_NUMERICAL = [
    ["1st", "first"],
    ["2nd", "second"],
    ["3rd", "third"],
    ["4th", "fourth"],
    ["5th", "fifth"],
    ["6th", "sixth"],
    ["7th", "seventh"],
    ["8th", "eighth"],
    ["9th", "ninth"],
];
const PRE_DEFINED_HEADERS_ACADEMY = [
    ["year", "yr"],
    ["semester"],
    ["semestre"],
    ["summer"],
    ["bridge"],
];
const PRE_DEFINED_PATTERNS = [
    ["string", "string", "string", "number"],
    ["string", "string", "number"], // most common
    // ["number", "string", "string", "number"],
];

const PRE_DEFINED_PATTERNS_NATIVE = [
    ["n", "s", "s", "n"],
    ["s", "s", "s", "n"],
    ["s", "s", "n"], // most common
    ["s", "s", "s"],
    ["n", "s", "s"],
];

function parseCurriculumsData(file = []) {
    const CELL_END = XLSX.utils.decode_range(file["!ref"]).e;

    let arrPredictedHeader = [];
    let arrPredictedContent = []; // will be used last if header data unreliable

    for (let row = 0; row < CELL_END.r; row++) {
        let valueCounter = 0;
        let cellValue = null;

        let arrCell = [];
        for (let col = 0; col < CELL_END.c; col++) {
            let encodeCell = XLSX.utils.encode_cell({
                c: col,
                r: row,
            });

            cellValue = file[encodeCell];

            if (cellValue && cellValue.t === "s") {
                let cell = XLSX.utils.encode_cell({ c: col, r: row });
                arrCell.push(cell);
                valueCounter++;
            }
        }

        if (valueCounter == 0) continue;
        let encodedRow = XLSX.utils.encode_row(row);
        let identity =
            valueCounter >
            Math.min(...PRE_DEFINED_HEADERS_NUMERICAL.map((el) => el.length))
                ? "data"
                : "header";
        // push header array
        if (identity !== "header") {
            arrCell.forEach((value) => {
                arrPredictedContent.push(value);
            });
        } else {
            arrCell.forEach((value) => {
                arrPredictedHeader.push(value);
            });
        }
    }

    /// VERIFY data prediction
    let objVerifiedHeader = {};
    let arrHeaderCollection = [];
    PRE_DEFINED_HEADERS_NUMERICAL.forEach((data) => {
        data.forEach((data2) => {
            arrHeaderCollection.push(data2);
        });
    });

    PRE_DEFINED_HEADERS_ACADEMY.forEach((data) => {
        data.forEach((data2) => {
            arrHeaderCollection.push(data2);
        });
    });

    arrPredictedHeader.forEach((data, index) => {
        let cellValue = file[data].w;

        // whatever matches, is verified as header
        arrHeaderCollection.forEach((data2) => {
            let cellValueLowerCase = cellValue.toLowerCase();
            if (cellValueLowerCase.match(data2)) {
                objVerifiedHeader[data] = file[data].w;
            }
        });
    });

    // VERIFY 2ND PASS
    // with context
    let objVerifiedHeader2 = {};
    for (key in objVerifiedHeader) {
        let arrVerify = [];
        PRE_DEFINED_HEADERS_ACADEMY.forEach((data) => {
            data.forEach((data2) => {
                if (data2 == "summer") {
                    let cellValue = objVerifiedHeader[key].toLowerCase();
                    if (cellValue.match("summer"))
                        arrVerify.push(sentenceCaseExclude("summer"));
                    return;
                }
                if (data2 == "bridge") {
                    let cellValue = objVerifiedHeader[key].toLowerCase();
                    if (cellValue.match("bridge"))
                        arrVerify.push(sentenceCaseExclude("bridge"));
                    return;
                }
                PRE_DEFINED_HEADERS_NUMERICAL.forEach((dataNumerical) => {
                    dataNumerical.forEach((dataNumerical2) => {
                        let word = dataNumerical2 + " " + data2;
                        // fix summer entry
                        let cellValue = objVerifiedHeader[key].toLowerCase();
                        if (cellValue.match(word))
                            arrVerify.push(sentenceCaseExclude(word));
                    });
                });
            });
        });
        if (arrVerify.length != 0) objVerifiedHeader2[key] = arrVerify;
    }

    // ROW STRUCTURE
    let objRowStructure = {};
    // Get row structures and its (meta) data
    for (let row = 0; row < CELL_END.r; row++) {
        let arrStructure = [];
        let arrA1Notation = [];
        let arrCellValue = [];
        let encodedRow = XLSX.utils.encode_row(row);

        for (let col = 0; col < CELL_END.c; col++) {
            let a1NotationDecoded = { c: col, r: row };
            let a1NotationEncoded = XLSX.utils.encode_cell(a1NotationDecoded);

            let cellValue = file[a1NotationEncoded];
            let filteredArray = [];
            // check if row is merged
            if (file["!merges"]) {
                filteredArray = file["!merges"].filter(
                    (el) =>
                        el.s.c == a1NotationDecoded.c &&
                        el.s.r == a1NotationDecoded.r
                );
                if (filteredArray.length != 0) {
                    // jump
                    col = filteredArray[0].e.c;
                }
            }

            // a1 notation store
            if (filteredArray.length == 0) {
                arrA1Notation.push(a1NotationEncoded);
            } else {
                let a1NotationRange = XLSX.utils.encode_range(filteredArray[0]);
                arrA1Notation.push(a1NotationRange);
            }

            // store a1 notation

            if (cellValue && cellValue.t) {
                arrStructure.push(cellValue.t);
                arrCellValue.push(cellValue.v);
            } else {
                arrStructure.push(null);
                arrCellValue.push(null);
            }
        }

        objRowStructure[encodedRow] = {
            structures: arrStructure,
            a1Notations: arrA1Notation,
            cellValues: arrCellValue,
        };
    }

    // optimize objRowStructure
    // you can skip this part if you want to but
    // this line of code trims all unecessary data before
    // reprocessing data on next pass
    // console.log(objRowStructure);

    // PASS 1
    let objDataContent = {};
    Object.keys(objRowStructure).forEach((key) => {
        let isAllNull = true;
        objRowStructure[key].structures.forEach((value) => {
            if (value != null) {
                isAllNull = false;
                return;
            }
        });
        if (!isAllNull) {
            objDataContent[key] = objRowStructure[key];
        }
    });

    // PASS 2
    // match on defined patterns above
    let objDataContent2 = {};
    Object.keys(objDataContent).forEach((key) => {
        let value = objDataContent[key];
        let valueStructure = value.structures;
        let structureLength = Math.min(
            ...PRE_DEFINED_PATTERNS_NATIVE.map((el) => el.length)
        );

        // do not include data with less than pattern length
        // para makasave ng memory + less intindihin sa code
        // later on
        if (valueStructure.length < structureLength) return;
        objDataContent2[key] = value;
    });

    // FIXME: verify these
    //tmpExpose = objVerifiedHeader2;

    // PASS 3: pseudo-machine learning part
    // check structure and rank based on significance
    let memory = {};
    let objDataContent3 = {};
    Object.keys(objDataContent2).forEach((key) => {
        let value = objDataContent2[key];
        let valueCell = objDataContent2[key].cellValues;
        let valueStructure = value.structures;
        let valueNotation = value.a1Notations;

        for (let i = 0; i < valueStructure.length; i++) {
            let isOutofBounds = false;
            for (let j = 0; j < PRE_DEFINED_PATTERNS_NATIVE.length; j++) {
                let nativePattern = PRE_DEFINED_PATTERNS_NATIVE[j];
                let isMatched = true;

                // check for bounds first!
                isOutofBounds =
                    nativePattern.length - 1 + i > valueStructure.length;
                if (isOutofBounds) continue;

                nativePattern.forEach((patternValue, patternIndex) => {
                    if (!isMatched) return; // i cant break, so i do these instead
                    let structureType = valueStructure[i + patternIndex];
                    if (structureType == null) {
                        isMatched = false;
                        return;
                    }
                    isMatched = patternValue == structureType;
                    if (!isMatched) return;
                });

                if (!isMatched) continue;

                // store
                objDataContent3[key] = value;

                // machine learning timeee...
                // give weighs to column that is significant
                // to certain values
                for (let k = 0; k < nativePattern.length; k++) {
                    let expectedCellValueType = valueCell[i + k].toString();
                    let result = parseInt(expectedCellValueType);
                    let iterator = result > 0 ? -1 : 1;

                    let patternA1Notation = valueNotation[i + k];
                    let patternRange =
                        XLSX.utils.decode_range(patternA1Notation);

                    for (
                        let ptnCol = patternRange.s.c;
                        ptnCol <= patternRange.e.c;
                        ptnCol++
                    ) {
                        let encodedPtnCol = XLSX.utils.encode_col(ptnCol);
                        if (memory[encodedPtnCol] != null) {
                            memory[encodedPtnCol] += iterator;
                        } else {
                            memory[encodedPtnCol] = 0;
                        }
                    }
                }

                i += nativePattern.length - 1;
                break;
            }
        }
    });

    // PASS 4
    // passing the data
    // sample
    //     let tmp = {
    //         year: {
    //             semester:{
    //                 ['curriculum'];
    //             }
    //         },
    //         summer: {

    //         }
    //     };

    let objCurriculum = {};
    Object.keys(objDataContent3).forEach((key) => {
        let value = objDataContent3[key];
        let arrTypes = value.structures;
        let valueNotation = value.a1Notations;

        let horizontalIndexing = 0;
        let offset = 0;

        for (let i = 0; i < arrTypes.length; i++) {
            offset = i;
            let isOutofBounds = false;
            let isMatched = false;
            let nativePattern = null;
            let selectedPatternIndex = 0;

            for (let j = 0; j < PRE_DEFINED_PATTERNS_NATIVE.length; j++) {
                nativePattern = PRE_DEFINED_PATTERNS_NATIVE[j];
                if (isMatched) break;

                // check for source structure bounds
                isOutofBounds =
                    nativePattern.length - 1 + offset > arrTypes.length;
                if (isOutofBounds) continue;

                // check all data of array if match
                var matchCount = 0;
                nativePattern.forEach((nativeType, nativeIndex) => {
                    let sourceType = arrTypes[offset + nativeIndex];
                    if (sourceType == nativeType) {
                        matchCount++;
                    }
                });

                isMatched = matchCount == nativePattern.length;
                selectedPatternIndex = j;
            }

            if (!isMatched) continue;

            // parse subjects
            let objSubject = {};

            let dataIndexSubjectNumber = null;
            let dataIndexSubjectCode = null;
            let dataIndexSubjectDescription = null;
            let dataIndexSubjectUnits = null;

            let dataA1NotationSubjectNumber = null;
            let dataA1NotationSubjectCode = null;
            let dataA1NotationSubjectDescription = null;
            let dataA1NotationSubjectUnits = null;

            let dataSubjectNumber = null;
            let dataSubjectCode = null;
            let dataSubjectDescription = null;
            let dataSubjectUnits = null;

            // put index on vars
            switch (selectedPatternIndex) {
                case 0:
                case 1:
                    dataIndexSubjectNumber = i + 0;
                    dataIndexSubjectCode = i + 1;
                    dataIndexSubjectDescription = i + 2;
                    dataIndexSubjectUnits = i + 3;
                    break;
                case 2:
                    dataIndexSubjectNumber = null;
                    dataIndexSubjectCode = i + 0;
                    dataIndexSubjectDescription = i + 1;
                    dataIndexSubjectUnits = i + 2;
                    break;
                case 3:
                case 4:
                    dataIndexSubjectNumber = i + 0;
                    dataIndexSubjectCode = i + 1;
                    dataIndexSubjectDescription = i + 2;
                    dataIndexSubjectUnits = null;
                    break;
            }

            // put a1 notation on vars
            dataA1NotationSubjectNumber = customGetA1Column(
                value,
                dataIndexSubjectNumber
            );
            dataA1NotationSubjectCode = customGetA1Column(
                value,
                dataIndexSubjectCode
            );
            dataA1NotationSubjectDescription = customGetA1Column(
                value,
                dataIndexSubjectDescription
            );
            dataA1NotationSubjectUnits = customGetA1Column(
                value,
                dataIndexSubjectUnits
            );

            // data
            dataSubjectNumber = value.cellValues[dataIndexSubjectNumber];
            dataSubjectCode = value.cellValues[dataIndexSubjectCode];
            dataSubjectDescription =
                value.cellValues[dataIndexSubjectDescription];
            dataSubjectUnits = value.cellValues[dataIndexSubjectUnits];

            // data verified
            dataSubjectNumber = validateInputOnTrainingSet(
                memory,
                dataSubjectNumber,
                dataA1NotationSubjectNumber
            );
            dataSubjectCode = validateInputOnTrainingSet(
                memory,
                dataSubjectCode,
                dataA1NotationSubjectCode
            );
            dataSubjectDescription = validateInputOnTrainingSet(
                memory,
                dataSubjectDescription,
                dataA1NotationSubjectDescription
            );
            dataSubjectUnits = validateInputOnTrainingSet(
                memory,
                dataSubjectUnits,
                dataA1NotationSubjectUnits
            );

            // sanitize
            if (
                dataSubjectNumber &&
                dataSubjectCode &&
                dataSubjectDescription
            ) {
                dataSubjectNumber = dataSubjectNumber.toString().trim();
                dataSubjectCode = dataSubjectCode.toString().trim();
                dataSubjectDescription = dataSubjectDescription.toString().trim();

                dataSubjectNumber = dataSubjectNumber.replace(
                    /[\ ][\ ][\ ]*/,
                    " "
                );
                dataSubjectCode = dataSubjectCode.replace(/[\ ][\ ][\ ]*/, " ");
                dataSubjectDescription = dataSubjectDescription.replace(
                    /[\ ][\ ][\ ]*/,
                    " "
                );
            }

            objSubject = {
                subjectNumber: dataSubjectNumber,
                subjectCode: dataSubjectCode,
                subjectDescription: dataSubjectDescription,
                subjectUnit: dataSubjectUnits,
            };

            let splittedYear = null;
            let splittedSem = null;

            // get year and semester data
            // get nearest header
            let root = XLSX.utils.decode_cell(valueNotation[i].split(":")[0]);

            // recursive checking
            let academicYear = null;
            let academicSem = null;
            let attemptCount = 0;

            while (root.r - attemptCount >= 0) {
                if (academicYear != null && academicSem != null) break;

                let nearestHeader = nearestHeaderRow(
                    objVerifiedHeader2,
                    root.r,
                    attemptCount * -1
                );

                let possibleHeader = objVerifiedHeader2[nearestHeader];

                possibleHeader.forEach((value, index) => {
                    if (
                        possibleHeader.length > horizontalIndexing &&
                        horizontalIndexing != 0 &&
                        horizontalIndexing != index
                    )
                        return;
                    if (
                        academicYear == null &&
                        value.toLowerCase().match("year")
                    ) {
                        academicYear = value;
                    }
                    if (
                        academicSem == null &&
                        value.toLowerCase().match("semester")
                    ) {
                        academicSem = value;
                    }
                    if (
                        academicSem == null &&
                        value.toLowerCase().match("summer")
                    ) {
                        academicSem = value;
                    }
                    if (
                        academicSem == null &&
                        value.toLowerCase().match("bridge")
                    ) {
                        academicSem = value;
                    }
                });

                attemptCount++;
            }

            let isHeader = checkIfHeaderArray([
                dataSubjectNumber,
                dataSubjectCode,
                dataSubjectDescription,
                dataSubjectUnits,
            ]);

            if (!isHeader) {
                if (academicYear != null && academicSem != null) {
                    // check if header

                    splittedYear = academicYear.split(" ")[0];
                    splittedSem = academicSem.trim().split(" ")[0];

                    // convert to numerical value
                    splittedYear = stringToNumericalValue(splittedYear);
                    splittedSem = stringToNumericalValue(splittedSem);

                    if (!objCurriculum[splittedYear]) {
                        objCurriculum[splittedYear] = {};
                    }
                    if (!objCurriculum[splittedYear][splittedSem]) {
                        objCurriculum[splittedYear][splittedSem] = [];
                        objCurriculum[splittedYear][splittedSem].push(
                            objSubject
                        );
                    } else {
                        objCurriculum[splittedYear][splittedSem].push(
                            objSubject
                        );
                    }
                }
            }

            i += nativePattern.length - 1;
            horizontalIndexing++;
        }
    });

    return objCurriculum;
}

function nearestHeaderRow(objectData = {}, row = -1, offset = 0) {
    let nearestTopHeaderRowEncoded = null;
    let nearestTopHeaderRowDecoded = null;
    let nearestRow = null;

    // put all keys into array of vars
    let arrKeyNumber = Object.keys(objectData).map(
        (el) => XLSX.utils.decode_cell(el).r
    );

    Object.keys(objectData).forEach((key) => {
        // key consist of A1 notation (e.g. A1)
        const keyToCell = XLSX.utils.decode_cell(key);

        if (
            nearestRow == null ||
            (row >= keyToCell.r && nearestRow <= keyToCell.r)
        ) {
            nearestRow = keyToCell.r;
            nearestTopHeaderRowEncoded = key;
            nearestTopHeaderRowDecoded = keyToCell.r;
        }
    });

    if (offset != 0) {
        nearestTopHeaderRowEncoded = nearestHeaderRow(
            objectData,
            nearestTopHeaderRowDecoded + offset
        );
    }

    return nearestTopHeaderRowEncoded;
}

function sentenceCaseExclude(sentence) {
    const excludedWords = new Set(["in", "the", "on", "at", "of", "if"]);

    return sentence.toLowerCase().replace(/\w\S*/g, function (word) {
        return excludedWords.has(word.toLowerCase())
            ? word.toLowerCase()
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
}

function stringToNumericalValue(input) {
    let returnValue = null;
    let inputValue = input.toLowerCase();

    switch (inputValue) {
        case "first":
        case "1st":
            returnValue = 1;
            break;
        case "second":
        case "2nd":
            returnValue = 2;
            break;
        case "third":
        case "3rd":
            returnValue = 3;
            break;
        case "fourth":
        case "4th":
            returnValue = 4;
            break;
        case "fifth":
        case "5th":
            returnValue = 5;
            break;
        case "sixth":
        case "6th":
            returnValue = 6;
            break;
        case "seventh":
        case "7th":
            returnValue = 7;
            break;
        case "eighth":
        case "8th":
            returnValue = 8;
            break;
        case "ninth":
        case "9th":
            returnValue = 9;
            break;
        case "summer":
            returnValue = "Summer";
            break;
        case "bridge":
            returnValue = "Bridge";
            break;
    }

    return returnValue;
}

function validateInputOnTrainingSet(memory, data, dataCol) {
    // memory with lower than 0 means number
    let returnValue = null;
    let validatedData = null;
    if (data == null) return returnValue;
    if (dataCol == null) return returnValue;

    let isExpectedAsNumber = memory[dataCol] < 0;
    if (isExpectedAsNumber) {
        validatedData = data.toString().replace(/[^0-9]*/, "");
        validatedData = parseInt(validatedData);
    } else if (typeof data == "string" && data.length != 0) {
        validatedData = data.toString();
    }

    returnValue = validatedData;
    return returnValue;
}

function checkIfHeader(data) {
    // TODO: fix parameters
    if (!data || typeof data != "string") return false;
    if (data.toLowerCase().match(/subj.*num/)) return true;
    if (data.toLowerCase().match(/subj.*code/)) return true;
    if (data.toLowerCase().match(/subj.*desc/)) return true;
    if (data.toLowerCase().match(/subj.*unit/)) return true;
    if (data.toLowerCase().match(/ourse.*code/)) return true;
    if (data.toLowerCase().trim().match("/^lab$")) return true;
    if (data.toLowerCase().trim().match("^class$")) return true;
    if (data.toLowerCase().trim().match("^units$")) return true;
    if (data.toLowerCase().trim().match("^total$")) return true;
}

function checkIfHeaderArray(arr = []) {
    let isHeader = false;
    arr.forEach((data) => {
        if (!isHeader) {
            isHeader = checkIfHeader(data);
        }
    });

    return isHeader;
}

function customGetA1Column(arrParam, arrIndex) {
    if (arrParam == null || arrIndex == null) return null;
    let returnValue = XLSX.utils.decode_cell(
        arrParam.a1Notations[arrIndex].split(":")[0]
    ).c;
    returnValue = XLSX.utils.encode_col(returnValue);
    return returnValue;
}

/// Utils
function getStringByRegex(sheet = {}, regex = "", split = "", splitIndex = 1) {
    let returnValue = null;
    let value = null;

    for (key in sheet) {
        // if invalid A1 notation, skip
        if (!sheet[key].w) continue;
        // here im checking possible relevance of string to source
        var strValueInLowerCase = String(sheet[key].w).toLowerCase();
        if (regex.test(strValueInLowerCase)) {
            value = strValueInLowerCase;
            value = sentenceCaseExclude(value);
            value = value.trim();

            if (splitIndex > -1 && split.length != 0) {
                value = split + value.split(split)[splitIndex];
            }
            break;
        }
    }

    returnValue = value;
    return returnValue;
}
