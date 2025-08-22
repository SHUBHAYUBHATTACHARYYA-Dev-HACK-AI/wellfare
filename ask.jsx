import { useState } from 'react';
import { Button } from "/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "/components/ui/card";
import { Input } from "/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "/components/ui/avatar";
import { Heart, ArrowUp, ArrowDown, Search, Plus, User } from 'lucide-react';

type User = {
  id: string;
  name: string;
  role: 'student' | 'volunteer' | 'professional';
};

type Question = {
  id: string;
  title: string;
  content: string;
  userId: string;
  timestamp: Date;
  votes: number;
  user: User;
};

type Answer = {
  id: string;
  content: string;
  userId: string;
  questionId: string;
  timestamp: Date;
  votes: number;
  user: User;
};

const mockUsers: User[] = [
  { id: '1', name: 'Alex Johnson', role: 'professional' },
  { id: '2', name: 'Sam Wilson', role: 'volunteer' },
  { id: '3', name: 'Taylor Reed', role: 'student' },
  { id: '4', name: 'Jordan Lee', role: 'professional' },
];

const initialQuestions: Question[] = [
  {
    id: '1',
    title: 'How do I apply for unemployment benefits?',
    content: 'I recently lost my job and need to know the process for applying for unemployment benefits in my state.',
    userId: '2',
    timestamp: new Date(Date.now() - 86400000),
    votes: 12,
    user: mockUsers[1]
  },
  {
    id: '2',
    title: 'What are my rights as a tenant?',
    content: 'My landlord is refusing to fix a broken heater. What legal actions can I take?',
    userId: '3',
    timestamp: new Date(Date.now() - 172800000),
    votes: 8,
    user: mockUsers[2]
  }
];

const initialAnswers: Answer[] = [
  {
    id: '1',
    content: 'You can apply online through your state\'s unemployment website. You\'ll need your Social Security number, driver\'s license, and employment history for the past 18 months. Processing usually takes 2-3 weeks.',
    userId: '1',
    questionId: '1',
    timestamp: new Date(Date.now() - 43200000),
    votes: 15,
    user: mockUsers[0]
  },
  {
    id: '2',
    content: 'As a tenant, you have the right to a habitable living space. Document the issue with photos and written notices to your landlord. You may be able to withhold rent or use the "repair and deduct" method, but check your local laws first.',
    userId: '4',
    questionId: '2',
    timestamp: new Date(Date.now() - 86400000),
    votes: 22,
    user: mockUsers[3]
  }
];

