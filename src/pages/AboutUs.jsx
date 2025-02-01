import React, { useState, useEffect } from "react";
import { BookOpen, Users, Clock, Target, Heart, Sparkles } from "lucide-react";
import LoadingAnimation from "../components/LoadingAnimation";
import { motion } from "framer-motion";

const AboutUs = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Force loading animation for 1.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  if (isLoading) {
    return <LoadingAnimation onComplete={() => setIsLoading(false)} duration={1500} />;
  }

  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-cyan-400" />,
      title: "Digital Library Access",
      description: "Access a vast collection of digital books anytime, anywhere. Our platform makes reading accessible to everyone."
    },
    {
      icon: <Users className="h-8 w-8 text-cyan-400" />,
      title: "Community-Driven",
      description: "Join a community of book lovers. Share your reading progress and discover new books through recommendations."
    },
    {
      icon: <Clock className="h-8 w-8 text-cyan-400" />,
      title: "Reading Progress Tracking",
      description: "Keep track of your reading journey with our built-in progress tracking system. Never lose your page again."
    },
    {
      icon: <Target className="h-8 w-8 text-cyan-400" />,
      title: "Personalized Experience",
      description: "Get notifications about new books, track your reading history, and receive personalized book recommendations."
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            Welcome to{" "}
            <motion.span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600"
              animate={{ 
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              Overbooked
            </motion.span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-400 max-w-3xl mx-auto"
            {...fadeInUp}
          >
            Your digital sanctuary for books, where technology meets the timeless joy of reading.
          </motion.p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div 
          className="bg-[#121212] rounded-2xl shadow-xl p-8 mb-16 border border-gray-800"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="flex items-center justify-center mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Heart className="h-12 w-12 text-cyan-400 mr-4" />
            <h2 className="text-3xl font-bold text-white">Our Mission</h2>
          </motion.div>
          <motion.p 
            className="text-lg text-gray-400 text-center max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            At Overbooked, we believe that knowledge should be accessible to everyone. 
            Our mission is to create a seamless digital library experience that encourages 
            reading, learning, and community engagement. We're committed to breaking down 
            barriers to education and making literature available at your fingertips.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-[#121212] rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 border border-gray-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
            >
              <motion.div 
                className="flex items-center mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold ml-4 text-white">{feature.title}</h3>
              </motion.div>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Why Overbooked */}
        <motion.div 
          className="bg-gradient-to-r from-cyan-900 to-cyan-800 rounded-2xl shadow-xl p-8 text-white"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="flex items-center justify-center mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="h-12 w-12 mr-4 text-cyan-300" />
            <h2 className="text-3xl font-bold">Why Overbooked?</h2>
          </motion.div>
          <motion.div 
            className="space-y-4 max-w-4xl mx-auto text-lg text-gray-200"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              Overbooked was born from a simple observation: in our digital age, 
              accessing and managing books should be as effortless as any other 
              digital content. We've created a platform that combines the traditional 
              library experience with modern technology.
            </motion.p>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              Our platform offers unique features like real-time reading progress 
              tracking, instant notifications for new books, and a community-driven 
              approach to library management. Whether you're a student, professional, 
              or casual reader, Overbooked adapts to your reading habits.
            </motion.p>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              We're more than just a digital library - we're a community of readers, 
              learners, and knowledge seekers. Join us in our mission to make reading 
              more accessible, engaging, and enjoyable in the digital age.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AboutUs; 