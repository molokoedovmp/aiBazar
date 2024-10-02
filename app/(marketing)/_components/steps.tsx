"use client";

import { useState } from 'react';
import Image from 'next/image';

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      number: 1,
      title: 'Выберите инструмент',
      description:
        'Просмотрите нашу библиотеку и выберите подходящий AI инструмент для ваших нужд или воспользуйтесь нашими услугами.',
      image: '/landing/steps/1.png',
    },
    {
      number: 2,
      title: 'Выберете опцию для оплаты',
      description:
        'На выбор дается несколько опций для оплаты услуг. Выберите подходящий вариант.',
      image: '/landing/steps/2.png',
    },
    {
      number: 3,
      title: 'Напишите нашему менеджеру',
      description:
        'После выбора услуги напишите менеджеру и он вам ответит на все вопросы.',
      image: '/landing/steps/3.png',
    },
  ];

  return (
    <section className="min-h-screen flex items-center bg-black">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="flex flex-col h-full">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-white">
            Как это работает
          </h2>
          <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-24 flex-grow">
            <div className="w-full lg:w-[600px] h-[350px] flex-shrink-0">
              <div className="relative w-full h-full">
                <Image
                  src={steps[activeStep - 1].image}
                  alt={`Шаг ${activeStep}`}
                  fill
                  className="rounded-lg shadow-lg object-cover"
                />
              </div>
            </div>
            <div className="w-full lg:flex-grow space-y-12">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`flex items-start space-x-6 cursor-pointer transition-all duration-300 ${
                    activeStep === step.number ? 'scale-105' : 'opacity-70'
                  }`}
                  onClick={() => setActiveStep(step.number)}
                >
                  <div
                    className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold transition-colors duration-300 ${
                      activeStep === step.number
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-300 text-gray-700'
                    }`}
                  >
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-2 text-white">
                      {step.title}
                    </h3>
                    <p className="text-base text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
