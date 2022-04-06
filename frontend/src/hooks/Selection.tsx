import { Asset } from '@Context/Game'
import { useCallback, useState } from 'react'

export function useSelection() {
  const [ selection, updateSelection ] = useState<Asset[]>([])

  const toggle = useCallback((asset: Asset) => {
    if (selection.includes(asset)) {
      updateSelection(selection.filter((item) => item !== asset))
    } else {
      updateSelection([ ...selection, asset ])
    }

    return
  }, [ selection ])

  const toggleAll = useCallback((assets: Asset[]) => {
    if (selection.length === 0) {
      updateSelection(assets)
    } else {
      updateSelection([])
    }

    return
  }, [ selection ])

  const reset = useCallback(() => {
    updateSelection([])
  }, [ selection ])

  return {
    assets: selection, toggle, toggleAll, reset
  }
}
