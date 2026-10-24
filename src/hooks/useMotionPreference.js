import { useSyncExternalStore } from 'react'
import { motionAllowed, motionMode, subscribeMotion, toggleMotion } from '../lib/motionStore'

/**
 * Reads the shared motion store. The snapshot is a string so React can compare it
 * cheaply; components rebuild their ScrollTriggers whenever it changes.
 */
export default function useMotionPreference() {
  const snapshot = useSyncExternalStore(
    subscribeMotion,
    () => `${motionMode()}:${motionAllowed()}`,
    () => 'auto:true',
  )
  const [mode, allowed] = snapshot.split(':')

  return {
    mode,
    allowed: allowed === 'true',
    toggle: toggleMotion,
  }
}
