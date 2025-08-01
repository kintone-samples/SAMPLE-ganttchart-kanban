/*
 * react sample program
 * Copyright (c) 2025 Cybozu
 *
 * Licensed under the MIT License
 * https://opensource.org/license/mit/
 */

import { KintoneRestAPIClient, KintoneRecordField, KintoneFormFieldProperty } from '@kintone/rest-api-client'
import stc from 'string-to-color'

// タスク管理アプリの型を定義する
export type AppRecord = {
  $id: KintoneRecordField.ID
  parent: KintoneRecordField.Number
  summary: KintoneRecordField.SingleLineText
  detail: KintoneRecordField.MultiLineText
  assignee: KintoneRecordField.UserSelect
  startDate: KintoneRecordField.Date
  endDate: KintoneRecordField.Date
  type: KintoneRecordField.Dropdown
  status: KintoneRecordField.Dropdown
}

export type AppProperty = {
  type: KintoneFormFieldProperty.Dropdown
  status: KintoneFormFieldProperty.Dropdown
}

// レコードを取得する処理
const getRecordsByApi = (query?: string) => {
  return new KintoneRestAPIClient().record.getRecords<AppRecord>({
    app: kintone.app.getId()!,
    query: `${query ? query : ''} order by $id asc`,
  })
}

// フォームの設定情報を取得する処理
const getFieldsByApi = () => {
  return new KintoneRestAPIClient().app.getFormFields<AppProperty>({ app: kintone.app.getId()! })
}

// 「ステータス」フィールドの情報を更新する処理
export const updateStatus = async (recordID: string, status: string) => {
  await new KintoneRestAPIClient().record.updateRecord({
    app: kintone.app.getId()!,
    id: recordID,
    record: {
      status: {
        value: status,
      },
    },
  })
}

// 「開始日付」「完了日付」フィールドの情報を更新する処理
export const updateDate = async (recordID: string, start: string, end: string) => {
  await new KintoneRestAPIClient().record.updateRecord({
    app: kintone.app.getId()!,
    id: recordID,
    record: {
      startDate: {
        value: start,
      },
      endDate: {
        value: end,
      },
    },
  })
}

// レコード、フォームの設定情報の取得を実行する処理
export const getRecords = async (
  cb: (records: AppRecord[], status: Map<string, number>, type: Map<string, string>) => void,
  query?: string,
) => {
  const [fields, list] = await kintone.Promise.all([getFieldsByApi(), getRecordsByApi(query)])
  const type = new Map()
  const status = new Map()
  // タスクのタイプの情報をtypeオブジェクトにセットする
  Object.keys(fields.properties.type.options).forEach((k) => {
    type.set(k, stc(k))
  })
  // タスクのステータスの情報をstatusオブジェクトに順番にセットする
  Object.keys(fields.properties.status.options).forEach((k) => {
    status.set(k, fields.properties.status.options[k].index)
  })
  cb(list.records, status, type)
}
