<?php

require '../classes/autoload.php';
require '../classes/vendor/autoload.php';

$db = new framework\databases\DoctrineDB();
$gestor = $db->getEntityManager();

$dst = $gestor->find("framework\dbobjects\Destinatario", 1);
$ctg = $gestor->find("framework\dbobjects\Categoria", 1);

$zapato = new framework\dbobjects\Zapato();

$zapato->setDestinatario($dst);
$zapato->addCategoria($ctg);

$ctg->addZapato($zapato);

$zapato->setMarca('Naiki');
$zapato->setModelo('Flyknit Racer');
$zapato->setPpu(38.81);
$zapato->setColor('Multicolor');
$zapato->setDescripcion('Run');
$zapato->setCubierta('Flyknit');
$zapato->setForro('Flyknit');
$zapato->setSuela('Racer');
$gestor->persist($zapato);
$gestor->flush();