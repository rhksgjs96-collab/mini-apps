---
name: safe-image
description: >-
  Draw an original image from a natural-language description — icons, illustrations,
  posters, banners, thumbnails, wallpapers, app art — by authoring SVG from scratch and
  rendering it to PNG with headless Chromium. Every shape is hand-written rather than
  sampled from a model, so the result is original work with no copyright exposure, and a
  pre-flight screen catches protected characters, logos, real people and named studio
  styles before drawing starts. Use this whenever the user asks for an image, picture,
  illustration, icon, poster, banner, logo mark, background, thumbnail or wallpaper to be
  made, drawn or designed — including Korean phrasings such as 이미지 만들어줘, 그려줘,
  일러스트, 아이콘, 포스터, 배너, 썸네일, 배경화면 — and especially when the request mentions
  copyright, 저작권, licensing, commercial use, or safety for publication. This environment
  has no text-to-image model, so this skill is how images get made here; reach for it
  rather than telling the user image generation is unavailable.
---

# safe-image

Turn a description into a finished picture by writing the artwork as SVG and
rendering it. You are the illustrator here, not a prompt relay — the quality of
the result is entirely a function of how carefully you compose and how honestly
you look at what you rendered.

## What this can and cannot do

Be straight with the user about this up front, because it shapes what they ask
for. Authored vector art is genuinely good at flat and geometric illustration,
icons and logo marks, posters and banners, editorial and diagrammatic scenes,
patterns, gradient backgrounds, isometric work, and stylised landscapes and
characters.

It cannot produce photorealism. There is no diffusion model in this environment;
asking for "a photo of a golden retriever on a beach" will yield a stylised
illustration of one. If the request clearly wants a photograph, say so in a
sentence and offer the illustrated version rather than quietly delivering
something that will disappoint.

## 1. Screen the request

Read the description and check whether the *subject matter* is someone else's
property. Because every shape is authored from scratch, the technique carries no
risk — only what you're asked to depict does.

Most requests pass cleanly and need no comment. If something is flagged — a
named character, a brand logo, a real person, a living studio's house style, a
specific product design, or a particular existing artwork — **substitute the
generic equivalent, draw that, and tell the user in one sentence what you
swapped.** Don't stop to ask permission and don't refuse outright; they want a
picture.

Read `references/screening.md` for the categories, the things that are
explicitly fine (public domain artists, genres, the user's own material), and a
substitution table. Consult it whenever anything in the request names a
specific someone or something.

## 2. Plan before drawing

Spend a moment on a concrete spec. Writing SVG without one produces a shape
salad — this is where the picture is actually decided.

Settle four things: the **canvas** (viewBox and why that ratio), the **light**
(direction and colour, which determines every shadow), the **palette** (five to
seven fixed hex values), and the **layer plan** (what occupies ground, far, mid,
subject, near, atmosphere).

For anything beyond a simple icon, show the user this plan in three or four
lines before you start drawing. It costs little and catches a
misunderstood brief before you've spent effort rendering the wrong picture.

## 3. Write the SVG

Read `references/craft.md` before writing the first element. It covers palette
construction from a light source, back-to-front layering, atmospheric
perspective, and the specific techniques that do the heavy lifting — grain
overlay, gradients, soft contact shadows, vignette, varied line weight. It also
covers the Hangul font limitation, which matters if the image carries Korean
text.

Work in the scratchpad directory, not the repo, unless the user asks for the
files to live in the project.

Structural requirements worth holding to: root `<svg>` carries a `viewBox` and
no `width`/`height`, so the file renders at any size. Gradients and filters are
defined once in `<defs>`. Each layer is a `<g>` with a comment naming it. These
make the revision pass in step 4 tractable instead of archaeological.

## 4. Render, then look at it

```bash
node .claude/skills/safe-image/scripts/render.js art.svg art.png --scale 2
```

Flags: `--scale N` for device pixel ratio (2 is default, 3–4 for print), `--bg
COLOR` to flatten onto a background (transparency is kept by default), `--width
N` to force an output width. The script resolves the global playwright install
itself and prints the output dimensions on success.

**Then read the PNG back with the Read tool and actually look at it.** This is
not a formality — it is the step that separates work you can stand behind from
work you are hoping is fine. SVG that parses perfectly can still render blank,
clip the subject, bury an element under a filter, or drop text into empty boxes,
and none of that is visible in the markup.

Fix what you see and re-render. Expect to do this at least once; a first render
is a draft. `references/craft.md` lists the failure modes that survive a clean
parse and are therefore worth looking for specifically.

## 5. Deliver

Send the PNG with `SendUserFile` so the user sees it inline, and keep the SVG
alongside it — the SVG is the editable master and the thing that makes revisions
cheap. Mention both paths.

Then say, briefly:

- What you drew, if you interpreted anything loosely
- Any IP substitution you made, per step 1
- Any limitation that actually bit — a Korean headline in a fallback font, a
  photorealistic request rendered as illustration

Offer a revision. Vector art is cheap to adjust: recolouring, recomposing or
resizing is a small edit to the SVG and a re-render, so the user should know
that "make it warmer" or "move the subject left" costs almost nothing.

If the image belongs in the project rather than the scratchpad, ask before
committing it — generated assets accumulate quickly and the user may not want
them in version control.
