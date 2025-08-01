import React from 'react';
import {Button, Tooltip} from 'antd';
import {PlusCircleTwoTone} from '@ant-design/icons';

// 子タスクを追加するボタンのコンポーネントを定義する
const AddSub = ({id = ''}) => {
  // ボタンを押したときのハンドラ
  const onClick = () => {
    if (id) {
      const url = window.location.protocol + '//' + window.location.host + window.location.pathname + 'edit?pid=' + id;
      window.location.assign(url.replaceAll('showedit', 'edit'));
    }
  };
  // 要素の定義と返却
  return (
    <Tooltip title="add sub task">
      <Button type="primary" shape="circle" icon={<PlusCircleTwoTone />} size="large" onClick={onClick} />
    </Tooltip>
  );
};

export default AddSub;
