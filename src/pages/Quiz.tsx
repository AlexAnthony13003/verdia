import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, doc, getDoc, updateDoc, addDoc } from 'firebase/firestore';
import { Timer, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Question {
  id: string;
  text: string;
  options: { text: string; isTrue: boolean }[];
}

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isAnswered, setIsAnswered] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionsRef = collection(db, 'quizz');
        const questionsSnap = await getDoc(doc(questionsRef, '41bUUuvo7avqvFcESbA7'));
        if (questionsSnap.exists()) {
          const quizData = questionsSnap.data();
          setQuestions(quizData.questions || []);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast.error('Erreur lors du chargement du quiz');
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (loading || isAnswered) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAnswer(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, loading, isAnswered]);

  const handleAnswer = async (selectedIndex: number | null) => {
    if (isAnswered) return;
    setIsAnswered(true);

    const currentQ = questions[currentQuestion];
    const isCorrect = selectedIndex !== null && currentQ.options[selectedIndex].isTrue;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    // Attendre 2 secondes avant de passer à la question suivante
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setTimeLeft(15);
        setIsAnswered(false);
      } else {
        finishQuiz();
      }
    }, 2000);
  };

  const finishQuiz = async () => {
    if (!user) return;

    try {
      // Mettre à jour les statistiques de l'utilisateur
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      const finalScore = (score / questions.length) * 100;
      const newQuizzesTaken = (userData?.stats?.quizzesTaken || 0) + 1;
      const newTotalScore = (userData?.stats?.totalScore || 0) + finalScore;

      await updateDoc(userRef, {
        'stats.quizzesTaken': newQuizzesTaken,
        'stats.totalScore': newTotalScore,
      });

      // Enregistrer le résultat du quiz
      await addDoc(collection(db, 'quizResults'), {
        userId: user.uid,
        score: finalScore,
        totalQuestions: questions.length,
        correctAnswers: score,
        timestamp: new Date(),
      });

      toast.success('Quiz terminé !');
      navigate('/');
    } catch (error) {
      console.error('Error saving quiz results:', error);
      toast.error('Erreur lors de la sauvegarde des résultats');
    }
  };

  if (loading) {
    return <div className="text-center">Chargement du quiz...</div>;
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="text-lg font-semibold">
            Question {currentQuestion + 1}/{questions.length}
          </div>
          <div className="flex items-center gap-2 text-emerald-600">
            <Timer className="h-5 w-5" />
            <span className="font-bold">{timeLeft}s</span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">{currentQ.text}</h2>
          <div className="grid gap-4">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={isAnswered}
                className={`p-4 rounded-lg text-left transition ${
                  isAnswered
                    ? option.isTrue
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                    : 'bg-gray-100 hover:bg-emerald-50 text-gray-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option.text}</span>
                  {isAnswered && (
                    option.isTrue ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Score actuel: {score}/{currentQuestion + 1}
          </div>
          <div className="text-sm text-gray-600">
            {((score / (currentQuestion + 1)) * 100).toFixed(0)}%
          </div>
        </div>
      </div>
    </div>
  );
}