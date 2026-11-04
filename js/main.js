(function(){
  'use strict';
  var WHATS = '5516996424878'; /* WhatsApp da clínica (formato 55 + DDD + número) */

  var burger = document.querySelector('.js-burger'), mnav = document.getElementById('mnav');
  burger.addEventListener('click', function(){
    var on = mnav.classList.toggle('on');
    burger.setAttribute('aria-expanded', on ? 'true' : 'false');
  });
  mnav.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ mnav.classList.remove('on'); burger.setAttribute('aria-expanded','false'); });
  });

  var fab = document.getElementById('fab');
  window.addEventListener('scroll', function(){
    fab.classList.toggle('on', window.scrollY > 700);
  }, {passive:true});

  var cnt = document.getElementById('cnt'), cnt2 = document.getElementById('cnt2'), msg = document.getElementById('chkmsg');
  document.querySelectorAll('#checks .chk').forEach(function(b){
    b.addEventListener('click', function(){
      b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      var n = document.querySelectorAll('#checks .chk[aria-pressed="true"]').length;
      cnt.textContent = n; cnt2.textContent = n;
      msg.classList.toggle('on', n >= 3);
    });
  });

  var ovl = document.getElementById('ovl'), bar = document.getElementById('bar');
  var steps = [].slice.call(document.querySelectorAll('.m-step'));
  var answers = {}, trail = [], lastFocus = null;

  function show(n){
    steps.forEach(function(s){ s.classList.toggle('on', +s.dataset.step === n); });
    bar.style.width = (n > 5 ? 100 : n * 20) + '%';
    if (n === 5) {
      document.getElementById('sum').innerHTML =
        '<span><b>Deslocamento:</b> ' + (answers[1] || 'não informado') + '</span>' +
        '<span><b>Dor:</b> ' + (answers[3] || 'não informado') + '</span>' +
        '<span><b>Tempo:</b> ' + (answers[4] || 'não informado') + '</span>';
    }
    var f = document.querySelector('.m-step.on .opt, .m-step.on input, .m-step.on .btn');
    if (f) { try { f.focus({preventScroll:true}); } catch(e){} }
  }
  function open(){
    lastFocus = document.activeElement;
    ovl.classList.add('on'); document.body.classList.add('no-scroll');
    trail = [1]; show(1);
  }
  function close(){
    ovl.classList.remove('on'); document.body.classList.remove('no-scroll');
    if (lastFocus) { try { lastFocus.focus(); } catch(e){} }
  }
  document.querySelectorAll('.js-open').forEach(function(b){ b.addEventListener('click', open); });
  document.querySelectorAll('.js-close').forEach(function(b){ b.addEventListener('click', close); });
  ovl.addEventListener('click', function(e){ if (e.target === ovl) close(); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && ovl.classList.contains('on')) close(); });

  document.querySelectorAll('.m-step .opt').forEach(function(b){
    b.addEventListener('click', function(){
      var step = +b.closest('.m-step').dataset.step;
      answers[step] = b.dataset.v;
      var next = step + 1;
      if (step === 1 && b.dataset.v.indexOf('Não consigo') === 0) next = 6;
      if (step === 2 && b.dataset.v.indexOf('Só posso') === 0) next = 7;
      trail.push(next); show(next);
    });
  });
  document.querySelectorAll('.js-back').forEach(function(b){
    b.addEventListener('click', function(){
      trail.pop();
      show(trail[trail.length - 1] || 1);
    });
  });

  var fone = document.getElementById('fone');
  fone.addEventListener('input', function(){
    var v = fone.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) v = '(' + v.slice(0,2) + ') ' + v.slice(2, v.length > 10 ? 7 : 6) + '-' + v.slice(v.length > 10 ? 7 : 6);
    else if (v.length > 2) v = '(' + v.slice(0,2) + ') ' + v.slice(2);
    else if (v.length) v = '(' + v;
    fone.value = v;
  });

  var nome = document.getElementById('nome');
  var eN = document.getElementById('err-nome'), eF = document.getElementById('err-fone');
  nome.addEventListener('input', function(){ eN.classList.remove('on'); });
  fone.addEventListener('input', function(){ eF.classList.remove('on'); });

  document.getElementById('send').addEventListener('click', function(){
    var ok = true;
    if (nome.value.trim().length < 2) { eN.classList.add('on'); ok = false; }
    if (fone.value.replace(/\D/g, '').length < 10) { eF.classList.add('on'); ok = false; }
    if (!ok) return;

    var txt = 'Olá, Felippe! Meu nome é ' + nome.value.trim() + '.'
      + '\nDeslocamento: ' + (answers[1] || 'não informado')
      + '\nMinha dor na coluna: ' + (answers[3] || 'não informado')
      + '\nHá quanto tempo: ' + (answers[4] || 'não informado')
      + '\nMeu WhatsApp: ' + fone.value
      + '\nGostaria de agendar uma consulta.';
    window.open('https://wa.me/' + WHATS + '?text=' + encodeURIComponent(txt), '_blank');
  });
})();
