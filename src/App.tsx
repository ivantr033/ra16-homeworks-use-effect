import { useState, useEffect } from 'react';
import List from './components/List';
import Details from './components/Details';
import { type UserItem } from './types';
import './App.css';

export const BASE_URL =
  'https://raw.githubusercontent.com/netology-code/ra16-homeworks/master/hooks-context/use-effect/data';

export default function App() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BASE_URL}/users.json`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error('Не удалось загрузить список пользователей');
        }
        const data: UserItem[] = await response.json();
        setUsers(data);
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

    void fetchUsers();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="app-layout">
      {isLoading && <div className="status-box loading">Загрузка списка...</div>}
      {error && <div className="status-box error">⚠️ {error}</div>}

      {!isLoading && !error && users.length > 0 && (
        <List
          users={users}
          selectedId={selectedUser?.id ?? null}
          onSelect={setSelectedUser}
        />
      )}

      <Details info={selectedUser} />
    </div>
  );
}
