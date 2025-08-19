import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import {Radio} from 'antd';
import GanttCharts from './GanttCharts';
import 'antd/dist/antd.css';
import Kanban from './Kanban';


export enum AppType {
  Gantt = 'Gantt',
  Board = 'Kanban',
}

// ガントチャート、カンバンを切り替えるボタンのコンポーネントを定義する
export const AppSwitcher = () => {
  // ボタンを押したときのハンドラ
  const onAppChange = (app: AppType) => {
    switch (app) {
      case AppType.Gantt:
        ReactDOM.render(
          // ガントチャートが選択された場合、レコード一覧のメニューの下側の空白部分の要素に、ガントチャートを表示する
          <GanttCharts query={kintone.app.getQueryCondition() || undefined} />,
          kintone.app.getHeaderSpaceElement(),
        );
        break;
      default:
        // デフォルトの表示として、レコード一覧のメニューの下側の空白部分の要素に、カンバンを表示する
        ReactDOM.render(<Kanban />, kintone.app.getHeaderSpaceElement());
    }
  };

  // 初回描画時に、カンバンの描画を実行する
  useEffect(() => {
    ReactDOM.render(<Kanban />, kintone.app.getHeaderSpaceElement());
  }, []);

  // 要素の定義と返却（React UI libraryのAnt Designのradio componentsを利用）
  return (
    <Radio.Group
      defaultValue={AppType.Board}
      buttonStyle="solid"
      size="large"
      onChange={(e) => onAppChange(e.target.value)}
    >
      <Radio.Button value={AppType.Gantt}>{AppType.Gantt}</Radio.Button>
      <Radio.Button value={AppType.Board}>{AppType.Board}</Radio.Button>
    </Radio.Group>
  );
};
