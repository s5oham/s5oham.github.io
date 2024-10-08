// Copyright (c) 2017 Florian Klampfer
// Licensed under MIT

/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import YDrawer from 'y-drawer/src/vanilla';

import { hasFeatures } from './common';

const REQUIREMENTS = [
  'eventlistener',
  'queryselector',
  'matchmedia',
  'requestanimationframe',
  'classlist',
  'opacity',
  'csstransforms',
  'csspointerevents',
  'cssremunit',
];

const MEDIA_QUERY = '(min-width: 54em)';

function resizeCallback() {
  const hasChanged = window.isDesktop !== window.matchMedia(MEDIA_QUERY).matches;
  if (hasChanged) {
    window.isDesktop = !window.isDesktop;
    window.drawer.persistent = window.isDesktop;
    window.drawer.jumpTo(window.isDesktop);
  }
}

function menuClickClallback(e) {
  if (!window.isDesktop) {
    e.preventDefault();
    window.drawer.toggle();
  }
}

function openSidebar() {
  const sidebar = document.getElementById('_yDrawer');
  sidebar.classList.add('opened');  // 사이드바 열림
}

function closeSidebar() {
  const sidebar = document.getElementById('_yDrawer');
  sidebar.classList.remove('opened');  // 사이드바 닫힘
}

// 닫기 버튼 클릭 시 사이드바 닫기
document.getElementById('closeSidebar').addEventListener('click', function() {
  closeSidebar();
});

// 메뉴 버튼 클릭 시 사이드바 열기
document.getElementById('_menu').addEventListener('click', function() {
  openSidebar();
});

function addEventListeners(drawer) {
  window.drawer = drawer;
  window.addEventListener('resize', resizeCallback);
  document.getElementById('_menu').addEventListener('click', menuClickClallback);
}

if (!window.disableDrawer && hasFeatures(REQUIREMENTS)) {
  window.isDesktop = window.matchMedia(MEDIA_QUERY).matches;
  const drawer = document.getElementById('_yDrawer');

  addEventListeners(new YDrawer(drawer, {
    opened: window.isDesktop,
    persistent: window.isDesktop,
    transitionDuration: 150,
  }));

  drawer.classList.add('loaded');
}
