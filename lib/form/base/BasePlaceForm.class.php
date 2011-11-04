<?php

/**
 * Place form base class.
 *
 * @method Place getObject() Returns the current form's model object
 *
 * @package    googlemap
 * @subpackage form
 * @author     Your name here
 */
abstract class BasePlaceForm extends BaseFormPropel
{
  public function setup()
  {
    $this->setWidgets(array(
      'id'          => new sfWidgetFormInputHidden(),
      'category_id' => new sfWidgetFormPropelChoice(array('model' => 'Category', 'add_empty' => false)),
      'user_id'     => new sfWidgetFormPropelChoice(array('model' => 'sfGuardUser', 'add_empty' => false)),
      'name'        => new sfWidgetFormInputText(),
      'lat'         => new sfWidgetFormInputText(),
      'lng'         => new sfWidgetFormInputText(),
      'created_at'  => new sfWidgetFormDateTime(),
      'description' => new sfWidgetFormInputText(),
    ));

    $this->setValidators(array(
      'id'          => new sfValidatorChoice(array('choices' => array($this->getObject()->getId()), 'empty_value' => $this->getObject()->getId(), 'required' => false)),
      'category_id' => new sfValidatorPropelChoice(array('model' => 'Category', 'column' => 'id')),
      'user_id'     => new sfValidatorPropelChoice(array('model' => 'sfGuardUser', 'column' => 'id')),
      'name'        => new sfValidatorString(array('max_length' => 100)),
      'lat'         => new sfValidatorNumber(),
      'lng'         => new sfValidatorNumber(),
      'created_at'  => new sfValidatorDateTime(array('required' => false)),
      'description' => new sfValidatorString(array('max_length' => 255, 'required' => false)),
    ));

    $this->widgetSchema->setNameFormat('place[%s]');

    $this->errorSchema = new sfValidatorErrorSchema($this->validatorSchema);

    parent::setup();
  }

  public function getModelName()
  {
    return 'Place';
  }


}
