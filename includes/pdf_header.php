<?php
// includes/pdf_header.php
?>
<!DOCTYPE html>
<html lang="pt-br" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório Weboost</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="/assets/css/style.css">
    <style>
        /* Estilos específicos para a impressão/PDF */
        body {
            background-color: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
        }
        .container-fluid {
            padding: 0 !important;
        }
        #viewContent {
            display: block !important; /* Garante que o conteúdo seja exibido */
            margin: 0 auto;
            padding: 1rem;
        }
        @media print {
            body {
                margin: 0;
                padding: 0;
            }
            .custom-pdf-header, .custom-pdf-footer {
                position: fixed;
                width: 100%;
                font-size: 10px;
                color: #6c757d;
            }
            .custom-pdf-header {
                top: 0;
                text-align: center;
                border-bottom: 1px solid #dee2e6;
                padding-bottom: 5px;
            }
            .custom-pdf-footer {
                bottom: 0;
                text-align: center;
                border-top: 1px solid #dee2e6;
                padding-top: 5px;
            }
        }
    </style>
</head>
<body class="pdf-view">

<div class="custom-pdf-header">
    <p>Relatório Confidencial - Weboost</p>
</div>

<div class="container-fluid">
    <main id="main" class="main">
