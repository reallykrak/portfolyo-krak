class TypeWriter {
  constructor(txtElement, words, wait = 3000) {
    this.txtElement = txtElement;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.type();
    this.isDeleting = false;
  }
  
  type() {
    const current = this.wordIndex % this.words.length;
    const fullTxt = this.words[current];
    if(this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }
    this.txtElement.innerHTML = this.txt;
    let typeSpeed = 100;
    
    if(this.isDeleting) {
      typeSpeed /= 2;
    }
    if(!this.isDeleting && this.txt === fullTxt) {
      typeSpeed = this.wait;
      this.isDeleting = true;
    } else if(this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.wordIndex++;
      typeSpeed = 500;
    }
    
    setTimeout(() => this.type(), typeSpeed);
  }
}

document.addEventListener('DOMContentLoaded', init);

function init() {
  const nameElement = document.getElementById('name-text');
  const names = ['Yusuf', 'Zypheris'];
  const nameWait = 2000;
  const roleElement = document.getElementById('type-text');
  const roles = [
    'Software Developer',
    'Problem Solver'
  ];
  const roleWait = 2000;
  if (nameElement) {
    new TypeWriter(nameElement, names, nameWait);
  }
  if (roleElement) {
    new TypeWriter(roleElement, roles, roleWait);
  }
}