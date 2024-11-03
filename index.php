<?php
include("./prod.php");
include("./constants.php");
include("./dom.php");
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Study Plan</title>
  <!-- FOR PROD USAGE, if local, use local files -->
  <?php if ($isProduction) { ?>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link href="https://cdn.datatables.net/v/dt/dt-2.0.6/datatables.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
  <?php } else { ?>
    <link href="/css/bootstrap-icons-1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
    <link href="/css/bootstrap-5.3.3-dist/bootstrap.min.css" rel="stylesheet">
    <link href="/DataTables/datatables.min.css" rel="stylesheet">
  <?php } ?>

  <link href="/css/main.css" rel="stylesheet">
  <link href="/css/sidebar.css" rel="stylesheet">
</head>

<body>
  <?php
  include("./db_contexts.php");
  initConnection();
  initRequiredTables();
  include("./redirector.php");
  ?>
  <?php
  applyConstantsToJs();
  ?>
  <?php if ($isProduction) { ?>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js" integrity="sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.11.8/umd/popper.min.js" integrity="sha512-TPh2Oxlg1zp+kz3nFA0C5vVC6leG/6mm1z9+mA81MI5eaUVqasPLO8Cuk4gMF4gUfP5etR73rgU/8PNMsSesoQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/js/bootstrap.min.js" integrity="sha512-ykZ1QQr0Jy/4ZkvKuqWn4iF3lqPZyij9iRv6sGqLRdTPkY69YX6+7wvVGmsdBbiIfN/8OdsI7HABjvEok6ZopQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js" integrity="sha512-r22gChDnGvBylk90+2e/ycr3RVrDi8DIOkIGNhJlKfuyQM4tIRAI062MaV8sfjQKYVGjOBaZBOA87z+IhZE9DA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdn.datatables.net/v/dt/dt-2.0.6/datatables.min.js"></script>
  <?php } else { ?>
    <script src="/js/sweetalert2.11/sweetalert2@11.js"></script>
    <script src="/js/popper-js/popper.min.js"></script>
    <script src="/js/bootstrap-5.3.3-dist/bootstrap.bundle.min.js"></script>
    <script src="/DataTables/datatables.min.js"></script>
    <script src="/js/sheetjs/xlsx.full.min.js"></script>
  <?php } ?>

  <script src="/js/notifications.js"></script>
  <script src="/js/main.js"></script>
  <script src="/js/view_model.js"></script>
  <script src="/js/automation.js"></script>
  <script src="/js/events.js"></script>
  <script src="/js/utils.js"></script>
  <script src="/js/sheet_parser.js"></script>
  <script src="/js/page_selector.js"></script>
  <script src="/js/tests.js"></script>
</body>

</html>