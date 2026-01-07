import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Users, Award, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { ThemeToggle } from '../components/ui/ThemeToggle';

const features = [
  {
    icon: BookOpen,
    title: 'Unlimited Courses',
    description: 'Access thousands of courses across various subjects and skill levels',
  },
  {
    icon: Users,
    title: 'Expert Teachers',
    description: 'Learn from industry professionals and experienced educators',
  },
  {
    icon: Award,
    title: 'Certifications',
    description: 'Earn recognized certificates upon course completion',
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    description: 'Monitor your learning journey with detailed analytics',
  },
];

const stats = [
  { label: 'Active Students', value: '50K+' },
  { label: 'Courses Available', value: '1,200+' },
  { label: 'Expert Teachers', value: '500+' },
  { label: 'Completion Rate', value: '95%' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-light-bg via-light-surface-secondary to-light-bg dark:from-dark-bg dark:via-dark-surface-secondary dark:to-dark-bg">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-light-border dark:border-dark-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-gradient">
            IQ Didactic
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-light-text-primary dark:text-dark-text-primary mb-6">
              Master New Skills
              <br />
              <span className="text-gradient">Transform Your Future</span>
            </h1>
            <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary mb-8 max-w-2xl mx-auto">
              Join the world's leading learning platform. Learn from experts, earn certifications,
              and advance your career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                  Start Learning Free
                </Button>
              </Link>
              <Link to="/courses">
                <Button variant="secondary" size="lg">
                  Explore Courses
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          >
            {stats.map((stat, index) => (
              <Card key={index} hover={false} className="text-center">
                <CardContent className="pt-6">
                  <p className="text-3xl md:text-4xl font-bold text-gradient mb-2">{stat.value}</p>
                  <p className="text-light-text-secondary dark:text-dark-text-secondary">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
              Why Choose IQ Didactic?
            </h2>
            <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
              Everything you need to succeed in your learning journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="text-center p-12 bg-gradient-primary text-white">
              <CardHeader>
                <CardTitle className="text-white text-3xl md:text-4xl mb-4">
                  Ready to Start Learning?
                </CardTitle>
                <CardDescription className="text-white/90 text-lg mb-8">
                  Join thousands of students already learning on IQ Didactic
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/signup">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-white text-accent hover:bg-white/90"
                  >
                    Create Free Account
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-light-border dark:border-dark-border">
        <div className="container mx-auto text-center text-light-text-secondary dark:text-dark-text-secondary">
          <p>© 2026 IQ Didactic. Built with ❤️ for learners worldwide.</p>
        </div>
      </footer>
    </div>
  );
}