export default function AskLaw() {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [answers, setAnswers] = useState<Answer[]>(initialAnswers);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [newAnswerContent, setNewAnswerContent] = useState('');
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newQuestionTitle.trim() || !newQuestionContent.trim()) return;
    
    const newQuestion: Question = {
      id: Date.now().toString(),
      title: newQuestionTitle,
      content: newQuestionContent,
      userId: '1', // Current user
      timestamp: new Date(),
      votes: 0,
      user: mockUsers[0]
    };
    
    setQuestions([newQuestion, ...questions]);
    setNewQuestionTitle('');
    setNewQuestionContent('');
  };

  const handleAnswerSubmit = (questionId: string) => {
    if (!newAnswerContent.trim()) return;
    
    const newAnswer: Answer = {
      id: Date.now().toString(),
      content: newAnswerContent,
      userId: '1', // Current user
      questionId,
      timestamp: new Date(),
      votes: 0,
      user: mockUsers[0]
    };
    
    setAnswers([newAnswer, ...answers]);
    setNewAnswerContent('');
    setActiveQuestionId(null);
  };

  const handleVote = (type: 'question' | 'answer', id: string, delta: number) => {
    if (type === 'question') {
      setQuestions(questions.map(q => 
        q.id === id ? { ...q, votes: q.votes + delta } : q
      ));
    } else {
      setAnswers(answers.map(a => 
        a.id === id ? { ...a, votes: a.votes + delta } : a
      ));
    }
  };

  const filteredQuestions = questions.filter(q => 
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case 'professional': return 'bg-blue-100 text-blue-800';
      case 'volunteer': return 'bg-green-100 text-green-800';
      case 'student': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-2 flex items-center justify-center">
            <Heart className="mr-2 text-red-500" /> AskLaw
          </h1>
          <p className="text-lg text-indigo-600">Crowdsourced legal help for everyday questions</p>
        </header>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search legal questions..."
              className="pl-10 py-6 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Ask Question Form */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg mb-6">
              <CardHeader>
                <CardTitle>Ask a Legal Question</CardTitle>
                <CardDescription>Get help from our community of legal experts</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAskQuestion}>
                  <div className="space-y-4">
                    <div>
                      <Input
                        placeholder="What do you need help with?"
                        value={newQuestionTitle}
                        onChange={(e) => setNewQuestionTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Describe your situation in detail..."
                        rows={4}
                        value={newQuestionContent}
                        onChange={(e) => setNewQuestionContent(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <Plus className="mr-2 h-4 w-4" /> Post Question
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Community Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-700">{questions.length}</div>
                    <div className="text-sm text-gray-600">Questions</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-700">{answers.length}</div>
                    <div className="text-sm text-gray-600">Answers</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-700">{mockUsers.length}</div>
                    <div className="text-sm text-gray-600">Helpers</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-700">
                      {answers.reduce((sum, a) => sum + a.votes, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Votes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Questions List */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {filteredQuestions.length === 0 ? (
                <Card className="shadow-lg">
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-500">No questions found. Be the first to ask!</p>
                  </CardContent>
                </Card>
              ) : (
                filteredQuestions.map((question) => {
                  const questionAnswers = answers.filter(a => a.questionId === question.id);
                  const topAnswer = questionAnswers.reduce((prev, current) => 
                    (prev.votes > current.votes) ? prev : current, 
                    questionAnswers[0]
                  );
                  
                  return (
                    <Card key={question.id} className="shadow-lg">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{question.title}</CardTitle>
                            <div className="flex items-center mt-2">
                              <Avatar className="w-8 h-8 mr-2">
                                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${question.user.name}`} />
                                <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                              </Avatar>
                              <div>
                                <span className="text-sm font-medium">{question.user.name}</span>
                                <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getRoleBadge(question.user.role)}`}>
                                  {question.user.role}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-center bg-gray-100 rounded-lg p-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="p-0 h-auto"
                              onClick={() => handleVote('question', question.id, 1)}
                            >
                              <ArrowUp className="w-4 h-4" />
                            </Button>
                            <span className="font-bold">{question.votes}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="p-0 h-auto"
                              onClick={() => handleVote('question', question.id, -1)}
                            >
                              <ArrowDown className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">{question.content}</p>
                        
                        {topAnswer && (
                          <Card className="border-l-4 border-green-500 bg-green-50">
                            <CardContent className="pt-4">
                              <div className="flex justify-between">
                                <div className="flex items-center">
                                  <Avatar className="w-6 h-6 mr-2">
                                    <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${topAnswer.user.name}`} />
                                    <AvatarFallback><User className="w-3 h-3" /></AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium">{topAnswer.user.name}</span>
                                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getRoleBadge(topAnswer.user.role)}`}>
                                    {topAnswer.user.role}
                                  </span>
                                </div>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                  Top Answer
                                </span>
                              </div>
                              <p className="mt-2 text-gray-700">{topAnswer.content}</p>
                              <div className="flex justify-end mt-2">
                                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="p-0 h-auto"
                                    onClick={() => handleVote('answer', topAnswer.id, 1)}
                                  >
                                    <ArrowUp className="w-3 h-3" />
                                  </Button>
                                  <span className="text-sm font-bold mx-1">{topAnswer.votes}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="p-0 h-auto"
                                    onClick={() => handleVote('answer', topAnswer.id, -1)}
                                  >
                                    <ArrowDown className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </CardContent>
                      <CardFooter className="flex flex-col">
                        <Button 
                          variant="outline" 
                          className="w-full mb-2"
                          onClick={() => setActiveQuestionId(
                            activeQuestionId === question.id ? null : question.id
                          )}
                        >
                          {activeQuestionId === question.id ? 'Cancel' : 'Answer this Question'}
                        </Button>
                        
                        {activeQuestionId === question.id && (
                          <div className="w-full mt-2">
                            <Textarea
                              placeholder="Write your answer..."
                              rows={3}
                              value={newAnswerContent}
                              onChange={(e) => setNewAnswerContent(e.target.value)}
                              className="mb-2"
                            />
                            <Button 
                              onClick={() => handleAnswerSubmit(question.id)}
                              className="w-full"
                            >
                              Submit Answer
                            </Button>
                          </div>
                        )}
                        
                        {questionAnswers.length > 0 && activeQuestionId !== question.id && (
                          <div className="text-sm text-gray-500 mt-2">
                            {questionAnswers.length} answer{questionAnswers.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}