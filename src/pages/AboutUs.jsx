import React from "react";
import { BookOpen, Users, Clock, Target, Heart, Sparkles } from "lucide-react";

const AboutUs = () => {
  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      title: "Digital Library Access",
      description: "Access a vast collection of digital books anytime, anywhere. Our platform makes reading accessible to everyone."
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "Community-Driven",
      description: "Join a community of book lovers. Share your reading progress and discover new books through recommendations."
    },
    {
      icon: <Clock className="h-8 w-8 text-purple-500" />,
      title: "Reading Progress Tracking",
      description: "Keep track of your reading journey with our built-in progress tracking system. Never lose your page again."
    },
    {
      icon: <Target className="h-8 w-8 text-red-500" />,
      title: "Personalized Experience",
      description: "Get notifications about new books, track your reading history, and receive personalized book recommendations."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Overbooked
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your digital sanctuary for books, where technology meets the timeless joy of reading.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <div className="flex items-center justify-center mb-6">
            <Heart className="h-12 w-12 text-red-500 mr-4" />
            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <p className="text-lg text-gray-600 text-center max-w-4xl mx-auto">
            At Overbooked, we believe that knowledge should be accessible to everyone. 
            Our mission is to create a seamless digital library experience that encourages 
            reading, learning, and community engagement. We're committed to breaking down 
            barriers to education and making literature available at your fingertips.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center mb-4">
                {feature.icon}
                <h3 className="text-xl font-semibold ml-4">{feature.title}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Why Overbooked */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-12 w-12 mr-4" />
            <h2 className="text-3xl font-bold">Why Overbooked?</h2>
          </div>
          <div className="space-y-4 max-w-4xl mx-auto text-lg">
            <p>
              Overbooked was born from a simple observation: in our digital age, 
              accessing and managing books should be as effortless as any other 
              digital content. We've created a platform that combines the traditional 
              library experience with modern technology.
            </p>
            <p>
              Our platform offers unique features like real-time reading progress 
              tracking, instant notifications for new books, and a community-driven 
              approach to library management. Whether you're a student, professional, 
              or casual reader, Overbooked adapts to your reading habits.
            </p>
            <p>
              We're more than just a digital library - we're a community of readers, 
              learners, and knowledge seekers. Join us in our mission to make reading 
              more accessible, engaging, and enjoyable in the digital age.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 