<?php
include("./modify_dom.php");

$page = isset($_GET["page"]) ? $_GET["page"] : "    ";

switch ($page) {
    default:
        include('./html/main.php');
        break;
}