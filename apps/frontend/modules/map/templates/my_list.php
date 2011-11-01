<div id="places">
    <table class="places_list">
      <?php foreach ($places as $i => $place): ?>
        <tr class="<?php echo fmod($i, 2) ? 'even' : 'odd' ?>">
          <td class="id">
            <?php echo $place->getId() ?>
          </td>
          <td class="category">
            <?php echo $place->getCategory() ?>
          </td>
          <td class="lat">
            <?php echo $place->getLat()  ?>
          </td>
          <td class="lat">
            <?php echo $place->getLng()  ?>
          </td>
          <td class="description">
            <?php echo $place->getDescription()  ?>
          </td>
          <td class="create_at">
            <?php echo $place->getCreatedAt('Y-m-d H:i:s')  ?>
          </td>
        </tr>
      <?php endforeach; ?>
    </table>
</div>
