const Help = () => {
  const helpTopics = [
    {
      title: "Getting Started",
      items: [
        "How to create an account",
        "Browsing the library",
        "Borrowing your first book",
        "Using the digital reader"
      ]
    },
    {
      title: "Managing Your Account",
      items: [
        "Viewing borrowed books",
        "Returning books",
        "Account settings",
        "Reading history"
      ]
    },
    {
      title: "Technical Support",
      items: [
        "PDF reader issues",
        "Login problems",
        "Mobile access",
        "Browser compatibility"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h2>
          <p className="text-lg text-gray-600">
            Find answers to common questions and learn how to make the most of Overbooked
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {helpTopics.map((topic, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{topic.title}</h3>
              <ul className="space-y-2">
                {topic.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <a href="#" className="text-blue-600 hover:text-blue-800">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Can't find what you're looking for?
          </p>
          <a
            href="/contact"
            className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default Help; 