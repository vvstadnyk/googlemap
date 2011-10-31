<?php

/**
 * map actions.
 *
 * @package    googlemap
 * @subpackage map
 * @author     Your name here
 * @version    SVN: $Id: actions.class.php 23810 2009-11-12 11:07:44Z Kris.Wallsmith $
 */
class mapActions extends sfActions
{
 /**
  * Executes index action
  *
  * @param sfRequest $request A request object
  */
  public function executeIndex(sfWebRequest $request)
  {
    $this->places = PlacePeer::getPlacesByUser($this->GetUserId());
  }

  public function executeSave(sfWebRequest $request)
  {
      if ($request->isXmlHttpRequest())
      {
          $place = new Place();
          $place->setUserId($this->GetUserId());
          $place->save();

          $this->places = PlacePeer::getPlacesByUser($this->GetUserId());
          return $this->renderPartial('map/list', array('places' => $this->places));

      }

      
  }

  private function GetUserId()
  {
      return $this->getUser()->getGuardUser()->getId();
  }
}
