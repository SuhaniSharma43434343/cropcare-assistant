import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick, 
  className = '', 
  gradient = 'from-blue-50 to-indigo-50',
  iconColor = 'text-blue-600',
  iconBg = 'bg-blue-100',
  size = 'normal',
  children,
  showArrow = true
}) => {
  const sizeClasses = {
    small: 'p-4',
    normal: 'p-6',
    large: 'p-8'
  };

  return (
    <motion.div
      onClick={onClick}
      className={`
        bg-gradient-to-br ${gradient} rounded-2xl border border-white/50 
        shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer
        backdrop-blur-sm hover:scale-[1.02] group
        ${sizeClasses[size]} ${className}
      `}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between h-full">
        <div className="flex-1">
          {/* Icon */}
          <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-gray-800 transition-colors">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {description}
              </p>
            )}
            {children}
          </div>
        </div>

        {/* Arrow */}
        {showArrow && (
          <motion.div
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            whileHover={{ x: 2 }}
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default FeatureCard;