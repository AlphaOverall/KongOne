//=require ../script.js

class PostCount extends Script {
  constructor() {
    super('Forum Post Count', /\/topics\//, true);
  }

  run() {
    const a = document.getElementsByClassName("updated");
    for (let i = 1; i <= a.length; i++)
    {
      // Get post number
      let cP = document.getElementsByClassName("current");
      cP = (cP.length > 0) ? cP[0].innerHTML : 1;
      let n = (cP > 1) ? (cP - 1) * 25 + i : i;
      // Set number
      const abbr = a[i - 1];
      abbr.innerHTML = `#${n} - ${abbr.innerHTML}`;
    }
  }
}
