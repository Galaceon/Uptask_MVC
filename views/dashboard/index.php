<?php include_once __DIR__ . '/header-dashboard.php'; ?>

    <?php if(count($proyectos) === 0) { ?>
        <p class="no-proyectos">No hay Proyectos aún</p>
        <div class="crear-proyecto-boton">
            <a href="/crear-proyecto" class="crear-proyecto">Crea tu primer Proyecto</a>
        </div>
    <?php } else { ?>
        <ul class="listado-proyectos">
            <?php foreach($proyectos as $proyecto) { ?>
                <li class="proyecto">
                    <a href="/proyecto?url=<?php echo $proyecto->url; ?>">
                        <?php echo $proyecto->proyecto ?>
                    </a>
                </li>
            <?php } ?>
        </ul>
    <?php } ?>

<?php include_once __DIR__ . '/footer-dashboard.php'; ?>