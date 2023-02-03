// variables
let quill, currentTitleElm, currentBodyElm,
    notes = {
      theme: '',
      title: [],
      body: [],
      scratchpad: ''
    };

// load quill
dynamicallyLoadScript = (url) => {
  var script = document.createElement("script");  // create a script DOM node
  script.src = url;  // set its src to the provided URL
 
  // add it to the end of the head section of the page
  // (could change 'head' to 'body' to add it to the end of the body section instead)
  document.head.appendChild(script);
}
dynamicallyLoadScript('libraries/quill/quill.min.js')

// remember notes in localStorage
updateStorage = () => {
  // push array to localstorage
  var notesTitle = []
  var notesBody = []
  for (i = 0; i < list.children.length; i++) {
    notesTitle.push(document.querySelectorAll('#list > li > strong')[i].textContent)
    notesBody.push(document.querySelectorAll('#list > li > section')[i].innerHTML)
  }

  notes = {
    theme: document.querySelector('[data-theme]').getAttribute('data-theme'),
    title: notesTitle,
    body: notesBody,
    scratchpad: pad.value
  };

  // update search criteria
  var str = ''
  for (let numbers in notes.title) {
    str += '<option value="'+ notes.title[numbers] +'" />'
  }
  searchtitles.innerHTML = str

  localStorage.setItem('Notes', JSON.stringify(notes));
}

// remember data via localStorage
document.body.onkeyup = () => {
  updateStorage()
}

// search
searchFunction = () => {
  // Declare variables
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('search');
  filter = input.value.toUpperCase();
  ul = document.getElementById("list");
  li = ul.getElementsByTagName('li');

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("strong")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

// open dialog
openPad = () => {
  scratchpad.setAttribute('open', true)
}

// clear pad
clearPad = () => {
  pad.value = ''

  // update localStorage
  updateStorage()
}

// close dialog
closePad = () => {
  scratchpad.setAttribute('open', false)
}
closeDialog = () => {
  // set title to active note
  currentTitleElm.textContent = editorTitle.value
  
  // set editor's content to active note
  currentBodyElm.innerHTML    = quill.root.innerHTML

  // close note
  dialog.setAttribute('open', false)

  // remove the editor toolbar to prevent it from being added again
  document.querySelector('.ql-toolbar').remove()

  // save notes
  updateStorage()
}

// add note
addNote = () => {
  // inactivate delete note
  if (deletenote.style.color) {
    deletenote.style.color = ''
  }

  notes.title.unshift('Title')
  notes.body.unshift('Body')

  // refresh elements on the screen
  list.innerHTML = ''
  for (let numbers in notes.title) {
    list.innerHTML += '<li onclick="editNote('+ numbers +')"><strong>'+ notes.title[numbers] +'</strong><section>'+ notes.body[numbers] +'</section></li>'
  }

  // update notes counter
  totalnotes.textContent = '('+ notes.title.length +')'

  // update localStorage
  updateStorage()
}

// edit note
editNote = (num) => {
  if (!deletenote.style.color) {
    currentTitleElm = document.querySelectorAll('#list > li > strong')[num]
    currentBodyElm  = document.querySelectorAll('#list > li > section')[num]
    let currentTitle    = currentTitleElm.textContent
    let currentBody     = currentBodyElm.innerHTML

    // remove editor if already visible
    if (document.querySelector('.ql-toolbar')) {
      document.querySelector('.ql-toolbar').remove()
    }

    // grab note title and body
    editorTitle.value    = currentTitle
    editorBody.innerHTML = currentBody

    // display editor
    dialog.setAttribute('open', true)

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

// toggle delete notes activity
deletenote.onclick = () => {
  let listAll = document.querySelectorAll('#list > li')

  if (deletenote.style.color) {
    deletenote.style.color = ''
    listAll.forEach(function(item, index) {
      listAll[index].setAttribute('onclick', 'editNote('+ index +')');
    })
  } else {
    deletenote.style.color = 'hsl(122, 47%, 41%)'
    listAll.forEach(function(item, index) {
      listAll[index].setAttribute('onclick', 'deleteNote('+ index +')');
    })
  }
}

// delete note
deleteNote = (num) => {
  if (deletenote.style.color) {
    // delete clicked note
    document.querySelectorAll('#list > li')[num].remove()

    // update notes
    listAll = document.querySelectorAll('#list > li')
    listAll.forEach(function(item, index) {
      listAll[index].setAttribute('onclick', 'deleteNote('+ index +')');
    })

    // update localStorage
    updateStorage()

    // update notes counter
    totalnotes.textContent = '('+ notes.title.length +')'
    return false
  }
}

// close note
closeNote = () => {
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

// toggle theme
toggleTheme = () => {
  // check if dark theme is enabled
  if (theme.querySelector('.fa').classList.contains('fa-moon')) {
    // change the icon to light theme
    theme.querySelector('.fa').classList.remove('fa-moon')
    theme.querySelector('.fa').classList.add('fa-sun')

    // apply light theme
    notes.theme = 'light'
    document.querySelector('[data-theme]').setAttribute('data-theme', notes.theme)
  } else {
    // change the icon to dark theme
    theme.querySelector('.fa').classList.add('fa-moon')
    theme.querySelector('.fa').classList.remove('fa-sun')

    // apply dark theme
    notes.theme = 'dark'
    document.querySelector('[data-theme]').setAttribute('data-theme', notes.theme)
  }

  // update localStorage
  updateStorage()
}

// initalize storage
if (!localStorage.getItem('Notes')) {
  updateStorage()
} else {
  notes = JSON.parse(localStorage.getItem('Notes'))

  // apply storage list
  totalnotes.textContent = '('+ notes.title.length +')'

  // first we'll append the list
  var str = ''
  for (let numbers in notes.title) {
    str += '<li onclick="editNote('+ numbers +')"><strong>'+ notes.title[numbers] +'</strong><section>'+ notes.body[numbers] +'</section></li>'
  }
  list.innerHTML = str

  // next display the stored value in scratchpad
  pad.value = notes.scratchpad

  // empty search criteria
  searchtitles.innerHTML = ''
  
  // add search criteria
  var str = ''
  for (let numbers in notes.title) {
    str += '<option value="'+ notes.title[numbers] +'" />'
  }
  searchtitles.innerHTML = str

  // apply theme
  if (notes.theme === 'light') {
    toggleTheme()
  }
}