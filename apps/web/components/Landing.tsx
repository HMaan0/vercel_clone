import {
  Code,
  Terminal,
  Cloud,
  Globe,
  Layout,
  Box,
  Github,
  Check,
} from "lucide-react";
import Login from "./Login";

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <header className="container mx-auto px-6 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Deploy Your Next Project
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto">
          The platform for developers, providing the speed and reliability you
          need to create at your best.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
          <Login>Deploy</Login>
        </div>
      </header>

      <section id="features" className="container mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
          Everything You Need to Deploy Fast
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="bg-blue-600 p-3 rounded-lg inline-block mb-4">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Global CDN</h3>
            <p className="text-gray-400">
              Deploy your sites to a global edge network for lightning-fast
              loading times anywhere in the world.
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="bg-purple-600 p-3 rounded-lg inline-block mb-4">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">CLI Workflow</h3>
            <p className="text-gray-400">
              Use our powerful command line tools to deploy, manage, and scale
              your projects with ease.
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="bg-green-600 p-3 rounded-lg inline-block mb-4">
              <Code className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Framework Auto-Detection</h3>
            <p className="text-gray-400">
              We automatically detect and optimize builds for React, Next.js,
              Vue, and more.
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="bg-yellow-600 p-3 rounded-lg inline-block mb-4">
              <Github className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Git Integration</h3>
            <p className="text-gray-400">
              Connect to GitHub, GitLab, or Bitbucket for automatic deployments
              on every push.
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="bg-red-600 p-3 rounded-lg inline-block mb-4">
              <Layout className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Preview Deployments</h3>
            <p className="text-gray-400">
              Every pull request gets its own preview deployment for easy
              testing and collaboration.
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="bg-teal-600 p-3 rounded-lg inline-block mb-4">
              <Cloud className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Serverless Functions</h3>
            <p className="text-gray-400">
              Add API functionality with serverless functions that scale
              automatically with your traffic.
            </p>
          </div>
        </div>
      </section>

      <section id="pricing" className="container mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
          Simple, Transparent Pricing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
            <h3 className="text-xl font-bold mb-2">Hobby</h3>
            <p className="text-gray-400 mb-6">Perfect for personal projects</p>
            <div className="text-4xl font-bold mb-6">Free</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <Check className="text-green-500 w-5 h-5 mr-2" />
                <span>Unlimited deployments</span>
              </li>
              <li className="flex items-center">
                <Check className="text-green-500 w-5 h-5 mr-2" />
                <span>Basic analytics</span>
              </li>
              <li className="flex items-center">
                <Check className="text-green-500 w-5 h-5 mr-2" />
                <span>Custom domains</span>
              </li>
              <li className="flex items-center">
                <Check className="text-green-500 w-5 h-5 mr-2" />
                <span>Community support</span>
              </li>
            </ul>
            <button className="w-full px-6 py-3 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition-colors">
              Get Started
            </button>
          </div>

          <div className="bg-gray-900 p-8 rounded-lg border border-blue-600 relative">
            <div className="absolute top-0 right-0 bg-blue-600 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
              POPULAR
            </div>
            <h3 className="text-xl font-bold mb-2">Pro</h3>
            <p className="text-gray-400 mb-6">For growing teams</p>
            <div className="text-4xl font-bold mb-6">
              $20
              <span className="text-lg font-normal text-gray-400">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <Check className="text-green-500 w-5 h-5 mr-2" />
                <span>Everything in Hobby</span>
              </li>
              <li className="flex items-center">
                <Check className="text-green-500 w-5 h-5 mr-2" />
                <span>Team collaboration</span>
              </li>
              <li className="flex items-center">
                <Check className="text-green-500 w-5 h-5 mr-2" />
                <span>Advanced analytics</span>
              </li>
              <li className="flex items-center">
                <Check className="text-green-500 w-5 h-5 mr-2" />
                <span>Password protection</span>
              </li>
              <li className="flex items-center">
                <Check className="text-green-500 w-5 h-5 mr-2" />
                <span>Priority support</span>
              </li>
            </ul>
            <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors">
              Start Free Trial
            </button>
          </div>

          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
            <h3 className="text-xl font-bold mb-2">Enterprise</h3>
            <p className="text-gray-400 mb-6">For large organizations</p>
            <div className="text-4xl font-bold mb-6">Custom</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <Check className="text-green-500 w-5 h-5 mr-2" />
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-center">
                <Check className="text-green-500 w-5 h-5 mr-2" />
                <span>Dedicated infrastructure</span>
              </li>
              <li className="flex items-center">
                <Check className="text-green-500 w-5 h-5 mr-2" />
                <span>Custom SLAs</span>
              </li>
              <li className="flex items-center">
                <Check className="text-green-500 w-5 h-5 mr-2" />
                <span>SSO & SAML</span>
              </li>
              <li className="flex items-center">
                <Check className="text-green-500 w-5 h-5 mr-2" />
                <span>24/7 support</span>
              </li>
            </ul>
            <button className="w-full px-6 py-3 border border-white rounded-md font-medium hover:bg-white hover:text-black transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-6 py-16 bg-gradient-to-b from-black to-gray-900">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
          Loved by Developers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="flex space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-300 mb-6">
              &quot;DeployNow has completely transformed our deployment
              workflow. What used to take hours now happens automatically in
              minutes.&quot;
            </p>
            <div>
              <p className="font-bold">Alex Chen</p>
              <p className="text-gray-500 text-sm">
                Senior Developer, TechStart
              </p>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="flex space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-300 mb-6">
              &quot;The preview deployments feature has made our review process
              so much more efficient. Our team can&apos;t imagine working
              without it now.&quot;
            </p>
            <div>
              <p className="font-bold">Sarah Johnson</p>
              <p className="text-gray-500 text-sm">Frontend Lead, DesignCo</p>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="flex space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-300 mb-6">
              &quot;As a freelancer, DeployNow gives me enterprise-level
              deployment capabilities at a price I can afford. The serverless
              functions are a game-changer.&quot;
            </p>
            <div>
              <p className="font-bold">Miguel Rodriguez</p>
              <p className="text-gray-500 text-sm">Freelance Developer</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to deploy faster?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of developers who have already simplified their
            deployment workflow.
          </p>
          <button className="px-8 py-4 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition-colors">
            Start for Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Enterprise
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Guides
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Templates
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    API Reference
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    YouTube
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Box className="w-6 h-6" />
              <span className="font-bold text-lg">DeployNow</span>
            </div>
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} DeployNow. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
