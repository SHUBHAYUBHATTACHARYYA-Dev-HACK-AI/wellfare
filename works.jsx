import { useState, useEffect } from 'react';
import { Button } from "/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "/components/ui/card";
import { Input } from "/components/ui/input";
import { Label } from "/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Plus, Award, BookOpen } from 'lucide-react';

type Lesson = {
  id: string;
  title: string;
  description: string;
  content: string;
  completed: boolean;
};

type Badge = {
  id: string;
  name: string;
  description: string;
  earned: boolean;
};

export default function SkillPuzzle() {
  // State for lessons
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: '1',
      title: 'Introduction to React Hooks',
      description: 'Learn the basics of useState and useEffect',
      content: 'React Hooks allow you to use state and other React features without writing a class. The useState hook lets you add state to functional components, while useEffect handles side effects.',
      completed: false
    },
    {
      id: '2',
      title: 'CSS Flexbox Fundamentals',
      description: 'Master layout with Flexbox',
      content: 'Flexbox is a one-dimensional layout method for arranging items in rows or columns. Items flex to fill additional space and shrink to fit into smaller spaces.',
      completed: true
    },
    {
      id: '3',
      title: 'JavaScript Array Methods',
      description: 'Essential methods for array manipulation',
      content: 'Learn map, filter, reduce, and other array methods that make data transformation easier in JavaScript.',
      completed: false
    }
  ]);

  // State for form inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');

  // State for badges
  const [badges, setBadges] = useState<Badge[]>([
    { id: '1', name: 'First Steps', description: 'Complete your first lesson', earned: true },
    { id: '2', name: 'Quick Learner', description: 'Complete 3 lessons', earned: false },
    { id: '3', name: 'Knowledge Seeker', description: 'Complete 5 lessons', earned: false },
    { id: '4', name: 'Content Creator', description: 'Submit your first lesson', earned: false }
  ]);

  // Calculate progress
  const completedCount = lessons.filter(lesson => lesson.completed).length;
  const progress = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  // Update badges based on progress
  useEffect(() => {
    const updatedBadges = [...badges];
    
    // Quick Learner badge (3 lessons)
    if (completedCount >= 3 && !updatedBadges[1].earned) {
      updatedBadges[1].earned = true;
    }
    
    // Knowledge Seeker badge (5 lessons)
    if (completedCount >= 5 && !updatedBadges[2].earned) {
      updatedBadges[2].earned = true;
    }
    
    // Content Creator badge (submitted lessons)
    if (lessons.length > 3 && !updatedBadges[3].earned) {
      updatedBadges[3].earned = true;
    }
    
    setBadges(updatedBadges);
  }, [completedCount, lessons.length]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !content.trim()) return;
    
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title,
      description,
      content,
      completed: false
    };
    
    setLessons([...lessons, newLesson]);
    
    // Reset form
    setTitle('');
    setDescription('');
    setContent('');
  };

  // Toggle lesson completion
  const toggleCompletion = (id: string) => {
    setLessons(lessons.map(lesson => 
      lesson.id === id ? { ...lesson, completed: !lesson.completed } : lesson
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-2">SkillPuzzle</h1>
          <p className="text-lg text-indigo-600">Master new skills in just 5 minutes a day</p>
        </header>

        {/* Progress Section */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="text-indigo-600" />
              Your Learning Progress
            </CardTitle>
            <CardDescription>
              {completedCount} of {lessons.length} lessons completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-indigo-600 h-4 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Lessons */}
          <div>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Available Micro-Lessons</CardTitle>
                <CardDescription>Learn something new in 5 minutes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lessons.map((lesson) => (
                    <Card 
                      key={lesson.id} 
                      className={`transition-all duration-300 ${lesson.completed ? 'bg-green-50 border-green-200' : 'hover:shadow-md'}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <Button
                            variant="outline"
                            size="icon"
                            className={`mr-3 mt-1 flex-shrink-0 ${lesson.completed ? 'bg-green-500 hover:bg-green-600 border-green-500' : ''}`}
                            onClick={() => toggleCompletion(lesson.id)}
                          >
                            {lesson.completed ? <Check className="text-white" /> : <div className="w-4 h-4" />}
                          </Button>
                          <div>
                            <h3 className={`font-semibold ${lesson.completed ? 'line-through text-gray-500' : ''}`}>
                              {lesson.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                            <p className="text-sm mt-2">{lesson.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contribution & Badges */}
          <div className="space-y-8">
            {/* Contribution Form */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Share Your Knowledge</CardTitle>
                <CardDescription>Contribute a 5-minute micro-lesson</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Lesson Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="What skill are you teaching?"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Short Description</Label>
                    <Input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Briefly describe your lesson"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Lesson Content</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Explain the concept in 5 minutes or less..."
                      rows={4}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Micro-Lesson
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Badges Section */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="text-yellow-500" />
                  Your Achievements
                </CardTitle>
                <CardDescription>Badges earned through learning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {badges.map((badge) => (
                    <div 
                      key={badge.id} 
                      className={`border rounded-lg p-4 text-center transition-all ${badge.earned ? 'bg-yellow-50 border-yellow-200 shadow-sm' : 'bg-gray-100 border-gray-200 opacity-60'}`}
                    >
                      <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2 ${badge.earned ? 'bg-yellow-100' : 'bg-gray-200'}`}>
                        <Award className={badge.earned ? 'text-yellow-500' : 'text-gray-400'} />
                      </div>
                      <h3 className="font-semibold text-sm">{badge.name}</h3>
                      <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
                      {badge.earned && (
                        <span className="inline-block mt-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          Earned
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}