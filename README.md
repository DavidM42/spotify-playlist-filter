# Skimify

The goal of this project is to improve my workflow of discovering new music.
I always follow new playlists on Spotify but never find the time to listen through all of them.
Also, it takes a lot of searching and clicks to add a track to a playlist.

That's why with this tool I simply select a playlist I want to discover nice tracks in and one of my own playlists to add the tracks too.
Then I can quickly skip through the source playlists tracks (event faster via keyboard and...XBOX controller shortcuts...) and add the ones I want to keep to my predefined playlist, right there easily in the browser.

Some might say coding for like 2 days straight to automate this previously not that hard or time-consuming task is not worth it.
I say; _it's a learning experience_.

![User interface of app showing Spotify playback](/assets/demo_img.png "UI demo")

_Maybe it's meant to be. Maybe it's productive procrastination_

---

## Get started

Install the dependencies...

```bash
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:8080](http://localhost:3000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.


## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Heroku](https://heroku.com).


## Single-page app mode

By default, sirv will only respond to requests that match files in `public`. This is to maximise compatibility with static fileservers, allowing you to deploy your app anywhere.

If you're building a single-page app (SPA) with multiple routes, sirv needs to be able to respond to requests for *any* path. You can make it so by editing the `"start"` command in package.json:

```js
"start": "sirv public --single"
```