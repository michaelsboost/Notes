var version = '1.000-release',
    logo = 'imgs/logo.svg',
    notes = {
      title: [],
      body: [],
      scratchpad: ''
    };

// show dark logo for dark theme
if ($('#theme').attr('href') === 'css/dark.css' ) {
  logo = 'imgs/logo-white.svg'
} else {
  logo = 'imgs/logo.svg'
}

// Budjut about
$('[data-about]').click(function() {
  if ($('#theme').attr('href') === 'css/dark.css' ) {
    swal({
      html: '<img src="'+ logo +'" style="isolation:isolate; width: 50%; cursor: pointer;" viewBox="0 0 512 512" onclick="window.open(\'https://github.com/michaelsboost/Notes\', \'_blank\')"><br><h1>Notes</h1><h5>Version '+ version +'</h5><a href="https://github.com/michaelsboost/Notes/blob/gh-pages/LICENSE" target="_blank">Open Source License</a>'
    })
    $('.swal2-show').css('font-size', '14px');
    $('.swal2-show').css('background', '#25251b');
    $('.swal2-show a').css('color', '#3085d6');
    $('.swal2-show h1, .swal2-show h5').css({
      'font-weight': '100',
      'color': '#fff'
    });
  } else {
    swal({
      html: '<img src="'+ logo +'" style="isolation:isolate; width: 50%; cursor: pointer;" viewBox="0 0 512 512" onclick="window.open(\'https://github.com/michaelsboost/Notes\', \'_blank\')"><br><h1>Notes</h1><h5>Version '+ version +'</h5><a href="https://github.com/michaelsboost/Notes/blob/gh-pages/LICENSE" target="_blank">Open Source License</a>'
    })
    $('.swal2-show').css('font-size', '14px');
    $('.swal2-show h1, .swal2-show h5').css({
      'font-weight': '100'
    });
  }
})

// remember notes in localStorage
function updateStorage() {
  var notesTitle = []
  $('[data-notes] li').each(function(i) {
    notesTitle.push($('.note strong')[i].textContent)
  })
  var notesBody = []
  $('[data-notes] li').each(function(i) {
    notesBody.push($('.note div')[i].textContent)
  })

  notes = {
    title: notesTitle,
    body: notesBody,
    scratchpad: scratchpad.value
  };
  localStorage.setItem('Notes', JSON.stringify(notes));
}

// remember data onkeyup
document.body.onkeyup = function() {
  updateStorage()
}

// search
function searchFunction() {
  // Declare variables
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('search');
  filter = input.value.toUpperCase();
  ul = document.getElementById("list");
  li = ul.getElementsByTagName('li');

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("div")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}
$('#search').on('keyup change', function() {
  searchFunction()
})

// open note
function openNote(e) {
  if (!$('[data-delete=note]').hasClass('active')) {
    $(e).find('.note').addClass('opened')
    $('.note.opened').find('strong, div').attr('contenteditable', true)
  
    // menu opened change icon to close
    $('#menu').addClass('opened').attr('href', 'javascript:closeNote()').html('<i class="fa fa-times"></i>')
  } else {
    // delete list item by index
    $('[data-notes] li').eq($(e).index()).remove()

    // update list
    $('#totalnotes').text('('+ $('[data-notes] li').length +')')
    updateStorage()
    return false
  }
}

// close note
function closeNote() {
  // close menu
  $('#menu').removeClass('opened').attr('href', 'https://michaelsboost.com/donate/').html('<i class="fa fa-heart"></i>')

  // close note
  $('.note.opened').find('strong, div').removeAttr('contenteditable')
  $('.note.opened').removeClass('opened')
}

// add note
$('[data-add=note]').click(function() {
  $('[data-notes]').prepend('<li onclick="openNote(this)"><div class="note"><strong>Title</strong><div>Body</div></div></li>')
  $('#totalnotes').text('('+ $('[data-notes] li').length +')')
  updateStorage()

  // inactivate delete note
  if ($('[data-delete=note]').hasClass('active')) {
    $('[data-delete=note]').toggleClass('active')
  }
})

// delete note
$('[data-delete=note]').click(function() {
  $(this).toggleClass('active')
})

// clear scratchpad
$('[data-clearpad]').click(function() {
  scratchpad.value = ''
  updateStorage()
})

// initalize storage
if (!localStorage.getItem('Notes')) {
  updateStorage()
} else {
  notes = JSON.parse(localStorage.getItem('Notes'))

  // first we'll append the list
  for (let numbers in notes.title) {
    $('[data-notes]').append('<li onclick="openNote(this)"><div class="note"><strong></strong><div></div></div></li>')
  }

  // next apply the storage
  $('[data-notes] li').each(function(i) {
    $('.note').eq(i).find('strong').text(notes.title[i])
    $('.note').eq(i).find('div').text(notes.body[i])

    // add search criteria
    $('#searchtitles').append('<option value="'+ notes.title[i] +'>')
  })
  $('#totalnotes').text('('+ $('[data-notes] li').length +')')

  // next display the stored value in scratchpad
  scratchpad.value = notes.scratchpad

  // empty search criteria
  $('#searchtitles').empty()
  
  // add search criteria
  for (i = 0; i < notes.title.length; i++) {
    $('#searchtitles').append('<option value="'+ notes.title[i] +'">')
  }
  console.log($('#searchtitles option').length)
}