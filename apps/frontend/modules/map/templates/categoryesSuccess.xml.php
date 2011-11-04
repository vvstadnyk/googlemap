<?php echo '<?xml version="1.0" encoding="utf-8"?>'?>
<categoryes>
<?php foreach ($categoryes as $category): ?>
  <category id="<?php echo $category->getId()?>">
    <id><?php echo $category->getId()?></id>
    <name><?php echo $category->getName()?></name>
  </category>
<?php endforeach; ?>
</categoryes>