import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sparkles, BookOpen, Video, Brain, Search, ChevronRight, Star } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

const trendingQuests = [
  { title: "Digital Art Mastery", image: "/placeholder.svg?height=200&width=300" },
  { title: "Creative Writing Workshop", image: "/placeholder.svg?height=200&width=300" },
  { title: "Music Production 101", image: "/placeholder.svg?height=200&width=300" },
  { title: "Innovative Design Thinking", image: "/placeholder.svg?height=200&width=300" },
  { title: "Photography Essentials", image: "/placeholder.svg?height=200&width=300" },
  { title: "Culinary Creativity", image: "/placeholder.svg?height=200&width=300" },
  { title: "Fashion Design Fundamentals", image: "/placeholder.svg?height=200&width=300" },
  { title: "Mindful Creativity", image: "/placeholder.svg?height=200&width=300" },
]

const testimonials = [
  { name: "Sarah L.", role: "Aspiring Artist", content: "CreativeTutor AI transformed my artistic journey. The personalized lessons and AI-curated resources helped me improve faster than I ever thought possible.", avatar: "/placeholder.svg?height=100&width=100" },
  { name: "Michael R.", role: "Entrepreneur", content: "As a busy entrepreneur, CreativeTutor AI's flexibility is a game-changer. I can learn at my own pace and the AI adapts to my unique learning style.", avatar: "/placeholder.svg?height=100&width=100" },
  { name: "Emily T.", role: "Student", content: "CreativeTutor AI made learning fun again! The interactive lessons and creative challenges keep me engaged and excited to learn more every day.", avatar: "/placeholder.svg?height=100&width=100" },
]

