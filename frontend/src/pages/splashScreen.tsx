import { motion } from 'framer-motion'
import { Activity,  } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
const SplashScreen = () => {
    const [countDown, setCountDown] = useState(3)
    const navigate = useNavigate()
    useEffect(() => {
        if (countDown > 0) {
            const timer = setInterval(() => {
                setCountDown(countDown - 1)
            }, 1000)
            return () => clearInterval(timer)
        }
    }, [countDown])

    useEffect(() => {
        if (countDown === 0) {
            setTimeout(() => {
                navigate('/login')
            }, 1200)
        }
    }, [countDown])
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center overflow-hidden"
    >
      <div className="relative">
        {/* Animated circles background */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-20 -left-20 w-40 h-40 bg-white rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute -bottom-20 -right-20 w-60 h-60 bg-white rounded-full"
        />
        
        {/* Main content */}
        <div className="relative z-10 text-center">
          {/* Logo with animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="mb-6"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-2xl shadow-2xl">
              <Activity className="w-14 h-14 text-blue-600" strokeWidth={2.5} />
            </div>
          </motion.div>
          
          {/* Title with fade in animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
              Sehatin
            </h1>
            <p className="text-xl text-blue-100 font-light">
              Sistem Manajemen Klinik
            </p>
          </motion.div>
          
          {/* Loading indicator */}
          <div className="mt-12 flex justify-center gap-2">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
                className="w-3 h-3 bg-white rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SplashScreen