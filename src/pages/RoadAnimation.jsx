import { useEffect, useRef } from "react";

export default function RoadAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas to fill the viewport
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // ROAD EFFECT PARAMETERS (adjust these values as needed)
    const roadSpeed = 2; // Speed of the road movement
    const segmentSpacing = 150; // Vertical spacing between checkered segments
    const roadWidthAtVP = 20; // Road width at the vanishing point (in pixels)
    const leftMargin = 0.2; // Left road edge at 20% of canvas width
    const rightMargin = 0.8; // Right road edge at 80% of canvas width

    // Create an array to hold vertical positions of checkered mid-line segments.
    const segments = [];
    for (let pos = 0; pos < canvas.height; pos += segmentSpacing) {
      segments.push(pos);
    }

    // The animation loop to draw the road perspective
    const animate = () => {
      // Clear canvas each frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Define key positions for perspective
      const vp = { x: canvas.width / 2, y: canvas.height * 0.4 };
      const bl = { x: canvas.width * leftMargin, y: canvas.height };
      const br = { x: canvas.width * rightMargin, y: canvas.height };

      // Draw road edges
      ctx.strokeStyle = "#665c53";
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.moveTo(bl.x, bl.y);
      ctx.lineTo(vp.x - roadWidthAtVP / 2, vp.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(br.x, br.y);
      ctx.lineTo(vp.x + roadWidthAtVP / 2, vp.y);
      ctx.stroke();

      // Draw the moving checkered mid-line segments
      for (let i = 0; i < segments.length; i++) {
        // Update segment position
        segments[i] += roadSpeed;
        if (segments[i] > canvas.height) {
          segments[i] -= canvas.height;
        }

        // Calculate interpolation factor
        const t = segments[i] / canvas.height;
        const xPos = (1 - t) * (canvas.width / 2) + t * vp.x;
        const yPos = (1 - t) * canvas.height + t * vp.y;

        // Adjust segment size for perspective
        const segmentWidth = 20 * (1 - t) + 5;
        const segmentHeight = 10 * (1 - t) + 2;

        // Alternate colors for a checkered effect
        ctx.fillStyle = i % 2 === 0 ? "#ebbdb2" : "#665c53";
        ctx.fillRect(xPos - segmentWidth / 2, yPos - segmentHeight / 2, segmentWidth, segmentHeight);
      }

      // Optional: Add a subtle grunge overlay
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 pointer-events-none"
      style={{ width: "100%", height: "100%", zIndex: 0 }}
    />
  );
}
