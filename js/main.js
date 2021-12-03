const root = document.getElementById('root');

const CUBE_WIDTH = 20;
const CUBE_HEIGHT = 20;
const CUBE_BORDER_COLOR = '#222';
const WINDOW_WIDTH = root.clientWidth;
const WINDOW_HEIGHT = root.clientHeight;
const ROW_LENGTH = Math.ceil(WINDOW_HEIGHT / CUBE_HEIGHT); // number of lines
const COLUMN_LENGTH = Math.ceil(WINDOW_WIDTH / CUBE_WIDTH); // number of cubes in the line
const MAX_HIGHTLIGHT = 5;

class Grid {
  createCube(r, c) {
    const cube = document.createElement('div');

    cube.style.width = `${CUBE_WIDTH}px`;
    cube.style.height = `${CUBE_HEIGHT}px`;
    cube.style.border = `1px solid ${CUBE_BORDER_COLOR}`;

    cube.setAttribute('r', r);
    cube.setAttribute('c', c);

    return cube;
  }

  createRow() {
    const row = document.createElement('div');

    row.style.minWidth = `${WINDOW_WIDTH}px`;
    row.classList.add('row');

    return row;
  }

  render() {
    for (let r = 0; r < ROW_LENGTH; r++) {
      const row = this.createRow();
      root.appendChild(row);
      for (let c = 0; c < COLUMN_LENGTH; c++) {
        const cube = this.createCube(r, c);
        row.appendChild(cube);
      }
    }
  }
}

class Cube {
  static render(row, column, color) {
    const c = document.querySelector(`div[r="${row}"][c="${column}"]`);

    if (c) {
      c.style.background = color;
    }
  }
}

class Mouse {
  filled = true;
  disabled = true;
  toTransparent = false;

  constructor() {
    if (this.disabled) {
      root.style.cursor = 'default';
    }
  }

  getPos(x, y) {
    return {
      cP: Math.floor(x / CUBE_WIDTH),
      rP: Math.floor(y / CUBE_HEIGHT),
    }
  }

  render(x, y) {
    if (this.disabled) return;

    const ray = 1;

    const { cP, rP } = this.getPos(x, y);

    const rL1 = rP - ray;
    const cL1 = cP - ray;
    const rR1 = rP - ray;
    const cR1 = cP + ray;
    const rL2 = rP + ray;
    const cL2 = cP - ray;
    const rR2 = rP + ray;
    const cR2 = cP + ray;


    const centerColor = this.toTransparent ? 'transparent' : '#1bff00';
    const borderOutlineColor = this.toTransparent ? 'transparent' : '#0c893e';
    const filledColor = this.toTransparent ? 'transparent' : '#5572db';

    Cube.render(rP, cP, centerColor);
    Cube.render(rL1, cL1, borderOutlineColor);
    Cube.render(rR1, cR1, borderOutlineColor);
    Cube.render(rL2, cL2, borderOutlineColor);
    Cube.render(rR2, cR2, borderOutlineColor);

    if (this.filled) {
      const tR = rP - ray;
      const tC = cP;
      const bR = rP + ray;
      const bC = cP;
      const lR = rP;
      const lC = cP - ray;
      const rR = rP;
      const rC = cP + ray;

      Cube.render(tR, tC, filledColor);
      Cube.render(bR, bC, filledColor);
      Cube.render(lR, lC, filledColor);
      Cube.render(rR, rC, filledColor);
    }
  }

  showOrHideCursor(show) {
    if (show) {
      this.disabled = true;
      root.style.cursor = 'default';
    } else {
      this.disabled = false;
      root.style.cursor = 'none';
    }
  }

  addEvent() {
    const actions = {
      f: () => {
        this.filled = !this.filled;
      },
      c: () => {
        this.showOrHideCursor(!this.disabled);
      },
      d: () => {
        this.toTransparent = !this.toTransparent;
        if (this.toTransparent) {
          this.disabled = false;
          root.style.cursor = 'default';
        } else {
          root.style.cursor = 'none';
        }
      }
    }

    window.addEventListener('keydown', e => {
      const fn = actions?.[e.key];

      if (fn) {
        fn();
      }
    });

    window.addEventListener('mousemove', e => {
      const x = e.clientX;
      const y = e.clientY;

      this.render(x, y);
    })
  }
}

const grid = new Grid();
const mouse = new Mouse();
grid.render();
mouse.addEvent();
