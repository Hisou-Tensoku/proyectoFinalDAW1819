<?php

require '../classes/autoload.php';
require '../classes/vendor/autoload.php';

$db = new framework\databases\DoctrineDB();
$gestor = $db->getEntityManager();

$userobj = $this->getModel()->getUsuario(1);
$metodopago = $this->getModel()->get
$ctg = new framework\dbobjects\Categoria();
$ctg -> setNombre('tacón');
$gestor->persist($ctg);
$gestor->flush();