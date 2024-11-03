<?php
// CRUD utils function impl.
include("./database.php");

function isDebug()
{
    return false;
}

function createTable($tableName = "", $tableColumns = "")
{
    $returnValue = false;
    $conn = dbInit();

    try {
        $query = "CREATE TABLE IF NOT EXISTS $tableName (" . $tableColumns . ");";
        $conn->exec($query);

        $returnValue = true;
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
        if (isDebug()) exit(1);
    }

    $conn = "";
    return $returnValue;
}

function fetchDatasFromTable($tableName = "", $orderBy = null)
{
    $returnValue = null;
    $conn = dbInit();

    try {
        $query = "SELECT * FROM $tableName";
        if (isset($orderBy)) {
            $query = "SELECT * FROM $tableName ORDER BY $orderBy";
        }
        $stmt = $conn->prepare($query);
        $stmt->execute();

        $results = $stmt->fetchAll(PDO::FETCH_BOTH);
        $returnValue = $results;
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage() . "<br>";
        if (isDebug()) exit(1);
    }

    $conn = "";
    return $returnValue;
}

function fetchColumnNamesFromTable($tableName = "")
{
    $returnValue = null;
    $conn = dbInit();

    try {
        $query = "SELECT * FROM $tableName LIMIT 1";
        $stmt = $conn->query($query);

        $columnTitles = array();
        $columnCount = $stmt->columnCount();
        for ($i = 0; $i < $columnCount; $i++) {
            $meta = $stmt->getColumnMeta($i);

            $columnTitles[] = $meta["name"];
        }

        $returnValue = $columnTitles;
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage() . "<br>";
        if (isDebug()) exit(1);
    }

    $conn = "";
    return $returnValue;
}

function fetchDataFromTableSpecific($tableName = "", $sqlRowArgs = array(), $sqlWhereArgs = array())
{
    $returnValue = null;
    $conn = dbInit();

    $placeholderWhere = "";
    $placeholderRows = "";

    // string parse
    $sqlArgsCount = count($sqlWhereArgs);
    $sqlArgsCountMinus1 = $sqlArgsCount - 1;

    $i = 0;
    foreach ($sqlWhereArgs as $key => $value) {
        $placeholderWhere .= "$key = :v$i";
        if ($sqlArgsCountMinus1 != $i) {
            $placeholderWhere .= " AND ";
        }

        $i++;
    }

    // sql row parse
    if ($sqlRowArgs != NULL && count($sqlRowArgs) != 0) {
        $sqlRowArgsCount = count($sqlRowArgs);
        $i = 0;
        foreach ($sqlRowArgs as $key => $value) {
            $placeholderRows .= "$value";
            $placeholderRows .= $i++ != ($sqlRowArgsCount - 1) ? ", " : "";
        }
    } else {
        $placeholderRows = "*";
    }

    try {
        $query = "SELECT $placeholderRows FROM $tableName WHERE $placeholderWhere";
        $stmt = $conn->prepare($query);

        $i = 0;

        foreach ($sqlWhereArgs as $key => $value) {
            $strVal = ":v$i";
            $stmt->bindParam($strVal, $sqlWhereArgs[$key]);
            $i++;
        }
        $i = 0;

        $stmt->execute();
        $returnValue = $stmt->fetchAll(PDO::FETCH_BOTH);
    } catch (PDOException $e) {
        // throw new PDOException($e);
    }
    $conn = "";
    return $returnValue;
}

function insertToTable($tableName = "", $sqlArgs = array())
{
    $returnValue = null;
    $conn = dbInit();

    $placeholderRows = "";
    $placeholderValues = "";

    $sanitizedSqlArgs = $sqlArgs;
    foreach ($sqlArgs as $key => $value) {
        if (isset($value)) {
            $sanitizedSqlArgs[$key] = $value;
        }
    }
    // string parse
    $sqlArgsCount = count($sanitizedSqlArgs);
    $sqlArgsCountMinus1 = $sqlArgsCount - 1;

    $latestId = -1;

    $i = 0;
    foreach ($sanitizedSqlArgs as $key => $value) {
        // skip rows if NULL
        if (isset($value)) {
            $sanitizedValue = htmlspecialchars($value);
            $sanitizedValue = trim($value);
            if (strlen($sanitizedValue . "") == 0) {
                $i++;
                continue;
            }
        }
        $placeholderRows .= "$key";
        $placeholderValues .= ":v$i";

        if ($sqlArgsCountMinus1 != $i) {
            $placeholderRows .= ", ";
            $placeholderValues .= ", ";
        }

        $i++;
    }

    try {
        $query = "INSERT INTO $tableName ($placeholderRows) VALUES ($placeholderValues);";
        $stmt = $conn->prepare($query);

        // bind parameter
        $i = 0;

        foreach ($sanitizedSqlArgs as $key => $value) {
            if (isset($value)) {
                $sanitizedValue = htmlspecialchars($value);
                $sanitizedValue = trim($value);
                if (strlen($sanitizedValue . "") == 0) {
                    continue;
                }
            }
            $strVal = ":v$i";
            $stmt->bindParam($strVal, $sanitizedSqlArgs[$key]);
            $i++;
        }

        $stmt->execute();
        $latestId = $conn->lastInsertId();
        $returnValue = $latestId;
    } catch (PDOException $e) {
        $returnValue = $e;
    }

    $conn = "";
    return $returnValue;
}

function deleteToTable($tableName = "", $sqlArgs = array())
{
    $returnValue = false;
    $conn = dbInit();

    $placeholderSection = "";

    // string parse
    $sqlArgsCount = count($sqlArgs);
    $sqlArgsCountMinus1 = $sqlArgsCount - 1;

    $i = 0;
    foreach ($sqlArgs as $key => $value) {
        $placeholderSection .= "$key = :v$i";
        if ($sqlArgsCountMinus1 != $i) {
            $placeholderSection .= " AND ";
        }
        $i++;
    }

    try {
        $query = "DELETE FROM $tableName WHERE $placeholderSection";
        $stmt = $conn->prepare($query);

        // bind parameter
        $i = 0;

        foreach ($sqlArgs as $key => $value) {
            $strVal = ":v$i";

            $stmt->bindParam($strVal, $sqlArgs[$key]);

            $i++;
        }
        $i = 0;

        $stmt->execute();
        $rowCount = $stmt->rowCount();

        echo "Successfully removed into $tableName! Rows affected: $rowCount";
        $returnValue = true;
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
        if (isDebug()) exit(1);
    }

    $conn = "";
    return $returnValue;
}

function executeRaw($query)
{
    try {
        $returnValue = null;
        $conn = dbInit();
        $returnValue = $conn->exec($query);
        $conn = "";
    } catch (PDOException $e) {
    }
    return $returnValue;
}

function executeSelectInstant($query, $fetchType = PDO::FETCH_BOTH)
{
    try {
        $returnValue = null;
        $conn = dbInit();
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $returnValue = $stmt->fetchAll($fetchType);
        $conn = "";
    } catch (PDOException $e) {
        return $e;
    }
    return $returnValue;
}
