const FAQ = () => {
  const faqs = [
    {
      question: "How do I borrow a book?",
      answer: "To borrow a book, simply browse our collection, click on the book you want, and click the 'Issue Book' button. You'll need to be logged in to borrow books."
    },
    {
      question: "How long can I keep a borrowed book?",
      answer: "Books can be borrowed for up to 14 days. You can return them earlier if you finish reading."
    },
    {
      question: "How many books can I borrow at once?",
      answer: "You can borrow up to 3 books at a time."
    },
    {
      question: "Are the books free to borrow?",
      answer: "Yes, all books in our digital library are free to borrow for registered users."
    },
    {
      question: "Can I read books offline?",
      answer: "Yes, you can download PDF versions of books for offline reading while they're issued to you."
    },
    {
      question: "What happens if I don't return a book on time?",
      answer: "Your borrowing privileges may be temporarily suspended until you return the overdue book."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ; 