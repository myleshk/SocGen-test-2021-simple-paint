# Simple Paint

## About The Project

A simple paint program running in the console. Currently only support drawing vertical and horizontal lines, rectangles and simple bucket fill.

## Getting Started

This project is written in [TypeScript](https://www.typescriptlang.org/) for [Node.js](https://nodejs.org/), thus needs to be compiled to JavaScript before running by NodeJs.

### Prerequisites

1. You need Node.js and [npm](https://www.npmjs.com/) installed (already in MacOS and some Linux systems by default). If not, follow the instructions on https://nodejs.org/en/download/ to download and install it.

2. Ready-to-use Javascript code is included in the `dist/` folder. To run it directly, skip to step 3.  
   To build the code by yourself, you will need a package manager. [Yarn](https://yarnpkg.com/) is the preferred package manager, but you may still use npm (already installed in step 1) to run this project. To install Yarn, run
   ```
   npm install -g yarn
   ```
   Both `yarn` and `npm` commands will be listed below, just choose one to use.

### Installation dependencies

Currently this project only requires dependencies for build or development. You can skip this section if you only run JavaScript from the `dist/` folder.

```
# yarn
yarn

# npm
npm install
```

### Build and test

This is optional if you only want to run the code from `/dist` folder.

- Build:

  ```
  # yarn
  yarn build

  # npm
  npm run build
  ```

- Test

  ```
  # yarn
  yarn test

  # npm
  npm run test
  ```

- Generate test coverage report

  ```
  # yarn
  yarn coverage

  # npm
  npm run coverage
  ```

### Start the program

```
# yarn
yarn start

# npm
npm run start
```

## Usage

Once the program is running, input a command and press ENTER. Each command starts with one uppercase letter as the action parameter, then followed by data parameters (where applicable). Put exactly one space between each parameter.
Currently the following 5 commands are supported.

| Command       | Description                                                                                                  | Example       |
| ------------- | ------------------------------------------------------------------------------------------------------------ | ------------- |
| C w h         | Create a new canvas of width w and height h.                                                                 | `C 20 10`     |
| L x1 y1 x2 y2 | Create a new line from `(x1, y1)` to `(x2, y2)`. Only horizontal or vertical lines are supported.            | `L 1 1 10 1`  |
| R x1 y1 x2 y2 | Create a new rectangle with `(x1, y1)` and `(x2, y2)` as the top left and bottom right corners respectively. | `R 1 1 10 10` |
| B x y c       | Bucket fill the area containing `(x, y)` with "color" `c` (single letter).                                   | `B 5 5 r`     |
| Q             | Quit the program.                                                                                            | `Q`           |

## Limitations

There are a few limitations and assumptions.

- The canvas starts from the top left corner as `(0, 0)`. `x` increases when going downwards and `y` increases rightwards.

- Drawing line (L) accepts coordinates of 2 points in any order, e.g. either `x1 < x2` or `x1 > x2` is accepted. However, drawing rectangle only allows points specified from top to bottom, left to right.

- Bucket fill (B) only supports to be applied on empty or previously filled cells. If you try to fill on a line or a rectangle, an error will occur.

- The color for bucket fill only supports English letters and digits except `x`. There are 2 major reasons:

- English letters and digits are easier to display. If other characters are allowed (e.g. Chinese), the UI might be corrupted due to different displayed width of other characters.

- `x` is excluded because it is already used for lines. If `x` is allowed as color, then it is difficult to decide what to do with next bucket fill (overwriting the lines or not).

- As the program is simple, a very basic algorithm ([four-way flood fill](https://en.wikipedia.org/wiki/Flood_fill)) for calculating bucket fill result is used. It might cause performance issue if the canvas becomes large.

- Considering the above point plus the screen size, the max height and width are both limited to 200.

## License

Distributed under the GPL v3 License. See `LICENSE` for more information.

## Contact

Myles Fang - [@myleshk](https://github.com/myleshk) - career@myles.hk
