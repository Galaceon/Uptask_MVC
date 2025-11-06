<?php 
    foreach($alertas as $key => $alerta):
        foreach($alerta as $mensaje):
            debuguear($key);
        ?>

            <div class="alerta <?php echo $key; ?>"><?php echo $mensaje; ?></div>

        <?php endforeach; ?>
    <?php endforeach; ?>