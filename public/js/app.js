'use strict';
console.log('JS Running');
$('.selectbut').on('click', function() {
  $('.nothidden').toggleClass('hidden');
});

$('.deletebut').on('click', function() {
  $('.unhidden').toggleClass('hidden');
});


