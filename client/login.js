function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('form').forEach(f => f.classList.remove('active'));

  document.querySelector(`.tab[onclick*="${tab}"]`).classList.add('active');
  document.getElementById(tab).classList.add('active');
}
function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('form').forEach(f => f.classList.remove('active'));
  document.querySelector(`.tab[onclick*="${tab}"]`).classList.add('active');
  document.getElementById(tab).classList.add('active');
}

function openDialog() {
  document.getElementById('forgotDialog').style.display = 'flex';
}

function closeDialog() {
  document.getElementById('forgotDialog').style.display = 'none';
}
