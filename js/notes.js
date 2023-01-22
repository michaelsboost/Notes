// load quill
function dynamicallyLoadScript(url) {
  var script = document.createElement("script");  // create a script DOM node
  script.src = url;  // set its src to the provided URL
 
  // add it to the end of the head section of the page
  // (could change 'head' to 'body' to add it to the end of the body section instead)
  document.head.appendChild(script);
}
dynamicallyLoadScript('libraries/quill/quill.min.js')

// variables
var notesElm     = document.querySelectorAll('#note .note'),
    noteTitle    = document.querySelector('#note .note > article'),
    noteBody     = document.querySelector('#note .note > section'),
    daList       = document.getElementById('list'),
    listAll      = document.querySelectorAll('#list > li'),
    currentTitleElm, currentTitle, currentBodyElm, currentBody, quill,
    notes = {
      title: [],
      body: [],
      scratchpad: ''
    };

// remember notes in localStorage
function updateStorage() {
  // push array to localstorage
  var notesTitle = []
  var notesBody = []
  for (i = 0; i < daList.children.length; i++) {
    notesTitle.push(document.querySelectorAll('.note > article')[i].textContent)
    notesBody.push(document.querySelectorAll('.note > section')[i].innerHTML)
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
    a = li[i].getElementsByTagName("article")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

// edit note
function editNote(num) {
  if (!deletenote.classList.contains('active')) {
    currentTitleElm = document.querySelectorAll('.list .note > article')[num]
    currentTitle = currentTitleElm.textContent
    currentBodyElm = document.querySelectorAll('.list .note > section')[num]
    currentBody = currentBodyElm.innerHTML

    // menu opened change icon to close
    menu.classList.add('opened')
    menu.setAttribute('href', 'javascript:closeNote()')
    menu.innerHTML = '<i class="fa fa-times"></i>'

    // grab note title and body
    editorTitle.value = currentTitle
    editorBody.innerHTML = currentBody

    // display editor
    document.querySelector('#dialog').style.display = 'block'

    // edit opened note
    quill = new Quill('#editorBody', {
      modules: {
        'toolbar': [
          [{ 'size': [] }],
          [ 'bold', 'italic', 'underline', 'strike' ],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'script': 'super' }, { 'script': 'sub' }],
          [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block' ],
          [{ 'list': 'ordered' }, { 'list': 'bullet'}, { 'indent': '-1' }, { 'indent': '+1' }],
          [ {'direction': 'rtl'}, { 'align': [] }],
          [ 'link', 'image', 'video', 'formula' ],
          [ 'clean' ]
        ],
      },
      theme: 'snow'
    })
  }
}

// delete note
function deleteNote(num) {
  if (deletenote.classList.contains('active')) {
    listAll[num].remove()

    // update list
    listAll = document.querySelectorAll('#list > li')
    listAll.forEach(function(item, index) {
      listAll[index].setAttribute('onclick', 'deleteNote('+ index +')');
    })

    // update list counter
    totalnotes.textContent = '('+ daList.children.length +')'
    updateStorage()
    return false
  }
}

// close note
function closeNote() {
  // close menu
  menu.classList.remove('opened')
  menu.setAttribute('href', 'https://michaelsboost.com/donate/')
  menu.innerHTML = '<i class="fa fa-heart"></i>'

  // close note
  document.querySelector('#dialog').style.display = 'none'

  // remove the editor toolbar to prevent it from being added again
  document.querySelector('.ql-toolbar').remove()

  // set title to active note
  currentTitleElm.textContent = editorTitle.value
  
  // set editor's content to active note
  currentBodyElm.innerHTML = quill.root.innerHTML

  // save notes
  updateStorage()
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
    liElm.innerHTML = '<li onclick="editNote('+ numbers +')"><article class="note"><article>'+ notes.title[numbers] +'</article><section>'+ notes.body[numbers] +'</section></article></li>'
    while (liElm.children.length > 0) {
      daList.appendChild(liElm.children[0])
    }
  }

  // update list number
  totalnotes.textContent = '('+ daList.children.length +')'
  
  notesElm = document.querySelectorAll('.note')
  listAll  = document.querySelectorAll('#list li')
  updateStorage()
}

// delete note
deletenote.onclick = function() {
  if (this.classList.contains('active')) {
    this.classList.remove('active')
    listAll.forEach(function(item, index) {
      listAll[index].setAttribute('onclick', 'editNote('+ index +')');
    })
  } else {
    this.classList.add('active')
    listAll.forEach(function(item, index) {
      listAll[index].setAttribute('onclick', 'deleteNote('+ index +')');
    })
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
    str += '<li onclick="editNote('+ numbers +')"><article class="note"><article>'+ notes.title[numbers] +'</article><section>'+ notes.body[numbers] +'</section></article></li>'
  }
  daList.innerHTML = str

  // reset variables
  notesElm  = document.querySelectorAll('#note .note')
  noteTitle = document.querySelector('#note .note > article')
  noteBody  = document.querySelector('#note .note > section')
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
}