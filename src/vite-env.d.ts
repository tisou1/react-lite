/// <reference types="vite/client"/>
/// <reference types="vite-plugin-pages/client-react" />

interface ViewTransition {
  ready: Promise<void>
}

interface Document {
  startViewTransition?: (updateCallback: () => void) => ViewTransition
}
