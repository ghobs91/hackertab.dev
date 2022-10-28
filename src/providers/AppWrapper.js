import React, { useReducer } from 'react'
import { LS_PREFERENCES_KEY } from 'src/Constants'
import AppStorage from '../services/localStorage'
import { PreferencesProvider } from '../preferences/PreferencesContext'
import { getOSMode } from '../services/os'
import AppReducer from '../preferences/AppReducer'
import { useRemoteConfigStore } from 'src/features/remoteConfig'

export default function AppWrapper({ children }) {
  const {
    remoteConfig: { supportedTags },
  } = useRemoteConfigStore()

  const [state, dispatcher] = useReducer(
    AppReducer,
    {
      userSelectedTags: supportedTags.filter((t) => t.value === 'javascript'),
      userBookmarks: [],
      theme: getOSMode(),
      openLinksNewTab: true,
      listingMode: 'normal',
      searchEngine: 'Google',
      cards: [
        { id: 0, name: 'github' },
        { id: 1, name: 'hackernews' },
        { id: 2, name: 'devto' },
        { id: 3, name: 'producthunt' },
      ],
    },
    (initialState) => {
      let preferences = AppStorage.getItem(LS_PREFERENCES_KEY)
      if (preferences) {
        preferences = JSON.parse(preferences)
        preferences = {
          ...preferences,
          userSelectedTags: supportedTags.filter((tag) =>
            preferences.userSelectedTags.includes(tag.value)
          ),
          cards: preferences.cards.filter((card) => card.name !== 'stackoverflow'),
        }
        return {
          ...initialState,
          ...preferences,
        }
      }

      return initialState
    }
  )

  return (
    <PreferencesProvider value={{ ...state, dispatcher: dispatcher }}>
      {children}
    </PreferencesProvider>
  )
}