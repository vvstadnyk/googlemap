<?php use_javascript('http://maps.google.com/maps/api/js?sensor=false') ?>
<?php use_javascript('jquery.js') ?>
<?php use_javascript('jquery.alerts.js') ?>
<?php use_stylesheet('jquery.alerts.css') ?>
<?php use_javascript('maps.js') ?>
<?php include_partial('map/list', array('places' => $places)) ?>
<div id="map"></div>