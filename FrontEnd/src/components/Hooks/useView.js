import { useEffect, useRef, useState } from "react";

export  function useInView(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // IMPORTANT
        }
      },
      {
        threshold: 1, //mean tigger when the respective container will be visible 20%
        rootMargin: "0px 0px -150px 0px", //tigger 100px before the element enters in the viewport
        ...options,
      }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}
