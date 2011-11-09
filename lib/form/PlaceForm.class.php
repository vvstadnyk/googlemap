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
      unset($this['created_at']);

      $this->widgetSchema['user_id'] = new sfWidgetFormInputHidden();
      $this->widgetSchema['name'] = new sfWidgetFormInputText();
      $this->widgetSchema['lat'] = new sfWidgetFormInputHidden();
      $this->widgetSchema['lng'] = new sfWidgetFormInputHidden();
      $this->widgetSchema['description'] = new sfWidgetFormTextarea();


      $this->validatorSchema['name'] = new sfValidatorString();
      $this->validatorSchema['lat'] = new sfValidatorNumber();
      $this->validatorSchema['lng'] = new sfValidatorNumber();
      $this->validatorSchema['description'] = new sfValidatorString(array('required' => false));

      $this->widgetSchema->setLabels(array(
        'category_id'    => 'Категорія',
        'name'           => 'Назва',
        'description'    => 'Примітки',
      ));

  }
}
