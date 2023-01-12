var version = '1.000-release',
    logo    = 'imgs/logo.svg',
    notesElm     = document.querySelectorAll('.note'),
    noteTitle    = document.querySelector('.note > strong'),
    noteBody     = document.querySelector('.note > div'),
    daList       = document.getElementById('list'),
    listAll      = document.querySelectorAll('#list > li'),
    notes = {
      title: [],
      body: [],
      scratchpad: ''
    };

// show dark logo for dark theme
if (theme.getAttribute('href') === 'css/dark.css' ) {
  logo = 'imgs/logo-white.svg'
} else {
  logo = 'imgs/logo.svg'
}

// Budjut about
about.onclick = function() {
  if (theme.getAttribute('href') === 'css/dark.css' ) {
    swal({
      html: '<img src="'+ logo +'" style="isolation:isolate; width: 50%; cursor: pointer;" viewBox="0 0 512 512" onclick="window.open(\'https://github.com/michaelsboost/Notes\', \'_blank\')"><br><h1>Notes</h1><h5>Version '+ version +'</h5><a href="https://github.com/michaelsboost/Notes/blob/gh-pages/LICENSE" target="_blank">Open Source License</a>'
    })
    document.querySelector('.swal2-show').style.fontSize = '14px'
    document.querySelector('.swal2-show').style.background = '#25251b'
    document.querySelector('.swal2-show a').style.color = '#3085d6'
    document.querySelector('.swal2-show h1, .swal2-show h5').style.fontWeight = '100'
    document.querySelector('.swal2-show h1, .swal2-show h5').style.color = '#fff'
  } else {
    swal({
      html: '<img src="'+ logo +'" style="isolation:isolate; width: 50%; cursor: pointer;" viewBox="0 0 512 512" onclick="window.open(\'https://github.com/michaelsboost/Notes\', \'_blank\')"><br><h1>Notes</h1><h5>Version '+ version +'</h5><a href="https://github.com/michaelsboost/Notes/blob/gh-pages/LICENSE" target="_blank">Open Source License</a>'
    })
    document.querySelector('.swal2-show').style.fontSize = '14px'
    document.querySelector('.swal2-show h1, .swal2-show h5').style.fontWeight = '100'
  }
}

// remember notes in localStorage
function updateStorage() {
  // push array to localstorage
  var notesTitle = []
  var notesBody = []
  for (i = 0; i < daList.children.length; i++) {
    notesTitle.push(document.querySelectorAll('.note > strong')[i].textContent)
    notesBody.push(document.querySelectorAll('.note > div')[i].innerHTML)
  }

  notes = {
    title: notesTitle,
    body: notesBody,
    scratchpad: scratchpad.value
  };

  // update search criteria
  var str = ''
  for (let numbers in notes.title) {
    str += '<option value="'+ notes.title[numbers] +'" />'
  }
  searchtitles.innerHTML = str

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

// open note
function openNotes() {
  for (i = 0; i < daList.children.length; i++) {
    document.querySelectorAll('.note')[i].onclick = function() {
      if (!deletenote.classList.contains('active')) {
        this.classList.add('opened')
        document.querySelector('.note.opened strong').setAttribute('contenteditable', true)
        document.querySelector('.note.opened div').setAttribute('contenteditable', true)
      
        // menu opened change icon to close
        menu.classList.add('opened')
        menu.setAttribute('href', 'javascript:closeNote()')
        menu.innerHTML = '<svg class="svg-inline--fa fa-xmark" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg=""><path fill="currentColor" d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"></path></svg>'
      } else {
        // delete list item by index
        listAll.forEach(function(e, i) {
          listAll[i].onclick = function() {
            listAll[i].remove()

            // update list
            totalnotes.textContent = '('+ daList.children.length +')'
            updateStorage()
          }
        })

        // update list
        totalnotes.textContent = '('+ daList.children.length +')'
        updateStorage()
        return false
      }
    }
  }
}

// close note
function closeNote() {
  // close menu
  menu.classList.remove('opened')
  menu.setAttribute('href', 'https://michaelsboost.com/donate/')
  menu.innerHTML = '<svg class="svg-inline--fa fa-heart" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="heart" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"></path></svg>'

  // close note
  document.querySelector('.note.opened > strong').removeAttribute('contenteditable')
  document.querySelector('.note.opened > div').removeAttribute('contenteditable')
  document.querySelector('.note.opened').classList.remove('opened')
}

// add note
addnote.onclick = function() {
  // inactivate delete note
  if (deletenote.classList.contains('active')) {
    deletenote.classList.remove('active')
  }

  notes.title.unshift('Title')
  notes.body.unshift('Body')

  // refresh elements on the screen
  daList.innerHTML = ''
  var liElm = document.createElement('div')
  for (let numbers in notes.title) {
    liElm.innerHTML = '<li><div class="note"><strong>'+ notes.title[numbers] +'</strong><div>'+ notes.body[numbers] +'</div></div></li>'
    while (liElm.children.length > 0) {
      daList.appendChild(liElm.children[0])
    }
  }

  // update list number
  totalnotes.textContent = '('+ daList.children.length +')'
  
  notesElm = document.querySelectorAll('.note')
  listAll  = document.querySelectorAll('#list li')
  openNotes()
  updateStorage()
}

// delete note
deletenote.onclick = function() {
  if (this.classList.contains('active')) {
    this.classList.remove('active')
  } else {
    this.classList.add('active')
  }
}

// clear scratchpad
clearpad.onclick = function() {
  scratchpad.value = ''
  updateStorage()
}

// // initalize storage
if (!localStorage.getItem('Notes')) {
  updateStorage()
} else {
  notes = JSON.parse(localStorage.getItem('Notes'))

  // apply storage list
  totalnotes.textContent = '('+ notes.title.length +')'

  // first we'll append the list
  var str = ''
  for (let numbers in notes.title) {
    str += '<li><div class="note"><strong>'+ notes.title[numbers] +'</strong><div>'+ notes.body[numbers] +'</div></div></li>'
  }
  daList.innerHTML = str

  // reset variables
  notesElm  = document.querySelectorAll('.note')
  noteTitle = document.querySelector('.note > strong')
  noteBody  = document.querySelector('.note > div')
  daList    = document.getElementById('list')
  listAll   = document.querySelectorAll('#list > li')

  // next display the stored value in scratchpad
  scratchpad.value = notes.scratchpad

  // empty search criteria
  searchtitles.innerHTML = ''
  
  // add search criteria
  var str = ''
  for (let numbers in notes.title) {
    str += '<option value="'+ notes.title[numbers] +'" />'
  }
  searchtitles.innerHTML = str

  // function to open notes
  openNotes()
}