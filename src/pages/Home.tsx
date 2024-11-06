import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Target, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const stats = {
    quizCompleted: 12,
    ecoScore: 85,
    badges: ['Écolo Débutant', 'Champion du Tri'],
    rank: 42
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Bienvenue, {user?.displayName || 'Écolo'}!
          </h1>
          <Trophy className="h-8 w-8 text-emerald-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-emerald-800">Quiz Complétés</span>
              <Target className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-emerald-700">{stats.quizCompleted}</p>
          </div>

          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-emerald-800">Score Écologique</span>
              <Award className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-emerald-700">{stats.ecoScore}%</p>
          </div>

          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-emerald-800">Classement</span>
              <Users className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-emerald-700">#{stats.rank}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Badges Obtenus</h2>
          <div className="grid grid-cols-2 gap-4">
            {stats.badges.map((badge, index) => (
              <div key={index} className="bg-emerald-50 rounded-lg p-4 text-center">
                <Award className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-emerald-800">{badge}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Défis Disponibles</h2>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/quiz')}
              className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition flex items-center justify-between"
            >
              <span>Nouveau Quiz Écologique</span>
              <Target className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="w-full bg-emerald-100 text-emerald-700 py-3 px-4 rounded-lg hover:bg-emerald-200 transition flex items-center justify-between"
            >
              <span>Défier un Ami</span>
              <Users className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}