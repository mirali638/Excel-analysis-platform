import React from "react";
import ScrollToTop from "../components/ScrollToTop";

const About = () => {
  <ScrollToTop />;
  return (
    <div className="min-h-screen bg-white p-8 text-gray-800 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-6 text-shadow-black">
        About Excel Analysis Platform
      </h1>
      <p className="max-w-3xl text-center text-lg mb-8 leading-relaxed">
        Our Excel Analysis Platform is designed to empower users to effortlessly
        upload and analyze Excel files, visualize data dynamically, and gain
        actionable insights through powerful 2D and 3D charting capabilities.
        Whether you're a data analyst, business professional, or enthusiast, our
        platform makes complex data approachable and interactive.
      </p>
      <div className="max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
        <div className="rounded-lg p-6  border bg-green-800 text-white shadow-md hover:shadow-xl transition hover:scale-105 cursor-pointer">
          <h2 className="text-2xl font-bold mb-3">Upload & Process</h2>
          <p>
            Seamlessly upload your Excel files with support for .xls and .xlsx
            formats and prepare your data for visualization and analysis.
          </p>
        </div>
        <div className="rounded-lg p-6  border bg-green-800 text-white shadow-md hover:shadow-xl transition hover:scale-105 cursor-pointer">
          <h2 className="text-2xl font-bold mb-3">Dynamic Visualization</h2>
          <p>
            Create a variety of 2D and 3D charts including bar, line, pie,
            scatter, and radar to understand your data better.
          </p>
        </div>
        <div className="rounded-lg p-6  border bg-green-800 text-white shadow-md hover:shadow-xl transition hover:scale-105 cursor-pointer">
          <h2 className="text-2xl font-bold mb-3">Interactive & Responsive</h2>
          <p>
            Our platform is fully responsive and interactive ensuring a smooth
            data exploration experience on any device.
          </p>
        </div>
      </div>
      <section className="max-w-4xl w-full pt-6 px-4 mx-auto">
        <h2 className="text-4xl font-extrabold text-center mb-10 text-green-800  inline-block pb-2">
          Legal Information
        </h2>

        <div className="space-y-8">
          {/* Terms and Conditions */}
          <div className="bg-gray-100 p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-2xl font-semibold text-lime-700 mb-3">
              Terms and Conditions
            </h3>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using the Excel Analysis Platform, you agree to
              comply with these Terms and Conditions. Our platform is provided
              “as is” without warranties of any kind. You agree not to misuse
              the platform or attempt unauthorized access to our systems.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              We reserve the right to update these terms at any time. Continued
              use after changes constitutes acceptance of the new terms.
            </p>
          </div>

          {/* Privacy Policy */}
          <div className="bg-gray-100 p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-2xl font-semibold text-lime-700 mb-3">
              Privacy Policy
            </h3>
            <p className="text-gray-700 leading-relaxed">
              We respect your privacy and are committed to protecting your
              personal information. We collect data only to improve your
              experience and will never sell your information to third parties.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              Our platform uses cookies to personalize content and analyze
              traffic. You can control cookie settings in your browser.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
