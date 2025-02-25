import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, BookOpen, Sparkles, Zap, Users, TrendingUp, ChevronRight } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Learning",
    description: "Adaptive lessons tailored to your unique learning style and pace.",
  },
  {
    icon: BookOpen,
    title: "Vast Course Library",
    description: "Access a wide range of subjects from basic to advanced levels.",
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description: "Get real-time assessments and personalized improvement suggestions.",
  },
  {
    icon: Users,
    title: "Collaborative Learning",
    description: "Connect with peers and participate in AI-moderated study groups.",
  },
]

const testimonials = [
  {
    name: "Sarah L.",
    role: "High School Student",
    content:
      "Learnify has completely transformed my study habits. The AI tutor feels like it truly understands my needs!",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Michael R.",
    role: "Adult Learner",
    content:
      "As a busy professional, Learnify's flexibility is a game-changer. I can learn at my own pace, anytime, anywhere.",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Dr. Emily T.",
    role: "Education Researcher",
    content: "The adaptive learning algorithms in Learnify are truly impressive. It's the future of education.",
    avatar: "/placeholder.svg?height=100&width=100",
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
     
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 animate-gradient font-display">
                  Revolutionize Your Learning with AI
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 font-sans">
                  Experience personalized, adaptive learning powered by cutting-edge artificial intelligence.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="relative group">

                <Link href="/gallery">
                  <Button 
                    className="absolute right-1 top-1 rounded-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold transition-all duration-300 ease-in-out transform group-hover:scale-105"
                    type="submit"
                  >
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Start your learning journey today and Now.
                </p>
                  </Button>
                </Link>
                </form>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 animate-blob"></div>
            <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-tl from-blue-400 to-green-400 rounded-full opacity-20 animate-blob animation-delay-2000"></div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 font-display">
              Why Choose Learnify?
            </h2>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="backdrop-blur-lg bg-white/50 dark:bg-gray-800/50 border-2 border-purple-100 dark:border-purple-900 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  <CardHeader>
                    <feature.icon className="h-12 w-12 mb-2 text-purple-600 dark:text-purple-400" />
                    <CardTitle className="font-display">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 font-display">
              What Our Learners Say
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
                >
                  <CardHeader className="flex items-center gap-4">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <div>
                      <CardTitle className="text-lg font-semibold font-display">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">{testimonial.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-display">
                  Ready to Transform Your Learning?
                </h2>
                <p className="mx-auto max-w-[700px] text-purple-100 md:text-xl">
                  Join thousands of learners who are already experiencing the power of AI-driven education.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="relative group">
                  <Link href={"/gallery"}>
                  <Button
                    className="absolute my-2 left-20 rounded-full px-2 py-4 bg-purple-800 text-white font-semibold transition-all duration-300 ease-in-out transform group-hover:scale-105 hover:bg-purple-700"
                    type="submit"
                  >
                    Start Learning
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white dark:bg-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 Learnify. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-gray-500 dark:text-gray-400" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-500 dark:text-gray-400" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

