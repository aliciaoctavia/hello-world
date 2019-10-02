<?php

  error_reporting(E_ERROR | E_PARSE | E_CORE_ERROR | E_COMPILE_ERROR | E_RECOVERABLE_ERROR);
  //error_reporting(E_ALL);
  //error_reporting(E_ALL & ~E_NOTICE);

  $mtime = microtime();
  $mtime = explode(' ', $mtime);
  $mtime = $mtime[1] + $mtime[0];
  $starttime = $mtime;

  require_once(__DIR__.'/vendor/autoload.php');
  require_once(__DIR__.'/application/settings.php');
  require_once(__DIR__.'/application/common.php');

  ini_set('session.name', SESSION_NAME);

  session_init();

  ob_start();

  trace(sprintf("-------------------- %s", server('REQUEST_URI')));

  $post_back = is_post_back();
  $double_post_back = is_double_post_back();

  // trace("post_back:$post_back");
  // trace("double_post_back:$double_post_back");
  // trace(sprintf("session_id:%s", session_id()));

  $router = new Router();
  $registry = new Registry();
  $registry->template = new Template();

  $router->route($registry);

  // trace(sprintf("apc_exists:%s", function_exists('apc_exists')));
  // trace(sprintf("apc_fetch:%s", function_exists('apc_fetch')));
  // trace(sprintf("apc_store:%s", function_exists('apc_store')));

  $g_user = null;
  $g_authenticated = false;
  $g_pagename = strtolower(basename($_SERVER['SCRIPT_FILENAME']));
  $g_uri = $_SERVER['REQUEST_URI'];

  //header("Cache-Control: private");
  //header("Content-Type: text/html");

  // test sms-58


