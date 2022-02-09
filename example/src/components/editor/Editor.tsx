import React, { useMemo } from 'react'
import styled from 'styled-components'
import debounce from 'lodash.debounce'

import { applyDevTools } from 'prosemirror-dev-toolkit'

import { RightPanel } from './RightPanel'
import { EditorStore } from './EditorStore'

import { PMEditor } from 'pm/PMEditor'
import { ReactEditorContext } from 'pm/context/EditorContext'
import { createDefaultProviders, IProviders } from 'pm/context/Providers'

export function Editor() {
  const editorProviders = useMemo(() => createDefaultProviders(), [])
  const editorStore = useMemo(() => new EditorStore(), [])
  const debouncedSync = useMemo(() => debounce(editorStore.syncCurrentEditorState, 500), [])

  function handleEdit() {
    debouncedSync()
  }
  function handleEditorReady(ctx: IProviders) {
    editorStore.setEditorView(ctx.viewProvider)
    applyDevTools(ctx.viewProvider.view)
  }
  return (
    <ReactEditorContext.Provider value={editorProviders}>
      <div>
        <ViewGrid>
          <LeftSide>
            <div className="pm-editor">
              <PMEditor
                onEdit={handleEdit}
                onEditorReady={handleEditorReady}
              />
            </div>
          </LeftSide>
          <RightPanel/>
        </ViewGrid>
      </div>
    </ReactEditorContext.Provider>
  )
}

const ViewGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto auto;
  margin-top: 1rem;
`
const LeftSide = styled.div`
  margin-right: 1rem;
`