import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';
import { PROMISE_STEPS, type PromiseStep } from '../data/catalog';
import { EditorialReveal, StaggerGrid, StaggerItem } from './MotionPrimitives';

function StepIcon({ icon }: { icon: PromiseStep['icon'] }) {
  switch (icon) {
    case 'truck':
      return <Truck className="w-5 h-5" />;
    case 'shield':
      return <ShieldCheck className="w-5 h-5" />;
    case 'refresh':
      return <RefreshCw className="w-5 h-5" />;
    case 'headphones':
      return <Headphones className="w-5 h-5" />;
  }
}

export function FourStepsPromise() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-[#FAF3EC] to-[#FDF9F6]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <EditorialReveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-[11px] font-medium text-[#9D8576] mb-2">
              عهد شوک به شما
            </p>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#241A14]">
              چهار قدم تا یک تجربه بی‌دغدغه
            </h2>
            <p className="text-xs sm:text-sm text-[#7D6D63] mt-3">
              از انتخاب پارچه تا لحظه تحویل، هر مرحله با وسواس آتلیه شوک همراه است تا خریدی
              مطمئن و لوکس را تجربه کنید.
            </p>
          </div>
        </EditorialReveal>

        <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {PROMISE_STEPS.map((step, idx) => {
            const isActive = activeIndex === idx;
            return (
              <StaggerItem key={step.number}>
                <motion.button
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className={`w-full h-full relative rounded-3xl p-6 text-right border transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-[#261B15] text-white border-[#3A2B22] shadow-xl shadow-[#261B15]/15'
                      : 'bg-white text-[#241A14] border-[#EFE3D8] shadow-[0_6px_22px_rgba(36,26,20,0.03)] hover:border-[#D7BFA9]'
                  }`}
                >
                  {/* Top row: Icon box & Step label */}
                  <div className="flex items-start justify-between mb-6 relative z-10">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${
                        isActive
                          ? 'bg-white/10 border-white/15 text-[#E5B88E]'
                          : 'bg-[#FAF3EC] border-[#EFE3D8] text-[#8A5026]'
                      }`}
                    >
                      <StepIcon icon={step.icon} />
                    </div>
                    <span
                      className={`text-[11px] font-medium ${
                        isActive ? 'text-[#C2AE9F]' : 'text-[#9A8577]'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {/* Subtle step number */}
                  <span
                    aria-hidden="true"
                    className={`absolute top-2 right-5 text-5xl font-extrabold select-none pointer-events-none tabular-nums-fa ${
                      isActive ? 'text-white/[0.06]' : 'text-[#241A14]/[0.04]'
                    }`}
                  >
                    {step.number}
                  </span>

                  <div className="relative z-10">
                    <h3 className="text-base font-bold mb-2">{step.title}</h3>
                    <p
                      className={`text-xs leading-6 ${
                        isActive ? 'text-[#D6C6B9]' : 'text-[#7C6D63]'
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </motion.button>
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      </div>
    </section>
  );
}
