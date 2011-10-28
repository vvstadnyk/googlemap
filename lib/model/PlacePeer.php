<?php


/**
 * Skeleton subclass for performing query and update operations on the 'place' table.
 *
 * 
 *
 * This class was autogenerated by Propel 1.4.2 on:
 *
 * Thu Oct 27 21:15:30 2011
 *
 * You should add additional methods to this class to meet the
 * application requirements.  This class will only be generated as
 * long as it does not already exist in the output directory.
 *
 * @package    lib.model
 */
class PlacePeer extends BasePlacePeer {

    static public function getPlacesByUser($user_id)
    {
        $criteria = new Criteria();
        $criteria->add(PlacePeer::USER_ID, $user_id);
        return self::doSelect($criteria);
    }
    static public function getCountPlacesByUser($user_id)
    {
        $criteria = new Criteria();
        $criteria->add(PlacePeer::USER_ID, $user_id);
        return self::doCount($criteria);
    }
} // PlacePeer
