import React from 'react'
import styled from 'styled-components'

import { useEditorContext } from 'pm/context/EditorContext'

export function RightPanel() {
  const { viewProvider } = useEditorContext()

  function handleCreateBrokenNode() {
    viewProvider.execCommand((state, dispatch) => {
      const tbl = state.schema.nodes.table.create(
        {},
        Array.from([1, 2, 3, 4], () =>
          state.schema.nodes.table_row.create({}, [
            state.schema.nodes.table_cell.create(),
            state.schema.nodes.table_cell.create(),
          ])
        )
      )
      dispatch && dispatch(state.tr.insert(1, tbl))
      return true
    })
  }
  function handleCreateNode() {
    viewProvider.execCommand((state, dispatch) => {
      const tbl = state.schema.nodes.table.createAndFill()
      dispatch && dispatch(state.tr.insert(1, tbl))
      return true
    })
  }
  function handleReset() {
    viewProvider.execCommand((state, dispatch) => {
      dispatch && dispatch(state.tr.delete(0, state.doc.nodeSize - 2))
      return true
    })
  }
  return (
    <Container>
      <button onClick={handleCreateBrokenNode}>Create broken node</button>
      <button onClick={handleCreateNode}>Create node</button>
      <button onClick={handleReset}>Reset</button>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  button {
    margin: 0.05rem;
  }
`
