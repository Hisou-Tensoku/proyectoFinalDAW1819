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

$zapato->setMarca('adidas1');
$zapato->setModelo('kids1');
$zapato->setPpu(38.81);
$zapato->setColor('blanco1');
$zapato->setDescripcion('AYY LMAO1');
$zapato->setCubierta('sintético1');
$zapato->setForro('lana1');
$zapato->setSuela('cuero1');
$gestor->persist($zapato);
$gestor->flush();