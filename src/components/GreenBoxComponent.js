import { Camera, Leaf } from "lucide-react";
import { motion } from "framer-motion";

const GreenBoxComponent = ({ onScanClick, isLoading = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl gradient-primary p-6 shadow-glow"
      style={{
        background: 'linear-gradient(135deg, hsl(142, 76%, 36%) 0%, hsl(142, 76%, 46%) 100%)',
        boxShadow: '0 0 40px -10px hsl(142 76% 36% / 0.4)'
      }}
    >
      {/* Main Content */}
      <div className="relative z-10">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Protect Your Crops
        </h2>
        
        {/* Subtext */}
        <p className="text-white/80 text-sm mb-6 max-w-[200px]" style={{ fontFamily: 'Inter, sans-serif' }}>
          Detect diseases early and get expert treatment recommendations instantly.
        </p>
        
        {/* Button */}
        <button
          onClick={onScanClick}
          disabled={isLoading}
          className="inline-flex items-center gap-2 bg-white/20 text-white border border-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm"
          style={{
            minHeight: '44px',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Camera className="w-5 h-5" />
              Scan Your Crop
            </>
          )}
        </button>
      </div>
      
      {/* Background Decorative Elements */}
      <div 
        className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(48px)'
        }}
      />
      
      <motion.div 
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-4 top-4 w-24 h-24 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(255, 255, 255, 0.2)' }}
      >
        <Leaf className="w-12 h-12" style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
      </motion.div>
    </motion.div>
  );
};

export default GreenBoxComponent;