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
      if ($request->isXmlHttpRequest()) {
         $this->places = array();
         foreach (PlacePeer::getPlaces() as $place) {
                 $this->places[$place->getId()] = $place->asArray();
         }
      }
  }

  public function executeDelete(sfWebRequest $request)
  {
      if ($request->isXmlHttpRequest()) {
          $place = $this->getRoute()->getobject();

          if ($place->getUserId() == $this->getUser()->getGuardUser()->getId()) {
              $place->delete();
              $this->setTemplate('save');
          } else
          {
              $this->forward404();
          }
      }

  }

public function executeNew(sfWebRequest $request)
{
    if ($request->isXmlHttpRequest())
   {
       $place = new Place();
       $this->form = new PlaceForm($place);
   }
}

public function executeCreate(sfWebRequest $request)
{
    if ($request->isXmlHttpRequest())
    //   {
       $this->form = new PlaceForm();
       $this->processForm($request, $this->form);
    //   }
}

protected function processForm(sfWebRequest $request, sfForm $form)
{
  $form->bind(
      $request->getParameter($form->getName()),
      $request->getFiles($form->getName())
  );

  if ($form->isValid())
  {
      $form->save();
      $this->setTemplate('save');
  } else
  {
      $this->setTemplate('new');
  }
}

}
