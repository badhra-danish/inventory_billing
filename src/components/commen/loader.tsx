// export default function Loader() {
//   return (
//     <div className="flex items-center justify-center w-full h-full p-4">
//       <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
//     </div>
//   );
// }
import React from "react";
import { motion } from "framer-motion";

const Loader: React.FC = () => {
  const barVariants = {
    initial: { scaleY: 0.3, opacity: 0.5 },
    animate: {
      scaleY: [0.3, 1, 0.3],
      opacity: [0.5, 1, 0.5],
    },
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {/* Reduced height from h-12 to h-6 and narrowed the gap */}
      <div className="flex items-end justify-center gap-1 h-6 w-12">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            variants={barVariants}
            initial="initial"
            animate="animate"
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.12,
            }}
            // Reduced width from w-2 to w-1
            className="w-1 bg-blue-600 rounded-full origin-bottom"
            style={{
              height: "100%",
              boxShadow: "0px 0px 4px rgba(37, 99, 235, 0.3)",
            }}
          />
        ))}
      </div>

      {/* Smaller text to match the icon scale */}
      <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">
        Loading
      </span>
    </div>
  );
};

export default Loader;
