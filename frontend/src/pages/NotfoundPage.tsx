    import { motion } from 'framer-motion';
import { Wrench } from 'lucide-react';
import DashboardLayout from '@/components/dashboardLayout';
export default function NotFoundPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <DashboardLayout>
    <div className="h-screen bg-white flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-lg w-full text-center"
      >
        {/* Icon */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center justify-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="bg-blue-500 p-6 rounded-2xl"
          >
            <Wrench className="w-12 h-12 text-white" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
        >
          Sedang Dikerjakan
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-gray-600 text-lg"
        >
          Halaman ini sedang dalam tahap pengembangan.
        </motion.p>
        <motion.div 
        animate={{ color: ["#3b82f6", "#a855f7", "#84cc16", "#3b82f6"], rotate: [0, 10, -20, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        >
            <motion.p 
                variants={itemVariants}
                className=" text-lg mb-8">
                    Miheelyu@dev
            </motion.p>
        </motion.div>
        {/* Dots indicator */}
       
      </motion.div>
    </div>
    </DashboardLayout>
  );
}