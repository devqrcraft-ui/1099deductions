(function () {
  'use strict';

  var deadlines = [
    ['2026-04-15', 'April 15, 2026'],
    ['2026-06-15', 'June 15, 2026'],
    ['2026-09-15', 'September 15, 2026'],
    ['2027-01-15', 'January 15, 2027']
  ];
  var today = new Date();
  var todayKey = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0')
  ].join('-');
  var nextDate = null;

  for (var i = 0; i < deadlines.length; i++) {
    if (deadlines[i][0] >= todayKey) {
      nextDate = deadlines[i][1];
      break;
    }
  }

  var dateElements = document.querySelectorAll('[data-est-date]');
  for (var j = 0; j < dateElements.length; j++) {
    dateElements[j].textContent = nextDate || 'check IRS.gov for the next due date';
  }
})();
