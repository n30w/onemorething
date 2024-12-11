import { createContext } from 'react'

export interface SelectedObjContextValue {
  selectedObj: any
  setSelectedObj: React.Dispatch<React.SetStateAction<any>>
}

export const SelectedObjContext = createContext<SelectedObjContextValue | null>(
  null,
)

export interface MessageObjContextValue {
  objects: any
  setObjects: React.Dispatch<React.SetStateAction<any>>
}

export const MessageObjContext = createContext<MessageObjContextValue | null>(
  null,
)

export const InboxSceneContext = createContext<InboxSceneContextValue | null>(
  null,
)

export interface InboxSceneContextValue {
  inboxScene: any
  setInboxScene: React.Dispatch<React.SetStateAction<any>>
}

export const UsernameContext = createContext<
  UsernameContextValue | null | string
>(null)

export interface UsernameContextValue {
  username: any
  setUsername: React.Dispatch<React.SetStateAction<any>>
}

export const ProfileContext = createContext<ProfileContextValue | null>(null)

export interface ProfileContextValue {
  profile: any
  setProfile: React.Dispatch<React.SetStateAction<any>>
}
