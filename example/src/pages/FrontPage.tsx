import React from 'react'
import styled from 'styled-components'

import { Editor } from '../components/editor/Editor'

export function FrontPage() {
  return (
    <Container>
      <header>
        <h1><a href="https://teemukoivisto.github.io/prosemirror-schema-not-enforced-bug/">
          ProseMirror schema is not enforced on node creation</a></h1>
        <p>This can create quite devious bugs...</p>
        <p><a href="https://github.com/TeemuKoivisto/prosemirror-schema-not-enforced-bug">Github repo</a></p>
      </header>
      <Editor/>
    </Container>
  )
}

const Container = styled.div``
