import { motion } from 'framer-motion';
import { EASE_OUT } from './motionPresets';

/**
 * Fades + slides its children in the first time they scroll into view.
 * Renders its own wrapper element (`as`), so hover transforms on the child
 * (e.g. .pwm-card--hover) are not overridden by framer-motion's inline transform.
 * Reduced-motion users get opacity only (see MotionConfig in WorkWithMePage).
 */
export default function Reveal({ as = 'div', delay = 0, y = 24, amount = 0.2, className, children, ...rest }) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.6, ease: EASE_OUT, delay }}
      {...rest}
    >
      {children}
    </Component>
  );
}

