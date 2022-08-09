import { ChangeEvent, FC, useState } from 'react'
import QRCode from 'qrcode'
import { toast } from 'react-toastify'

import { Settings, SettingsKeys } from '../types'

const Generator: FC = () => {
  const [qrCode, setQrCode] = useState<string>('')
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [url, setUrl] = useState<string>('')
  const [settings, setSettings] = useState<Settings>({
    margin: 1,
    scale: 1,
    width: 600,
    errorCorrectionLevel: 'medium',
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  })

  const handleUrlField = ({ target: { value } }: ChangeEvent<HTMLInputElement>): void => {
    setUrl(value)
  }

  const handleSettingsFields =
    (key: SettingsKeys) =>
    ({ target: { value } }: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
      if (key === 'dark' || key === 'light') {
        setSettings(prev => ({ ...prev, color: { ...prev.color, [key]: value } }))
      } else if (key === 'margin' || key === 'scale' || key === 'width') {
        setSettings(prev => ({ ...prev, [key]: Number(value) }))
      } else {
        setSettings(prev => ({ ...prev, [key]: value }))
      }
    }

  const handleToggleSettings = (): void => {
    setShowSettings(prev => !prev)
  }

  const handleGenerate = (): void => {
    QRCode.toString(url, settings, (error, code) => {
      if (!error) {
        setQrCode(code)
        toast.success('QR code generated!')
      } else {
        toast.error(error?.message || 'Something went wrong')
      }
    })
  }

  const handleDownload = (href: string, name: string): void => {
    const link = document.createElement('a')
    link.style.opacity = '0'
    link.download = name

    document.body.append(link)

    link.href = href
    link.click()
    link.remove()
  }

  const handleGetSVG = (): void => {
    QRCode.toString(url, settings, (error, code) => {
      if (!error) {
        const blob = new Blob([code], { type: 'image/svg+xml' })
        const href = URL.createObjectURL(blob)

        handleDownload(href, 'qr-code.svg')
      } else {
        toast.error(error?.message || 'Something went wrong')
      }
    })
  }

  const handleGetImage = (type: 'jpeg' | 'png' | 'webp') => (): void => {
    QRCode.toDataURL(url, { ...settings, type: `image/${type}` }, (error, url) => {
      if (!error) {
        handleDownload(url, `qr-code.${type}`)
      } else {
        toast.error(error?.message || 'Something went wrong')
      }
    })
  }

  const handleGetBase64 = (): void => {
    QRCode.toCanvas(url, settings, (error, canvas) => {
      if (!error) {
        const blob = new Blob([canvas.toDataURL()], { type: 'plain/text' })
        const href = URL.createObjectURL(blob)
        handleDownload(href, 'qr-code.txt')
      } else {
        toast.error(error?.message || 'Something went wrong')
      }
    })
  }

  return (
    <section className="generator">
      <section className="generator__title">
        <h1>QR Code</h1>
        <h3>Generator</h3>
      </section>

      <section className={`generator__app${qrCode ? ' generator__app_qr-generated' : ''}`}>
        <section className={`generator__app__url${qrCode ? ' generator__app__url_slide' : ''}`}>
          <label htmlFor="url-input">Text goes here:</label>
          <input id="url-input" type="text" placeholder="example.com" value={url} onChange={handleUrlField} />

          <div className={`generator__app__url__settings${showSettings ? ' generator__app__url__settings_slide' : ''}`}>
            <button type="button" onClick={handleToggleSettings}>
              {showSettings ? 'Hide' : 'Show'} Settings
            </button>

            <ul
              className={`generator__app__url__settings__list${
                showSettings ? ' generator__app__url__settings__list_show' : ''
              }`}
            >
              <li>
                <label htmlFor="light-input">Background color</label>
                <input
                  id="light-input"
                  type="color"
                  value={settings.color.light}
                  onChange={handleSettingsFields('light')}
                />
              </li>
              <li>
                <label htmlFor="dark-input">Code color</label>
                <input
                  id="dark-input"
                  type="color"
                  value={settings.color.dark}
                  onChange={handleSettingsFields('dark')}
                />
              </li>
              <li>
                <label htmlFor="detalization-input">Detalization</label>
                <select
                  id="detalization-input"
                  value={settings.errorCorrectionLevel}
                  onChange={handleSettingsFields('errorCorrectionLevel')}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="quartile">Quartile</option>
                  <option value="high">High</option>
                </select>
              </li>
              <li>
                <label htmlFor="margin-input">Margin</label>
                <input
                  id="margin-input"
                  type="number"
                  value={settings.margin}
                  step="1"
                  min="0"
                  onChange={handleSettingsFields('margin')}
                />
              </li>
              <li>
                <label htmlFor="size-input">Size</label>
                <input
                  id="size-input"
                  type="number"
                  value={settings.width}
                  step="50"
                  min="0"
                  onChange={handleSettingsFields('width')}
                />
              </li>
            </ul>
          </div>

          <button type="button" onClick={handleGenerate}>
            Generate
          </button>
        </section>

        <section className={`generator__app__qr-code${qrCode ? ' generator__app__qr-code_show' : ''}`}>
          <div className="generator__app__qr-code__code" dangerouslySetInnerHTML={{ __html: qrCode }} />
          <div className="generator__app__qr-code__actions">
            <button type="button" onClick={handleGetSVG}>
              SVG
            </button>
            <button type="button" onClick={handleGetImage('jpeg')}>
              JPEG
            </button>
            <button type="button" onClick={handleGetImage('png')}>
              PNG
            </button>
            <button type="button" onClick={handleGetImage('webp')}>
              WEBP
            </button>
            <button type="button" onClick={handleGetBase64}>
              Base64
            </button>
          </div>
        </section>
      </section>
    </section>
  )
}

export default Generator
