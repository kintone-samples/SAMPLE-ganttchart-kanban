/*
 * echarts sample program
 * Copyright (c) 2022 Cybozu
 *
 * Licensed under the MIT License
 * https://opensource.org/license/mit/
 */

import { KintoneRecordField } from '@kintone/rest-api-client'
import { Card, Avatar, Tag } from 'antd'
import React from 'react'

const { Meta } = Card

export interface KCard extends ReactTrello.DraggableCard {
  labelColor?: string
  assignee: KintoneRecordField.UserSelect
  startDate: string
  endDate: string
  onClick?: () => void
}

// カンバンのカードに表示する、タスク担当者のコンポーネントを定義する
const Avatars = (props: { assignee: KintoneRecordField.UserSelect }) => {
  // 要素の定義と返却
  return (
    <Avatar.Group
      maxCount={2}
      size="large"
      maxStyle={{
        color: '#f56a00',
        backgroundColor: '#fde3cf',
      }}
    >
      {props.assignee.value.map((element) => {
        return (
          <Avatar
            // src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            style={{
              backgroundColor: '#15dad2',
            }}
            key={element.code}
          >
            {element.name}
          </Avatar>
        )
      })}
    </Avatar.Group>
  )
}

// カンバンのカードのコンポーネントを定義する
export const AntdCard = (props: KCard) => {
  // 要素の定義と返却（React UI libraryのAnt Designのcard componentsを利用）
  return (
    <Card
      extra={<Tag color={props.labelColor}>{props.label}</Tag>}
      style={{ width: 300 }}
      title={props.title}
      onClick={props.onClick}
    >
      <Meta
        avatar={<Avatars assignee={props.assignee} />}
        title={`${props.startDate.substring(5)}~${props.endDate.substring(5)}`}
        description={props.description}
      />
    </Card>
  )
}
