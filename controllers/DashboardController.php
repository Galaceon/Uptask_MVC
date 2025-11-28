<?php

namespace Controllers;

use Model\Proyecto;
use Model\Usuario;
use MVC\Router;

class DashboardController {
    public static function index(Router $router) {
        // Iniciar sesión y validar el usuario
        session_start();
        isAuth();

        // Obtener los proyectos del usuario autenticado
        $id = $_SESSION['id'];
        $proyectos = Proyecto::belongsTo('propietarioId', $id);

        $router->render('dashboard/index', [
            'titulo' => 'Proyectos',
            'proyectos' => $proyectos
        ]);
    }


    public static function crear_proyecto(Router $router) {
        // Iniciar sesión y validar el usuario
        session_start();
        isAuth();

        // Necesitamos $alertas, ya que la vista las utiliza al mostrar el formulario
        $alertas = [];


        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Crear una nueva instancia de Proyecto
            $proyecto = new Proyecto($_POST);

            // validación
            $alertas = $proyecto->validarProyecto();

            if(empty($alertas)) {
                // Generar una URL única
                $proyecto->url = md5(uniqid());

                // Almacenar el creador del proyecto
                $proyecto->propietarioId = $_SESSION['id'];

                // Guardar el proyecto
                $proyecto->guardar();

                // Redireccionar
                header('Location: /proyecto?url=' . $proyecto->url);
            }

        }

        $router->render('dashboard/crear-proyecto', [
            'alertas' => $alertas,
            'titulo' => 'Crear Proyecto'
        ]);
    }

    public static function proyecto(Router $router) {
        // Iniciar sesión y validar el usuario
        session_start();
        isAuth();

        // Validar la URL por GET para obtener el proyecto actual
        $url = $_GET['url'];

        // Redireccionar si no hay proyecto
        if(!$url) header('Location: /dashboard');

        // Revisar que el visitante de un proyecto sea quien lo creó
        $proyecto = Proyecto::where('url', $url);
        if($proyecto->propietarioId !== $_SESSION['id']) {
            header('Location: /dashboard');
        }

        $router->render('dashboard/proyecto', [
            'titulo' => $proyecto->proyecto
        ]);
    }

    public static function perfil(Router $router) {
        // Iniciar sesión y validar el usuario
        session_start();
        isAuth();
        $alertas = [];

        $usuario = Usuario::find($_SESSION['id']);

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $usuario->sincronizar($_POST);

            $alertas = $usuario->validar_perfil();

            if(empty($alertas)) {
                $existeUsuario = Usuario::where('email', $usuario->email);

                if($existeUsuario && $existeUsuario->id !== $usuario->id) {
                    // Mostrar un mensaje de error
                    Usuario::setAlerta('error', 'Email no válido, cuenta ya registrada');
                    $alertas = $usuario->getAlertas();
                } else {
                    // Guardar el registro
                    // Guardar el usuario
                    $usuario->guardar();

                    Usuario::setAlerta('exito', 'Guardado correctamente');
                    $alertas = $usuario->getAlertas();

                    // Asignar el nombre nuevo a la barra
                    $_SESSION['nombre'] = $usuario->nombre;
                }
            } 
        }

        $router->render('dashboard/perfil', [
            'titulo' => 'Perfil',
            'usuario' => $usuario,
            'alertas' => $alertas
        ]);
    }


    public static function cambiar_password(Router $router) {
        session_start();
        isAuth();
        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $usuario = Usuario::find($_SESSION['id']);

            // Sincronizar con los datos de Usuario
            $usuario->sincronizar($_POST);

            $alertas = $usuario->nuevo_password();

            if(empty($alertas)) {
                $resultado = $usuario->comprobar_password();

                if($resultado) {
                    //Borrar password anterior y propiedades no necesarias
                    $usuario->password = $usuario->password_nuevo;
                    unset($usuario->password_actual);
                    unset($usuario->password_nuevo);

                    // Hashear password
                    $usuario->hashPassword();

                    // Actualizar usuario en DB
                    $resultado = $usuario->guardar();

                    if($resultado) {
                        Usuario::setAlerta('exito', 'Password Guardado Correctamente');
                        $alertas = $usuario->getAlertas();
                    }

                } else {
                    Usuario::setAlerta('error', 'Password Actual Incorrecto');
                    $alertas = $usuario->getAlertas();
                }
            }

        }

        $router->render('dashboard/cambiar-password', [
            'titulo' => 'Cambiar Contraseña',
            'alertas' => $alertas
        ]);
    }
}