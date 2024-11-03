<?php

$headersIgnore = array(
    "id", "timeCreated", "timeUpdated"
);

function createHtmlTableFromData(
    //$tableCaption ="",
    $tableHeader = array(), 
    $data = array(),
    $id = "",
    $hasSearch = true,
    $minify = false, 
    $actionRow = false, 
    $tableName = "",
    $customHeader = null)
{
    global $headersIgnore;

    $isIdEmpty = empty($id);

    // if ($hasSearch) {
    //     $randomId = bin2hex(random_bytes(8));
    //     echo '<div class="row justify-content-end mb-3">';
    //     echo '<div class="col-sm-3">';
    //     echo '<div class="form-floating">';
    //     echo '<input type="text" class="form-control" id="search-'. $id .'" placeholder="...">';
    //     echo '<label for="search-' . $id . '">Search for...</label>';
    //     echo '</div>';
    //     echo '</div>';
    //     echo '</div>';
    // }

    if ($isIdEmpty){
        echo '<table class="table table-striped caption-bottom">';
    } else {
        echo '<table class="table table-striped caption-bottom" id="'. $id .'">';
    }
    // echo '<caption>Total Entry Count: ' . count($data) . '</caption>';

    // header row
    echo '<thead>';
    echo "<tr>";

    $useHeader = array();

    if (isset($customHeader)) {
        $useHeader = $customHeader;
    } else {
        $useHeader = $tableHeader;
    }
    
    foreach ($useHeader as $header) {
        if ($minify) {
            if (in_array($header, $headersIgnore)) continue;
        }

        echo "<th>";
        echo $header;
        echo "</th>";
    }

    if ($actionRow) {
        echo "<th>";
        echo "Action";
        echo "</th>";
    }
    echo "</tr>";
    echo '</thead>';
    echo '<tbody>';

    // data row
    foreach ($data as $row) {
        echo "<tr>";
        foreach ($tableHeader as $header) {
            if ($minify) {
                if (in_array($header, $headersIgnore)) continue;
            }
            echo "<td>";
            echo "$row[$header]";
            echo "</td>";
        }

        if ($actionRow) {
            // delete
            $data = array(
                "id" => $row["id"],
                "table" => $tableName
            );

            echo "<td>";
            echo '<div class="d-flex">';
            
            // htmltags
            echo '<button class="edit-btn btn btn-primary">Edit</button>';
            echo '<p style="margin-right: 10px;"></p>';
            createHtmlButtonPost(
                'action.php?action=delete',
                $data,
                'Delete'
            );
           
            echo '</div>';
            echo "</td>";
        }
        echo "</tr>";
    }
    echo '</tbody>';

    echo "</table>";
}

function createHtmlButtonPost($url = "", $data = array(), $displayText = "") {
    echo '<form method="post" action="'. $url .'" class="form-inline sp-form-verify">';
    echo '<div class="form-group">';
    foreach ($data as $key => $value) {
        echo '<input type="hidden" class="form-control" name="'. $key .'" value="'. $value .'">';
    }

    echo '<button class="btn btn-danger" type="submit">'. $displayText .'</button>';
    echo '</div>';
    echo '</form>';
}

function createHtmlOptionsFromData($data = array(), $keyNameTexts = array(), $keyNameValue = "", $hasInnerText = true)
{
    $nameTextIndexCount = count($keyNameTexts) - 1;
    foreach ($data as $key => $value) {
        $dataText = '';
        $i = 0;

        foreach ($keyNameTexts as $keyNameText) {
            $item = $value[$keyNameText];
            if (!isset($item)) continue;
            $dataText .= $item;

            if ($i < $nameTextIndexCount) {
                // delimiter
                $dataText .= ' ';
            }
            $i++;
        }

        $dataValue = $value[$keyNameValue];

        createHtmlOption($dataText, $dataValue, $hasInnerText);
    }
}

function createHtmlOption($text = "", $value = "", $hasInnerText = true)
{
    echo "<option value=\"$value\">";
    if (!$hasInnerText) return;
    echo "$text";
    echo "</option>";
}

function generateTable($tableName = "", $id = "", $hasSearch = true, $withAction = false)
{
    $table = $tableName;
    $dataHeader = fetchColumnNamesFromTable($table);
    $dataValue = fetchDatasFromTable($table);
    if ($withAction) {
        createHtmlTableFromData($dataHeader, $dataValue, $id, $hasSearch, true, true, $table);
    } else {
        // verbose arguments (even if optional to do)
        createHtmlTableFromData($dataHeader, $dataValue, $id, $hasSearch, false, false, "");
    }
}

function generateTableCustomHeader($customHeader = array(), $tableName = "", $id = "", $hasSearch = true, $withAction = false)
{
    $table = $tableName;
    $dataHeader = fetchColumnNamesFromTable($table);
    $dataValue = fetchDatasFromTable($table);

    if ($withAction) {
        createHtmlTableFromData($dataHeader, $dataValue, $id, $hasSearch, true, true, $table, $customHeader);
    } else {
        // verbose arguments (even if optional to do)
        createHtmlTableFromData($dataHeader, $dataValue, $id, $hasSearch, false, false, "", $customHeader);
    }
}

function generateTableCustomHeaderInstantQuery($customHeader = array(), $tableName = "", $id = "", $hasSearch = true, $withAction = false, $query = "", $arrDbTargetRows = array())
{
    $table = $tableName;
    $dataHeader = $arrDbTargetRows;
    $dataValue = executeSelectInstant($query);

    if ($withAction) {
        createHtmlTableFromData($dataHeader, $dataValue, $id, $hasSearch, true, true, $table, $customHeader);
    } else {
        // verbose arguments (even if optional to do)
        createHtmlTableFromData($dataHeader, $dataValue, $id, $hasSearch, false, false, "", $customHeader);
    }
}
