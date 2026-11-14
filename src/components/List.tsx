import { type UserItem } from '../types';

interface ListProps {
    users: UserItem[];
    selectedId: number | null;
    onSelect: (user: UserItem) => void;
}

export default function List({ users, selectedId, onSelect }: ListProps) {
    return (
        <ul className="user-list">
            {users.map((user) => {
                const isActive = user.id === selectedId;
                return (
                    <li
                        key={user.id}
                        className={`user-item ${isActive ? 'active' : ''}`}
                        onClick={() => {
                            if (!isActive) {
                                onSelect(user);
                            }
                        }}
                    >
                        {user.name}
                    </li>
                );
            })}
        </ul>
    );
}
