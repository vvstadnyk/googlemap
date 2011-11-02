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

  }

  public function executePlaces(sfWebRequest $request)
  {
      if ($request->isXmlHttpRequest())
     {
          $this->places = array();
          foreach (PlacePeer::getPlaces() as $palace)
          {
              $this->places[$palace->getId()] = $palace->asArray($this->GetUserId());
          }
     }
  }

public function executeCategoryes(sfWebRequest $request)
{
    if ($request->isXmlHttpRequest())
   {
        $this->categoryes = CategoryPeer::getCategoryes();
   }
}

  public function executeSave(sfWebRequest $request)
  {
      if ($request->isXmlHttpRequest())
      {
          $place = new Place();
          $place->setUserId($this->GetUserId());
          $place->setDescription($request->getParameter('description'));
          $place->setCategoryId($request->getParameter('category'));
          $place->setLat($request->getParameter('lat'));
          $place->setLng($request->getParameter('lng'));
          $place->setName($request->getParameter('name'));
          $place->save();
      }

      
  }

  private function GetUserId()
  {
      return $this->getUser()->getGuardUser()->getId();
  }
}
