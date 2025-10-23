import { useState, useEffect } from 'react'
import PageWatcher from 'page-watchdog'
import './App.css'

function App() {
    const [status, setStatus] = useState('Initializing Page Watchdog...')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let watcher: PageWatcher | null = null

        const initializeWatcher = async () => {
            try {
                // Initialize PageWatcher, checking every 5 seconds
                watcher = await PageWatcher.create({ timer: 5000 })
                setStatus('Page Watchdog is active. Checking for updates every 5 seconds.')

                watcher.on('changed', () => {
                    setStatus('Page scripts updated! Reloading page in 3 seconds...')
                    console.log('Page scripts updated! Reloading...')
                    setTimeout(() => window.location.reload(), 3000)
                })

                watcher.on('unchanged', () => {
                    const currentTime = new Date().toLocaleTimeString()
                    setStatus(`No updates found at ${currentTime}. Still active.`)
                    console.log(`No updates found at ${currentTime}.`)
                })

                watcher.on('error', (err) => {
                    setError(`Watcher error: ${err.message}`)
                    setStatus('Page Watchdog encountered an error and stopped.')
                    console.error('Watcher error:', err)
                    watcher?.stop()
                })
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : String(e)
                setError(`Failed to initialize Page Watchdog: ${errorMessage}`)
                setStatus('Initialization failed.')
                console.error('Initialization error:', e)
            }
        }

        initializeWatcher()

        return () => {
            if (watcher) {
                watcher.stop()
                console.log('Page Watchdog stopped.')
            }
        }
    }, [])

    return (
        <div className="app-container">
            <h1>Page Watchdog React Example</h1>
            <div className="status-message">
                Status: <strong>{status}</strong>
            </div>
            {error && <div className="error-message">Error: {error}</div>}
            <hr/>
            <h3>How to Test:</h3>
            <ol>
                <li>Open your browser's developer tools (F12).</li>
                <li>Go to the "Console" tab to see live logs from the watcher.</li>
                <li>Go to the "Elements" tab, find the <code>{'<body>'}</code> tag.</li>
                <li>
                    Manually add a new script tag, like{' '}
                    <code>{`<script src="https://example.com/test.js"></script>`}</code>, inside the body.
                </li>
                <li>Wait for the next check (up to 5 seconds).</li>
                <li>
                    The status on the page should change to “Page scripts updated!”, and the page will reload.
                </li>
            </ol>
        </div>
    )
}

export default App
