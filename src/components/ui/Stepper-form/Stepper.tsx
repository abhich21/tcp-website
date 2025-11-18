// tumul901/tcp-website/tcp-website-d66ffaf1bb64fc577ab80a112ef9305a0440dc75/src/components/ui/Stepper-form/Stepper.tsx
// src/components/ui/Stepper-form/Stepper.tsx
import React, {
  useState,
  Children,
  useRef,
  useLayoutEffect,
  HTMLAttributes,
  ReactNode,
  forwardRef,
  useImperativeHandle, // <-- Import useImperativeHandle
} from "react";
import { motion, AnimatePresence, Variants } from "motion/react";
import ShineButton from "../ShineButton"; // Make sure this path is correct

// 1. Import renamed .module.css file
import styles from "./Stepper.module.css";

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  stepCircleContainerClassName?: string;
  stepContainerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  backButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  nextButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  backButtonText?: string;
  nextButtonText?: string;
  disableStepIndicators?: boolean;
  renderStepIndicator?: (props: RenderStepIndicatorProps) => ReactNode;
}

interface RenderStepIndicatorProps {
  step: number;
  currentStep: number;
  onStepClick: (clicked: number) => void;
}

// --- New definition for the exposed ref handle ---
export interface StepperHandle {
  setActiveStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  complete: () => void;
}

