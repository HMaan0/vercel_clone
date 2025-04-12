"use client";
import {
  Code,
  Terminal,
  Cloud,
  Globe,
  Layout,
  Box,
  Github,
  Shield,
  Server,
  Lock,
  RefreshCw,
  Check,
} from "lucide-react";
import { useState, useEffect } from "react";
import Login from "./Login";

export default function Landing() {
  const [isVisible, setIsVisible] = useState({
    header: false,
    features: false,
    testimonials: false,
  });

  useEffect(() => {
    setIsVisible({
      header: true,
      features: true,
      testimonials: true,
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".reveal-item").forEach((item) => {
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white font-sans overflow-hidden">
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="absolute w-64 h-64 rounded-full bg-blue-600/30 blur-3xl -top-10 -left-10 animate-pulse"></div>
        <div
          className="absolute w-96 h-96 rounded-full bg-purple-600/20 blur-3xl top-1/3 right-10 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute w-80 h-80 rounded-full bg-teal-600/20 blur-3xl bottom-10 left-1/4 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="relative z-10">
        <header
          className={`container mx-auto px-6 py-20 md:py-28 text-center transition-all duration-1000 transform ${isVisible.header ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="inline-block mb-6 p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-spin-slow">
            <div className="bg-black p-3 rounded-full">
              <Box className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-400 to-purple-400">
            Deploy Securely. Scale Instantly.
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Deploy your frontend, backend, and fullstack applications in secure
            containers with zero configuration.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
            <Login>
              <span className="w-full relative z-10 ">Deploy Now</span>
            </Login>
          </div>

          {/* Animated container illustration */}
          <div className="mt-16 relative max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 shadow-2xl shadow-blue-900/20">
              <div className="flex items-center mb-3">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="mx-auto flex items-center bg-gray-700 rounded-md px-3 py-1 text-sm text-gray-300">
                  <Lock className="w-3 h-3 mr-2" />{" "}
                  deploy-now.secure.containers.app
                </div>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 font-mono text-sm overflow-hidden relative">
                <div className="animate-typewriter text-green-400">
                  $ deploy-now init myapp
                </div>
                <div
                  className="animate-typewriter-2 text-gray-300"
                  style={{ animationDelay: "1s" }}
                >
                  ✓ Initializing secure container...
                </div>
                <div
                  className="animate-typewriter-3 text-gray-300"
                  style={{ animationDelay: "2s" }}
                >
                  ✓ Environment variables secured
                </div>
                <div
                  className="animate-typewriter-4 text-gray-300"
                  style={{ animationDelay: "3s" }}
                >
                  ✓ Optimizing for production
                </div>
                <div
                  className="animate-typewriter-5 text-green-400"
                  style={{ animationDelay: "4s" }}
                >
                  ✓ Deployment successful! Your app is live at:
                  https://myapp.deploy-now.app
                </div>
                <div className="animate-blink">_</div>
              </div>
            </div>
            <div className="absolute -bottom-3 -right-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full p-2 animate-bounce">
              <RefreshCw className="w-6 h-6" />
            </div>
          </div>
        </header>

        <section
          id="security"
          className="container mx-auto px-6 py-16 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-3xl blur-3xl"></div>
          <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="md:w-1/2 reveal-item opacity-0">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl inline-block mb-4">
                  <Shield className="w-8 h-8" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Container-Based Security
                </h2>
                <p className="text-gray-300 text-lg mb-6">
                  Every deployment runs in its own isolated container, ensuring
                  complete separation between applications and enhanced
                  security.
                </p>
                <ul className="space-y-3">
                  {[
                    "Environment variables are securely stored and never exposed",
                    "Isolated container environments prevent cross-contamination",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="bg-green-600/20 p-1 rounded-full mr-3 mt-1">
                        <Check className="w-4 h-4 text-green-500" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:w-1/2 reveal-item opacity-0">
                <div className="relative aspect-square max-w-md mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full animate-pulse"></div>
                  <div
                    className="absolute inset-4 bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-full animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                  <div
                    className="absolute inset-8 bg-gradient-to-br from-blue-600/40 to-purple-600/40 rounded-full animate-pulse"
                    style={{ animationDelay: "1s" }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-gray-800 rounded-2xl border border-gray-700 p-5 shadow-xl w-4/5 h-4/5 flex items-center justify-center">
                      <Lock className="w-20 h-20 text-blue-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="container mx-auto px-6 py-16">
          <h2
            className={`text-3xl md:text-5xl font-bold mb-6 text-center transition-all duration-1000 transform ${isVisible.features ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            Everything You Need to{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Deploy Fast
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-16 text-center max-w-3xl mx-auto">
            Built for developers who need reliable, secure, and effortless
            deployments
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Server className="w-6 h-6" />,
                color: "red",
                title: "Container Technology",
                description:
                  "Isolated containers ensure maximum security and consistent behavior across environments.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group reveal-item opacity-0 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-600/10 hover:-translate-y-1"
              >
                <div className="h-1 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                <div className="p-6">
                  <div
                    className={`bg-${feature.color}-600/20 p-3 rounded-lg inline-block mb-4 transition-all duration-300 group-hover:bg-${feature.color}-600/30`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-6 py-16">
          <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="reveal-item opacity-0">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Deploy Any Application Type
                </h2>
                <p className="text-gray-300 text-lg mb-8">
                  Our platform supports the full spectrum of modern web
                  applications with optimized configurations for each type.
                </p>
                <div className="space-y-6">
                  {[
                    {
                      title: "Frontend Applications",
                      description:
                        "Static sites, SPAs, and JAMstack applications with global CDN distribution.",
                      icon: <Layout className="w-5 h-5" />,
                      color: "blue",
                    },
                    {
                      title: "Backend Services",
                      description:
                        "API servers, microservices, and data processing applications in secure containers.",
                      icon: <Server className="w-5 h-5" />,
                      color: "green",
                    },
                    {
                      title: "Fullstack Applications",
                      description:
                        "Combined frontend and backend deployments with seamless integration.",
                      icon: <Code className="w-5 h-5" />,
                      color: "purple",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start">
                      <div
                        className={`bg-${item.color}-600/20 p-2 rounded-lg mr-4`}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{item.title}</h4>
                        <p className="text-gray-400">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className={`container mx-auto px-6 py-16 transition-all duration-1000 transform ${isVisible.testimonials ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
            Loved by Developers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "DeployNow has completely transformed our deployment workflow. The container security gives us peace of mind, and what used to take hours now happens automatically in minutes.",
                author: "Alex Chen",
                position: "Senior Developer, TechStart",
              },
              {
                text: "As a freelancer, DeployNow gives me enterprise-level deployment capabilities at a price I can afford. The isolated containers ensure my clients' applications stay secure and reliable.",
                author: "Miguel Rodriguez",
                position: "Freelance Developer",
              },
              {
                text: "The ability to deploy both frontend and backend in secure containers has made our development process so much more efficient. Our team can't imagine working without it now.",
                author: "Sarah Johnson",
                position: "Frontend Lead, DesignCo",
              },
            ].map((testimonial, i) => (
              <div key={i} className="group reveal-item opacity-0">
                <div className="h-full bg-gray-900 border border-gray-800 rounded-xl p-6 transition-all duration-300 hover:border-blue-600/30 hover:shadow-lg hover:shadow-blue-600/10">
                  <div className="flex space-x-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <svg
                        key={j}
                        className="w-5 h-5 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 text-lg">
                    &quot;{testimonial.text}&quot;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gradient-to-b from-black to-gray-900 border-t border-gray-800 py-16">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start mb-12">
              <div className="mb-8 md:mb-0">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                    <Box className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-xl">DeployNow</span>
                </div>
                <p className="text-gray-400 max-w-md mb-6">
                  Secure container deployments for frontend, backend, and
                  fullstack applications.
                </p>
                <div className="flex space-x-4">
                  {["twitter", "github", "discord", "youtube"].map(
                    (platform) => (
                      <a
                        key={platform}
                        href="#"
                        className="text-gray-500 hover:text-white transition-colors p-2 bg-gray-800 rounded-full hover:bg-gray-700"
                      >
                        <span className="sr-only">{platform}</span>
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0110 2.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </a>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="font-bold text-lg mb-4">Product</h3>
                  <ul className="space-y-2">
                    {["Features", "Pricing", "Security", "Documentation"].map(
                      (item) => (
                        <li key={item}>
                          <a
                            href="#"
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            {item}
                          </a>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-4">Resources</h3>
                  <ul className="space-y-2">
                    {["Guides", "Templates", "API Reference", "Status"].map(
                      (item) => (
                        <li key={item}>
                          <a
                            href="#"
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            {item}
                          </a>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-4">Company</h3>
                  <ul className="space-y-2">
                    {["About", "Blog", "Careers", "Contact"].map((item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-4">Legal</h3>
                  <ul className="space-y-2">
                    {["Privacy", "Terms", "Security", "Cookies"].map((item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-500 text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()} DeployNow. All rights reserved.
              </div>
              <div className="flex space-x-6">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Add CSS animations */}
      <style jsx global>{`
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        @keyframes typewriter {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
        .animate-typewriter,
        .animate-typewriter-2,
        .animate-typewriter-3,
        .animate-typewriter-4,
        .animate-typewriter-5 {
          overflow: hidden;
          white-space: nowrap;
          width: 0;
          border-right: 2px solid transparent;
          animation: typewriter 2s steps(40) forwards;
        }
        @keyframes blink {
          from,
          to {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
