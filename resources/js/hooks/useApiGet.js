import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export default function useApiGet(url, defaultData = null) {
    const [data, setData] = useState(defaultData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (!url) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const result = await api.get(url);
            setData(result);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData, setData };
}
