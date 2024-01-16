# Meow Match
A quick project for matching cats photos fetched from the [Cat API](https://thecatapi.com/).

Unless I'm serving something else, this is usually available to preview here: https://meek-mermaid-c73df7.netlify.app/

## Quick start
This little app uses the public auth for the Cat API, and therefore, you don't need a key.

This is a [Vite](https://vitejs.dev/)+React 18 project, so you'll need Node.js version 16+ or higher installed on your machine.

After you have that, you can get started by updating your project imports:

```
npm i
```

Then, starting your server:
```
npm run dev
```

The game should be available in your browser at something local like `http://127.0.0.1:5173/`.

## To do
There is still work to be done here. I did this in a weekend as a quick exercise and it's
quite far from great.

For example:

- break the card out into its own component
- styling
- mobile
- allow users to customize the board size
- implement a leaderboard
- allow users to pick dogs or cats (there's a dog API)
