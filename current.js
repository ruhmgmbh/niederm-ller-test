container.innerHTML = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" fill="black">
  <defs>
    <mask id="hole-mask">
      <!-- black = visible (background shows through), white = covered -->
      <rect width="100%" height="100%" fill="white" />
      <circle id="mask-hole" cx="150" cy="150" r="100" fill="black" />
    </mask>
  </defs>

  <rect width="100%" height="100%" fill="rgba(0,0,0,0.8)" mask="url(#hole-mask)" />
</svg>
`;
