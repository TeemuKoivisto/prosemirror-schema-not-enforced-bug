import { EditorViewProvider } from 'pm/context/EditorViewProvider'

export class EditorStore {

  viewProvider?: EditorViewProvider
  currentEditorState?: Record<string, any>
  STORAGE_KEY = 'editor-store'

  constructor() {
    const existing = localStorage.getItem(this.STORAGE_KEY)
    if (existing && existing !== null && existing.length > 0) {
      let stored = JSON.parse(existing)
      this.currentEditorState = stored
    }
  }

  setEditorView = (viewProvider: EditorViewProvider) => {
    this.viewProvider = viewProvider
    if (this.currentEditorState) {
      viewProvider.hydrateStateFromJSON(this.currentEditorState)
    }
  }

  syncCurrentEditorState = () => {
    const newState = this.viewProvider!.stateToJSON()
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newState))
  }
}