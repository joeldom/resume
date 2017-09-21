
//one START
const resolver = {
  resolve: function resolve(options, callback) {
    // The string to resolve
    const resolveString = options.resolveString || options.element.getAttribute('data-target-resolver-1');
    const combinedOptions = Object.assign({}, options, {resolveString: resolveString});

    function getRandomInteger(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    function randomCharacter(characters) {
      return characters[getRandomInteger(0, characters.length - 1)];
    };

    function doRandomiserEffect(options, callback) {
      const characters = options.characters;
      const timeout = options.timeout;
      const element = options.element;
      const partialString = options.partialString;

      let iterations = options.iterations;

      setTimeout(() => {
        if (iterations >= 0) {
          const nextOptions = Object.assign({}, options, {iterations: iterations - 1});

          // Ensures partialString without the random character as the final state.
          if (iterations === 0) {
            element.textContent = partialString;
          } else {
            // Replaces the last character of partialString with a random character
            element.textContent = partialString.substring(0, partialString.length - 1) + randomCharacter(characters);
          }

          doRandomiserEffect(nextOptions, callback)
        } else if (typeof callback === "function") {
          callback();
        }
      }, options.timeout);
    };

    function doResolverEffect(options, callback) {
      const resolveString = options.resolveString;
      const characters = options.characters;
      const offset = options.offset;
      const partialString = resolveString.substring(0, offset);
      const combinedOptions = Object.assign({}, options, {partialString: partialString});

      doRandomiserEffect(combinedOptions, () => {
        const nextOptions = Object.assign({}, options, {offset: offset + 1});

        if (offset <= resolveString.length) {
          doResolverEffect(nextOptions, callback);
        } else if (typeof callback === "function") {
          callback();
        }
      });
    };

    doResolverEffect(combinedOptions, callback);
  }
}

const strings = [
  'BRANDING',
  'UX',
  'UI',
  'FRONT-END',
  'USER-EXPERIENCE',
  'USER-INTERFACE',
  '.....',
  'BEGIN WITH THE END IN MIND',
  '#############',
  'DESIGN IS HOW IT WORKS.',
  'HELL0 WORLD!',
  'TEST. TEST. TEST.',
  'GET RID OF MORE.',
  'DO NOT EVER MAKE IT "POP".',
  '( ͡° ͜ʖ ͡°)',
  'ס₪₪₪₪§|(ΞΞΞΞΞΞΞΞΞΞΞΞΞΞΞΞ>',
  '=ε/̵͇̿̿/’̿’̿ ̿=ε/̵͇̿̿/’̿’̿ ̿=ε/̵͇̿̿/’̿’̿ ̿'
];

let counter = 0;

const options = {
  // Initial position
  offset: 0,
  // Timeout between each random character
  timeout: 10,
  // Number of random characters to show
  iterations: 5,
  // Random characters to pick from
  characters: ['$', '3', '8', 'd', '_', 'f', 'g', '!', '5', 'j', 'k', 'l', '2', 'n', '_', 'p', 'q', 'r', 's', 't', 'u', 'v', 'x', 'y', 'x', '#', '%', '&', '-', '+', '_', '?', '/', '\\', '='],
  // String to resolve
  resolveString: strings[counter],
  // The element
  element: document.querySelector('[data-target-resolver-1]'),
}

// Callback function when resolve completes
function callback() {
  setTimeout(() => {
    counter ++;

    if (counter >= strings.length) {
      counter = 0;
    }

    let nextOptions = Object.assign({}, options, {resolveString: strings[counter]});
    resolver.resolve(nextOptions, callback);
  }, 1000);
}

resolver.resolve(options, callback);
//one END

//two START
const resolver = {
  resolve: function resolve(options, callback) {
    // The string to resolve
    const resolveString = options.resolveString || options.element.getAttribute('data-target-resolver-2');
    const combinedOptions = Object.assign({}, options, {resolveString: resolveString});

    function getRandomInteger(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    function randomCharacter(characters) {
      return characters[getRandomInteger(0, characters.length - 1)];
    };

    function doRandomiserEffect(options, callback) {
      const characters = options.characters;
      const timeout = options.timeout;
      const element = options.element;
      const partialString = options.partialString;

      let iterations = options.iterations;

      setTimeout(() => {
        if (iterations >= 0) {
          const nextOptions = Object.assign({}, options, {iterations: iterations - 1});

          // Ensures partialString without the random character as the final state.
          if (iterations === 0) {
            element.textContent = partialString;
          } else {
            // Replaces the last character of partialString with a random character
            element.textContent = partialString.substring(0, partialString.length - 1) + randomCharacter(characters);
          }

          doRandomiserEffect(nextOptions, callback)
        } else if (typeof callback === "function") {
          callback();
        }
      }, options.timeout);
    };

    function doResolverEffect(options, callback) {
      const resolveString = options.resolveString;
      const characters = options.characters;
      const offset = options.offset;
      const partialString = resolveString.substring(0, offset);
      const combinedOptions = Object.assign({}, options, {partialString: partialString});

      doRandomiserEffect(combinedOptions, () => {
        const nextOptions = Object.assign({}, options, {offset: offset + 1});

        if (offset <= resolveString.length) {
          doResolverEffect(nextOptions, callback);
        } else if (typeof callback === "function") {
          callback();
        }
      });
    };

    doResolverEffect(combinedOptions, callback);
  }
}

const strings = [
  'BRANDING',
  'UX',
  'UI',
  'FRONT-END',
  'USER-EXPERIENCE',
  'USER-INTERFACE',
  '.....',
  'BEGIN WITH THE END IN MIND',
  '#############',
  'DESIGN IS HOW IT WORKS.',
  'HELL0 WORLD!',
  'TEST. TEST. TEST.',
  'GET RID OF MORE.',
  'DO NOT EVER MAKE IT "POP".',
  '( ͡° ͜ʖ ͡°)',
  'ס₪₪₪₪§|(ΞΞΞΞΞΞΞΞΞΞΞΞΞΞΞΞ>',
  '=ε/̵͇̿̿/’̿’̿ ̿=ε/̵͇̿̿/’̿’̿ ̿=ε/̵͇̿̿/’̿’̿ ̿'
];

let counter = 0;

const options = {
  // Initial position
  offset: 0,
  // Timeout between each random character
  timeout: 10,
  // Number of random characters to show
  iterations: 5,
  // Random characters to pick from
  characters: ['$', '3', '8', 'd', '_', 'f', 'g', '!', '5', 'j', 'k', 'l', '2', 'n', '_', 'p', 'q', 'r', 's', 't', 'u', 'v', 'x', 'y', 'x', '#', '%', '&', '-', '+', '_', '?', '/', '\\', '='],
  // String to resolve
  resolveString: strings[counter],
  // The element
  element: document.querySelector('[data-target-resolver-2]'),
}

// Callback function when resolve completes
function callback() {
  setTimeout(() => {
    counter ++;

    if (counter >= strings.length) {
      counter = 0;
    }

    let nextOptions = Object.assign({}, options, {resolveString: strings[counter]});
    resolver.resolve(nextOptions, callback);
  }, 1000);
}

resolver.resolve(options, callback);
//two END
