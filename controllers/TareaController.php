<?php

namespace Controllers;

use Model\Proyecto;
use Model\Tarea;
use MVC\Router;

class TareaController {
    // Llamado al entrar en esta URL: /api/tareas?url=proyecto-url
    // Retorna las tareas de un proyecto específico para que el cliente las consuma vía fetch
    public static function index() {
        session_start();

        $proyectoId = $_GET['url'];
        if(!$proyectoId) header('Location: /dashboard');

        $proyecto = Proyecto::where('url', $proyectoId);
        if(!$proyecto || $proyecto->propietarioId !== $_SESSION['id']) header('Location: /404');

        $tareas = Tarea::belongsTo('proyectoId', $proyecto->id);
        
        echo json_encode(['tareas' => $tareas]);
    }

    // Llamado al entrar en esta URL: /api/tareas (POST)
    // Crea una nueva tarea en un proyecto específico
    public static function crear() {
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            session_start();

            $proyectoId = $_POST['proyectoId'];
            $proyecto = Proyecto::where('url', $proyectoId);

            if(!$proyecto || $proyecto->propietarioId !== $_SESSION['id']) {
                $respuesta = [
                    'tipo' => 'error',
                    'mensaje' => 'Hubo un error al agregar la tarea',
                    'animacion' => true
                ];
                echo json_encode($respuesta);
                return;
            };

            // Comportamiento esperado, instanciar y crear la tarea en DB
            $tarea = new Tarea($_POST);
            $tarea->proyectoId = $proyecto->id;
            $resultado = $tarea->guardar();
            $respuesta = [
                'tipo' => 'exito',
                'id' => $resultado['id'],
                'mensaje' => 'Tarea Creada Correctamente',
                'proyectoId' => $proyecto->id,
                'animacion' => true
            ];
            echo json_encode($respuesta);
        }
    }

    // Llamado al entrar en esta URL: /api/tarea/actualizar
    // Se entra a la URL al pulsar el button de tarea pendiente/completa
    public static function actualizar() {
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Validar que el proyecto exista
            $proyecto = Proyecto::where('url', $_POST['proyectoId']);
            session_start();

            if(!$proyecto || $proyecto->propietarioId !== $_SESSION['id']) {
                $respuesta = [
                    'tipo' => 'error',
                    'mensaje' => 'Hubo un error al agregar la tarea',
                    'animacion' => true
                ];
                echo json_encode($respuesta);
                return;
            };

            $tarea = new Tarea($_POST);
            // Cambiamos el proyectoId(ej: 362df952acc95f722137c0d6e93f1ab8) por el id real del proyecto(ej: 6)
            $tarea->proyectoId = $proyecto->id; 

            $resultado = $tarea->guardar();
            if($resultado) {
                $respuesta = [
                    'tipo' => 'exito',
                    'id' => $tarea->id,
                    'proyectoId' => $proyecto->id,
                    'mensaje' => 'Actualizado correctamente',
                    'animacion' => true
                ];
                echo json_encode(['respuesta' => $respuesta]);
            }
        }
    }

    
    public static function eliminar() {
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Validar que el proyecto exista
            $proyecto = Proyecto::where('url', $_POST['proyectoId']);
            session_start();

            if(!$proyecto || $proyecto->propietarioId !== $_SESSION['id']) {
                $respuesta = [
                    'tipo' => 'error',
                    'mensaje' => 'Hubo un error al agregar la tarea',
                    'animacion' => true
                ];
                echo json_encode($respuesta);
                return;
            };

            $tarea = New Tarea($_POST);
            $resultado = $tarea->eliminar();

            $resultado = [
                'resultado' => $resultado,
                'mensaje' => 'Eliminado Correctamente',
                'tipo' => 'exito',
                'animacion' => true
            ];
            
            echo json_encode($resultado);

        }
    }
}