<?php

/**
 * Place form.
 *
 * @package    googlemap
 * @subpackage form
 * @author     Your name here
 */
class PlaceForm extends BasePlaceForm
{
  public function configure()
  {
      unset($this['created_at'], $this['user_id']);
  }
}
