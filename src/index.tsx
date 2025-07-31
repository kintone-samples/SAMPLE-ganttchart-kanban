import React from 'react'
import { createRoot } from 'react-dom/client'
import { AppSwitcher } from './components/App'
import GanttCharts from './components/GanttCharts'
import AddSub from './components/AddSub'

interface KintoneEvent {
  record: kintone.types.SavedFields
}

const roots = new Map<HTMLElement, ReturnType<typeof createRoot>>()

function renderReactComponent(container: HTMLElement, element: React.ReactElement) {
  if (!roots.has(container)) {
    roots.set(container, createRoot(container))
  }
  roots.get(container)!.render(element)
}

kintone.events.on('app.record.index.show', (event: KintoneEvent) => {
  const headerMenuSpaceElement = kintone.app.getHeaderMenuSpaceElement()
  if(!headerMenuSpaceElement) return event
  renderReactComponent(headerMenuSpaceElement, <AppSwitcher />);
  return event
})

kintone.events.on('app.record.detail.show', (event: KintoneEvent) => {
  let query = `parent = ${event.record.$id.value} or $id= ${event.record.$id.value}`
  event.record.parent.value && (query += ` or $id = ${event.record.parent.value}`)
  
  const headerMenuSpaceElement = kintone.app.getHeaderMenuSpaceElement()
  if(!headerMenuSpaceElement) return event
  renderReactComponent(headerMenuSpaceElement, <GanttCharts query={query} />)

  const addSubSpaceElement = kintone.app.record.getSpaceElement('addSub')
  if(!addSubSpaceElement) return event
  renderReactComponent(addSubSpaceElement, <AddSub id={event.record.$id.value} />)

  return event
})

kintone.events.on('app.record.create.show', (event: KintoneEvent) => {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const pid = urlParams.get('pid')
  if (pid) {
    event.record.parent.value = pid
  }
  return event
})
