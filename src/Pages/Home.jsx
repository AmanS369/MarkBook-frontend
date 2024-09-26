import React from "react";
import { useNavigate } from "react-router-dom";
const Feature = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-center gap-2 text-blue-600 mb-4">
      {icon}
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-24">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-5xl font-bold mb-6 text-blue-900">
              Welcome to MarkBook
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your Second Brain for Organized Thoughts and Seamless Productivity
            </p>
            <div className="flex gap-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                onClick={() => navigate("/dashboard")}
              >
                Get Started
              </button>
              <button className="border border-blue-600 text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-blue-50 transition duration-300">
                Watch Demo
              </button>
            </div>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              alt="MarkBook Dashboard"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-semibold mb-12 text-center text-blue-900">
            Unlock Your Productivity Potential
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Feature
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              }
              title="Organize Thoughts"
              description="Create spaces for every need and store content efficiently."
            />
            <Feature
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              }
              title="Smart Reminders"
              description="Never forget important tasks with intelligent reminders."
            />
            <Feature
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              }
              title="Audio Notes"
              description="Add audio to your notes for a multi-sensory experience."
            />
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-semibold mb-12 text-center text-blue-900">
            How MarkBook Works
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <img
                src="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                alt="MarkBook Workflow"
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <ol className="list-decimal space-y-4 pl-4">
                <li className="text-lg">
                  Create custom spaces for different projects or areas of your
                  life
                </li>
                <li className="text-lg">
                  Add notes, files, and media to your spaces
                </li>
                <li className="text-lg">
                  Set reminders and deadlines to stay on track
                </li>
                <li className="text-lg">
                  Access your second brain from any device, anytime
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Testimonial Section */}
        <div className="mb-24 bg-blue-100 rounded-xl p-8">
          <h2 className="text-3xl font-semibold mb-8 text-center text-blue-900">
            What Our Users Say
          </h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex-1">
              <p className="italic mb-4">
                "MarkBook has revolutionized the way I organize my thoughts and
                projects. It's like having a supercharged notebook that thinks
                with you!"
              </p>
              <p className="font-semibold">- Sarah K., Product Manager</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex-1">
              <p className="italic mb-4">
                "As a researcher, MarkBook has become indispensable. It's the
                perfect tool for collecting and connecting ideas across
                different projects."
              </p>
              <p className="font-semibold">- Dr. James L., Neuroscientist</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-6 text-blue-900">
            Ready to Supercharge Your Productivity?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join MarkBook today and experience the power of a well-organized
            second brain.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-8 py-3 rounded-lg transition duration-300">
            Start Your Free Trial
          </button>
        </div>
      </div>
    </main>
  );
};

export default Home;
