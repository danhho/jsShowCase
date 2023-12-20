'use strict';
/*** Constant ***/
const FIRST_HOME = 'uniben-home-page-first';
const SIZE_CHANGED = new CustomEvent('app-size-changed');
const MAIN_BANNER_SLIDE_DONE = new CustomEvent('MAIN_BANNER_SLIDE_DONE');
const MAIN_BANNER_INIT = new CustomEvent('MAIN_BANNER_INIT');


/*** Global Class ***/
var CLASS = {
	_dlex: 'js-dflex',
	_active: 'js-active',
	_hide: 'js-hide',
	_mobile: 'js-mobile',
	_menuActive: 'js-menu-active',
	_iOS: 'js-ios',
	_orientation: 'js-orientation',
	_require: 'js-required',
	_email: 'js-email',
	_error: 'js-error'
};

/*** APP ***/
var APP = {
	_html: {},
	_body: {},
	_overlay: {},
	_pageID: '',
	_W: 0,
	_H: 0,

	init: function() {
		this._window = $(window);
		this._html = $('html');
		this._body = $('body');
		this._overlay = $('#overlay');
		this._pageID = $('#page-id').val();
		(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) && APP._html.addClass(CLASS._mobile);
		(APP._html.hasClass(CLASS._mobile) && window.orientation != 0) && APP._html.addClass(CLASS._orientation);
		this.getSize();
		this.header.init();
		this.footer.init();
		this.body.init();
		this.popup.init();
		this.heroBanner.init();
		switch(this._pageID) {
			case 'page-home': this.home.init(); break;
			case 'page-history': this.history.init(); break;
			case 'page-news' : this.news.init();break;
			case 'page-news-detail' : this.news_detail.init();break;
			case 'page-bod' : this.bod.init();break;
			case 'page-recruitment' : this.recruitment.init();break;
			case 'page-detail-recruitment' : this.detail_recruitment.init();break;
			case 'page-project' : this.project.init();break;
			case 'page-detail-project' : this.detail_project.init();break;
			case 'page-prize' : this.prize.init();break;
			case 'page-report' : this.report.init();break;
			case 'page-policy' : this.policy.init();break;
			case 'page-detail-policy' : this.detail_policy.init();break;
		}
		this.initEvent();
	},

	initEvent: function() {
		var self = this;
		self._overlay.on('click', self.overlayClicked);
		$(window).resize(self.resized);
	},

	overlayClicked: function(e) {
		e.preventDefault();
		APP.header._btnMb.hasClass(CLASS._active) && APP.header._btnMb.trigger('click');
	},

	resized: function() {
		if ($(window).width() === APP._W) return false;
		APP.getSize();
		(APP._W > 960 && APP.header._btnMb.hasClass(CLASS._active)) && APP.header._btnMb.trigger('click');
	},

	getSize: function() {
		APP._W = $(window).innerWidth();
		APP._H = $(window).innerHeight();
		document.dispatchEvent(SIZE_CHANGED);
	},

	scroll: function(offset, time) {
		$('html, body').animate({
			scrollTop: offset
		}, time);
	}
};
/*** READY ***/
$(document).ready(function() {
  (matchMedia('(hover: none)').matches) || document.body.classList.add('can-hover');
});
/*** LOAD ***/
$(window).load(function() { APP.init(); });
APP.body = {
  _el: {},

  init: function() {
    var self = this;
    self.initCss();
    self.initResize();
    self.initEvent();
  },

  initCss: function() {
  	var self = this;
  	var paddingFooter = APP.footer._el.outerHeight();
    self._el = $('body');
    self._el.find('main').css('padding-bottom', paddingFooter);
  },

  initResize: function() {
  	var self = this;
  	$(window).resize(function() {
  		self.initCss();
  	});
  },

  initEvent: function() {
  	var self = this;
  	self._el.find('.js-close').click(function() {
      $(this).closest('.popup').find('.desc-popup').scrollTop(0);
			$(this).closest('.popup').hide();
      $('html').removeAttr('style');
		});
    $('.search figure').click(function() {
      if($(window).innerWidth() > 767) {
        if($(this).hasClass('js-active')) {
          $(this).removeClass('js-active');
          $('.search input').removeClass('js-active');
        } else {
          $(this).addClass('js-active');
          $('.search input').addClass('js-active');
        }
      }
    }); 
  }

};
var Carousel = function(el, isLoop, maxShow) {

  var el = $(el),
      items = el.find('.item'),
      btnPrev = el.find('.btn-prev'),
      btnNext = el.find('.btn-next'),
			currentItem = {},
      targetItem = {},
			isAnimate = false,
			index = 0,
      target = 0,
      max = items.length,
      item = items.eq(index),
      itemW = item.outerWidth(),
      itemH = 0,
      mainW = el.find('.wrap').outerWidth(),
      showArray = [0, 1, 2];

  function init() {
    if (max <= maxShow) {
      el.addClass(CLASS._dlex);
      return false;
    }
    setupPos();
    initEvent();
  }

  this.updateMaxShow = function(val) {
    if (maxShow === val) return false;
    maxShow = val;
    updateShowArray();
    resetPos();
  }

  function updateShowArray() {
    var cIndex = 0;
    showArray[0] = index;
    if (maxShow > 1) {
      for (var i = 1; i < maxShow; i++) {
        cIndex = index + i;
        cIndex >= max && (cIndex = (cIndex % max));
        showArray[i] = cIndex;
      }
    } 
  }

  function resetPos() {
    itemW = item.outerWidth()
    itemH = getMaxH();
    el.height(itemH);
    mainW = el.find('.wrap').outerWidth();

    for (var i = 0; i < maxShow; i++) {
      currentItem = items.eq(showArray[i]);
      TweenMax.set(currentItem, { autoAlpha: 1, x: itemW * i });
    }
  }

  function getMaxH() {
    var item = {},
        maxH = 0;
    
    items.each(function() {
      item = $(this);
      (item.height() > maxH) && (maxH = item.height());
    });
    return maxH;
  }

  function setupPos() {
    itemH = getMaxH();
    el.height(itemH);
    TweenMax.set(items, { autoAlpha: 0 });
    for (var i = 0; i < maxShow; i++) {
      currentItem = items.eq(i);
      TweenMax.set(currentItem, { autoAlpha: 1, x: itemW * i });
    }
  }

  function initEvent() {
    btnPrev.on('click', prevClicked);
    btnNext.on('click', nextClicked);
    document.addEventListener(SIZE_CHANGED, function() {
      resetPos();
    });
  }

  function nextClicked(e) {
    e.preventDefault();
    if (isAnimate || (!isLoop && index === max - maxShow)) return false;
		isAnimate = true;
    
    target = index + maxShow;
    (target >= max) && (target = target % max);
    // console.log(index, target);
		goToNext();
  }

  function prevClicked(e) {	
    e.preventDefault();
		if (isAnimate || (!isLoop && index === 0)) return false;
		isAnimate = true;
		
		target = (index == 0) ? (max - 1) : (index - 1);
    // console.log(index, target);
		goToPrev();
	}
	
	function goToPrev() {
    var delay = 0,
        cIndex = 0;

    targetItem = items.eq(target);
    for (var i = 0; i < maxShow; i++) {
      cIndex = index + i;
      cIndex >= max && (cIndex = (cIndex % max));
      currentItem = items.eq(cIndex);

      TweenMax.to(currentItem, 1, {
        delay: delay,
        x: itemW * (i + 1),
        ease: Expo.easeInOut,
        force3D: true
      });
    }

		TweenMax.set(targetItem, { autoAlpha: 1, x: -itemW });
    TweenMax.to(targetItem, 1, {
      delay: delay,
      x: 0,
			ease: Expo.easeInOut,
			force3D: true,
			onComplete: prevComplete
		});
	}
  
  
	function goToNext() {
    var delay = 0,
        cIndex = 0;
		
    targetItem = items.eq(target);
    for (var i = 0; i < maxShow; i++) {
      cIndex = index + i;
      cIndex >= max && (cIndex = (cIndex % max));
      currentItem = items.eq(cIndex);

      TweenMax.to(currentItem, 1, {
        delay: delay,
        x: itemW * (i - 1),
        ease: Expo.easeInOut,
        force3D: true
      });
    }

		TweenMax.set(targetItem, { autoAlpha: 1, x: mainW });
    TweenMax.to(targetItem, 1, {
			delay: delay,
      x: mainW - itemW,
      ease: Expo.easeInOut,
			force3D: true,
			onComplete: nextComplete
		});
  }

  function prevComplete() {
    isAnimate = false;
    index = (index < 1) ? (max - 1) : (index - 1);
    hideOutItem();
  }

  function nextComplete() {
    isAnimate = false;
    index = (index < max - 1) ? (index + 1) : 0;
    hideOutItem();
  }

  function hideOutItem() {
    var item = {},
        currentIndex = 0;

    updateShowArray();
    items.each(function() {
      item = $(this);
      TweenMax.set(item, {
        autoAlpha: 0
      });
    });

    for (var i = 0; i < maxShow; i++) {
      currentIndex = showArray[i];
      item = items.eq(currentIndex);

      TweenMax.set(item, {
        autoAlpha: 1
      });
    }
  }

  init();
	return this;
};
APP.cookie = {
  set: function(name, value, days) {
    var expires = '',
        date = {};
    
    if (days) {
      date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '')  + expires + '; path=/';
  },

  get: function(name) {
    var nameEQ = name + '=',
        ca = document.cookie.split(';');

    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  erase: function(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
  }
};
APP.footer = {
  _el: {},
  _subscribeForm: {},
  _btnToTop: {},

  init: function() {
    var self = this;
    self._el = $('.main-footer');
    self._subscribeForm = new Form(self._el.find('.subscribe'));
    self._btnToTop = self._el.find('.btn-totop');
    self.initEvent();
    APP._html.hasClass(CLASS._mobile) || TweenMax.set(self._btnToTop, { autoAlpha: 0, y: 100 });
  },

  initEvent: function() {
    var self = this;
    self._btnToTop.on('click', self.btnToTopClicked);
    APP._html.hasClass(CLASS._mobile) || $(window).scroll(function() {
      ($(this).scrollTop() >= 1000)?
        (self._btnToTop.hasClass(CLASS._active) || self.showToTop()):
        (self._btnToTop.hasClass(CLASS._active) && self.hideToTop());
		});
  },

  showToTop: function() {
    var self = this;

    self._btnToTop.addClass(CLASS._active);
    TweenMax.to(self._btnToTop, 0.5, {
      autoAlpha: 1,
      y: 0,
      force3D: true
    });
  },

  hideToTop: function() {
    var self = this;

    self._btnToTop.removeClass(CLASS._active);
    TweenMax.to(self._btnToTop, 0.5, {
      autoAlpha: 0,
      y: 100,
      force3D: true
    });
  },

  btnToTopClicked: function(e) {
    e.preventDefault();
    $('html, body').animate({
			scrollTop: 0
		}, 1000);
  }
};
/***** Form *****/
var Form = function(el) {
	
	var el = $(el),
			form = el.find('form'),
			ajaxURL = form.data('url'),
			input = el.find('input'),
      inputRequire = el.find('.' + CLASS._require),
      inputEmail = el.find('.' + CLASS._email),
      inputPhone = el.find('.' + CLASS._mobile),
      textarea = el.find('textarea'),
      btnSubmit = el.find('.btn-submit'),
      feedback = el.find('.feedback');
	
	function init() {
		initEvent();
	}

	function initEvent() {
		inputRequire.on('focus', inputFocus);
		textarea.on('blur', txtBlur);
		btnSubmit.on('click', submitClicked);
	}
	
	function txtBlur(e) {
		e.preventDefault();
		textarea.val().length === 0 ? textarea.removeClass(CLASS._active) : textarea.addClass(CLASS._active);
		textarea.removeClass(CLASS._error); 
	}
	
	function inputFocus(e) {
    var input = $(this),
        warning = input.next('.warning');

    input.removeClass(CLASS._error);
    warning.hide();
	}
	
	function submitClicked(e) {
		e.preventDefault();
		var pass = true;
		(inputRequire.length > 0)
		pass = checkRequire();
		pass && (pass = checkPhone());
		pass && (pass = checkEmail());
		pass && (pass = checkContent());
		pass && submit();
	}
	
	function submit() {
		// BE.loading.showLoading();
		$.ajax({
			type: 'POST',
			url: ajaxURL,
			data: form.serializeArray(),
			success: function(data) {
				var status = parseInt(data.status),
						message = data.message;

				switch(status) {
					case 0: {
						APP.popup._alert.update('Submit Failed', message);
						APP.popup._alert.show();
					} break;
					case 1: {
						resetForm(message);
					} break;
				}
			}
		});
	}
	
	function resetForm(message) {
		(input.length > 0) && input.val('');
		(textarea.length > 0) && textarea.val('');
		//feedback.text(message).show().fadeOut(5000);
        feedback.show().fadeOut(5000);
	}
	
	function checkContent() {
		if (textarea.length === 0) return true;
		if (textarea.val().length === 0) {
			textarea.addClass(CLASS._error); 
			textarea.focus();
			warning.text(text.required);
			return false;
		}
		
		return true;
	}
	
	function checkRequire() {
    var pass = true,
        input = {},
        warning = {},
				txt = '';
				
		if (inputRequire.length === 0) return true;
		for (var i = 0; i < inputRequire.length; i++) {
      input = $(inputRequire[i]);
      warning = input.next('.warning');
			if (input.val() === '') {
				input.addClass(CLASS._error);
				txt = input.attr('required-txt');
        warning.text(txt).show();
				pass = false;
			}
		}	
		return pass;
	}
	
	function checkEmail() {
		var pass = true,
				regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/,
        input = {},
        warning = {},
				txt = '';
				
		if (inputEmail.length === 0) return true;
		for (var i = 0; i < inputEmail.length; i++) {
      input = $(inputEmail[i]);
      warning = input.next('.warning');
			if (!regex.test(input.val())) {
				input.addClass(CLASS._error);
        txt = input.attr('email-txt'),
				warning.text(txt).show();
				pass = false;
			}
		}
		return pass;
	}

	function checkPhone() {
		var pass = true,
				minLength = 10,
        input = {},
        warning = {},
				txt = '';

		if (inputPhone.length === 0) return true;
		for (var i = 0; i < inputPhone.length; i++) {
      input = $(inputPhone[i]);
      warning = input.next('.warning');
			if (input.val().length < minLength) {
				input.addClass(CLASS._error);
        txt = input.attr('phone-txt'),
				warning.text(txt).show();
				pass = false;
			}
		}
		return pass;
	}
  
  init();
	return this;
};
APP.header = {
  _el: {},
  _btn: {},
  _btnMb: {},

  init: function() {
    var self = this;
    self._el = $('.main-header');
    self._btn = $('.main-menu li');
    self._btnMb = self._el.find('.btn-mb');
    self.initEvent();
    APP.headerMb.init();
  },

  initEvent: function() {
    var self = this;
    self._btn.on('click', self.btnClicked);
    self._btnMb.on('click', self.btnMbClicked);
    APP._window.on('click', () => $('.main-menu li').removeClass(CLASS._active));
  },

  btnClicked: function(e) {
    var item = $(this), self = this;
    e.stopPropagation();
    if(APP._html.hasClass(CLASS._mobile)) {
      item.hasClass(CLASS._active) ? item.removeClass(CLASS._active) : ($('.main-menu li').removeClass(CLASS._active), item.addClass(CLASS._active));
    }
  },

  btnMbClicked: function(e) {
    var item = $(this);
    e.preventDefault();
    item.hasClass(CLASS._active) ? (item.removeClass(CLASS._active), APP.headerMb.hide()) : (item.addClass(CLASS._active), APP.headerMb.show());
  }
};


APP.headerMb = {
  _el: {},
  _height: 0,
  _subLink: {},
  _cSub: null,

  init: function() {
    var self = this;
    self._el = $('.header-mb');
    self._subLink = self._el.find('.had-sub');
    self.checkActiveMenu();
    self.initEvent();
  },

  initEvent: function() {
    var self = this;
    self._subLink.on('click', self.subClicked);
  },

  checkActiveMenu: function() {
    var self = this,
        item = {},
        subMenu = {};

    self._subLink.each(function() {
      item = $(this);
      subMenu = item.next('.sub-menu');
      if (item.hasClass(CLASS._active)) {
        subMenu.slideDown(); 
        self._cSub = subMenu;
        return false;
      }
    });
  },

  updateHeight: function() {
    var self = this;
    self._height = (self._el.outerHeight());
    
    TweenMax.to(APP._body, 0.25, { 
      height: self._height,
      onComplete: () => APP._body.addClass(CLASS._menuActive)
    });
  },

  subClicked: function(e) {
    e.preventDefault();
    var self = APP.headerMb,
        item = $(this),
        subMenu = item.next('.sub-menu'),
        timeout = 0;

    if (item.hasClass(CLASS._active)) {
      self._cSub.slideUp();
      item.removeClass(CLASS._active);
      self._cSub = null;
    } else {
      (self._cSub != null) && (self._cSub.slideUp(), timeout = 250);
      self._subLink.removeClass(CLASS._active);
      item.addClass(CLASS._active);
      setTimeout(() => subMenu.slideDown(() => self.updateHeight()), timeout);
      self._cSub = subMenu;
    }
    
  },

  overlayClicked: function(e) {
    e.preventDefault();
  },

  show: function() {
    var self = this;
    self._el.addClass(CLASS._active);
    self.updateHeight();

    TweenMax.set(self._el, {
      display: 'block',
      onComplete: () => TweenMax.to(self._el, 0.5, { x: 0 })
    });
  },

  hide: function() {
    var self = this;
    APP._body.attr('style', '').removeClass(CLASS._menuActive);
    self._el.removeClass(CLASS._active);

    TweenMax.to(self._el, 0.5, {
      x: -APP._W,
      onComplete: () => TweenMax.set(self._el, { display: 'none' })
    });
  }
};
APP.heroBanner = {
  _el: {},
  _mainBanner: {},
  _slider50: {},

  init: function() {
    var self = this;
    var time = $('#banner_slider_time').val();
    self._el = $('#' + APP._pageID);
    self._mainBanner = new MainBanner(self._el.find('.banner-holder'), time);
    self._slider50 = new Slider50(self._el.find('.slider-50'), true, 0);
  },

  initCss: function() {
    var self = this;
    var heightMenu, heightHeroBanner, heightProjectHeader, heightProjectSlider;

    //set full screen hero banner
    heightMenu = parseInt($('.main-header').outerHeight());
    heightHeroBanner = parseInt(APP._H - heightMenu);
    self._mainBanner.css('height', heightHeroBanner);
  },

  initResize: function() {
    var self = this;
    $(window).resize(function() {
      self.initCss();
    })
  }
};

var HoverList = function(el) {
  var el = $(el),
      event = 'mouseover',
      list = el.find('ul'),
      isAnimate = false;

  function init() {
    initEvent();
  }

  function initEvent() {
    el.on(event, toogeList);
    el.on('mouseleave', outList)
  }

  function toogeList(e) {
    e.preventDefault();
    e.stopPropagation();
    if (el.hasClass(CLASS._active) || isAnimate) return false;
    isAnimate = true;
    el.hasClass(CLASS._active) ? hideList() : showList();
  }

  function showList() {
    el.addClass(CLASS._active);
    list.slideDown(function() {
      isAnimate = false;
    });
  }

  function hideList () {
    el.removeClass(CLASS._active);
    list.slideUp(function() {
      isAnimate = false;
    });
  }

  function outList(e) {
    e.preventDefault();
    e.stopPropagation();
    
    isAnimate = true;
    el.off(event);
    el.clearQueue();
    el.removeClass(CLASS._active);
    list.slideUp(function() {
      isAnimate = false;
      el.on(event, toogeList);
    });
  }

  init();
  return this;
}
var HoverMobileList = function(el) {
  var el = $(el),
      event = 'click',
      title = el.find('h5'),
      list = el.find('ul'),
      isAnimate = false;

  function init() {
    initEvent();
  }

  function initEvent() {
    title.on(event, toogeList);
  }

  function toogeList(e) {
    e.preventDefault();
    e.stopPropagation();

    console.log('event');
    if (isAnimate) return false;
    console.log('true');
    isAnimate = true;
    title.hasClass(CLASS._active) ? hideList() : showList();
  }

  function showList() {
    el.addClass(CLASS._active);
    title.addClass(CLASS._active);
    list.slideDown(function() { isAnimate = false; });
  }

  function hideList () {
    el.removeClass(CLASS._active);
    title.removeClass(CLASS._active);
    list.slideUp(function() { isAnimate = false; });
  }

  init();
  return this;
};
var MainBanner = function(el, iTime) {

	var el = $(el),
			items = el.find('.item'),
			currentItem = {},
      targetItem = {},
			navs = el.find('.paging a'),
			btnScroll = el.find('.btn-scroll'),
			isAnimate = false,
			index = 0,
			target = 0,
			max = items.length,
			mainH = el.height(),
			interval = {};


	this.pause = () => clearInterval(interval);
	this.play = () => autoPlay();
	this.getTargetItem = function() {
		targetItem = items.eq(target);
		return targetItem;
	}
	this.getCurrentItem = function() {
		return currentItem;
	}
    
  function init() {
		if (max == 1) {
			navs.hide();
		} else {
			autoPlay();
		}
    TweenMax.set(items, { autoAlpha: 0});
    TweenMax.set(items.eq(index), { autoAlpha: 1});
		initEvent();

		if (APP._H < mainH) {
			el.height(APP._H - 55);
			mainH = el.height();
		}

	}
	
	function autoPlay() {
		(iTime > 0) && (
			clearInterval(interval),
			interval = setInterval(function() {
				goNext();
		}, iTime));
	}

  function initEvent() {
		btnScroll.on('click', scrollClicked);
		navs.on('click', navClicked);
		document.addEventListener(SIZE_CHANGED, function() {
			APP._html.hasClass(CLASS._mobile) && (el.height(APP._H - 55), mainH = el.height());
		});
		document.dispatchEvent(MAIN_BANNER_INIT);
	}
	
	function scrollClicked(e) {
		e.preventDefault();
		APP.scroll(APP._H, 750);
	}

  function navClicked(e) {
    e.preventDefault();
    var item = $(this),
        targetIndex = 0;

    if (isAnimate || item.hasClass(CLASS._active)) return false;
    targetIndex = parseInt(item.data('index'));
    goTo(targetIndex);
	}
	
	function goNext() {
		target = index + 1;
		target == max && (target = 0);
		goToDown();
	}

  function goTo(targetIndex) {
    isAnimate = true;
    target = targetIndex;
		index < targetIndex ? goToDown() : goToUp(); 
  }
	
	function goToUp() {
		updatePaging();
		currentItem = items.eq(index);
		targetItem = items.eq(target);
		
		TweenMax.set(targetItem, {
			autoAlpha: 0
    });
    
    TweenMax.to(targetItem, 1, {
			autoAlpha: 1,
			onComplete: animatedDone
		});
		
		TweenMax.to(currentItem, 1, {
			autoAlpha: 0,
			force3D: true
		});
	}
	
	function goToDown() {
		updatePaging();
		currentItem = items.eq(index);
		targetItem = items.eq(target);

		TweenMax.set(targetItem, {
			autoAlpha: 0
    });
    
    TweenMax.to(targetItem, 1, {
			autoAlpha: 1,
			onComplete: animatedDone
		});
		
		TweenMax.to(currentItem, 1, {
			autoAlpha: 0
		});
	}
	
	function animatedDone() {
    isAnimate = false;
    TweenMax.set(currentItem, { autoAlpha: 0 });
		index = target;
		autoPlay();
		document.dispatchEvent(MAIN_BANNER_SLIDE_DONE);
	}
	
	function updatePaging() {
		navs.eq(index).removeClass(CLASS._active);
    navs.eq(target).addClass(CLASS._active);
	}
  
  init();
	return this;
}
var niceSelect = function(el) {

	var el = $(el),
			currentSelect = el.find('.current'),
			list = el.find('.list'),
			option = el.find('.option'),
			input = el.find('.js-input'),
			selected = el.find('.selected'),
			nameOfSelected = selected.text(),
      nameDefaultOption = option.first().text(),
			valueOfOption,
			nameOfOption,
			overlay = $('.nice-select-overlay');

  function init() {
  	if(option.hasClass('selected')) {
  		currentSelect.text(nameOfSelected);
  	} else {
      currentSelect.text(nameDefaultOption);
    }

  	el.click(function(e) {
      e.stopPropagation();
  		if(list.hasClass('active')) {
				list.hasClass('has-overlay') && overlay.addClass('hidden');
  			list.slideUp(300, function() {
  				list.removeClass('active');
  			})
  		} else {
				list.hasClass('has-overlay') && overlay.removeClass('hidden');
	  		list.slideDown(300, function() {
	  			list.addClass('active');			
	  		});
  		}
  	});

    APP._html.click(function(){
      list.slideUp(300, function() {
          list.removeClass('active');
					list.hasClass('has-overlay') && overlay.addClass('hidden');
        })
    });

  	option.click(function() {
  		nameOfOption = $(this).text();
  		valueOfOption = $(this).attr('data-value');
  		currentSelect.text(nameOfOption);
  		input.val(valueOfOption);
      input.trigger("change");
  	});
  }

  function initCss() {
    var widthList = list.width();
    option.outerWidth(widthList);
  }

  function initResize() {
    $(window).resize(function() {
      initCss();
    })
  }

  init();
  initCss();
  initResize();
}
APP.popup = {
  _language: {},
  _country: {},
  _alert: {},

  init: function() {
    var self = this;
    self._language = new Popup('#popup-language');
    self._country = new Popup('#popup-country');
    self._alert = new Popup('#popup-alert');
  }
};

var Popup = function(el) {
  var el = $(el),
      content = el.find('.content'),
      contentTitle = content.find('.title'),
      contentDesc = content.find('p'),
      overlay = el.find('.overlay'),
      btnClose = el.find('.btn-close');

  this.update = function(title, desc) {
    (title.length > 0) && contentTitle.text(title);
    (desc.length > 0) && contentDesc.text(desc);
  }

  this.show = function() {
    console.log('hi')
    el.fadeIn();
  }

  this.hide = function() {
    el.fadeOut();
  }

  function init() {
    initEvent();
  }

  function initEvent() {
    overlay.on('click', close);
    btnClose.on('click', close);
  }

  function close(e) {
    e.preventDefault();
    el.fadeOut();
  }
  
  init();
  return this;
};
/***** Selection Nav *****/
var SelectionNav = function(el) {
	
  var el = $(el),
      header = el.find('.header'),
      title = header.find('span'),
      links = el.find('a');
	
	function init() {
    initEvent();
  }
  
  function initEvent() {
    header.on('click', toogleMenu);
    links.on('click', linkClicked);
  }

  function toogleMenu(e) {
    e.preventDefault();

    header.hasClass(CLASS._active) ? header.removeClass(CLASS._active) : header.addClass(CLASS._active);
  }

  function linkClicked(e) {
    e.preventDefault();
    var item = $(this),
        txt = item.text(),
        url = item.attr('href');

    links.removeClass(CLASS._active);
    item.addClass(CLASS._active);
    title.text(txt);
    header.removeClass(CLASS._active);
    window.location.href = url;
  }
	
  init();
	return this;
};
var Slider = function(el, iTime) {

  var el = $(el),
      holder = el.find('.slider'),
      items = holder.find('.item'),
      pagings = el.find('.paging a'),
			currentItem = {},
      targetItem = {},
			isAnimate = false,
			index = 0,
			target = 0,
			max = items.length,
      mainW = el.width(),
      interval = {};
      
  function init() {
    if (max < 2) {
      pagings.hide();
      return false;
    }
    TweenMax.set(items, { autoAlpha: 0});
    TweenMax.set(items.eq(index), { autoAlpha: 1});
    autoPlay();
		initEvent();
  }

  function autoPlay() {
		(iTime > 0) &&  (
      clearInterval(interval), 
      interval = setInterval(function() {
			  goNext();
		}, iTime));
	}

  function initEvent() {
    pagings.on('click', navClicked);
    document.addEventListener(SIZE_CHANGED, function() {
      mainW = el.width() / 2;
    });
  }

  function navClicked(e) {
    e.preventDefault();
    var item = $(this),
        targetIndex = 0;

    if (isAnimate || item.hasClass(CLASS._active)) return false;
    targetIndex = parseInt(item.data('index'));
    goTo(targetIndex);
  }

  function goTo(targetIndex) {
    isAnimate = true;
    target = targetIndex;
		index < targetIndex ? goToNext() : goToPrev(); 
  }

  function goNext() {
		target = index + 1;
		target == max && (target = 0);
		goToNext();
	}
	
	function goToPrev() {
		currentItem = items.eq(index);
		targetItem = items.eq(target);
		
		TweenMax.set(targetItem, {
			autoAlpha: 1,
			x: -mainW
    });
    
    TweenMax.to(targetItem, 1, {
      x: 0,
			ease: Expo.easeInOut,
			force3D: true,
			onComplete: animatedDone
		});
		
		TweenMax.to(currentItem, 1, {
      x: mainW,
			ease: Expo.easeInOut,
			force3D: true
		});
	}
	
	function goToNext() {
		currentItem = items.eq(index);
		targetItem = items.eq(target);

		TweenMax.set(targetItem, {
			autoAlpha: 1,
			x: mainW
    });
    
    TweenMax.to(targetItem, 1, {
      x: 0,
      ease: Expo.easeInOut,
			force3D: true,
			onComplete: animatedDone
		});
		
		TweenMax.to(currentItem, 1, {
      x: -mainW,
			ease: Expo.easeInOut,
			force3D: true
		});
	}
	
	function animatedDone() {
    isAnimate = false;
    TweenMax.set(currentItem, { autoAlpha: 0 });
    index = target;
		autoPlay();
  }

  function updatePaging() {
    pagings.eq(index).removeClass(CLASS._active);
    pagings.eq(target).addClass(CLASS._active);
  }

  init();
	return this;
};
var Slider50 = function(el, isLoop, iTime) {

  var el = $(el),
      navs = el.find('.nav-link a'),
      sliderHolder = el.find('.slider-holder'),
      items = sliderHolder.find('.item'),
      btnPrev = sliderHolder.find('.btn-prev'),
      btnNext = sliderHolder.find('.btn-next'),
      pagings = sliderHolder.find('.paging a'),
			currentItem = {},
      targetItem = {},
			isAnimate = false,
			index = 0,
			target = 0,
			max = items.length,
      mainW = sliderHolder.width(),
      interval = {};
      
  function init() {
    if (max < 2) {
      btnPrev.hide();
      btnNext.hide();
      pagings.hide();
      return false;
    }
    TweenMax.set(items, { autoAlpha: 0});
    TweenMax.set(items.eq(index), { autoAlpha: 1});
    autoPlay();
    initEvent();
  }

  function autoPlay() {
		(iTime > 0) && (
      clearInterval(interval),
      interval = setInterval(function() {
			  btnNext.trigger('click');
		}, iTime));
	}

  function initEvent() {
    btnPrev.on('click', prevClicked);
    btnNext.on('click', nextClicked);
    navs.on('click', navClicked);
    pagings.on('click', navClicked);
    document.addEventListener(SIZE_CHANGED, function() {
      mainW = sliderHolder.width();
    });
  }

  function nextClicked(e) {
    e.preventDefault();
    if (isAnimate || (!isLoop && index === max - 1)) return false;
		isAnimate = true;
		
		target = index + 1;
		target === max && (target = 0);
		goToNext();
  }

  function prevClicked(e) {	
    e.preventDefault();
		if (isAnimate || (!isLoop && index === 0)) return false;
		isAnimate = true;
		
		target = index - 1;
		target === -1 && (target = max - 1);
		goToPrev();
	}

  function navClicked(e) {
    e.preventDefault();
    var item = $(this),
        targetIndex = 0;

    if (isAnimate || item.hasClass(CLASS._active)) return false;
    targetIndex = parseInt(item.data('index'));
    goTo(targetIndex);
  }

  function goTo(targetIndex) {
    isAnimate = true;
    target = targetIndex;
		index < targetIndex ? goToNext() : goToPrev(); 
  }
	
	function goToPrev() {
    updatePaging();
		currentItem = items.eq(index);
		targetItem = items.eq(target);
		
		TweenMax.set(targetItem, {
			autoAlpha: 1,
			x: -mainW
    });
    
    TweenMax.to(targetItem, 1, {
      x: 0,
			ease: Expo.easeInOut,
			force3D: true,
			onComplete: animatedDone
		});
		
		TweenMax.to(currentItem, 1, {
      x: mainW,
			ease: Expo.easeInOut,
			force3D: true
		});
	}
	
	function goToNext() {
    updatePaging();
		currentItem = items.eq(index);
		targetItem = items.eq(target);

		TweenMax.set(targetItem, {
			autoAlpha: 1,
			x: mainW
    });
    
    TweenMax.to(targetItem, 1, {
      x: 0,
      ease: Expo.easeInOut,
			force3D: true,
			onComplete: animatedDone
		});
		
		TweenMax.to(currentItem, 1, {
      x: -mainW,
			ease: Expo.easeInOut,
      force3D: true
		});
  }
	
	function animatedDone() {
    isAnimate = false;
    TweenMax.set(currentItem, { autoAlpha: 0 });
    index = target;
		autoPlay();
  }

  function updatePaging() {
    navs.eq(index).removeClass(CLASS._active);
    navs.eq(target).addClass(CLASS._active);
    pagings.eq(index).removeClass(CLASS._active);
    pagings.eq(target).addClass(CLASS._active);
  }

  init();
	return this;
};
var sliderImg = function(element, autoplay, timeauto) {
  var CLASS = {
    _active: 'item-active',
    _dot: 'dot-active',
  }

  var elm = jQuery(element),
    listImg = elm.find('.list-img'),
    imgs = listImg.find('> *'),
    dots = elm.find('.dots'),
    dot = {},
    total = imgs.length,
    imgCurrent,
    imgTarget,
    current = 0,
    target = 0,
    timedelay = 100,
    isAnimate = false;

  function init() {
    if(total < 2) {
      dots.hide();
      return false;
    }

    setUp();
    TweenMax.set(imgCurrent, {
      alpha: 1
    })

    createDot();

    if (!autoplay) {
      autoAnimation();
    }
  }

  function setUp() {
    imgCurrent = imgs.eq(current);
    imgTarget = imgs.eq(target);
  }

  // function dot
  function createDot() {
    dots.html('');

    for (let i = 0; i < total; i++) {
      dots.append('<span class="dot"></span>')
    }

    dot = dots.find('.dot');
    dotEvent();

    dot.on('click', onClickDot);
  }

  function dotEvent() {
    dot.removeClass(CLASS._dot);
    dot.eq(target).addClass(CLASS._dot);
  }

  function onClickDot() {
    var that = jQuery(this),
      index = that.index();
    if (isAnimate || that.hasClass(CLASS._dot)) return;

    isAnimate = true;
    target = index;

    sliderAnimation();
  }
  // function images
  function sliderNext() {
    if (isAnimate) return;
    isAnimate = true;

    target = current + 1;
    if (target > total - 1) {
      target = 0;
    }
    sliderAnimation();
  }

  function sliderPrev() {
    if (isAnimate) return;
    isAnimate = true;

    target = current - 1;
    if (target < 0) {
      target = total - 1;
    }

    sliderAnimation();
  }

  function sliderAnimation() {
    setUp();
    dotEvent();

    TweenMax.set(imgTarget, {
      alpha: 0
    });
    TweenMax.to(imgCurrent, 1, {
      alpha: 0,
      ease: Power2.easeOut
    });
    TweenMax.to(imgTarget, 1, {
      alpha: 1,
      ease: Power3.easeOut,
      onComplete: function () {
        current = target;
        isAnimate = false;
      }
    });
  }
  // function auto
  function autoAnimation() {
    setTimeout(function () {
      sliderNext();
      autoAnimation();
    }, timeauto * 1000);
  }

  init();
	return this;
};
var stickyElement = function(el) {
  const top = $(el).offset().top;
  const stickyEl = $(el).clone().addClass("sticky");

  stickyEl.appendTo(el);
  stickyEl.hide();
  stick();

  APP._window.scroll(() => {
    stick();
  });

  function stick() {
    if (window.pageYOffset > top) {
      stickyEl.show();
    } else {
      stickyEl.hide();
    }
  }

  return stickyEl;
}
/*** PAGE - BOD ***/
APP.bod = {
	_el: {},
	_des: {},
	_imgDes: {},
	_figureDes: {},
	_figCaption: {},
	_nameDes: {},
	_positionDes: {},
	_description: {},
	_clickedShowDes: {},
	_imgClickedShowDes: {},
	_btnClose: {},
	_popup: {},
	_manager: {},
	_scrollTop: {},
	_scrollPx: {},
	_niceSelect: {},
	_bodValue: {},

	init: function() {
		var self = this;
		self._des = $('.js-des');
		self._imgDes = $('.js-des img');
		self._figureDes = $('.js-des figure');
		self._figCaption = $('.js-des figcaption');
		self._nameDes = $('.js-des .name');
		self._positionDes = $('.js-des .position');
		self._description = $('.js-des .description');
		self._clickedShowDes = $('.js-show-des');
		self._imgClickedShowDes = $('.js-show-des img');
		self._btnClose = $('.js-close');
		self._popup = $('.js-popup-bod');
		self._manager = $('.manager');
		self._niceSelect = new niceSelect($('.sort'));
		self._bodValue = $('#bod-value');

		self.initScroll();
		self.initEvent();
	},

	initScroll: function() {
		var self = this;
		APP._window.scroll(() => {
			self._scrollTop = APP._window.scrollTop();
		});
	},

	initEvent: function() {
		var self = this;

		//SHOW DESCRIPTION
		var currentItem, lastItem, addItem;
		var equalHeight;

		self._imgClickedShowDes.on('click', function() {
			var img = $(this).attr('src'),
					gender = $(this).closest('.bod-item').find('.js-gender').text(),
					name = $(this).closest('.bod-item').find('.js-name').text(),
					position = $(this).closest('.bod-item').find('.js-position').text(),
					desc = $(this).closest('.bod-item').find('.js-long-des').html();
			
			if($(window).innerWidth() >= 768) {		
				//GET INFORMATION FROM CLICKEDSHOWDES
				currentItem = $(this).closest(self._clickedShowDes).attr('data-value');	
				lastItem = $(this).closest('.bod').find('.content > .js-show-des').last().attr('data-value');

				if(currentItem == lastItem) {
					addItem = currentItem;
				} else {
					for(var i=currentItem; i<=lastItem; i++) {
						if(i == lastItem) {
							addItem = i;
							break;
						}
						else if(i % 3 == 0) {
							addItem = i;
							break;
						}
					}
				}

				//INACTIVE
				self._manager.find('figcaption.active').removeClass('active');

				//ASSIGN DATA
				self._imgDes.attr('src',img);
				self._nameDes.find('span:first-child').text(gender);
				self._nameDes.find('span:last-child').text(name);
				self._positionDes.text(position);
				self._description.html(desc);	

				//ACTIVE
				$(this).closest('.bod-info').find('figcaption').addClass('active');
				$(this).closest('.bod').find('.content > .js-show-des').eq(addItem - 1).after(self._des);
				self._des.show();
				$('html, body').animate({scrollTop: $(".js-des").offset().top - 345}, 750);
			} else {
				//ASSIGN DATA
				self._popup.find('.gender').html(gender);
				self._popup.find('.name').html(name);
				self._popup.find('.position').html(position);
				self._popup.find('.desc').html(desc);
				
				//ACTIVE
				self.disableScroll();
				self._popup.show();
			}
		});

		$('.bod-select .option').click(function() {
			var dataValue = $(this).attr('data-value');
			
			$('.bod-select .option.active').removeClass('active');
			$(".bod-select .option[data-value='" + dataValue + "']").addClass("active");
		});
	
		self._bodValue.on('change', function() {
			var value = $(this).val();
			var bods = $('.bod');
			var dataValue = $(this).attr('data-value');

			// $('.bod').removeClass(CLASS._active);
			$('.bod[data-value="'+value+'"]').addClass(CLASS._active);
	
			bods.each( (key, bod) => {
				bod.id === value ? $(bod).removeClass(CLASS._hide) : $(bod).addClass(CLASS._hide)
			})
		});

		//CLOSE DESCRIPTION & POPUP
		self._btnClose.on('click', () => {
			self._des.hide();
			self._manager.find('figcaption.active').removeClass('active');
			APP._window.innerWidth() < 768 && self.activeScroll();
		});
		
		//MAKE EQUAL HEIGHT
		self._clickedShowDes.on('click', () => {
			equalHeight = self._figureDes.height();
			self._figCaption.height(equalHeight);
		});
	},

	disableScroll: function() {
		var self = this;
		self._scrollPx = self._scrollTop;
		APP._html.addClass('js-popup');
		APP._html.css('margin-top', '-' + self._scrollTop + 'px');
	},

	activeScroll: function() {
		var self = this;
		APP._html.removeClass('js-popup');
		APP._window.scrollTop(self._scrollPx);
	}
};
/*** PAGE - DETAIL POLICY ***/
APP.detail_policy = {
	_el: {},
	

	init: function() {
		var self = this;
		self._el = $('#' + APP._pageID);
		self.initCss();
		self.initRezise();	
	},

	initCss: function() {
		var self = this;
		var heightTitle, maxHeight;
		var bigItem = self._el.find('.js-big-item');
		self._el.find('.js-equal-height').removeAttr('style');
		if($(window).innerHeight() >= 768) {
			bigItem.each(function() {
				maxHeight = 0;
				heightTitle = $(this).find('.js-equal-height');
				heightTitle.each(function () {
					if($(this).innerHeight() > maxHeight) {
						maxHeight = $(this).innerHeight();
					}				
				});
				heightTitle.innerHeight(maxHeight);	
			});
		}
	},

	initRezise: function() {
		var self = this;
		$(window).resize(function() {
			self.initCss();
		});
	}
};
/*** PAGE - DETAIL PROJECT ***/
APP.detail_project = {
	_el: {},
	_acreageSelect: {},
	_progessSelect: {},
	_brochurePopup: {},

	init: function() {
		var self = this;
		self._el = $('#' + APP._pageID);
		self._brochurePopup = $('.popup-brochure');
		self._stickyNav = new stickyElement($('.heading-in-page'));
		self.initSlick();
		self.initCss();
		self.initEvent();
		self.initResize();
		self.initScroll();
	},

	initSlick: function() {
		var acreageSelectWidth = $('.acreage-select.slider').width();
		var acreageSelectItemWidth = $('.acreage-select.slider .item').outerWidth();
		var acreageSelectItemCount = $('.acreage-select.slider .item').length;

		var maxHeight = Math.max.apply(null, $(".acreage-select.slider .item").map(function (){
				return $(this).outerHeight();
		}).get());
		$('.acreage-select.slider .item').css({'height': maxHeight})

		// $('.acreage-slider').slick({
		//   speed: 300,
		// 	slidesToShow: 1,
		//   arrows: true,
		//   responsive: [
		//     {
		//       breakpoint: 769,
		//       settings: {
		//       	arrows: false,
		//         dots: true
		//       }
		//     }
		//   ]  	
		// });

		if (acreageSelectWidth < acreageSelectItemWidth*acreageSelectItemCount) {
			var itemsToShow = Math.floor(acreageSelectWidth/acreageSelectItemWidth);
			var adjustedItemWidth = Math.floor(acreageSelectWidth/itemsToShow);

			$('.acreage-select.slider .item').css({'width': adjustedItemWidth})
			$('.acreage-select.slider').slick({
			  speed: 300,
				infinite: false,
			  arrows: true,
				variableWidth: true,
				slidesToScroll: 1,
				slidesToShow: itemsToShow
			});
		}

		$('.news-slider').slick({
			resize: true,
		    speed: 300,
		    slidesToShow: 3,
			arrows: false,
			dots: true,
		    centerMode: false,
            responsive: [
                {
                  breakpoint: 769,
                  settings: {
                    speed: 300,
                    slidesToShow: 1,
                    arrows: false,
                    centerMode: true
                  }
                }
              ]
		});
        $('.bds-cn-slider').slick({
            resize: true,
            speed: 300,
            slidesToShow: 4,
            arrows: false,
            dots: true,
            centerMode: false,
            responsive: [
                {
                    breakpoint: 769,
                    settings: {
                        speed: 300,
                        slidesToShow: 1,
                        arrows: false,
                        centerMode: true
                    }
                }
            ]
        });
	},

	initCss: function() {
		var self = this;
		self._acreageSelect = new niceSelect($('.acreage .sort'));
		self._progessSelect = new niceSelect($('.progress .sort'));
		self.reSizeNews();
	}, 

	initEvent: function() {
		var self = this;
		var srcImage, idSection;
		const stickyNavHeight = self._stickyNav.height()
		
		//scroll to section
		$('.js-hashtag .text').click(function() {
			idSection = $(this).attr('data-value');
			$('.js-hashtag .active').removeClass('active');
			$(this).addClass('active');
			$('html,body').animate({scrollTop: $(idSection).offset().top - stickyNavHeight},750);
		});

		$('[data-fancybox]').fancybox({
      beforeShow: function(){
      	$("html").css({'overflow':'hidden'});
      },
      afterClose: function(){
    		$("html").css({'overflow':'auto'});
			}
		});
		
		$('.maps-type .options > .item').on('click', function() {
			const activeValue = $(this).attr('data-value');

			$('.maps-type .options > .item.active').removeClass('active');
			$('.maps-type .options > .item[data-value="'+activeValue+'"]').addClass('active');
			
			$('.maps > .content.active').removeClass('active');
			$('.maps > .content[data-value="'+activeValue+'"]').addClass('active');
		});

		$('.acreage-select .item').on('click', function() {
			const activeValue = $(this).attr('data-value');

			$('.acreage-select .item.active').removeClass('active');
			$('.acreage-select .item[data-value="'+activeValue+'"]').addClass('active');
			$('.acreage-content .item.active').removeClass('active');
			$('.acreage-content .item[data-value="'+activeValue+'"]').addClass('active');
		});

		$('.download-brochure').on('click', function() {
			self._brochurePopup.addClass('active');
			self.disableScroll();
		});
		
		$('.popup-brochure .close').on('click', function() {
			self._brochurePopup.removeClass('active');
			self.clearBrochureForm();
			self.activeScroll();
		});

		$('.popup-brochure').on('click', function(e) {
			const isOutsidePopup = $(e.target).find('> .popup-container').length === 1;
// console.log({isOutsidePopup})
			if(isOutsidePopup) {
				self._brochurePopup.removeClass('active');
				self.clearBrochureForm();
				self.activeScroll();
			}
		});

		$('.popup-brochure .agreement-checkbox.conditions-agreement').on('click', function() {
			var isChecked = $(this).find('input').prop('checked');

			isChecked
				? $('.popup-brochure button[type=submit]').removeAttr('disabled')
				: $('.popup-brochure button[type=submit]').prop('disabled', true);

		});

		// validate brochure form 
		$('.popup-brochure .field input').on('blur', function() {
			self.validateBrochureFormField(this);
		});

		// submit brochure form
		$('.popup-brochure form').submit(function( event ) {
			event.preventDefault();
			let errors;
			
			// Known issue: this code would not work correctly if each type there're more than 1 field (ex: form has 2 fields with type='text')
			// However, due to some issue while BE integrated with the correct code, this is now temporarily kept here for current situation
			// This should be soon improve to avoid bugs in future.
			self.validateBrochureFormField($(this).find('input[type=text]'));
			self.validateBrochureFormField($(this).find('input[type=number]'));
			self.validateBrochureFormField($(this).find('input[type=email]'));

			// $(this).find('input[type=text], input[type=email], input[type=number]').each(
			// 	(key, field) => self.validateBrochureFormField(field)
			// );
					
			errors = $(this).find('.field.error');
		
			if (errors.length >= 1) {
				return;
			} else {
				// These logic and ajax call should be handled on BE side however, due to tight implementation time,
				// we temporarily keep it here. This should be improved in future.
				var name = $('#customerName').val();
				var phone = $('#customerPhone').val();
				var email = $('#customerEmail').val();
				var projectId = $('#projectId').val();
                var checkTcs = [];
                $.each($("input[name='conditionsAgreement']:checked"), function() {
                    checkTcs.push($(this).val());
                });
                var ajaxUrl = $('#ajaxUrl').val();
                $.ajax({
                    url: ajaxUrl,
                    type: "POST",
                    dataType: 'json',
                    data: {
                        action: 'set_form',
                        name: name,
                        phone: phone,
                        email: email,
                        projectId: projectId,
                        tcs : checkTcs,
                    },   success: function(response){
                        $('span.close').trigger('click');
                        window.location = response.url;
                        self.clearBrochureForm();
                    }, error: function(data){
                        // show messages if needed
                    }
                });
				$('#customerForm')[0].reset();				
			}
		});

		// viewmore
		$(".library").on("click", "[data-group='libraryViewMore']", function(evt) {
			evt.preventDefault();
			let container = $(".library .library-container");
			let viewmoreButton = $(container).find('.viewmore');
			var blockSize = parseInt($(container).attr("data-step"), 10);
			var total = parseInt($(container).attr("data-max-length"), 10);
			var currentIndex = parseInt($(container).attr("data-current-step"), 10);
			var newItemsCount;
			var newIndex;
			
			if (currentIndex + 1 >= total) {
				return;
			} else if (currentIndex + blockSize + 1 >= total) {
				newIndex = total - 1;
				viewmoreButton.hide();
			} else {
				newIndex = currentIndex + blockSize;
			}
			newItemsCount = newIndex - currentIndex;
	
			for(var i=1; i <= newItemsCount; i++){
				$(container).find("[data-group='library-item'][data-index='"+(currentIndex + i)+"']").show();
			}
	

			$(container).attr("data-current-step", newIndex);
		});
	},

	initResize: function() {
		var self = this;
		$(window).resize(function() {
			self.initCss();
			self.initSlick();
		});
	},

	reSizeNews: function() {
		var maxHeight = 0;
		$('.js-equal-height').each(function () {
			$('.js-equal-height').removeAttr('style');
			if($(this).innerHeight() > maxHeight) {
				maxHeight = $(this).innerHeight();
			}				
		});
		$('.js-equal-height').innerHeight(maxHeight);	
	},

	initScroll: function() {
		var self = this;
		APP._window.scroll(() => {
			self._scrollTop = APP._window.scrollTop();
		});
	},

	disableScroll: function() {
		// var self = this;
		// self._scrollPx = self._scrollTop;
		APP._html.addClass('js-popup');
		// APP._html.css('margin-top', '-' + self._scrollTop + 'px');
	},

	activeScroll: function() {
		// var self = this;
		APP._html.removeClass('js-popup');
		// APP._window.scrollTop(self._scrollPx);
	},

	clearBrochureForm: function() {
		$('.popup-brochure button[type=submit]').prop('disabled', true);
		$('.popup-brochure form').find('input[type=text], input[type=email], input[type=number]').val('');
		$('.popup-brochure form').find('input:checkbox, input:radio').removeAttr('checked');
		$('.popup-brochure form .gender input:radio').first().prop('checked', true);
		$('.popup-brochure form .field .error-msg').text('');
		$('.popup-brochure form .field').removeClass('error');
	},

	validateBrochureFormField: function(input) {
		var inputType = $(input).attr('name');
		var inputValue = $(input).val();
		var inputRequiredError = $(input).attr('data-required-error');
		var inputValidError = $(input).attr('data-invalid-error');
		var parent = $(input).parent('.field');
		var error = parent.find('.error-msg');
		var minPhoneNumberLength = 10;
		var minNameLength = 2;
		var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
console.log('inputValue', inputValue)
		switch (inputType) {
			case 'fullName':
				if (!inputValue) {
					parent.addClass('error');
					error.text(inputRequiredError);
				} else if (inputValue.length < minNameLength) {
					parent.addClass('error');
					error.text(inputValidError);
				} else {
					parent.removeClass('error');
					error.text('');
				}

				break;

			case 'phone':
				if (!inputValue) {
					parent.addClass('error');
					error.text(inputRequiredError);
				} else if (inputValue.length < minPhoneNumberLength) {
					parent.addClass('error');
					error.text(inputValidError);
				} else {
					parent.removeClass('error');
					error.text('');
				}

				break;

			case 'email':
				if (!inputValue) {
					parent.addClass('error');
					error.text(inputRequiredError);
				} else if (!emailRegex.test(inputValue)) {
					parent.addClass('error');
					error.text(inputValidError);
				} else {
					parent.removeClass('error');
					error.text('');
				}

				break;

			default:
				break;
		}
	}
};
/*** PAGE - DETAIL RECRUITMENT ***/
APP.detail_recruitment = {
	_el: {},

	init: function() {
		var self = this;
		self._el = $('#' + APP._pageID);
		
		$('.js-send-cv').click(function() {
			$('.js-form').show();
			$('html').css('overflow', 'hidden');
		});
		
		$("input:file").change(function (e){
			var fileName = e.target.files[0].name;
			$(".js-name-file").html(fileName);
    });
	}
};
/*** PAGE - HISTORY ***/
APP.history = {
	_el: {},
	_sliderImg: {},
	_viewmore: {},

	init: function() {
		var self = this;
		self._el = $('#' + APP._pageID);
    self._sliderImg = self._el.find('.slider-img');
    for (var i = 0; i < self._sliderImg.length; i++) {
      new sliderImg(self._sliderImg[i], false , 5);
		}

		self._viewmore = self._el.find('.view-more');
		for (var i = 0; i < self._viewmore.length; i++) {
    	self.viewMore(self._viewmore[i]);
		}
		self.initCss();
		self.initResize();
	},

	viewMore: function(element) {
		var item = jQuery(element),
			parent = item.parent();

		item.on('click', function(e) {
			e.preventDefault();
			(parent.hasClass('js-active')) ? parent.removeClass('js-active') : parent.addClass('js-active');
		})
	},

	initCss: function() {
		var self = this;
		var historyText = self._el.find('.history-item .text'), 
				heightText, heightImage, paddingImage;
		var marginCovert, heightCovert;

		historyText.each(function(index) {
			heightText = parseInt($(this).outerHeight());
			heightImage = $(this).closest('.history-item').find('.list-img').innerHeight();
			paddingImage = 54 + (heightText / 2) - (heightImage / 2);
			$(this).closest('.history-item').find('.slider-img').removeAttr('style');
			if($(window).innerWidth() >= 768) {
				$(this).closest('.history-item').find('.slider-img').css('padding-top',paddingImage);
				if(index == 0) {
					heightCovert = (heightText / 2) + 54 + 'px';
					$(this).closest('.history-item').find('.covert').css('height', heightCovert);
				}
				if(index == (historyText.length - 1)) {
					marginCovert = (heightText / 2) + 54;
					heightCovert = parseInt($(this).closest('.copy').outerHeight()) - marginCovert + 'px';
					$(this).closest('.history-item').find('.covert').css({
						'height': heightCovert, 'margin-top': marginCovert
					});
				}			
			}
		});
	},

	initResize: function() {
		var self = this;
		$(window).resize(function() {
			self.initCss();
		});
	}
};
/*** PAGE - HOME ***/

APP.home = {
	_el: {},

	init: function() {
		var self = this;
		var video;
		self._el = $('#' + APP._pageID);
		self.initSlick();
		self.initCss();
		self.initEvent();
		self.initResizeWindow();

		//count number
		$('.js-count').each(function () {
	    $(this).prop('Counter',0).animate({
	        Counter: $(this).text()
	    }, {
	        duration: 4000,
	        easing: 'swing',
	        step: function (now) {
	            $(this).text(Math.ceil(now));
	        }
	    });
		});
	},

	initSlick: function() {
		$('.service-slider-mb').slick({
		  slidesToShow: 4,
		  arrows: false,
			responsive: [
		    {
		      breakpoint: 960,
		      settings: {
		  			speed: 300,
		        slidesToShow: 2,
		        slidesToScroll: 2,
		        dots: true
		      }
		    }
		  ]  		
		});

		$('.project-slider').slick({
		  speed: 300,
		  slidesToShow: 1,
		  arrows: true,
		  autoplay: false,
		  responsive: [
		    {
		      breakpoint: 960,
		      settings: {
		        arrows: false,
		        dots: true
		      }
		    }
		  ]  		
		});

		$('.info-slider').slick({
		  speed: 300,
		  slidesToShow: 3,
		  arrows: false,
		  dots: true,
		  responsive: [
		    {
		      breakpoint: 767,
		      settings: {
		        slidesToShow: 1,
		        arrows: false,
		        centerMode: true
		      }
		    }
		  ] 
		});

		$('.partner-slider').slick({
			infinite: false,
		  speed: 300,
		  slidesToShow: 4,
		  arrows: false,
		  dots: true,
		  responsive: [
		  	{
			  	breakpoint: 960,
			  	settings: {
			  		slidesToShow: 3
			  	}
		  	}
		  ]
		});
	},

	initEvent: function() {
		var self = this;
		//hover image
		$('.js-hover-service').hover(
			function() {
				$(this).find('figure').addClass('hover');
			}, function() {
				$(this).find('figure').removeClass('hover');
			}
		);
	},

	initCss: function() {
		var self = this;
		var heightMenu, heightHeroBanner, heightProjectHeader, heightProjectSlider;

		// set full screen hero banner
		heightMenu = parseInt($('.main-header').innerHeight());
		heightHeroBanner = parseInt($(window).innerHeight() - heightMenu);
		self._el.find('.banner-holder').css('height', heightHeroBanner);

		//set full screen project
		heightProjectHeader = parseInt(self._el.find('.project-header').outerHeight());
		heightProjectSlider = parseInt($(window).height() - heightProjectHeader + 'px');
		self._el.find('.project-slider .slider-item >figure').css('height', heightProjectSlider);

		self.reSize();
	},

	initResizeWindow: function() {
		var self = this;
		$(window).resize(function() { 
			self.initCss();			
		});
	},

	reSize: function() {
		var maxHeight = 0;
		$('.js-equal-height').removeAttr('style');
		$('.js-equal-height').each(function () {
			if($(this).height() > maxHeight) {
				maxHeight = $(this).height();
			}				
		});
		$('.js-equal-height').height(maxHeight);	
	}
};

/*** PAGE - NEWS DETAIL***/
APP.news_detail = {
	_el: {},

	init: function() {
		var self = this;
		self._el = $('#' + APP._pageID);
		self.initSlick();
		self.initResizeSlick();
		self.initCss();
		self.initResize();
	},

	initSlick: function() {
		if($(window).innerWidth() < 768) {
			$('.news-slider-mb').slick({
			  responsive: [
			    {
			      breakpoint: 768,
			      settings: {
			  			speed: 300,
						  slidesToShow: 1,
						  infinite: true,
						  arrows: false,
						  dots: true,
						  centerMode: true
			      }
			    },
			    {
			      breakpoint: 480,
			      settings: {
			  			speed: 300,
						  slidesToShow: 1,
						  infinite: true,
						  arrows: false,
						  dots: true,
						  centerMode: true
			      }
			    }
			  ]  	
			});
		}
	},

	initResizeSlick: function() {
		var self = this;
		$('.news-slider-mb').on('breakpoint', function(e){
			if($(window).innerWidth() >= 768) {
				$('.news-slider-mb').slick('unslick');
			} else if($(window).innerWidth() < 768 && !$('.news-slider-mb').hasClass('slick-initialized')) {
				self.initSlick();
			}
			self.initCss();
		});
	},

	initCss: function() {
		var self = this;
		self.reSize();
	},

	initResize: function() {
		var self = this;
		$(window).resize(function() {
			if($(window).innerWidth() < 768 && !$('.news-slider-mb').hasClass('slick-initialized')) {
				self.initSlick();
			}
			self.initCss();
		});
	},

	reSize: function() {
		var self = this;
		var heightImgNews = self._el.find('.js-equal-height');
		var maxHeightImgNews = 0;
		heightImgNews.removeAttr('style');
		heightImgNews.each(function () {
			if($(this).innerHeight() > maxHeightImgNews) {
				maxHeightImgNews = $(this).innerHeight();
			}				
		});
		heightImgNews.innerHeight(maxHeightImgNews);	
	}
};
/*** PAGE - NEWS ***/
APP.news = {
	_el: {},
	_niceSelect: {},

	init: function() {
		var self = this;
		self._el = $('#' + APP._pageID);
		self._niceSelect = new niceSelect($('.sort'));
		self.initCss();
		self.initEvent();
		self.initRezise();	
	},

	initCss: function() {
		var self= this;
		var heightTitle = self._el.find('.vertical-news .js-equal-height');
		var maxHeight = 0;
		heightTitle.removeAttr('style');
		if($(window).innerWidth() >= 768) {
			heightTitle.each(function () {
				if($(this).height() > maxHeight) {
					maxHeight = $(this).height();
				}				
			});
			heightTitle.height(maxHeight);	
		}
	},

	initEvent: function() {
		var self = this;
		var verticalNews = self._el.find('.vertical-news');
		if($(window).innerWidth() >= 767) {
			verticalNews.each(function() {
				var image = $(this).find('.image');
				var figure = $(this).find('figure');
				var title = $(this).find('.title');
				var description = $(this).find('.description');
				var heightImage = image.innerHeight();
				var heightTitle = title.innerHeight();
				var heightDescription = $(this).find('.description').innerHeight();
				$(this).hover(function() {
					image.animate({height: heightImage - heightDescription + 'px'},200);
					title.animate({height: heightTitle + heightDescription + 'px'},200);
					description.animate({opacity: '1'},200);
				}, function() {
					title.animate({height: heightTitle + 'px'},200);
					image.animate({height: heightImage + 'px'},200);
					description.animate({opacity: '0'},200);
				});
			})
		}				
	},

	initRezise: function() {
		var self = this;
		$(window).resize(function() {
			self.initCss();	
			self.initEvent();		
		})
	}
};
/*** PAGE - POLICY ***/
APP.policy = {
	_el: {},
	

	init: function() {
		var self = this;
		self._el = $('#' + APP._pageID);
		self.initCss();
		self.initRezise();	
	},

	initCss: function() {
		var self = this;
		var heightTitle, maxHeight;
		var bigItem = self._el.find('.big-item');
		self._el.find('.js-equal-height').removeAttr('style');
		if($(window).innerHeight() >= 768) {
			bigItem.each(function() {
				maxHeight = 0;
				heightTitle = $(this).find('.js-equal-height');
				heightTitle.each(function () {
					if($(this).innerHeight() > maxHeight) {
						maxHeight = $(this).innerHeight();
					}				
				});
				heightTitle.innerHeight(maxHeight);	
			});
		}
	},

	initRezise: function() {
		var self = this;
		$(window).resize(function() {
			self.initCss();
		});
	}
};
/*** PAGE - PRIZE ***/
APP.prize = {
	_slider: {},
	_itemLength: {},
	_indexOfSlide: {},
	_valueOfSlide: {},
	_itemGoTo: {},

	init: function() {
		var self = this;
		//slider
		self._itemLength = $('.year-slider > div').length;
		self._indexOfSlide = 0
		self.initSlick();
		self.initEventSlick();
		self.initEvent();
		self.initResize();
	},

	initSlick: function() {
		var self = this;

		self._slider = $('.year-slider').slick({
			speed: 100,
		  slidesToShow: 5,
	   	slidesToScroll: 1,
		  variableWidth: true, 
		  swipe: false,
		  responsive: [
		    {
		      breakpoint: 960,
		      settings: {
		        slidesToShow: 3
		      }
		    }
		  ] 
		});		

		self._itemGoTo = $(window).innerWidth() >= 960 ? self._itemLength - 2 : self._itemLength - 1;
		self.goToItemSlider(self._itemGoTo);
		self.setStyle(self.getIndexOfShowing());
	},

	initEventSlick: function() {
		var self = this;

		self._slider.on('afterChange', function(event, slick, currentSlide, nextSlide){
			currentSlide == 5 && self.setStyle(self._indexOfSlide);
		});

		$('.slick-arrow').click(function() {
			self.removeSliderActive();
			self.setStyle(self.getIndexOfShowing());
			self._valueOfSlide = $('.year-slider .active').attr('data-value');
			self.addSliderActive(self._valueOfSlide);
		});

		$('.js-show').click(function() {
			var itemClick = parseInt($(this).attr('data-slick-index'));
			self._itemGoTo = $(window).innerWidth() >= 960 ? itemClick - 2 : itemClick - 1;
			self._valueOfSlide = $(this).attr('data-value');
			self.goToItemSlider(self._itemGoTo);
			self.removeSliderActive();
			self.addSliderActive(self._valueOfSlide);
			self.setStyle(self.getIndexOfShowing());
		});
	},

	initEvent: function() {
		var self = this;
		//show des
		$('.js-show-des').click(function() {
			var i;
			var addItem;
			var currentItem = $(this).attr('data-value');	
			var lastItem = $(this).closest('.big-item').find('.js-show-des').last().attr('data-value');
			var title = $(this).find('.js-title').text();
			var content = $(this).find('.js-content').text();
			var image = $(this).find('figure img').attr('src');
			$('.manager').find('figcaption.active').removeClass('active');
			if(currentItem == lastItem) {
				addItem = currentItem;
			} else {
				for(i=currentItem; i<=lastItem; i++) {
					if(i == lastItem) {
						addItem = i;
						break;
					}
					if(APP._W > 768 && i % 4 == 0) {
						addItem = i;
						break;
					}
					if(APP._W < 768 && i % 2 == 0) {
						addItem = i;
						break;
					} 
				}
			}
			$('.js-des .title-des').html(title);
			$('.js-des .content-des').html(content);
			$('.js-des').find('figure img').attr('src', image);
			$(this).closest('.big-item').find('.js-show-des').eq(addItem - 1).after($('.js-des'));
			$('.js-des').show();
			$('html, body').animate({
        scrollTop: $(".js-des").offset().top}, 750);
		});

		//close des
		$('.js-close').click(function() {
			$('.js-des').hide();
		});
	},

	initResize: function() {
		var self = this;
		$(window).resize(function() {
			self.initCss();
		});
	},

	setStyle: function(index) {
		var itemSecond = index + 1;
		var itemThird = index + 2;
		var itemFourth = index + 3;
		var itemFifth = index + 4;

		if($(window).innerWidth() >= 960) {
			$(".slick-slide[data-slick-index=" + index +"]").find('.icon').css({
				'width':'120px',
				'font-size':'2.5rem'
			});
			$(".slick-slide[data-slick-index=" + itemSecond +"]").find('.icon').css({
				'width':'160px',
				'font-size':'3.7rem'
			});
			$(".slick-slide[data-slick-index=" + itemThird +"]").find('.icon').css({
				'width':'240px',
				'font-size':'4.5rem'
			});
			$(".slick-slide[data-slick-index=" + itemThird +"]").addClass('active');
			$(".slick-slide[data-slick-index=" + itemFourth +"]").find('.icon').css({
				'width':'160px',
				'font-size':'3.7rem'
			});
			$(".slick-slide[data-slick-index=" + itemFifth +"]").find('.icon').css({
				'width':'120px',
				'font-size':'2.5rem'
			});
		}

		else if($(window).innerWidth() < 960 && $(window).innerWidth() >= 480) {
			$(".slick-slide[data-slick-index=" + index +"]").find('.icon').css({
				'width':'120px',
				'font-size':'1.6rem'
			});
	
			$(".slick-slide[data-slick-index=" + itemSecond +"]").find('.icon').css({
				'width':'160px',
				'font-size':'3rem'
			});
			$(".slick-slide[data-slick-index=" + itemSecond +"]").addClass('active');
	
			$(".slick-slide[data-slick-index=" + itemThird +"]").find('.icon').css({
				'width':'120px',
				'font-size':'1.6rem'
			});
		}	

		else if($(window).innerWidth() < 480) {
			$(".slick-slide[data-slick-index=" + index +"]").find('.icon').css({
				'width':'80px',
				'font-size':'1.6rem'
			});
	
			$(".slick-slide[data-slick-index=" + itemSecond +"]").find('.icon').css({
				'width':'120px',
				'font-size':'3rem'
			});
			$(".slick-slide[data-slick-index=" + itemSecond +"]").addClass('active');
	
			$(".slick-slide[data-slick-index=" + itemThird +"]").find('.icon').css({
				'width':'80px',
				'font-size':'1.6rem'
			});
		}	
	},

	getIndexOfShowing: function() {
		var indexOfShowing = parseInt($('.slick-current').attr('data-slick-index'));
		return indexOfShowing;
	},

	removeSliderActive: function() {
		$('.year-slider .active').removeClass('active');
		$(".prize .active").removeClass('active');
	},

	addSliderActive: function(valueOfSlide) {
		$(".prize .big-item[data-value=" + valueOfSlide +"]").addClass('active');
	},

	goToItemSlider: function(index) {
		$('.year-slider').slick('slickGoTo', index);
	}
};
/*** PAGE - PROJECT ***/
APP.project = {
	_el: {},
	_niceSelect: {},

	init: function() {
		var self = this;
		self._el = $('#' + APP._pageID);
		self._niceSelect = new niceSelect($('.sort'));

		//animate 
		function addAnimate() {
			$('.projects-container .item').each(function(){
		    if(isScrolledIntoView($(this))){
		      $(this).addClass('animate');
		    }

		    if($(this).find('.detail-link span').hasClass('tooltip')) {
		    	$(this).find('.overview').css('padding-top','43px');
		    }
		  });
		}

		function isScrolledIntoView(elem){
	    var $elem = $(elem);
	    var $window = $(window);

	    var scrollTop = $window.scrollTop();
	    var viewBottom = scrollTop + $window.height();

	    var elemTop = $elem.offset().top;
	    var elemBottom = elemTop + 150;
	    if(elemBottom < viewBottom) {
	    	return true;
	    }
		}

        var hash = window.location.hash.substr(1);
        if(hash != '') {
            var hashValue = hash;
            hash = '#' + hash;
            var item = $('.navbar .item').find("a[href='" + hash + "']").closest('.item');
            //var itemMb = $('.navbar-mb .option').find("a[href='" + hash + "']").closest('.option');
            var pathRe = item.attr('data-value');
            item.addClass('active');
            //itemMb.addClass('active');
            $(".navbar-mb .option[data-value='" + hashValue + "']").addClass("active");
            var current = $('.navbar-mb').find('.current');
            current.text($(".navbar-mb .option[data-value='" + hashValue + "']").find('a').text());
            $(".projects-container[data-value=" + pathRe +"]").addClass('active');
        } else {
            $('.navbar .item[data-value=0]').addClass('active');
            $('.navbar-mb .item[data-value=0]').addClass('active');
            $('.projects-container[data-value=0]').addClass('active');
        }

        // addAnimate();
        // $(window).scroll(function(){
        //   addAnimate();
        // });

        $('.js-show-project .option').click(function() {
            var dataValue = $(this).attr('data-value');

            $('.navbar .option.active').removeClass('active');
            $('.navbar-mb .option.active').removeClass('active');
            $(".navbar .option[data-value='" + dataValue + "']").addClass("active");
            $(".navbar-mb .option[data-value='" + dataValue + "']").addClass("active");
            $('.projects-container.active').removeClass('active');
            $(".projects-container[data-value=" + dataValue +"]").addClass('active');
            window.location.hash = '#' + dataValue;
        });

		//show tooltip
		$('.js-show-tooltip').click(function() {
			$(this).closest('.detail-link').find('.tooltip').css('opacity','1');
		})

		// change view
		$(".view-config .item").on('click', function() {
			var dataValue = $(this).attr("data-value");

			$(".view-config .item.active").removeClass("active");
			$(".view-config .item[data-value=" + dataValue +"]").addClass("active");
			dataValue == 0
				? $(".project").addClass("grid-view")
				: $(".project").removeClass("grid-view");
		})
	}
};
/*** PAGE - DETAIL RECRUITMENT ***/
APP.recruitment = {
	_el: {},

	init: function() {
    var self = this;

    self._niceSelect = new niceSelect($('.sort'));
	}
};
/*** PAGE - REPORT ***/
APP.report = {
	_el: {},
	_niceSelect: {},

	init: function() {
		var self = this;
		self._el = $('#' + APP._pageID);
		self._niceSelect = new niceSelect($('.sort'));
	}
};