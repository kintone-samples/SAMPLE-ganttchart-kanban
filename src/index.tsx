/*
 * react sample program
 * Copyright (c) 2025 Cybozu
 *
 * Licensed under the MIT License
 * https://opensource.org/license/mit/
 */

import React from 'react';
import {createRoot} from 'react-dom/client';
import {AppSwitcher} from './components/App';
import GanttCharts from './components/GanttCharts';
import AddSub from './components/AddSub';

interface KintoneEvent {
  record: kintone.types.SavedFields
}

const roots = new Map<HTMLElement, ReturnType<typeof createRoot>>();

// 指定された DOM 要素に React コンポーネントをマウントする
function renderReactComponent(container: HTMLElement, element: React.ReactElement) {
  let root = roots.get(container);
  if (!root) {
    root = createRoot(container);
    roots.set(container, root);
  }
  root.render(element);
}

// レコード一覧のメニューの右側の空白部分の要素に、ガントチャート、カンバンを切り替えるボタンを表示する
kintone.events.on('app.record.index.show', (event: KintoneEvent) => {
  const headerMenuSpaceElement = kintone.app.getHeaderMenuSpaceElement();
  if (!headerMenuSpaceElement) return event;
  renderReactComponent(headerMenuSpaceElement, <AppSwitcher />);
  return event;
});

// レコード詳細画面のメニューの上側の空白部分の要素に、該当レコードの関連する親子タスクのガントチャートを表示する
kintone.events.on('app.record.detail.show', (event: KintoneEvent) => {
  let query = `parent = ${event.record.$id.value} or $id= ${event.record.$id.value}`;
  event.record.parent.value && (query += ` or $id = ${event.record.parent.value}`);

  const headerMenuSpaceElement = kintone.app.record.getHeaderMenuSpaceElement();
  if (!headerMenuSpaceElement) return event;
  renderReactComponent(headerMenuSpaceElement, <GanttCharts query={query} />);

  const addSubSpaceElement = kintone.app.record.getSpaceElement('addSub');
  if (!addSubSpaceElement) return event;
  renderReactComponent(addSubSpaceElement, <AddSub id={event.record.$id.value} />);

  return event;
});

// スペースフィールド「addSub」に設置した「add sub task」ボタンをクリックして、レコード追加画面を開いた場合、
// 親タスクのレコードidを、追加された子タスクのレコードの「親タスクID」フィールドに指定する
kintone.events.on('app.record.create.show', (event: KintoneEvent) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const pid = urlParams.get('pid');
  if (pid) {
    event.record.parent.value = pid;
  }
  return event;
});
