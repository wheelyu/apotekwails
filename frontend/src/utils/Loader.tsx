
interface DotsLoaderProps {
  className?: string;
}

export const DotsLoader: React.FC<DotsLoaderProps> = ({ className = '' }) => {
  return (
    <div className={`flex space-x-2 ${className}`}>
      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  );
};