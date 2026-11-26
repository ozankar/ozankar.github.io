// A symmetric block-sparse example with strict diagonal dominance admits Cholesky without pivoting.
const n = 64;
const input = Array.from({length:n}, () => new Array(n).fill(false));
for (let row = 0; row < n; row++) {
  for (let col = 0; col <= row; col++) {
    const gap = row - col;
    const block = Math.floor(row / 8) === Math.floor(col / 8);
    const bridge = (gap === 16 && col % 8 <= 3) || (gap === 32 && col % 8 >= 5);
    input[row][col] = input[col][row] = gap <= 1 || (block && gap <= 5) || bridge;
  }
}
const filled = input.map(row => [...row]);
for (let k = 0; k < n; k++) {
  const neighbors = [];
  for (let i = k + 1; i < n; i++) if (filled[i][k]) neighbors.push(i);
  for (const i of neighbors) for (const j of neighbors) filled[i][j] = true;
}
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
function draw(mode) {
  ctx.clearRect(0,0,640,640);
  for (let i=0; i<n; i++) {
    for (let j=0; j<n; j++) {
      const active = mode === 'A' ? input[i][j] : j <= i && filled[i][j];
      ctx.fillStyle = active ? (input[i][j] ? '#20574d' : '#8c561b') : '#becbb8';
      const size = active ? 7.7 : 1.5;
      ctx.fillRect(j*10+(10-size)/2,i*10+(10-size)/2,size,size);
    }
  }
  const description = mode === 'A' ? 'Illustrative input matrix A' : 'Factor L · fill-in in ochre';
  document.querySelector('#caption').textContent = description;
  canvas.setAttribute('aria-label',description);
  for (const button of document.querySelectorAll('[data-mode]')) button.setAttribute('aria-pressed',String(button.dataset.mode === mode));
}
for (const button of document.querySelectorAll('[data-mode]')) button.addEventListener('click',() => draw(button.dataset.mode));
draw('A');
