/*
 * echarts sample program
 * Copyright (c) 2025 Cybozu
 *
 * Licensed under the MIT License
 * https://opensource.org/license/mit/
 */

import React, { useEffect } from 'react'
import Board from 'react-trello'
import { AppRecord, getRecords, updateStatus } from '../KintoneAppRepository'
import { AntdCard, KCard } from './Card'
import { Spin, Result } from 'antd'
import './app.css'

// カンバンのコンポーネントを定義する
const Kanban = () => {
  // カンバンに表示するレコードのデータ、画面のローディング状態の情報を保管する
  const [data, setData] = React.useState<ReactTrello.BoardData>()
  const [isLoading, setLoading] = React.useState<boolean>(true)

  const display = (records: AppRecord[], status: Map<string, number>, type: Map<string, string>) => {
    // 取得したレコードが0件の場合、画面のローディングを停止する
    if (records.length === 0) {
      setLoading(false)
    } else {
      // 0件以上のレコードを取得した場合、カンバンのカードを配置するlaneの配列を生成する
      const lanes = new Array(status.size)
      // 取得したステータスごとに、laneをセットする
      status.forEach((v, k) => {
        lanes[v] = {
          id: k,
          title: k,
          cards: new Array<KCard>(),
        }
      })
      // 取得したデータをカンバンのカード表示用に整形し、該当ステータスのlaneに渡す
      records.forEach((record) =>
        lanes[status.get(record.status.value!)!].cards!.push({
          id: record.$id.value,
          title: record.summary.value,
          label: record.type.value!,
          labelColor: type.get(record.type.value!),
          description: record.detail.value,
          assignee: record.assignee,
          startDate: record.startDate.value!,
          endDate: record.endDate.value!,
        }),
      )
      // 整形済みのデータを返却する
      setData({ lanes })
    }
  }

  // 初回描画時の処理
  useEffect(() => {
    // カンバンに表示するためにレコードを取得し、取得したデータを処理する
    getRecords(display, kintone.app.getQueryCondition() || undefined)
  }, [])

  // カンバンのカードがクリックされた場合、該当カードのレコードの詳細画面を開く処理
  const onCardClick = (cardId: string) => {
    const url =
      window.location.protocol + '//' + window.location.host + window.location.pathname + 'show#record=' + cardId
    window.location.assign(url)
  }

  // カードがドラッグされた場合、ドラッグの動作が完了後、レコードのステータスを更新する処理
  const handleDragEnd = (cardId: string, _sourceLandId: string, targetLaneId: string) => {
    updateStatus(cardId, targetLaneId)
  }

  let content
  // レコードのデータを取得できた場合に表示する、カンバンの要素を定義する
  if (data) {
    content = (
      <Board
        data={data}
        draggable
        onCardClick={onCardClick}
        hideCardDeleteIcon
        handleDragEnd={handleDragEnd}
        style={{ padding: '30px 20px', backgroundColor: '#5F9AF8' }}
        components={{ Card: AntdCard }}
      />
    )
    // レコードのデータを取得できるまでに表示する、ローディング画面の要素を定義する
  } else if (isLoading) {
    content = (
      <div className="center">
        <Spin size="large" tip="Loading..." />
      </div>
    )
  } else {
    content = <Result title="No data" />
  }

  // content要素を返却する
  return <>{content}</>
}
export default Kanban
