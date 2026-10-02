// Content stays visible without JavaScript; entering the viewport only adds motion.
if ('IntersectionObserver' in window) {
  const reveals = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('motion-reveal');
      reveals.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.section-heading, .benefit, .reason, .portfolio-grid figure, .studio-statement > *, .quote-copy').forEach(element => reveals.observe(element));
}

// Local preview only. Native validation runs first; never transmit or persist inputs.
document.querySelectorAll('.preview-form').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    form.querySelector('.preview-result').textContent = 'Preview checked. Nothing was sent or saved. Call Shine Squad to discuss your vehicle.';
  });
});
