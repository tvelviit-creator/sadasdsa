const fs = require('fs');

try {
  let svgContent = fs.readFileSync('public/registration_welcome.svg', 'utf8');

  // Replace colors with CSS variables for light/dark theme support
  svgContent = svgContent.replace(/fill="#050505"/g, 'fill="var(--bg-color)"');
  svgContent = svgContent.replace(/fill="#F5F5F5"/g, 'fill="var(--text-primary)"');
  svgContent = svgContent.replace(/fill="#141414"/g, 'fill="var(--bg-color)"');
  svgContent = svgContent.replace(/fill="#999999"/g, 'fill="var(--text-secondary)"');

  svgContent = svgContent.replace(/stop-color="#F5F5F5"/g, 'stopColor="var(--text-primary)"');

  // React camelCase attributes
  svgContent = svgContent.replace(/stroke-width/g, 'strokeWidth');
  svgContent = svgContent.replace(/stroke-linecap/g, 'strokeLinecap');
  svgContent = svgContent.replace(/stroke-dasharray/g, 'strokeDasharray');
  svgContent = svgContent.replace(/color-interpolation-filters/g, 'colorInterpolationFilters');
  svgContent = svgContent.replace(/stop-opacity/g, 'stopOpacity');
  svgContent = svgContent.replace(/stop-color/g, 'stopColor');

  // Support className prop
  svgContent = svgContent.replace('<svg ', '<svg className={className} ');

  const componentContent = `import React from 'react';\n\nexport default function RegistrationWelcomeSVG({ className }: { className?: string }) {\n  return (\n    ${svgContent}\n  );\n}\n`;

  fs.writeFileSync('src/app/registration/RegistrationWelcomeSVG.tsx', componentContent);
  console.log('Successfully written RegistrationWelcomeSVG.tsx');
} catch (e) {
  console.error("Error processing SVG:", e);
}
