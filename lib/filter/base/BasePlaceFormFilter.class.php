<?php

/**
 * Place filter form base class.
 *
 * @package    googlemap
 * @subpackage filter
 * @author     Your name here
 */
abstract class BasePlaceFormFilter extends BaseFormFilterPropel
{
  public function setup()
  {
    $this->setWidgets(array(
      'category_id' => new sfWidgetFormPropelChoice(array('model' => 'Category', 'add_empty' => true)),
      'user_id'     => new sfWidgetFormPropelChoice(array('model' => 'sfGuardUser', 'add_empty' => true)),
      'lat'         => new sfWidgetFormFilterInput(array('with_empty' => false)),
      'lng'         => new sfWidgetFormFilterInput(array('with_empty' => false)),
      'created_at'  => new sfWidgetFormFilterDate(array('from_date' => new sfWidgetFormDate(), 'to_date' => new sfWidgetFormDate())),
      'description' => new sfWidgetFormFilterInput(),
    ));

    $this->setValidators(array(
      'category_id' => new sfValidatorPropelChoice(array('required' => false, 'model' => 'Category', 'column' => 'id')),
      'user_id'     => new sfValidatorPropelChoice(array('required' => false, 'model' => 'sfGuardUser', 'column' => 'id')),
      'lat'         => new sfValidatorSchemaFilter('text', new sfValidatorNumber(array('required' => false))),
      'lng'         => new sfValidatorSchemaFilter('text', new sfValidatorNumber(array('required' => false))),
      'created_at'  => new sfValidatorDateRange(array('required' => false, 'from_date' => new sfValidatorDate(array('required' => false)), 'to_date' => new sfValidatorDate(array('required' => false)))),
      'description' => new sfValidatorPass(array('required' => false)),
    ));

    $this->widgetSchema->setNameFormat('place_filters[%s]');

    $this->errorSchema = new sfValidatorErrorSchema($this->validatorSchema);

    parent::setup();
  }

  public function getModelName()
  {
    return 'Place';
  }

  public function getFields()
  {
    return array(
      'id'          => 'Number',
      'category_id' => 'ForeignKey',
      'user_id'     => 'ForeignKey',
      'lat'         => 'Number',
      'lng'         => 'Number',
      'created_at'  => 'Date',
      'description' => 'Text',
    );
  }
}
