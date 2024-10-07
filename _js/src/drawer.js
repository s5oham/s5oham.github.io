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

function addEventListeners(drawer) {
  window.drawer = drawer;
  window.addEventListener('resize', resizeCallback);
  document.getElementById('_menu').addEventListener('click', menuClickClallback);
  // 사이드바 외부 클릭 시 닫기 (모바일)
  document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('_yDrawer');
    if (!sidebar.contains(event.target) && !window.isDesktop && drawer.opened) {
      drawer.close();  // 사이드바 닫기
    }
  });
  // 터치 이동 시 닫기 (모바일)
  document.addEventListener('touchmove', function() {
    if (!window.isDesktop && drawer.opened) {
      drawer.close();  // 사이드바 닫기
    }
  });
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
