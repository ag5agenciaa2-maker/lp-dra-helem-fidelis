/* =====================================================================
   Dra Helem Fidélis — script.js
   JavaScript Vanilla ES6 — sem dependências externas
   ===================================================================== */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ---------------------------------------------------------------
       1. REVEAL ao rolar (IntersectionObserver)
    --------------------------------------------------------------- */
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
      reveals.forEach(function (el) { io.observe(el); });
      // segurança: garante visibilidade mesmo se o observer falhar
      setTimeout(function () { reveals.forEach(function (el) { el.classList.add('visible'); }); }, 3500);
    } else {
      reveals.forEach(function (el) { el.classList.add('visible'); });
    }

    /* ---------------------------------------------------------------
       2. CONTADORES animados
    --------------------------------------------------------------- */
    var counters = document.querySelectorAll('[data-count]');
    function runCount(el) {
      if (el.dataset.counted) return;
      el.dataset.counted = '1';
      var raw = el.getAttribute('data-count');
      var target = parseFloat(raw);
      var dec = raw.indexOf('.') > -1 ? 1 : 0;
      var dur = 1500, t0 = performance.now();
      function step(t) {
        var p = Math.min((t - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(dec).replace('.', ',');
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(dec).replace('.', ',');
      }
      requestAnimationFrame(step);
    }
    if ('IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { cio.observe(el); });
    } else {
      counters.forEach(runCount);
    }

    /* ---------------------------------------------------------------
       3. NAVBAR — estado ao rolar + menu mobile
    --------------------------------------------------------------- */
    var nav = document.getElementById('nav');
    var burger = document.getElementById('burger');
    var drawer = document.getElementById('drawer');
    var drawerOverlay = document.getElementById('drawerOverlay');
    var drawerClose = document.getElementById('drawerClose');

    var navRaf = false;
    function onScroll() {
      if (navRaf) return;
      navRaf = true;
      requestAnimationFrame(function () {
        navRaf = false;
        if (window.scrollY > 40) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    function openDrawer() {
      if (!drawer) return;
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      if (drawerOverlay) { drawerOverlay.hidden = false; drawerOverlay.classList.add('open'); }
      if (burger) burger.setAttribute('aria-expanded', 'true');
      nav.classList.add('open');
      document.body.classList.add('no-scroll');
    }
    function closeDrawer() {
      if (!drawer) return;
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      if (drawerOverlay) {
        drawerOverlay.classList.remove('open');
        setTimeout(function () { drawerOverlay.hidden = true; }, 450);
      }
      if (burger) burger.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
      document.body.classList.remove('no-scroll');
    }

    if (burger) {
      burger.addEventListener('click', function () {
        if (drawer && drawer.classList.contains('open')) closeDrawer();
        else openDrawer();
      });
    }
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
    if (drawer) {
      drawer.querySelectorAll('[data-close]').forEach(function (a) {
        a.addEventListener('click', closeDrawer);
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) closeDrawer();
    });

    /* ---------------------------------------------------------------
       4. DEPOIMENTOS — carrossel de cards (slide + auto + swipe)
    --------------------------------------------------------------- */
    var revTrack = document.getElementById('revTrack');
    if (revTrack) {
      var revCards = Array.prototype.slice.call(revTrack.children);
      var revPrev = document.getElementById('revPrev');
      var revNext = document.getElementById('revNext');
      var revDots = document.getElementById('revDots');
      var page = 0, pages = 1, perView = 3, maxShift = 0, revTimer = null;

      function perViewFor() {
        var w = window.innerWidth;
        return w <= 600 ? 1 : (w <= 900 ? 2 : 3);
      }
      function metrics() {
        var first = revCards[0];
        var cardW = first.getBoundingClientRect().width;
        var gap = parseFloat(getComputedStyle(revTrack).columnGap) || 0;
        return { step: cardW + gap, gap: gap };
      }
      function build() {
        perView = perViewFor();
        pages = Math.max(1, revCards.length - perView + 1); // desliza 1 card por vez
        var m = metrics();
        // scrollWidth do Chrome ignora o padding direito; somamos de volta p/ alinhar a última posição
        var padRight = parseFloat(getComputedStyle(revTrack).paddingRight) || 0;
        maxShift = revTrack.scrollWidth + padRight - revTrack.parentElement.clientWidth;
        revTrack._step = m.step;
        if (page > pages - 1) page = pages - 1;

        // (re)cria os dots
        revDots.innerHTML = '';
        revDots._dots = [];
        for (var i = 0; i < pages; i++) {
          (function (idx) {
            var b = document.createElement('button');
            b.className = 'tw-dot' + (idx === page ? ' active' : '');
            b.setAttribute('aria-label', 'Ir para o grupo ' + (idx + 1));
            b.addEventListener('click', function () { go(idx); restart(); });
            revDots.appendChild(b);
            revDots._dots.push(b);
          })(i);
        }
        apply();
      }
      function apply() {
        var shift = Math.min(page * revTrack._step, maxShift);
        if (shift < 0) shift = 0;
        revTrack.style.transform = 'translateX(-' + shift + 'px)';
        if (revDots._dots) revDots._dots.forEach(function (d, i) { d.classList.toggle('active', i === page); });
        if (revPrev) revPrev.disabled = page === 0;
        if (revNext) revNext.disabled = page >= pages - 1;
      }
      function go(i) { page = Math.max(0, Math.min(i, pages - 1)); apply(); }
      function restart() {
        clearInterval(revTimer);
        revTimer = setInterval(function () { go(page >= pages - 1 ? 0 : page + 1); }, 5500);
      }

      if (revPrev) revPrev.addEventListener('click', function () { go(page - 1); restart(); });
      if (revNext) revNext.addEventListener('click', function () { go(page + 1); restart(); });

      // swipe no mobile
      var startX = 0, dragging = false;
      revTrack.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; dragging = true; clearInterval(revTimer); }, { passive: true });
      revTrack.addEventListener('touchend', function (e) {
        if (!dragging) return; dragging = false;
        var dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) go(dx < 0 ? page + 1 : page - 1);
        restart();
      });

      revTrack.parentElement.addEventListener('mouseenter', function () { clearInterval(revTimer); });
      revTrack.parentElement.addEventListener('mouseleave', restart);

      var rzTimer = null;
      window.addEventListener('resize', function () { clearTimeout(rzTimer); rzTimer = setTimeout(build, 180); });

      build();
      restart();
    }

    /* ---------------------------------------------------------------
       5. FAQ — acordeão
    --------------------------------------------------------------- */
    var faqList = document.getElementById('faqList');
    if (faqList) {
      var items = Array.prototype.slice.call(faqList.querySelectorAll('.faq-item'));
      items.forEach(function (item) {
        var btn = item.querySelector('.faq-item__btn');
        btn.addEventListener('click', function () {
          var wasOpen = item.classList.contains('open');
          items.forEach(function (it) {
            it.classList.remove('open');
            it.querySelector('.faq-item__btn').setAttribute('aria-expanded', 'false');
          });
          if (!wasOpen) {
            item.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
          }
        });
      });
    }

    /* ---------------------------------------------------------------
       6. FORMULÁRIO — validação + envio via WhatsApp
    --------------------------------------------------------------- */
    var form = document.getElementById('contactForm');
    if (form) {
      var formOk = document.getElementById('formOk');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var nome = form.nome, email = form.email, tel = form.tel, servico = form.servico, mensagem = form.mensagem;

        function mark(id, invalid) {
          document.getElementById(id).classList.toggle('invalid', invalid);
        }
        var digits = (tel.value || '').replace(/\D/g, '');
        var badNome = nome.value.trim().length < 2;
        var badEmail = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
        var badTel = digits.length < 10;
        var badServico = !servico.value;

        mark('field-nome', badNome);
        mark('field-email', badEmail);
        mark('field-tel', badTel);
        mark('field-servico', badServico);

        if (badNome || badEmail || badTel || badServico) {
          formOk.classList.remove('show');
          return;
        }

        var linhas = [
          'Olá, me chamo ' + nome.value.trim() + ', vim através do site e gostaria de uma informação.',
          '',
          '- E-mail: ' + email.value.trim(),
          '- Telefone: ' + tel.value.trim(),
          '- Tratamento: ' + servico.value
        ];
        if (mensagem.value.trim()) linhas.push('- Mensagem: ' + mensagem.value.trim());

        window.open('https://wa.me/5521979937234?text=' + encodeURIComponent(linhas.join('\n')), '_blank');
        formOk.classList.add('show');
        form.reset();
      });

      // limpa o estado de erro ao digitar
      form.querySelectorAll('input, select').forEach(function (el) {
        el.addEventListener('input', function () {
          var field = el.closest('.field');
          if (field) field.classList.remove('invalid');
        });
      });
    }

    /* ---------------------------------------------------------------
       6. WHATSAPP PREMIUM — Balão flutuante (AG5 V4)
          t=0s   → usuário chega em #servicos (3ª seção) → botão aparece
          t=25s  → balão sobe (typing 2.5s → mensagem)
          t=40s  → balão some (15s visível)
          Compliance CRO: sem badge de notificação
    --------------------------------------------------------------- */
    (function initWaPremium() {
      var MODO_COMPLIANCE = true; // odonto (CRO) = nicho rigoroso → SEM badge

      var bubble        = document.getElementById('wa-message-bubble');
      var typing        = document.getElementById('wa-typing');
      var realMessage   = document.getElementById('wa-real-message');
      var badge         = document.getElementById('wa-notification');
      var closeBtn      = document.getElementById('wa-close-btn');
      var mainBtn       = document.getElementById('wa-main-btn');
      var targetSection = document.getElementById('servicos');

      if (!bubble || !typing || !realMessage || !closeBtn || !mainBtn || !targetSection) return;

      var DELAY_BALAO            = 25000;
      var DURATION_TYPING        = 2500;
      var DURATION_BALAO_VISIVEL = 15000;
      var DELAY_BADGE_APOS_SUMIR = 5000;

      var triggered = false;
      var autoHideTimer = null;
      var badgeTimer = null;
      var userClosed = false;

      var waObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !triggered) {
            triggered = true;

            mainBtn.classList.add('visible');

            setTimeout(function () {
              if (userClosed) return;
              bubble.classList.add('show');

              setTimeout(function () {
                if (userClosed) return;
                typing.classList.add('is-hidden');
                realMessage.classList.add('is-visible');
                requestAnimationFrame(function () { realMessage.classList.add('is-in'); });
              }, DURATION_TYPING);

              autoHideTimer = setTimeout(function () {
                if (userClosed) return;
                bubble.classList.remove('show');

                if (!MODO_COMPLIANCE && badge) {
                  badgeTimer = setTimeout(function () {
                    if (userClosed) return;
                    badge.classList.add('show');
                  }, DELAY_BADGE_APOS_SUMIR);
                }
              }, DURATION_BALAO_VISIVEL);
            }, DELAY_BALAO);
          }
        });
      }, { threshold: 0.1 });

      waObserver.observe(targetSection);

      closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        userClosed = true;
        bubble.classList.remove('show');
        if (autoHideTimer) clearTimeout(autoHideTimer);
        if (badgeTimer) clearTimeout(badgeTimer);
        if (!MODO_COMPLIANCE && badge) {
          setTimeout(function () { badge.classList.add('show'); }, DELAY_BADGE_APOS_SUMIR);
        }
      });

      mainBtn.addEventListener('click', function () {
        bubble.classList.remove('show');
        if (badge) badge.classList.remove('show');
        if (autoHideTimer) clearTimeout(autoHideTimer);
        if (badgeTimer) clearTimeout(badgeTimer);
      });
    })();

    /* ---------------------------------------------------------------
       7. VÍDEO Tecnologia — botão play/pause
    --------------------------------------------------------------- */
    var techVideoBox = document.querySelector('.tech__video');
    if (techVideoBox) {
      var techVideo = techVideoBox.querySelector('video');
      var techPP = techVideoBox.querySelector('.tech__playpause');
      if (techVideo && techPP) {
        var techSync = function () {
          var paused = techVideo.paused;
          techVideoBox.classList.toggle('is-paused', paused);
          techPP.setAttribute('aria-label', paused ? 'Reproduzir vídeo' : 'Pausar vídeo');
        };
        techPP.addEventListener('click', function () {
          if (techVideo.paused) { techVideo.play(); } else { techVideo.pause(); }
        });
        techVideo.addEventListener('play', techSync);
        techVideo.addEventListener('pause', techSync);
        techSync();
      }
      var techExpand = techVideoBox.querySelector('.tech__expand');
      var vmodal = document.getElementById('techVideoModal');
      if (techVideo && techExpand && vmodal) {
        var vmodalVideo = vmodal.querySelector('.vmodal__video');
        var openVModal = function () {
          vmodal.classList.add('open');
          vmodal.setAttribute('aria-hidden', 'false');
          document.body.classList.add('no-scroll');
          if (techVideo.pause) techVideo.pause();
          if (vmodalVideo) {
            var pp = vmodalVideo.play();
            if (pp && pp.catch) pp.catch(function () { vmodalVideo.muted = true; vmodalVideo.play().catch(function () {}); });
          }
        };
        var closeVModal = function () {
          if (!vmodal.classList.contains('open')) return;
          vmodal.classList.remove('open');
          vmodal.setAttribute('aria-hidden', 'true');
          document.body.classList.remove('no-scroll');
          if (vmodalVideo) vmodalVideo.pause();
          if (techVideo.play) { var pr = techVideo.play(); if (pr && pr.catch) pr.catch(function () {}); }
        };
        techExpand.addEventListener('click', openVModal);
        var vcloseEls = vmodal.querySelectorAll('[data-vclose]');
        for (var vi = 0; vi < vcloseEls.length; vi++) { vcloseEls[vi].addEventListener('click', closeVModal); }
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' || e.keyCode === 27) closeVModal();
        });
      }
      /* Ao sair da seção: pausa o vídeo (se estiver tocando) e reinicia do zero */
      if (techVideo && 'IntersectionObserver' in window) {
        var techLeaveIO = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (!e.isIntersecting) {
              if (!techVideo.paused) techVideo.pause();
              try { techVideo.currentTime = 0; } catch (err) {}
            }
          });
        }, { threshold: 0 });
        techLeaveIO.observe(techVideoBox);
      }
    }

    /* ---------------------------------------------------------------
       8. VÍDEO Hero — som (mute/unmute) + expandir (tela cheia)
    --------------------------------------------------------------- */
    var heroStage = document.querySelector('.hero__media-stage');
    if (heroStage) {
      var heroVideo = heroStage.querySelector('video');
      var heroSound = heroStage.querySelector('.hero__vbtn--sound');
      var heroExpand = heroStage.querySelector('.hero__vbtn--expand');
      if (heroVideo && heroSound) {
        var heroSoundSync = function () {
          heroStage.classList.toggle('sound-on', !heroVideo.muted);
          heroSound.setAttribute('aria-label', heroVideo.muted ? 'Ativar som' : 'Desativar som');
        };
        heroSound.addEventListener('click', function () {
          heroVideo.muted = !heroVideo.muted;
          if (!heroVideo.muted) { var ps = heroVideo.play(); if (ps && ps.catch) ps.catch(function () {}); }
          heroSoundSync();
        });
        heroVideo.addEventListener('volumechange', heroSoundSync);
        heroSoundSync();
      }
      var heroModal = document.getElementById('heroVideoModal');
      if (heroVideo && heroExpand && heroModal) {
        var heroModalVideo = heroModal.querySelector('.vmodal__video');
        var openHeroModal = function () {
          heroModal.classList.add('open');
          heroModal.setAttribute('aria-hidden', 'false');
          document.body.classList.add('no-scroll');
          if (heroVideo.pause) heroVideo.pause();
          if (heroModalVideo) {
            var hp = heroModalVideo.play();
            if (hp && hp.catch) hp.catch(function () { heroModalVideo.muted = true; heroModalVideo.play().catch(function () {}); });
          }
        };
        var closeHeroModal = function () {
          if (!heroModal.classList.contains('open')) return;
          heroModal.classList.remove('open');
          heroModal.setAttribute('aria-hidden', 'true');
          document.body.classList.remove('no-scroll');
          if (heroModalVideo) heroModalVideo.pause();
          if (heroVideo.play) { var hr = heroVideo.play(); if (hr && hr.catch) hr.catch(function () {}); }
        };
        heroExpand.addEventListener('click', openHeroModal);
        var hcloseEls = heroModal.querySelectorAll('[data-vclose]');
        for (var hi = 0; hi < hcloseEls.length; hi++) { hcloseEls[hi].addEventListener('click', closeHeroModal); }
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' || e.keyCode === 27) closeHeroModal();
        });
      }
    }

  });
})();
