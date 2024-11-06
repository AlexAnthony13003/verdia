import React, { useState, useEffect } from 'react';
import { Users, UserPlus, X, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

export default function FriendsOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !isOpen) return;

    // Écouter les demandes d'amis
    const requestsQuery = query(
      collection(db, 'friendRequests'),
      where('toUserId', '==', user.uid)
    );

    const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFriendRequests(requests);
    });

    // Écouter la liste d'amis
    const friendsQuery = query(
      collection(db, 'friends'),
      where('users', 'array-contains', user.uid)
    );

    const unsubscribeFriends = onSnapshot(friendsQuery, (snapshot) => {
      const friendsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFriends(friendsList);
    });

    return () => {
      unsubscribeRequests();
      unsubscribeFriends();
    };
  }, [user, isOpen]);

  const sendFriendRequest = async () => {
    if (!searchEmail.trim() || !user) return;

    try {
      await addDoc(collection(db, 'friendRequests'), {
        fromUserId: user.uid,
        fromUserEmail: user.email,
        toUserEmail: searchEmail,
        status: 'pending',
        createdAt: new Date()
      });
      setSearchEmail('');
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const handleFriendRequest = async (requestId: string, accept: boolean) => {
    try {
      if (accept) {
        const request = friendRequests.find(req => req.id === requestId);
        await addDoc(collection(db, 'friends'), {
          users: [user?.uid, request.fromUserId],
          createdAt: new Date()
        });
      }
      await deleteDoc(doc(db, 'friendRequests', requestId));
    } catch (error) {
      console.error('Error handling friend request:', error);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 left-4 bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700 transition-colors"
        >
          <Users className="h-6 w-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-4 left-4 w-80 bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-gray-800">Amis Écolos</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 border-b">
            <div className="flex gap-2">
              <input
                type="email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="Ajouter un ami par email"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
              <button
                onClick={sendFriendRequest}
                className="bg-emerald-600 text-white p-2 rounded-md hover:bg-emerald-700"
              >
                <UserPlus className="h-5 w-5" />
              </button>
            </div>
          </div>

          {friendRequests.length > 0 && (
            <div className="p-4 border-b">
              <h4 className="font-medium text-sm text-gray-700 mb-2">
                Demandes d'amis
              </h4>
              <div className="space-y-2">
                {friendRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between">
                    <span className="text-sm">{request.fromUserEmail}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleFriendRequest(request.id, true)}
                        className="text-emerald-600 hover:text-emerald-700"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleFriendRequest(request.id, false)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="h-64 overflow-y-auto p-4">
            <h4 className="font-medium text-sm text-gray-700 mb-2">
              Mes amis ({friends.length})
            </h4>
            <div className="space-y-2">
              {friends.map((friend) => (
                <div key={friend.id} className="flex items-center justify-between">
                  <span className="text-sm">
                    {friend.users.find((id: string) => id !== user?.uid)}
                  </span>
                  <button
                    onClick={() => {/* Implémenter l'invitation au quiz */}}
                    className="text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    Défier
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}