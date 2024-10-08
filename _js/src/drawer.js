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

function openSidebar() {
  const sidebar = document.getElementById('_yDrawer');
  const scrim = document.querySelector('.y-drawer-scrim');

  // 사이드바와 스크림 활성화
  sidebar.style.pointerEvents = 'all';
  scrim.style.pointerEvents = 'all';
  scrim.style.opacity = '1';
}

function closeSidebar() {
  const sidebar = document.getElementById('_yDrawer');
  const scrim = document.querySelector('.y-drawer-scrim');

  // 사이드바와 스크림 비활성화
  sidebar.style.pointerEvents = 'none';
  scrim.style.pointerEvents = 'none';
  scrim.style.opacity = '0';
}

function addEventListeners(drawer) {
  window.drawer = drawer;

  const sidebar = document.getElementById('_yDrawer');
  const scrim = document.querySelector('.y-drawer-scrim');

  // 사이드바 외부 클릭 시 닫기
  document.addEventListener('click', function(event) {
    if (!sidebar.contains(event.target) && drawer.opened) {
      closeSidebar();  // 사이드바 닫기
    }
  });

  // 터치 이벤트로 외부 클릭 처리
  document.addEventListener('touchstart', function(event) {
    if (!sidebar.contains(event.target) && drawer.opened) {
      closeSidebar();  // 터치 시 사이드바 닫기
    }
  });

  // 사이드바 스크롤 처리: 스크롤 중에도 pointer-events 유지
  sidebar.addEventListener('scroll', function(event) {
    if (drawer.opened) {
      sidebar.style.pointerEvents = 'all';  // 스크롤 중에도 pointer-events 유지
      scrim.style.pointerEvents = 'all';    // 스크림도 활성화 유지
    }
  });

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
