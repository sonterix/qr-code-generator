export type SettingsKeys = 'margin' | 'scale' | 'width' | 'quelity' | 'errorCorrectionLevel' | 'dark' | 'light'

export interface Settings {
  margin: number
  scale: number
  width: number
  errorCorrectionLevel: 'low' | 'medium' | 'quartile' | 'high'
  color: {
    dark: string
    light: string
  }
}
