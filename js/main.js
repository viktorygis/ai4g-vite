const swiper = document.querySelector('.swiper');

if (swiper) {
  function scrollUp() {
    const scrollUp = document.querySelector('.scrollUp');

    window.addEventListener('scroll', () => {
      if (scrollY > 499) {
        scrollUp.classList.add('active');
      } else {
        scrollUp.classList.remove('active');
      }
    });
  }

  function showMore() {
    const btnReadMore = document.querySelector('.plane__btn');
    const planeItems = document.querySelector('.plane__bottom-items');

    btnReadMore.addEventListener('click', () => {
      planeItems.classList.toggle('active');
    });
  }

  function showFairway1() {
    window.addEventListener('scroll', () => {
      const fairwayBlock = document.querySelector('.fairway__row');
      const fairwayBlockBack = document.querySelector('.fairway__row-back');
      const animItemHeight = fairwayBlock.offsetHeight;
      const animItemOffset = offset(fairwayBlock).top;
      const animStart = 4;
      let animItemPoint = window.innerHeight - animItemHeight / animStart;

      if (scrollY > animItemOffset - animItemPoint && scrollY < animItemOffset + animItemHeight) {
        fairwayBlockBack.style.animation = 'fairway 2.2s forwards';
      }
    });
  }

  // function showFairway2() {
  //   const fairwayFooter = document.querySelector('.fairway__footer');
  //   const animItemHeight = fairwayFooter.offsetHeight;
  //   const animItemOffset = offset(fairwayFooter).top;
  //   const animStart = 4;
  //   const imgs = document.querySelector('.fairway__bg');

  //   let animItemPoint = window.innerHeight - animItemHeight / animStart;

  //   window.addEventListener('scroll', () => {
  //     if (scrollY > animItemOffset - animItemPoint && scrollY < animItemOffset + animItemHeight) {
  //       imgs.classList.add('active');
  //     }
  //   });
  // }

  function mentors() {
    window.addEventListener('scroll', () => {
      const mentorsBlock = document.querySelector('.mentors__line');
      const mentorsBg = document.querySelector('.mentors__line-bg-2');
      const animItemHeight = mentorsBlock.offsetHeight;
      const animItemOffset = offset(mentorsBlock).top;
      const animStart = 4;
      let animItemPoint = window.innerHeight - animItemHeight / animStart;

      if (scrollY > animItemOffset - animItemPoint && scrollY < animItemOffset + animItemHeight) {
        mentorsBg.classList.add('active');
      }
    });
  }

  function choice() {
    window.addEventListener('scroll', () => {
      const choiceBlock = document.querySelector('.choice__items');
      const block1 = document.querySelector('.ci-1');
      const block2 = document.querySelector('.ci-2');
      const block3 = document.querySelector('.ci-3');
      const animItemHeight = choiceBlock.offsetHeight;
      const animItemOffset = offset(choiceBlock).top;
      const animStart = 4;
      let animItemPoint = window.innerHeight - animItemHeight / animStart;

      if (scrollY > animItemOffset - animItemPoint && scrollY < animItemOffset + animItemHeight) {
        block1.style.animation = 'ci-1 0.5s forwards';
        block2.style.animation = 'ci-2 0.5s forwards';
        block2.style.animationDelay = '0.5s';
        block3.style.animation = 'ci-3 0.5s forwards';
        block3.style.animationDelay = '1s';
      }
    });
  }

  function cutText() {
    let texts = document.querySelectorAll('.swiper-item__text');

    texts.forEach((text) => {
      text.textContent.length > 709
        ? (text.textContent = text.textContent.slice(0, 709) + '...')
        : (text.textContent = text.textContent);
    });
  }

  function isMozilla() {
    const userAgent = navigator.userAgent.toLowerCase();
    const mozila = /firefox/.test(userAgent);
    const link = document.querySelector('.fairway__link');

    if (mozila) {
      link.style.marginTop = '-7px';
    }
  }

  function scrollUp() {
    const scrollUp = document.querySelector('.scrollUp');

    window.addEventListener('scroll', () => {
      if (scrollY > 499) {
        scrollUp.classList.add('active');
      } else {
        scrollUp.classList.remove('active');
      }
    });

    scrollUp.addEventListener('click', () => {
      $('html, body').animate(
        {
          scrollTop: $('#top').offset().top,
        },
        'slow',
      );
    });
  }

  const swiper = new Swiper('.swiper', {
    speed: 400,
    spaceBetween: 50,
    slidesPerView: 1,
    allowTouchMove: false,

    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  function scrollToMentor() {
    const mentorIgor = document.getElementById('mentors-igor');

    mentorIgor.addEventListener('click', () => {
      localStorage.setItem('mentor', 'igor');
    });
  }

  function offset(el) {
    const rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
  }

  showMore();
  showFairway1();
  // showFairway2();
  mentors();
  choice();
  cutText();
  isMozilla();
  scrollUp();
  scrollToMentor();
}

function formValidation() {
  const validation = new JustValidate('.modal-request__form');
  const inputMask = new Inputmask('+7 (999) 999-99-99');
  const telSelector = document.querySelector('.modal-request__phone');

  inputMask.mask(telSelector);

  validation
    .addField('.modal-request__name', [
      {
        rule: 'minLength',
        value: 2,
      },
      {
        rule: 'maxLength',
        value: 50,
      },
      {
        rule: 'required',
        value: true,
        errorMessage: 'Введите имя',
      },
    ])
    .addField('.modal-request__phone', [
      {
        rule: 'required',
        value: true,
        errorMessage: 'Введите телефон',
      },
    ])
    .onSuccess((event) => {
      let formData = new FormData(event.target);
      let xhr = new XMLHttpRequest();

      console.log(...formData);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            console.log('отправлено');
          }
        }
      };

      $.fancybox.close('fancybox-content');
      $.fancybox.open({
        src: '#modal-thanks',
        type: 'inline',
      });

      xhr.open('POST', 'mail.php', true);
      xhr.send(formData);
      event.target.reset();
    });
}

function btnValidation() {
  const btn = document.querySelector('.modal-request__btn');
  const inputName = document.querySelector('.modal-request__name');
  const inputPhone = document.querySelector('.modal-request__phone');



  inputName.addEventListener('input', (e) => {
    checkLength();
  });

  inputPhone.addEventListener('input', (e) => {
    checkLength();
  });

  function checkLength() {
    if (inputName.value.length > 1 && inputPhone.value.length > 1) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  }
}

function checkStorage() {
  const mentorsPage = document.querySelector('.body-mentors');
  const igor = localStorage.getItem('mentor');

  if (mentorsPage && igor) {
    $(document).ready(function () {
      $('html, body').animate(
        {
          scrollTop: $('#igor').offset().top - 160,
        },
        'slow',
      );
    });

    localStorage.clear();
  }
}

formValidation();
btnValidation();
checkStorage();
