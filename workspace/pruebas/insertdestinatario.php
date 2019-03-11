<?php

require '../classes/autoload.php';
require '../classes/vendor/autoload.php';

$db = new framework\databases\DoctrineDB();
$gestor = $db->getEntityManager();
$dst = new framework\dbobjects\Destinatario();
$dst -> setNombre('hombre');
$gestor->persist($dst);
$gestor->flush();