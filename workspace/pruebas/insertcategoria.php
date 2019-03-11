<?php

require '../classes/autoload.php';
require '../classes/vendor/autoload.php';

$db = new framework\databases\DoctrineDB();
$gestor = $db->getEntityManager();
$ctg = new framework\dbobjects\Categoria();
$ctg -> setNombre('tacón');
$gestor->persist($ctg);
$gestor->flush();