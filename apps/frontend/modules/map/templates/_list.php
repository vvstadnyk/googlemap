<div>count: <?php  echo PlacePeer::getCountPlacesByUser($sf_user->getGuardUser()->getId()) ?></div>
<table class="places">
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
      <td class="create_at">
        <?php echo $place->getCreatedAt('Y-m-d H:i:s')  ?>
      </td>
    </tr>
  <?php endforeach; ?>
</table>
