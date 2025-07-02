import { useRef, useCallback } from 'react';

export const use3DTilt = () => {
  const elementRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculate distance from center (normalized -1 to 1)
    const deltaX = (mouseX - centerX) / (rect.width / 2);
    const deltaY = (mouseY - centerY) / (rect.height / 2);
    
    // Apply 3D transforms based on mouse position
    const rotateX = -deltaY * 20; // Tilt forward/backward
    const rotateY = deltaX * 20;  // Tilt left/right
    const translateX = deltaX * 5; // Slight horizontal movement
    const translateY = deltaY * 5; // Slight vertical movement
    
    // Apply transform directly as inline style
    elementRef.current.style.transform = `
      translateY(${translateY}px) 
      translateX(${translateX}px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      scale(1.05)
    `;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!elementRef.current) return;
    
    // Reset transform when mouse leaves
    elementRef.current.style.transform = 'translateY(0px) translateX(0px) rotateX(0deg) rotateY(0deg) scale(1)';
  }, []);

  return {
    elementRef,
    handleMouseMove,
    handleMouseLeave
  };
}; 
