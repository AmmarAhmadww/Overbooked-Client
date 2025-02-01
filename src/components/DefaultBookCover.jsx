const DefaultBookCover = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="text-center p-4">
        <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">No Cover Available</p>
      </div>
    </div>
  );
};

export default DefaultBookCover; 