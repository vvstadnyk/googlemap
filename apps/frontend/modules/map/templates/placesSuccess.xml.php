<?php echo '<?xml version="1.0" encoding="utf-8"?>'?>
<places>
<?php foreach ($places as $id => $place): ?>
  <place id="<?php echo $id?>">
    <?php foreach ($place as $key => $value): ?>
        <<?php echo $key?>><?php echo $value?></<?php echo $key?>>
    <?php endforeach; ?>
  </place>
<?php endforeach; ?>
</places>