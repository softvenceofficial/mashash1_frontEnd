import { useEffect, useRef } from "react";
import "./SnowEffect.css";

export default function SnowEffect() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particleCount = 80;
    const particles: HTMLDivElement[] = [];

    const resetParticle = (particle: HTMLDivElement) => {
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.opacity = "0";
      return { x: posX, y: posY };
    };

    const animateParticle = (particle: HTMLDivElement) => {
      if (!particle.isConnected) return;

      const pos = resetParticle(particle);
      const duration = Math.random() * 10 + 10;
      const delay = Math.random() * 5;

      setTimeout(() => {
        if (!particle.isConnected) return;

        particle.style.transition = `all ${duration}s linear`;
        particle.style.opacity = `${Math.random() * 0.3 + 0.1}`;
        
        const moveX = pos.x + (Math.random() * 20 - 10);
        const moveY = pos.y - Math.random() * 30;

        particle.style.left = `${moveX}%`;
        particle.style.top = `${moveY}%`;

        setTimeout(() => {
          if (particle.isConnected) animateParticle(particle);
        }, duration * 1000);
      }, delay * 1000);
    };

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "snow-particle";
      const size = Math.random() * 3 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      container.appendChild(particle);
      particles.push(particle);
      animateParticle(particle);
    }

    const handleMouseMove = (e: MouseEvent) => {
       if (!container) return;

       const mouseX = (e.clientX / window.innerWidth) * 100;
       const mouseY = (e.clientY / window.innerHeight) * 100;
       
       const particle = document.createElement('div');
       particle.className = 'snow-particle';
       
       const size = Math.random() * 4 + 2;
       particle.style.width = `${size}px`;
       particle.style.height = `${size}px`;
       particle.style.left = `${mouseX}%`;
       particle.style.top = `${mouseY}%`;
       particle.style.opacity = '0.6';
       
       container.appendChild(particle);

       setTimeout(() => {
           if (!particle.isConnected) return;
           particle.style.transition = 'all 2s ease-out';
           particle.style.left = `${mouseX + (Math.random() * 10 - 5)}%`;
           particle.style.top = `${mouseY + (Math.random() * 10 - 5)}%`;
           particle.style.opacity = '0';
           
           setTimeout(() => {
               if (particle.isConnected) particle.remove();
           }, 2000);
       }, 10);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      particles.forEach((p) => p.remove());
      if (container) container.innerHTML = "";
    };
  }, []);

  return (
    <div ref={containerRef} className="snow-container"></div>
  );
}