const faqs = [
  { question: "How does CreativeTutor AI work?", answer: "CreativeTutor AI uses advanced artificial intelligence to create personalized learning experiences. It analyzes your interests, learning style, and goals to craft custom courses and provide real-time feedback on your progress." },
  { question: "Can I learn multiple subjects?", answer: "CreativeTutor AI supports a wide range of creative subjects, from digital art to music production. You can explore multiple areas or focus deeply on one, depending on your interests." },
  { question: "Is CreativeTutor AI suitable for beginners?", answer: "Yes, CreativeTutor AI is designed for learners of all levels. Whether you're a complete beginner or looking to refine advanced skills, the AI adapts to your current level and helps you progress at your own pace." },
  { question: "How often is the content updated?", answer: "Our AI constantly scans for the latest trends, techniques, and information in creative fields. This means the content is continuously updated to ensure you're learning the most current and relevant material." },
  { question: "Can I interact with human tutors or other students?", answer: "While CreativeTutor AI focuses on personalized AI-driven learning, we also offer community forums where you can connect with fellow learners. For certain premium courses, we provide options for live sessions with expert human tutors." },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <header className="px-4 lg:px-6 h-16 flex items-center backdrop-blur-md bg-white/30 dark:bg-gray-800/30 sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
        <Link className="flex items-center justify-center" href="#">
          <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 dark:from-purple-400 dark:via-pink-400 dark:to-orange-400">CreativeTutor AI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {["Features", "Courses", "Pricing", "Contact"].map((item) => (
            <Link key={item} className="text-sm font-medium text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors relative group" href="#">
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 dark:bg-purple-400 transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </nav>
        <div className="ml-4">
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none animate-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent dark:from-purple-400 dark:via-pink-400 dark:to-orange-400">
                  Unleash Your Creative Genius with AI
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-700 md:text-xl dark:text-gray-300 animate-fade-in-up">
                  Dive into a world of endless possibilities with AI-powered courses tailored to ignite your imagination and fuel your passion.
                </p>
              </div>
              <div className="w-full max-w-md space-y-2 animate-fade-in-up">
                <form className="relative group">
                  <Input 
                    className="w-full pl-12 pr-20 py-6 text-lg rounded-full border-2 border-purple-300 focus:border-purple-500 dark:border-purple-700 dark:focus:border-purple-500 transition-all duration-300 ease-in-out shadow-lg focus:shadow-purple-300/50 dark:focus:shadow-purple-700/50" 
                    placeholder="What sparks your curiosity?" 
                    type="text" 
                  />
                  <Button 
                    className="absolute right-2 top-2 rounded-full px-5 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold transition-all duration-300 ease-in-out transform group-hover:scale-105"
                    type="submit"
                  >
                    Inspire Me
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Sparkles className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-purple-500 animate-pulse" />
                </form>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full opacity-20 animate-blob dark:from-purple-700 dark:to-pink-700"></div>
            <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-tl from-orange-300 to-yellow-300 rounded-full opacity-20 animate-blob animation-delay-2000 dark:from-orange-700 dark:to-yellow-700"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-gradient-to-tr from-blue-300 to-green-300 rounded-full opacity-20 animate-blob animation-delay-4000 dark:from-blue-700 dark:to-green-700"></div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-800 relative overflow-hidden">
          <div className="container px-4 md:px-6 relative z-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 animate-text">Ignite Your Learning Journey</h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              {[
                { icon: Brain, title: "AI-Crafted Brilliance", description: "Our AI weaves captivating course materials, tailored to your unique creative spark.", color: "purple" },
                { icon: Video, title: "Visual Inspiration", description: "Immerse yourself in AI-curated video content from visionary creators and educators.", color: "pink" },
                { icon: Search, title: "Boundless Exploration", description: "From abstract art to quantum physics, craft a course on any subject that ignites your passion.", color: "orange" }
              ].map((feature, index) => (
                <Card key={index} className="group backdrop-blur-lg bg-white/50 dark:bg-gray-800/50 border-2 border-purple-100 dark:border-purple-900 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
                  <CardHeader>
                    <feature.icon className={`h-12 w-12 mb-2 text-${feature.color}-600 dark:text-${feature.color}-400 group-hover:animate-bounce`} />
                    <CardTitle className={`text-${feature.color}-600 dark:text-${feature.color}-400 group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-${feature.color}-600 group-hover:to-pink-600 dark:group-hover:from-${feature.color}-400 dark:group-hover:to-pink-400`}>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors duration-300">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 bg-grid-gray-200/[0.03] dark:bg-grid-gray-700/[0.03] -z-10"></div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
          <div className="container px-4 md:px-6 relative z-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 animate-text">Trending Creative Quests</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {trendingQuests.map((quest, index) => (
                <Card key={index} className="overflow-hidden group hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={quest.image || "/placeholder.svg"}
                      alt={quest.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 ease-in-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100"></div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">{quest.title}</h3>
                    <Button variant="outline" className="w-full mt-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900 transition-all duration-300">
                      Explore Quest
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 bg-grid-gray-200/[0.03] dark:bg-grid-gray-700/[0.03] -z-10"></div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-800 relative overflow-hidden">
          <div className="container px-4 md:px-6 relative z-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 animate-text">What Our Students Say</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="flex items-center gap-4">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <div>
                      <CardTitle className="text-lg font-semibold">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">{testimonial.content}</p>
                  </CardContent>
                  <div className="absolute top-4 right-4 text-yellow-400">
                    <Star className="fill-current" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 bg-grid-gray-200/[0.03] dark:bg-grid-gray-700/[0.03] -z-10"></div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
          <div className="container px-4 md:px-6 relative z-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 animate-text">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-lg font-semibold">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="absolute inset-0 bg-grid-gray-200/[0.03] dark:bg-grid-gray-700/[0.03] -z-10"></div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 animate-text">Embark on Your Creative Odyssey</h2>
                <p className="mx-auto max-w-[700px] text-gray-700 md:text-xl dark:text-gray-300">
                  Enter any topic and watch as our AI conjures a personalized creative journey just for you.
                </p>
              </div>
              <div className="w-full max-w-md space-y-2">
                <form className="relative group">
                  <Input 
                    className="w-full pl-12 pr-20 py-6 text-lg rounded-full border-2 border-purple-300 focus:border-purple-500 dark:border-purple-700 dark:focus:border-purple-500 transition-all duration-300 ease-in-out shadow-lg focus:shadow-purple-300/50 dark:focus:shadow-purple-700/50" 
                    placeholder="Your next creative adventure awaits..." 
                    type="text" 
                  />
                  <Button 
                    className="absolute right-2 top-2 rounded-full px-5 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold transition-all duration-300 ease-in-out transform group-hover:scale-105"
                    type="submit"
                  >
                    Create Course
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                  <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-purple-500 dark:text-purple-400 animate-pulse" />
                </form>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-grid-gray-200/[0.03] dark:bg-grid-gray-700/[0.03] -z-10"></div>
        </section>
      </main>
      <footer className="w-full py-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">© 2023 CreativeTutor AI. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6 mt-4 md:mt-0">
            {["Terms of Service", "Privacy Policy", "FAQ"].map((item) => (
              <Link key={item} className="text-sm text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors" href="#">
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  )
}

