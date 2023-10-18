import { IntentType } from '../types'
import { Color } from '../types/ui'

export const INTENTS: IntentType[] = ['SUCCESS', 'FAILED', 'PRIMARY', 'DEFAULT', 'AWAITING']

export const Intent: Record<IntentType, IntentType> = Object.fromEntries(INTENTS.map(key => ([key, key]))) as any

export const IntentColors: Color[] = ['green', 'red', 'brand', 'messenger', 'orange']

export const a = 6788 + 333

