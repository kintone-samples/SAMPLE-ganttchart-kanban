/*
 * echarts sample program
 * Copyright (c) 2025 Cybozu
 *
 * Licensed under the MIT License
 * https://opensource.org/license/mit/
 */

import React, {useEffect} from 'react';
import 'gantt-task-react/dist/index.css';
import {Task, ViewMode, Gantt} from 'gantt-task-react';
import {ViewSwitcher} from './GanttViewSwitcher';
import {AppRecord, getRecords, updateDate} from '../KintoneAppRepository';
import {Spin, Result} from 'antd';
import './app.css';

// ガントチャートのコンポーネントを定義する
const GanttCharts = ({query = ''}) => {
  // ガントチャートのview、tasks、画面のローディング状態の情報を保管する
  const [view, setView] = React.useState<ViewMode>(ViewMode.Day);
  const [tasks, setTasks] = React.useState<Task[]>();
  const [isLoading, setLoading] = React.useState<boolean>(true);

  // 各ViewModeのガントチャートのcolumnの幅を指定する
  let columnWidth = 60;
  if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  // ガントチャートから、タスクの「開始日付」「完了日付」を調整した場合、変更された日付をレコードに更新する
  const onTaskChange = (task: Task) => {
    const start = new Date(task.start.getTime() - task.start.getTimezoneOffset() * 60 * 1000)
      .toISOString()
      .split('T')[0];
    const end = new Date(task.end.getTime() - task.end.getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0];
    updateDate(task.id, start, end);
  };

  // ガントチャートからタスクをダブルクリックするとき、タスクの詳細画面に遷移する
  const onDblClick = (task: Task) => {
    const url =
      window.location.protocol + '//' + window.location.host + window.location.pathname + 'show#record=' + task.id;
    window.location.assign(url.replaceAll('showshow', 'show'));
  };

  // 初回描画時に、ガントチャートに表示するためのレコードを取得する
  useEffect(() => {
    getRecords(display, query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const display = (records: AppRecord[], status: Map<string, number>, type: Map<string, string>) => {
    // 取得したレコードが0件の場合、画面のローディングを停止する
    if (records.length === 0) {
      setLoading(false);
    } else {
      // 0件以上のレコードを取得した場合、取得したデータをガントチャート表示用に整形して返却する
      setTasks(
        records.map<Task>((record) => {
          return {
            id: record.$id.value,
            name: record.summary.value,
            start: new Date(record.startDate.value! + 'T00:00:00.000+09:00'),
            end: new Date(record.endDate.value! + 'T23:59:59.000+09:00'),
            progress: Math.ceil(((status.get(record.status.value!) || 0) * 100) / Math.max(status.size - 1, 1)),
            styles: {progressColor: type.get(record.type.value!) || '#ff9e0d', progressSelectedColor: '#ff9e0d'},
            dependencies: record.parent.value ? [record.parent.value] : [],
            type: 'task',
            // isDisabled: true,
          };
        }),
      );
    }
  };

  let content;
  // 0件以上のレコードを取得できた場合に表示する、ガントチャートの要素を定義する
  if (tasks && tasks.length > 0) {
    content = (
      <div>
        <ViewSwitcher onViewModeChange={(viewMode) => setView(viewMode)} />
        <Gantt
          tasks={tasks}
          viewMode={view}
          onDateChange={onTaskChange}
          onDoubleClick={onDblClick}
          listCellWidth="155px"
          columnWidth={columnWidth}
          todayColor="#FCFF19"
        />
      </div>
    );
    // レコードのデータを取得できるまでに表示する、ローディング画面の要素を定義する
  } else if (isLoading) {
    content = (
      <div className="center">
        <Spin size="large" tip="Loading..." />
      </div>
    );
    // レコードのデータを取得できなかった場合に表示する、「no data」画面の要素を定義する
  } else {
    content = <Result title="No data" />;
  }

  // content要素を返却する
  return <>{content}</>;
};

export default GanttCharts;
