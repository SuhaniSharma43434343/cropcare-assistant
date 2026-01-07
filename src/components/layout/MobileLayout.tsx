import { ReactNode } from "react";
import { motion } from "framer-motion";
import BottomNavigation from "./BottomNavigation";

interface MobileLayoutProps {
  children: ReactNode;
  showNav?: boolean;
  className?: string;
}

const MobileLayout = ({ children, showNav = true, className = "" }: MobileLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative overflow-hidden">
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`flex-1 overflow-y-auto no-scrollbar ${showNav ? 'pb-24' : ''} ${className}`}
      >
        {children}
      </motion.main>
      {showNav && <BottomNavigation />}
    </div>
  );
};

export default MobileLayout;
