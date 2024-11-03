<?php

// connection provider only
$conn = null;

function initConnection()
{
    $returnValue = false;

    $dbHost = 'localhost';
    $dbUsername = 'root';
    $dbPassword = '';
    $dbToUse = 'study_planner';

    $pdoQueryMysqliInit = "mysql:host=$dbHost;";

    try {
        $conn = new PDO($pdoQueryMysqliInit, $dbUsername, $dbPassword);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // echo "Connected successfully!<br>";

        // create database
        $queryCreateDatabase = "CREATE DATABASE IF NOT EXISTS $dbToUse;";
        $conn->exec($queryCreateDatabase);
        // echo "Database created and initialized!<br>";

        $returnValue = true;
    } catch (PDOException $e) {
        echo "Connection failed: " . $e->getMessage() . "";
    }

    return $returnValue;
}

function dbClose()
{
    global $conn;
    $conn = null;
}

function dbInit()
{
    $returnValue = null;

    $dbHost = 'localhost';
    $dbUsername = 'root';
    $dbPassword = '';
    $dbToUse = 'study_planner';

    $pdoQueryMysqliInitWithDb = "mysql:host=$dbHost;dbname=$dbToUse";

    try {
        $conn = null;
        $conn = new PDO($pdoQueryMysqliInitWithDb, $dbUsername, $dbPassword);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $returnValue = $conn;
    } catch (PDOException $e) {
        echo "Connection failed: " . $e->getMessage() . "";
    }

    return $returnValue;
}