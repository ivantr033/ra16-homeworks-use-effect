import { useState, useEffect } from 'react';
import { type UserItem, type UserDetailsData } from '../types';
import { BASE_URL } from '../App';

interface DetailsProps {
    info: UserItem | null;
}

export default function Details({ info }: DetailsProps) {
    const [details, setDetails] = useState<UserDetailsData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const userId = info?.id;

    useEffect(() => {
        if (!userId) return;

        const controller = new AbortController();

        const fetchDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`${BASE_URL}/${userId}.json`, {
                    signal: controller.signal,
                });
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке данных пользователя');
                }
                const data: UserDetailsData = await response.json();
                setDetails(data);
            } catch (err: unknown) {
                if (err instanceof Error && err.name !== 'AbortError') {
                    setError(err.message);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        void fetchDetails();

        return () => {
            controller.abort();
        };
    }, [userId]);

    if (!info) return null;

    if (isLoading) {
        return <div className="status-box loading">Загрузка профиля...</div>;
    }

    if (error) {
        return <div className="status-box error">⚠️ {error}</div>;
    }

    if (!details) return null;

    return (
        <div className="details-card">
            <img
                src={`${details.avatar}?t=${details.id}`}
                alt={details.name}
                className="details-avatar"
            />
            <div className="details-body">
                <h3 className="details-name">{details.name}</h3>
                <div className="details-row">City: {details.details.city}</div>
                <div className="details-row">Company: {details.details.company}</div>
                <div className="details-row">Position: {details.details.position}</div>
            </div>
        </div>
    );
}
