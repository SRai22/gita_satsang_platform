import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, BookOpen, Calendar, MessageCircle, Video } from "lucide-react";

const Index = () => {
  const todaysShloka = {
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन",
    translation: "You have the right to perform your actions, but never to the fruits of action",
    chapter: "Bhagavad Gita 2.47"
  };

  const recentActivities = [
    { type: "discussion", title: "Understanding Dharma in Modern Times", author: "Guruji Ramesh", time: "2 hours ago" },
    { type: "satsang", title: "Evening Meditation Session", time: "Tomorrow 7 PM", participants: 25 },
    { type: "learning", title: "New Audio: Chapter 3 Commentary", author: "Mata Priya", time: "1 day ago" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-spiritual font-bold text-gradient mb-4">
          नमस्ते 🙏
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Welcome to our sacred community where souls unite in the pursuit of divine wisdom through the Bhagavad Gita
        </p>
      </div>

      {/* Daily Shloka */}
      <Card className="bg-gradient-primary text-primary-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-spiritual">
            <Heart className="h-5 w-5" />
            Today's Sacred Verse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-xl font-spiritual italic">{todaysShloka.sanskrit}</p>
            <p className="text-lg">{todaysShloka.translation}</p>
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
              {todaysShloka.chapter}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button className="h-20 flex-col gap-2" variant="outline">
          <MessageCircle className="h-6 w-6" />
          <span className="text-sm">Join Discussion</span>
        </Button>
        <Button className="h-20 flex-col gap-2" variant="outline">
          <Video className="h-6 w-6" />
          <span className="text-sm">Live Satsang</span>
        </Button>
        <Button className="h-20 flex-col gap-2" variant="outline">
          <BookOpen className="h-6 w-6" />
          <span className="text-sm">Study Gita</span>
        </Button>
        <Button className="h-20 flex-col gap-2" variant="outline">
          <Calendar className="h-6 w-6" />
          <span className="text-sm">Schedule</span>
        </Button>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="font-spiritual">Recent Community Activities</CardTitle>
          <CardDescription>Stay connected with our spiritual community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div className="flex-1">
                  <h4 className="font-medium">{activity.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {activity.author && `by ${activity.author} • `}{activity.time}
                    {activity.participants && ` • ${activity.participants} participants`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Community Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">847</div>
            <p className="text-sm text-muted-foreground">Active Members</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-accent" />
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-sm text-muted-foreground">Discussions</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-secondary" />
            <div className="text-2xl font-bold">18</div>
            <p className="text-sm text-muted-foreground">Chapters Studied</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;