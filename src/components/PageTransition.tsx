import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();

  // 페이지 전환 애니메이션 variants
  const pageVariants = {
    initial: {
      opacity: 0,
      x: 20,
      scale: 0.98,
    },
    in: {
      opacity: 1,
      x: 0,
      scale: 1,
    },
    out: {
      opacity: 0,
      x: -20,
      scale: 0.98,
    },
  };

  // 부드러운 스프링 전환
  const pageTransition = {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  };

  return (
    <AnimatePresence mode="sync">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