// --- Wrap the component in forwardRef ---
const Stepper = forwardRef<StepperHandle, StepperProps>(
  (
    {
      children,
      initialStep = 1,
      onStepChange = () => {},
      onFinalStepCompleted = () => {},
      stepCircleContainerClassName = "",
      stepContainerClassName = "",
      contentClassName = "",
      footerClassName = "",
      backButtonProps = {},
      nextButtonProps = {},
      backButtonText = "Back",
      nextButtonText = "Continue",
      disableStepIndicators = false,
      renderStepIndicator,
      ...rest
    },
    ref // <-- Receive the ref
  ) => {
    const [currentStep, setCurrentStep] = useState<number>(initialStep);
    const [direction, setDirection] = useState<number>(0);
    const stepsArray = Children.toArray(children);
    const totalSteps = stepsArray.length;
    const isCompleted = currentStep > totalSteps;
    const isLastStep = currentStep === totalSteps;

    const updateStep = (newStep: number) => {
      // Ensure step is within bounds (1 to totalSteps + 1)
      const clampedStep = Math.max(
        1,
        Math.min(newStep, totalSteps + 1)
      );

      // Only update if the step is actually changing
      if (clampedStep === currentStep) return;

      setDirection(clampedStep > currentStep ? 1 : -1);
      setCurrentStep(clampedStep);

      if (clampedStep > totalSteps) {
        onFinalStepCompleted();
      } else {
        onStepChange(clampedStep);
      }
    };

    const handleBack = () => {
      if (currentStep > 1) {
        updateStep(currentStep - 1);
      }
    };

    const handleNext = () => {
      if (!isLastStep) {
        updateStep(currentStep + 1);
      }
    };

    const handleComplete = () => {
      updateStep(totalSteps + 1);
    };

    // --- Expose controls to the parent component via ref ---
    useImperativeHandle(ref, () => ({
      /**
       * Sets the active step. Step index is 0-based.
       * (e.g., 0 for Step 1, 1 for Step 2)
       */
      setActiveStep: (stepIndex: number) => {
        updateStep(stepIndex + 1); // Convert 0-based index to 1-based step
      },
      nextStep: handleNext,
      prevStep: handleBack,
      complete: handleComplete,
    }));

    return (
      // 2. All classNames converted to camelCase
      <div className={styles.outerContainer} {...rest}>
        <div
          className={`${styles.stepCircleContainer} ${stepCircleContainerClassName}`}
        >
          <div className={`${styles.stepIndicatorRow} ${stepContainerClassName}`}>
            {stepsArray.map((_, index) => {
              const stepNumber = index + 1;
              const isNotLastStep = index < totalSteps - 1;
              return (
                <React.Fragment key={stepNumber}>
                  {renderStepIndicator ? (
                    renderStepIndicator({
                      step: stepNumber,
                      currentStep,
                      onStepClick: (clicked) => {
                        updateStep(clicked);
                      },
                    })
                  ) : (
                    <StepIndicator
                      step={stepNumber}
                      disableStepIndicators={disableStepIndicators}
                      currentStep={currentStep}
                      onClickStep={(clicked) => {
                        updateStep(clicked);
                      }}
                    />
                  )}
                  {isNotLastStep && (
                    <StepConnector isComplete={currentStep > stepNumber} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <StepContentWrapper
            isCompleted={isCompleted}
            currentStep={currentStep}
            direction={direction}
            className={`${styles.stepContentDefault} ${contentClassName}`}
          >
            {stepsArray[currentStep - 1]}
          </StepContentWrapper>

          {!isCompleted && (
            <div className={`${styles.footerContainer} ${footerClassName}`}>
              <div
                className={`${styles.footerNav} ${
                  currentStep !== 1 ? styles.spread : styles.end
                }`}
              >
                {currentStep !== 1 && (
                  <button
                    onClick={handleBack}
                    className={`${styles.backButton} ${
                      currentStep === 1 ? styles.inactive : ""
                    }`}
                    {...backButtonProps}
                  >
                    {backButtonText}
                  </button>
                )}
                {/* Using ShineButton as requested */}
                <ShineButton
                  onClick={isLastStep ? handleComplete : handleNext}
                  className={styles.nextButton}
                  {...nextButtonProps}
                >
                  {isLastStep ? "Complete" : nextButtonText}
                </ShineButton>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);
Stepper.displayName = "Stepper";
export default Stepper;

// --- Wrapper Components (Previously truncated) ---

interface StepContentWrapperProps {
  isCompleted: boolean;
  currentStep: number;
  direction: number;
  children: ReactNode;
  className?: string;
}

function StepContentWrapper({
  isCompleted,
  currentStep,
  direction,
  children,
  className,
}: StepContentWrapperProps) {
  const [parentHeight, setParentHeight] = useState<number>(0);

  return (
    <motion.div
      className={className}
      style={{ position: "relative", overflow: "hidden" }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: "spring", duration: 0.4 }}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition
            key={currentStep}
            direction={direction}
            onHeightReady={(h) => setParentHeight(h)}
          >
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface SlideTransitionProps {
  children: ReactNode;
  direction: number;
  onHeightReady: (h: number) => void;
}

function SlideTransition({
  children,
  direction,
  onHeightReady,
}: SlideTransitionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      onHeightReady(containerRef.current.offsetHeight);
    }
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ position: "absolute", left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  );
}

const stepVariants: Variants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? "100%" : "-100%", // <-- FIXED
    opacity: 0,
  }),
  center: {
    x: "0%",
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? "-100%" : "100%", // <-- FIXED
    opacity: 0,
  }),
};
// --- Child 'Step' Component ---

interface StepProps {
  children: ReactNode;
}

export function Step({ children }: StepProps): JSX.Element {
  return <div className={styles.stepDefault}>{children}</div>;
}

// --- Step Indicator Components ---

interface StepIndicatorProps {
  step: number;
  currentStep: number;
  onClickStep: (step: number) => void;
  disableStepIndicators?: boolean;
}

function StepIndicator({
  step,
  currentStep,
  onClickStep,
  disableStepIndicators,
}: StepIndicatorProps) {
  const status =
    currentStep === step
      ? "active"
      : currentStep < step
      ? "inactive"
      : "complete";

  const handleClick = () => {
    if (step !== currentStep && !disableStepIndicators) {
      onClickStep(step);
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      className={styles.stepIndicator}
      animate={status}
      initial={false}
    >
      <motion.div
        variants={{
          inactive: { scale: 1, backgroundColor: "#222", color: "#a3a3a3" },
          active: { scale: 1, backgroundColor: "#9ae600", color: "#5227FF" },
          complete: { scale: 1, backgroundColor: "#016630", color: "#3b82f6" },
        }}
        transition={{ duration: 0.3 }}
        className={styles.stepIndicatorInner}
      >
        {status === "complete" ? (
          <CheckIcon className={styles.checkIcon} />
        ) : status === "active" ? (
          <div className={styles.activeDot} />
        ) : (
          <span className={styles.stepNumber}>{step}</span>
        )}
      </motion.div>
    </motion.div>
  );
}

interface StepConnectorProps {
  isComplete: boolean;
}

function StepConnector({ isComplete }: StepConnectorProps) {
  const lineVariants: Variants = {
    incomplete: { width: 0, backgroundColor: "transparent" },
    complete: { width: "100%", backgroundColor: "#9ae600" },
  };

  return (
    <div className={styles.stepConnector}>
      <motion.div
        className={styles.stepConnectorInner}
        variants={lineVariants}
        initial={false}
        animate={isComplete ? "complete" : "incomplete"}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

// --- Check Icon Component ---

interface CheckIconProps extends React.SVGProps<SVGSVGElement> {}

function CheckIcon(props: CheckIconProps) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.1, type: "tween", ease: "easeOut", duration: 0.3 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}