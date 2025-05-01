import { useState, useEffect } from 'react';

export function useOllamaSettings() {
    const defaultApiUrl = 'http://localhost:11434';
    const [ollamaApiUrl, setOllamaApiUrl] = useState<string>(defaultApiUrl);
    const [newApiUrl, setNewApiUrl] = useState<string>('');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Load API URL from localStorage on initial render
    useEffect(() => {
        // Only run on client-side
        if (typeof window !== 'undefined') {
            const savedUrl = localStorage.getItem('ollamaApiUrl');
            if (savedUrl) {
                setOllamaApiUrl(savedUrl);
                setNewApiUrl(savedUrl);
            } else {
                setNewApiUrl(defaultApiUrl);
            }
        }
    }, [defaultApiUrl]);

    // Handle opening settings dialog
    const handleOpenSettings = () => {
        setNewApiUrl(ollamaApiUrl);
        setIsSettingsOpen(true);
    };

    // Handle saving settings
    const handleSaveSettings = () => {
        if (newApiUrl && newApiUrl !== ollamaApiUrl) {
            setOllamaApiUrl(newApiUrl);
            localStorage.setItem('ollamaApiUrl', newApiUrl);
            setErrorMessage(null); // Clear any existing error messages
        }
        setIsSettingsOpen(false);
    };

    return {
        ollamaApiUrl,
        newApiUrl,
        setNewApiUrl,
        isSettingsOpen,
        setIsSettingsOpen,
        errorMessage,
        setErrorMessage,
        handleOpenSettings,
        handleSaveSettings
    };
}